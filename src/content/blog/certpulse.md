---
title: "certpulse: tls certificate monitoring that doesn't cost enterprise money"
date: 2026-03-19
description: "i built a saas that tracks tls certificates across endpoints, cloud providers, and ct logs. because the existing options are either too basic or absurdly expensive."
tags: ["saas", "go", "tls", "devops", "security"]
---

if you've ever been woken up at 3am because a certificate expired and took down prod, you know the feeling. and if you haven't, you either have good tooling or you've been lucky.

the certificate monitoring market has a weird gap. on one end you've got basic uptime monitors that'll check if your cert is valid and email you when it's close to expiring. $20-150/mo, external probes only, no cloud integration. on the other end you've got enterprise certificate lifecycle management platforms (venafi, keyfactor, appviewx) that cost $50k+/yr, take months to deploy, and require a dedicated team to operate.

nothing in the middle. so i'm building certpulse to fill that gap.

## what it does

certpulse is a unified dashboard for discovering, tracking, and alerting on tls certificates across four sources:

1. **endpoint scanning.** point it at any hostname and it probes the tls handshake, extracts the full certificate chain, checks validity, expiration, and ocsp status
2. **cloud inventory.** connects to aws acm, azure key vault, and gcp certificate manager to pull every certificate in your accounts. cross-account, cross-subscription, cross-project
3. **certificate transparency logs.** monitors ct logs in real-time via certstream. add domains you care about and get notified when anyone issues a certificate for them (shadow certs, misissued certs, phishing domains)
4. **manual tracking.** for internal certificates that aren't publicly accessible. add them to the inventory and track expiration alongside everything else

everything feeds into a single certificate inventory with a unified status model: ok (30+ days), warning (7-30 days), critical (1-7 days), expired, error.

## the architecture

two services running on fly.io:

**api server.** go + fiber, handles all http requests, clerk jwt auth for the dashboard, api key auth for programmatic access. stateless, talks to postgres.

**worker.** go binary running in three fly.io regions (us-east, europe, asia-pacific) with five concurrent schedulers:

- **scan scheduler** (every 30s). picks up endpoints due for a check based on their scan frequency, runs tls probes from the nearest region, stores results
- **cloud sync scheduler** (every 60s). syncs cloud accounts that are due for refresh, pulls new/changed/removed certificates
- **ct monitor.** maintains a websocket connection to certstream, matches incoming ct log entries against watched domains using a trie data structure for efficient prefix matching. also polls crt.sh every 6 hours as a fallback in case the websocket misses anything
- **alert sweep** (hourly). evaluates all alert rules against current certificate state, fires notifications for anything that matches
- **trial checker** (hourly). downgrades expired trial orgs to the free plan

the database is postgres on supabase with 15 tables. scan results are partitioned by month since they're time-series data that grows fast. row-level security is enabled but the api bypasses it with a superuser role since all tenant isolation is enforced in the go layer. no redis. job scheduling is just go tickers polling the database, which turned out to be plenty.

## cloud integrations

this is where certpulse earns its keep versus basic monitors. each cloud provider has its own integration:

**aws acm.** provide an iam access key with acm read permissions. certpulse lists all certificates across regions, pulls metadata (domain names, status, expiration, renewal eligibility, in-use status), and syncs them into your inventory. supports cross-account setups. add multiple aws accounts and see everything in one view.

**azure key vault.** service principal auth with certificate read permissions across subscriptions. discovers certificates in every vault you grant access to. credentials are encrypted at rest with aes-256-gcm envelope encryption.

**gcp certificate manager.** service account json auth. pulls certificates from google cloud's certificate manager across projects.

every sync gets logged in an audit trail so you can see exactly what changed and when.

## certificate transparency monitoring

this one's interesting. certificate transparency is a public log of every tls certificate issued by participating certificate authorities. it's how you find out if someone issued a cert for your domain without your knowledge, whether that's a forgotten subdomain, a compromised ca, or someone setting up a phishing site on a lookalike domain.

certpulse connects to certstream's websocket feed and processes ct log entries in real-time. you add domains to watch, and the worker builds a trie (prefix tree) for efficient matching. when a new certificate appears in ct logs that matches one of your watched domains, including subdomains, it gets stored and can trigger alerts. there's also a crt.sh fallback that polls every 6 hours to catch anything the websocket might miss.

