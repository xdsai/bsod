---
title: "webdex: automatic search engine indexing for all my sites"
date: 2026-03-19
description: "how i built a tool that crawls my domains, keeps sitemaps fresh, and submits new pages to every search engine — automatically."
tags: ["seo", "python", "automation", "cloudflare"]
---

i have a few sites. jndl.dev, snackr.food, certpulse.dev — and whenever i'd publish a new page or blog post, i'd do the same dance: update the sitemap (or hope the framework did it right), go to google search console and manually request indexing, maybe remember that bing has its own webmaster tools, definitely forget about yandex and naver.

so i built webdex to do all of it for me.

## what it does

webdex is a python cli that runs the full seo submission pipeline in one command:

1. **discovers all your domains** — pulls every zone, subdomain, pages project, and worker route from cloudflare's api. no manually maintaining a list of sites.
2. **crawls each site** — follows internal links and parses sitemaps to find every page. skips assets, api routes, admin paths, and anything that isn't actual content.
3. **manages sitemaps** — either generates a fresh `sitemap.xml` with correct lastmod dates and priorities, or verifies that your framework's auto-generated sitemap matches what the crawler found.
4. **submits to search engines** — new urls go out via indexnow (which covers bing, yahoo, yandex, naver, seznam, and amazon) and google's search console api. only new or changed urls get submitted — it tracks state between runs so nothing gets sent twice.

run it on a cron job and forget about it. that's the whole point.

## domain discovery

the laziest part (in a good way). instead of configuring each domain by hand, webdex talks to cloudflare's api and inventories everything:

- **zones** — every domain on your account
- **dns records** — a/aaaa/cname records pointing to actual sites
- **pages projects** — sites deployed on cloudflare pages with custom domains
- **worker routes** — workers serving content on custom domains

it supports both scoped api tokens (preferred — minimal permissions) and the legacy global key. the `setup` command even generates a scoped token for you with just zone read and dns read/write access.

## the crawler

the crawler is a breadth-first traversal with a few pragmatic constraints:

- **max depth of 3** — most real content lives within 3 clicks of the homepage
- **max 500 pages per site** — a safety limit so it doesn't go infinite on dynamic routes
- **smart seeding** — tries sitemap.xml, sitemap-index.xml, and robots.txt before falling back to just crawling from `/`
- **url normalization** — strips fragments, query parameters, and trailing slashes so you don't get duplicates
- **content filtering** — skips anything with an asset extension (css, js, images, fonts, pdf, video) and known non-content paths like `/api/`, `/admin/`, `/auth/`

it uses httpx for async requests and beautifulsoup for parsing links out of html. nothing fancy, just reliable.

## sitemap strategies

different sites need different approaches, so webdex supports two strategies per domain:

**managed** — webdex owns the sitemap. it generates a valid `sitemap.xml`, preserves existing lastmod dates for unchanged urls, stamps today's date on new ones, assigns priorities (1.0 for the homepage, 0.8 for everything else), commits the file to your repo, and pushes. fully hands-off.

**verify** — for sites like this one (astro generates sitemaps automatically). webdex crawls the site, fetches the live sitemap, and checks that they match. if the crawler found pages the sitemap missed, you'll know about it.

my current config:

```yaml
sites:
  - domain: snackr.food
    repo: /home/alex/repos/snackr-webpage
    sitemap_strategy: managed

  - domain: jndl.dev
    repo: /home/alex/repos/bsod
    sitemap_strategy: verify

  - domain: certpulse.dev
    repo: /home/alex/repos/certpulse
    sitemap_strategy: managed
```

## search engine submission

this is the part that actually matters for seo. two channels:

### indexnow

indexnow is a protocol supported by bing, yahoo, yandex, naver, seznam, and amazon. you host a key file at your domain root (just a text file containing your api key), and then you can push urls to all of those engines in a single api call.

webdex batches urls (up to 10,000 per request), handles rate limiting, and only submits urls that are new since the last run. the key file gets generated automatically during setup.

### google

google doesn't support indexnow (of course), so webdex uses two google apis:

- **search console api** — submits your sitemap url so google knows where to find it
- **indexing api** — pushes individual urls for faster crawling. officially this api is "limited to jobposting and broadcastevent schema" but in practice it works for any page. grey area, but it works.

both use service account authentication. the `setup` command walks you through creating the service account in gcp and verifying your domains in search console (it even adds the dns txt records via cloudflare automatically).

## state tracking

the key to not being annoying (to search engines or yourself) is only submitting what's actually new. webdex keeps a `state.json` file that stores the set of known urls and last crawl timestamp for each domain.

every run diffs the crawled urls against the previous state:
- **new urls** → submit to search engines
- **removed urls** → log them (pages that disappeared)
- **unchanged** → skip

simple, effective, no redundant submissions.

## setup

getting it running is one command:

```bash
webdex setup
```

this does three things:
1. generates an indexnow api key (random hex string)
2. creates a scoped cloudflare api token with minimal permissions
3. prompts you through google service account setup and domain verification

after that, the daily cron is just:

```bash
0 6 * * * cd /path/to/webdex && .venv/bin/webdex run >> webdex.log 2>&1
```

every morning at 6am, webdex crawls everything, updates sitemaps, submits new pages, and goes back to sleep.

## why not just use search console manually

because i'd forget. every time. i'd publish a blog post, feel good about it, and then three weeks later wonder why it's not showing up in google. turns out i never submitted it. or i submitted it to google but not bing. or the sitemap was stale because i added a page outside of the normal build process.

webdex removes all of that. publish content, wait for the next cron run, done. every search engine that matters gets notified, every sitemap stays accurate, and i never have to open search console again.

the code is at [github.com/xdsai/webdex](https://github.com/xdsai/webdex). python 3.11+, minimal dependencies, straightforward to set up.

---

automate the boring parts. index the rest.

— alex
