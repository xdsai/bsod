# SEO Audit: jndl.dev

**Date:** 2026-03-23
**Tool:** Claude SEO v1.4.0
**Overall Health Score: 31/100**

---

## Executive Summary

jndl.dev is a personal portfolio site with a retro BSOD theme built on Astro. While it loads fast and has a working sitemap, it is missing nearly all foundational SEO elements: no Open Graph tags, no Twitter cards, no canonical URLs, no structured data, no heading hierarchy on the homepage, and no internal linking structure. The site is essentially invisible to social sharing previews and has minimal signals for search engines beyond the sitemap.

### Top 5 Critical Issues
1. No canonical URL on any page
2. No Open Graph or Twitter Card meta tags
3. No H1/H2/H3 heading structure on homepage
4. No Schema.org structured data anywhere
5. Zero internal links on homepage (only 1 email link + 2 external)

### Top 5 Quick Wins
1. Add OG/Twitter meta tags to Astro layout (~10 min)
2. Add canonical URLs via Astro config (~5 min)
3. Add Person/WebSite JSON-LD schema to homepage (~10 min)
4. Add H1 heading to homepage (even if visually hidden) (~5 min)
5. Add internal navigation links to blog from homepage (~10 min)

---

## Technical SEO (Score: 45/100)

### Crawlability
| Check | Status | Notes |
|-------|--------|-------|
| robots.txt | PASS | Cloudflare managed, allows search crawlers |
| Sitemap | PASS | sitemap-index.xml -> sitemap-0.xml, 10 URLs |
| HTTP Status | PASS | 200 OK |
| HTTPS | PASS | Forced HTTPS via Cloudflare |
| Redirects | PASS | No redirect chain |

### Indexability
| Check | Status | Notes |
|-------|--------|-------|
| Canonical URL | FAIL | Missing on all pages |
| Meta robots | PASS | No noindex directives |
| Duplicate content risk | WARN | Without canonicals, www vs non-www and trailing slashes could cause issues |

### Security Headers
| Header | Status |
|--------|--------|
| HTTPS | PASS |
| X-Content-Type-Options | PASS (nosniff) |
| Referrer-Policy | PASS (strict-origin-when-cross-origin) |
| Content-Security-Policy | FAIL - Missing |
| X-Frame-Options | FAIL - Missing |
| Permissions-Policy | FAIL - Missing |
| Strict-Transport-Security | FAIL - Missing |

### Performance
| Metric | Value | Rating |
|--------|-------|--------|
| TTFB | 139ms | Good |
| Page Size | 17.6KB | Excellent |
| Hosting | Cloudflare Pages | Good CDN |

---

## Content Quality (Score: 25/100)

### Homepage Analysis
- **Title:** "alex@jndl.dev" - Creative but not descriptive for search. Missing name or role keywords.
- **Meta Description:** "A retro BSOD-themed portfolio website" - Too generic. Doesn't mention who you are, what you do, or location.
- **Word Count:** 467 words - Acceptable for a portfolio but content is mostly in JS-rendered modals.
- **H1:** MISSING - Critical. No heading structure at all on homepage.
- **Content Accessibility:** Much content is inside modals that may not be crawled by search engines.

### Blog
- Blog index has H1: "my little corner of the internet" - Not keyword-optimized
- 7 blog posts in sitemap
- Blog posts lack individual meta descriptions (not verified but likely given pattern)
- No schema markup on blog posts (Article, BlogPosting)

### Recommended Title
`Alex Jendek | Infrastructure Security Engineer - jndl.dev`

### Recommended Meta Description
`Infrastructure security engineer based in Bratislava. AWS, Azure, Python, Linux. Projects include CertPulse, Webdex, and more. View portfolio and blog.`

---

## On-Page SEO (Score: 20/100)

### Heading Structure
```
Homepage:
  H1: (none)
  H2: (none)
  H3: (none)

Blog Index:
  H1: "my little corner of the internet"
  H2: (post titles - good)
```

### Internal Linking
- Homepage has 0 internal links (critical)
- No navigation links to blog, projects, or other pages
- Blog has return link to main site
- Very poor link equity distribution

### External Links
- GitHub: rel="noopener noreferrer" (fine)
- LinkedIn: rel="noopener noreferrer" (fine)
- No rel="me" for identity verification

---

## Schema & Structured Data (Score: 0/100)

No structured data found anywhere on the site.

### Recommended Schema Implementation

**Homepage - Person + WebSite:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alex Jendek",
  "url": "https://jndl.dev",
  "jobTitle": "Infrastructure Security Engineer",
  "sameAs": [
    "https://github.com/xdsai",
    "https://linkedin.com/in/jndl"
  ]
}
```

**Blog Posts - BlogPosting:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "author": { "@type": "Person", "name": "Alex Jendek" },
  "datePublished": "2026-01-01",
  "url": "https://jndl.dev/blog/post-slug/"
}
```

---

## Images (Score: N/A)

No images on homepage. Blog pages not fully audited but likely minimal.

---

## AI Search Readiness (Score: 30/100)

| Check | Status | Notes |
|-------|--------|-------|
| llms.txt | FAIL | Returns 200 but serves homepage HTML (Astro fallback) — effectively broken |
| AI crawler access | BLOCKED | robots.txt blocks GPTBot, ClaudeBot, Bytespider, CCBot, Google-Extended, Applebot-Extended, meta-externalagent |
| Structured data | FAIL | No schema for AI to parse |
| Content citability | LOW | Modal-based content is hard for AI to extract |
| Passage structure | LOW | No heading hierarchy for passage-level citation |

**Note:** The robots.txt AI crawler blocks are Cloudflare-managed defaults. If you want AI search visibility (Google AI Overviews, ChatGPT, Perplexity), you'd need to selectively allow some of these crawlers.

---

## Prioritized Action Plan

### Critical (fix immediately)
1. **Add canonical URLs** - Add `<link rel="canonical">` to Astro base layout
2. **Add H1 to homepage** - Even "Alex Jendek" or your role as a visible/accessible heading
3. **Fix llms.txt** - Either create a proper llms.txt static file or remove the route

### High (fix within 1 week)
4. **Add Open Graph meta tags** - Title, description, image, URL, type for all pages
5. **Add Twitter Card meta tags** - card, title, description, image
6. **Add Person JSON-LD schema** - Homepage
7. **Add BlogPosting schema** - All blog posts
8. **Improve meta description** - Include name, role, location, keywords
9. **Add internal navigation links** - Blog link and project links on homepage

### Medium (fix within 1 month)
10. **Add Content-Security-Policy header** - Via Cloudflare or _headers file
11. **Add X-Frame-Options header** - SAMEORIGIN
12. **Add Strict-Transport-Security** - Via Cloudflare
13. **Improve blog post meta descriptions** - Unique per post
14. **Add social sharing image** - OG image for social previews
15. **Consider allowing Googlebot/Google-Extended** - For AI Overview visibility

### Low (backlog)
16. **Add rel="me" to social links** - Identity verification
17. **Add breadcrumb schema** - Blog navigation
18. **Consider WebSite schema with SearchAction** - If site search is added
19. **Add alt text to any future images**
20. **Ensure modal content is in static HTML** - For crawlability