the trie is important because ct logs are high-volume. you can't afford to do a linear scan of your watched domains for every single certificate issued globally. the trie makes lookups O(k) where k is the domain length, regardless of how many domains you're watching.

## alerts

configurable alert rules with multiple conditions:

- certificate expiring within N days
- certificate status changed to critical/expired/error
- new certificate discovered via ct logs
- cloud sync found new or removed certificates

alerts fire via six channels: email (resend), slack, discord, pagerduty, microsoft teams, and generic webhooks (signed with HMAC-SHA256 so you can verify they came from certpulse). the system deduplicates, same cert won't trigger the same rule twice within a cooldown window. new organizations get default rules out of the box (30, 14, 7, 3, and 1-day expiration warnings).

## multi-region scanning

pro and business plans get tls probes from three fly.io regions: us-east (iad), europe (ams), and asia-pacific (sin). your cert might look fine from virginia but be serving an expired chain from singapore. multi-region catches that.

the worker is region-aware. each instance only picks up endpoints assigned to its region, so there's no duplicate work.

## renewal verification

this one came out of a real pain point. you set up auto-renewal, it works for six months, and then silently breaks. the cert expires and you find out from your users.

certpulse tracks renewal state for certificates: pending, verified, at_risk, failed. if a certificate is close to expiry and hasn't been renewed yet, it flags it as at-risk so you can investigate before it becomes an outage.

## compliance reports

generate certificate inventory, expiration forecast, compliance posture (mapped to SOC2, ISO 27001, PCI-DSS controls), and change audit reports. export as CSV or JSON. mostly useful for teams that need to hand something to auditors without manually compiling spreadsheets.

## multi-tenant

certpulse is built multi-tenant from the ground up:

- **teams.** invite members with role-based access (owner, admin, member, viewer)
- **api keys.** scoped tokens (read, readwrite, agent) with optional expiry for ci/cd integration
- **billing.** stripe integration with four tiers

the plan limits scale with price: free tier gets 5 endpoints and no cloud accounts, business tier gets 1,000 endpoints and 50 cloud accounts with 15-minute scan frequency. the limits are enforced server-side. every create/sync operation checks the org's plan before proceeding.

## pricing

| plan | price | endpoints | cloud accounts | ct domains | scan frequency |
|------|-------|-----------|----------------|------------|----------------|
| free | $0/mo | 5 | 0 | 1 | daily |
| starter | $29/mo | 50 | 2 | 5 | 12h |
| pro | $79/mo | 250 | 10 | 25 | 1h |
| business | $199/mo | 1,000 | 50 | 100 | 15min |

the gap in the market is real. trackssl charges $149/mo for 1,000 endpoints with zero cloud integration. we're at $199/mo for 1,000 endpoints plus 50 cloud accounts, ct monitoring, team management, and api access.

## the tech stack

| layer | tech |
|-------|------|
| api + worker | go 1.25, fiber v2 |
| frontend | next.js 15, react 19, tailwind |
| database | postgresql 16 (supabase) |
| auth | clerk |
| billing | stripe |
| email | resend |
| error tracking | sentry (go + browser) |
| hosting | fly.io (api/worker), cloudflare workers (frontend) |

go was the right call for this. the worker runs five concurrent schedulers with goroutines, handles websocket connections, and does tls probes, all things go is built for. no job queue needed, just tickers and goroutines.

the frontend deploys to cloudflare workers via opennextjs/cloudflare. edge-rendered, fast everywhere, cheap to run.

## why now

the ca/browser forum voted to reduce maximum tls certificate lifetimes. the 200-day limit is already live. 100-day certificates hit in march 2027. 47-day certificates are mandated by 2029.

that means every organization that currently tracks certificates in a spreadsheet (and there are a lot of them) is about to have a very bad time. certificates that used to last a year will need renewal every 47 days. manual tracking doesn't scale when your renewal frequency triples.

certpulse is positioned for exactly this moment. automated discovery, multi-source monitoring, proactive alerts. before the 47-day deadline turns certificate management into a full-time job.

## current status

certpulse is live. stripe is in production, all 15 implementation phases are done, and the worker is deployed across three regions. ci/cd auto-deploys the frontend to cloudflare workers on push to main. sentry is wired up on both the go backend and the browser frontend for error tracking.

check it out at [certpulse.dev](https://certpulse.dev).

---

don't let a cert expire in prod. automate it.

— alex
