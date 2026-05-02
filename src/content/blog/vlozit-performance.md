---
title: "vloz.it: making a $25/mo database serve 128k listings without catching fire"
date: 2026-05-02
description: "i shipped indexnow, crawlers showed up, and my database melted. here's every performance fire i fought on vloz.it and what i learned from each one."
tags: ["startup", "performance", "postgres", "classifieds", "infrastructure"]
---

quick context if you're not from central europe: [vloz.it](https://vloz.it) is a classifieds platform i'm building for slovakia and czech republic. think craigslist, but for a market where one site (bazos) has had a monopoly for 20 years. people post used cars, furniture, phones, whatever they want to sell. other people browse, search, and contact the seller. no payment processing, no shipping integration. just a bulletin board connecting buyers and sellers. i wrote about [why i'm building it](/blog/vlozit) a few weeks ago.

to bootstrap inventory (because nobody browses an empty classifieds site), a python scraper runs every 2 hours on a VPS and pulls listings from bazos.sk and bazos.cz. native user posts grow alongside the scraped data. the database currently holds about 128,000 active listings.

the whole thing runs on a stack that costs about $25/mo: sveltekit 2 on cloudflare pages for server-side rendering at the edge, supabase postgres Pro tier in frankfurt as the primary datastore, upstash redis for sessions and rate limiting, cloudflare KV for pre-computed cache blobs, and R2 for user-uploaded images. the site serves three countries (SK, CZ, international) with full i18n, each seeing a filtered view of listings from their country.

for a classifieds site at this scale, that should be comfortable. postgres can handle 128k rows without breaking a sweat. the problem was never the data volume. the problem was query shapes that worked fine under normal load and fell apart catastrophically under crawler traffic.

this post is every performance fire i fought over the span of about a week, with real numbers from `pg_stat_statements`, actual EXPLAIN plans, and the specific fixes that landed. some of them are embarrassing. most of them were avoidable.

## the day i shipped indexnow

indexnow is a protocol for telling search engines about new URLs immediately instead of waiting for them to crawl. bing, yandex, and seznam all support it. i wired it into the listing creation flow so every new listing gets pushed to search engines within seconds. great for SEO.

i also had a pagination cap that limited category pages to 2 pages. i removed it around the same time, because why would you hide listings from search engines? let them crawl everything.

what i didn't think about: telling three search engines "hey, i have new content" while simultaneously uncapping pagination means every crawler on the internet is about to walk every page of every category in every language. SK, CZ, EN. deep pagination. all at once.

## the IOPS wedge (april 30)

the first thing that went wrong was `get_category_counts()`. this is a postgres function that powers the homepage. it answers the question "how many listings are in each category?" so the homepage can show counts like "auta (4,231)" next to each category link. simple concept.

the implementation was a `SELECT category_slug, source, count(*) FROM listings WHERE status = 'active' GROUP BY 1, 2`. no index on `(category_slug, source)` with a `WHERE status = 'active'` partial filter existed, so the planner chose a sequential scan over the entire `listings` table (179 MB heap), followed by a HashAggregate. the EXPLAIN looked like:

```
HashAggregate (rows=40)
  -> Seq Scan on listings (rows=124,832)
       Filter: (status = 'active')
```

on a warm database with the full heap resident in `shared_buffers`, this took about 720ms. annoying but survivable. under crawler load, with hundreds of concurrent requests competing for buffer pool pages, it became a different story.

postgres manages memory through `shared_buffers`, a fixed-size pool of 8 KB pages cached from disk. when the pool is full and a query needs a page that isn't cached, postgres evicts an existing page using a clock-sweep algorithm. under normal load, hot pages (the ones queries actually need) stay resident and the hit ratio stays high. ours was 99.48%. but that number is an average. under a sudden spike of diverse queries all touching different pages, the eviction rate overwhelms the cache and the hit ratio collapses.

here's the sequence: crawlers hit deep pagination on every category. each cold page render triggered stats probes (average price, newest listing date) via PostgREST RPCs. those RPCs piled up at the supabase connection pooler. `get_category_counts()` needed to read all 22,000+ heap pages of the `listings` table, but those pages were being evicted by the category browse queries pulling different slices of the same table. so it fell back to disk reads. which saturated the provisioned IOPS on supabase's underlying storage. which made every other query slow because they now also needed disk. which caused more buffer evictions. which made more queries need disk reads.

a textbook positive feedback loop. within minutes, a simple `count(*)` on an indexed column was timing out at the 2-minute `statement_timeout`. supabase support flagged disk IO usage.

the numbers from `pg_stat_statements` right before the wedge:

| query | total time | calls | mean | max |
|---|---|---|---|---|
| detail/related WITH query | 14,286 s | 21,336 | 670 ms | 7,984 ms |
| PostgREST RPC dispatch | 5,060 s | 22,951 | 220 ms | 7,992 ms |
| UPDATE view_count | 1,109 s | 81,451 | 13.6 ms | 7,968 ms |
| category browse | 988 s | 282 | 3,502 ms | 7,753 ms |
| sitemap count(*) | 291 s | 39 | 7,474 ms | 17,720 ms |
| get_category_counts() | -- | 8 | 10,076 ms | 57,216 ms |

ten seconds average on `get_category_counts()`. fifty-seven seconds worst case. for a function that runs on every homepage cache miss.

recovery was unglamorous: supabase dashboard restart. clears shared_buffers, kills stuck connections, fastest path back to a healthy state.

## fixing the root cause

the restart bought time. fixing it meant understanding what query shapes were actually killing us and making them cheap.

**the covering index.** `get_category_counts()` was doing a seq scan over a 179 MB heap because no index covered both its GROUP BY columns and its WHERE filter. the key insight is the difference between an index scan and an index *only* scan. a regular index scan finds matching rows via the index but still fetches each row from the heap to read non-indexed columns. an index only scan satisfies the entire query from the index alone, never touching the heap. but it only works if every column the query needs is either a key column or an `INCLUDE`d column in the index.

`get_category_counts()` groups by `(category_slug, source)` and `get_category_stats()` also aggregates `price`, `currency`, `created_at`, and `updated_at`. so the index needed all of them:

```sql
CREATE INDEX idx_listings_aggs_iox
ON listings (category_slug, source)
INCLUDE (created_at, updated_at, price, currency)
WHERE status = 'active';
```

the `WHERE status = 'active'` makes it a partial index, only indexing the rows that matter. the `INCLUDE` columns are stored in the index leaf pages but aren't part of the B-tree key, so they don't affect sort order or bloat the internal nodes.

result: 8.5 MB index instead of scanning a 179 MB heap. the EXPLAIN flipped from `Seq Scan (rows=124,832)` to `Index Only Scan using idx_listings_aggs_iox (rows=124,832)`. same row count, completely different I/O profile. the index only scan reads ~1,050 pages instead of ~22,000.

there's a catch with index only scans: postgres still needs to check the visibility map to confirm each tuple is visible to the current transaction. if the table has a lot of dead tuples (from UPDATEs/DELETEs that haven't been vacuumed), it falls back to heap fetches anyway. that's why i ran `VACUUM ANALYZE` immediately after creating the index, to refresh the visibility map and planner statistics.

before and after on prod:

| function | before | after |
|---|---|---|
| `get_category_counts()` | 2-min timeout | 391 ms |
| `get_category_stats()` | 2-min timeout | 49 ms |
| `/auto` SK browse | 12 s timeout | 200-400 ms |

the brutal part: i tried to create this index during the outage. on a database already saturated with crawler I/O, `CREATE INDEX CONCURRENTLY` took 32+ minutes and made everything worse. the same operation took 19.7 seconds on the restarted database at 17:04 UTC. same data, same index, same hardware. the only difference was whether the disk was already on fire.

lesson learned: ship the read-shape change before the load-shape change. i uncapped pagination (more load) before adding the index that makes deep pagination cheap. should have been the other way around.

## the similar listings problem

the single biggest time-burner in the entire database was a query i barely thought about. listing detail pages show "similar listings" -- same category, similar price range, sorted by recency. 670 ms average, called 21,336 times in the measurement window. 14,286 seconds of total database time.

the query itself resists indexing. it filters on `category_slug + status + price BETWEEN` and orders by `created_at DESC`. the existing composite browse index orders by `(bumped_at DESC NULLS LAST, created_at DESC)` because that's what the category listing pages need. a "similar listings" index would need `(category_slug, created_at DESC) WHERE status = 'active'` with `price` somewhere accessible for the range filter. that's a different sort order from the browse index, and both cover most of the same rows. the write amplification of maintaining two near-identical indexes on a table that gets bulk-inserted every 2 hours by the scraper wasn't worth it for a query that can be cached.

caching was the right call. each listing detail page now writes `similar:v1:<id>` to cache with a 1-hour TTL. empty results aren't cached, which is a deliberate choice: if the database has a transient blip and returns zero rows, i don't want that empty state pinned for an hour. the next request retries the query.

i initially wrote to cloudflare KV. bad idea. KV is a globally replicated key-value store, which sounds great, but it's designed for low-write, high-read workloads. the free tier caps at 1,000 writes/day. with indexnow accelerating crawl, about 6,000 unique listing IDs were getting hit per day. burned through the write quota in 4 hours.

moved to cloudflare's Cache API (`caches.default`). this is the same cache that cloudflare's CDN uses, but accessible programmatically from workers. the tradeoff: it's per-colo (each cloudflare data center has its own cache) rather than globally replicated like KV. a listing cached in frankfurt isn't cached in prague. but crawlers tend to hit from the same colo consistently, so they self-warm whichever data center they route through. worst case miss is the 670 ms postgres query, which is acceptable for a cache miss that repopulates for the next hour.

## 81,000 row-locking UPDATEs

every time someone viewed a listing, the detail page ran `UPDATE listings SET view_count = view_count + 1 WHERE id = $1`. in postgres, UPDATE doesn't modify a row in place. it marks the old row version as dead, writes a new row version with the incremented value, and updates every index that references the row. on a table with 8+ indexes, that's a lot of write amplification for a counter increment. 81,451 of these in the measurement window. 1,109 seconds of total database time. each one taking a row-level lock, generating WAL, and creating a dead tuple for autovacuum to clean up later.

replaced it with a redis write-behind buffer. the detail page now does three redis operations in a single pipeline (one network round trip to upstash):

1. `SET view_seen:<visitor_hash>:<listing_id> 1 NX EX 3600` -- dedup. if the key already exists (same visitor saw this listing in the last hour), the `NX` flag makes it a no-op
2. `SADD view_buf:pending <listing_id>` -- add to the pending set so the flush job knows which listings have buffered counts
3. `INCR view_buf:c:<listing_id>` -- increment the counter atomically

zero database round trips on page view. the database doesn't know the view happened.

a VPS cron job hits `/api/cron/flush-views` every 5 minutes. the flush endpoint does `SMEMBERS` on the pending set, `GETDEL` on each counter (atomic read-and-delete), `SREM` to clean up, then fires a single `UPDATE listings SET view_count = view_count + delta FROM unnest($1::int[], $2::int[]) AS t(id, delta) WHERE listings.id = t.id`. one UPDATE, one WAL entry, one set of index maintenance. 81,000+ individual UPDATEs became one batch UPDATE per 5-minute cycle.

## search was materializing to disk

`search_combined('auto')` took 3,007 ms cold. for the most common search term on a car-heavy classifieds site in czech republic and slovakia. `auto` matches thousands of listings.

the search function uses postgres full-text search (`to_tsvector('simple', title) @@ plainto_tsquery('simple', $1)`) with a `ts_rank` score, filtered by country and status. the SQL was structured as a CTE pipeline:

```sql
WITH fts_hits AS (
  SELECT *, ts_rank(to_tsvector('simple', title), q) AS rank
  FROM listings, plainto_tsquery('simple', p_query) q
  WHERE to_tsvector('simple', title) @@ q
    AND status = 'active' AND source = ANY(p_sources)
),
scored AS (
  SELECT * FROM fts_hits ORDER BY rank DESC, created_at DESC LIMIT 20
),
counted AS (
  SELECT count(*) AS total FROM fts_hits
)
SELECT * FROM scored, counted;
```

the problem is the double reference to `fts_hits`. postgres's CTE optimization (since v12) can inline a CTE that's referenced once, treating it like a subquery and letting the planner push down filters and use indexes. but when a CTE is referenced by two consumers (`scored` and `counted`), the planner materializes it. that means it executes `fts_hits` once, writes all matching rows to a temp tuplestore (spilling to disk if the result set is large enough), and then both `scored` and `counted` read from that materialized copy.

for `auto`, the FTS index returned thousands of hits. the materialized tuplestore spilled to disk, and then `scored` did a full sort on the spilled data to find the top 20. with the CTE inlined (single reference), the planner instead uses a top-N heapsort: it maintains a heap of 20 elements and scans through the results in one pass, never needing to materialize or sort the full set.

the fix was removing the `counted` CTE entirely. 1,786 ms to 74 ms cold. for deleting 4 lines of SQL.

the frontend now uses cursor-based pagination (`prev/next` with a `hasNext` flag derived from fetching `LIMIT + 1` rows) instead of showing total result counts. nobody was clicking "page 47 of 231" anyway.

## sitemap was firing 20 parallel count queries

the sitemap endpoint needed to know how many listings existed in each category to generate the right number of sitemap pages. it was making 20 parallel `count: 'exact'` calls to supabase, one per category.

on a warm database, 5-7 seconds. under load, timeout.

replaced it with a KV read. the precompute cron already calculates category counts every 2 hours and stores them in KV. the sitemap now reads that blob. 5-7 seconds to 30 ms.

## the WAL-lock incident (may 2)

two days after fixing the IOPS wedge, the site went down again. different failure mode this time: 15-minute outages repeating throughout the day, plus one 4-hour degradation affecting only the SK version.

two compounding problems, both rooted in WAL contention.

postgres uses write-ahead logging (WAL) for crash safety. every data-modifying operation (INSERT, UPDATE, DELETE) writes a WAL record before modifying the actual data pages. WAL writes are serialized through a lock (`LWLock:WALWrite`) to maintain ordering. under normal load, this lock is held for microseconds and contention is negligible.

the IOPS fix from two days earlier had included an autovacuum tuning migration that reset `vacuum_cost_delay` to the postgres default of 2ms. this controls how long autovacuum sleeps between batches of work. at 2ms, autovacuum runs aggressively. it reads pages, marks dead tuples, and writes cleaned pages back, generating its own WAL records. on a table with 128k rows and a 5.9% dead tuple ratio from the constant scraper churn, that's a lot of cleanup work.

when autovacuum's aggressive 2ms cycle overlapped with the scraper window (bulk INSERTs every 2 hours), both processes competed for the WAL write lock. normal SELECT queries don't write WAL, but they still need buffer pool pages, and when those pages are being modified by autovacuum (pinned, locked, written), the SELECTs have to wait. under sustained contention, simple SELECTs started hitting the 2-minute `statement_timeout`.

the second problem was a cascade from the first. the homepage had a carousel showing the 10 newest listings. the query behind it (`WHERE status='active' AND source IN (...) ORDER BY created_at DESC LIMIT 10`) had no perfectly-shaped index, so it needed a sort on the result set. normally this was fast. under WAL-lock pressure, it timed out. and when it timed out, the homepage precompute function treated the *entire homepage payload* as unhealthy. the healthy gate checked `recentListings.length > 0` before writing to KV cache. carousel failure meant no cache write. no cache write meant every subsequent SK visitor hit the cold database path on every render. which generated more load on the already-contended database.

a decorative carousel was the load-bearing column holding up the entire SK homepage caching layer.

fix was two commits. first (`0f0b4cd`): decouple the carousel from the healthy gate so counts, categories, and stats can cache independently even if the carousel query fails. second (`7a52bca`): remove the carousel entirely. it was low-engagement filler and the only consumer of that specific query path. one fewer database query per cold render, one fewer failure mode.

autovacuum `cost_delay` went to 10ms via a migration. not the original 20ms throttle (which was set when we were on free tier and needed to be gentle), not the 2ms default (too aggressive when competing with the scraper and view-count flush). 10ms gives autovacuum enough throughput to keep up with dead tuple generation without starving concurrent writers.

## the category browse indexes

big category pages (knihy, foto, oblecenie) were averaging 2.4 seconds because of a gap between the index shape and the query shape.

the existing browse index was `(category_slug, bumped_at DESC NULLS LAST, created_at DESC) WHERE status = 'active'`. this covers the sort order and the status filter. but the query also filters by `source` -- SK users see listings from `('native', 'bazos_sk')`, CZ users see `('native', 'bazos_cz')`. since `source` isn't in the index, postgres had to do an index scan to find matching `(category_slug, status)` rows, then heap-fetch each one to check the `source` column, then discard the ones that didn't match.

for `knihy` (books) in SK, the index scan returned rows from all sources, then the heap filter dropped the CZ rows. that meant fetching ~11,000 heap pages and discarding ~16,000 rows that didn't match the source filter. the I/O was entirely wasted.

the fix was two partial composite indexes with the source filter baked into the index predicate:

```sql
CREATE INDEX idx_listings_browse_sk
ON listings (category_slug, bumped_at DESC NULLS LAST, created_at DESC)
WHERE status = 'active' AND source IN ('native', 'bazos_sk');

CREATE INDEX idx_listings_browse_cz
ON listings (category_slug, bumped_at DESC NULLS LAST, created_at DESC)
WHERE status = 'active' AND source IN ('native', 'bazos_cz');
```

now the planner picks the SK index for SK queries and the CZ index for CZ queries. the index only contains rows the query will actually return, so there are zero wasted heap fetches. EN traffic (which shows all sources) still uses the original unfiltered browse index.

2,400 ms to 4 ms on `knihy` SK browse. 5 MB total for both indexes. the indexes are small because each one only covers roughly half the table.

## the trigram index i almost dropped

`idx_listings_title_lower_trgm` showed up in `pg_stat_user_indexes` as suspicious: 22 MB GIN index, only 4 scans recorded across the entire measurement period. a 22 MB index that gets used 4 times looks like pure waste, especially when you're fighting for IOPS.

dug into the code before dropping it. `search_combined` has a two-phase search strategy: first, postgres full-text search (`to_tsvector @@ plainto_tsquery`). if that returns zero results, it falls back to trigram similarity search using `lower(l.title) % lower(p_query)`. the `%` operator is the trigram similarity operator from `pg_trgm`, and it's the specific operator that activates GIN trigram indexes. this is the fuzzy search safety net, the thing that catches "iphon" when the user meant "iphone" and FTS found nothing.

the 4 scans were real users whose search terms didn't match any FTS lexemes and fell through to trigram matching. low scan count doesn't mean the index is useless. it means the primary search path is working well and the fallback rarely needs to fire. when it does fire, the GIN index is the difference between a sub-second fuzzy match and a sequential scan doing `similarity()` over 128k rows.

kept it. the 22 MB is worth it as insurance.

## what i actually learned

**databases don't fail gradually.** postgres will happily serve 128k rows at sub-second latency until something pushes shared_buffers into eviction territory, and then everything falls off a cliff at once. there's no "getting slower" phase. it goes from fine to dead.

**don't diagnose a wedged database.** every diagnostic query you run on a saturated database makes it worse. you're reading cold pages, evicting warm ones, adding to the spiral. during the IOPS incident i kept checking `pg_stat_activity` and each check made recovery take longer.

**sequence matters.** shipping indexnow before the covering index was like opening a fire hydrant before connecting the hose. the feature that generates load and the optimization that handles load need to ship together, or the optimization ships first.

**autovacuum is not set-and-forget.** tuning it in isolation makes sense. tuning it while ignoring the other writers (scraper, view count flush, user creates) competing for the same WAL is how you get 15-minute outages.

**cosmetic features shouldn't be load-bearing.** the carousel was filler content. but it was wired into the homepage health check, which meant when it failed, nothing else cached either. optional components should fail silently, not take down the critical path.

**the embarrassingly simple fixes are the best ones.** removing a count CTE: 1,786 ms to 74 ms. reading from a KV blob instead of 20 parallel count queries: 5-7 seconds to 30 ms. removing a carousel nobody clicked: eliminated an entire outage category. none of these were clever. they were just obvious in retrospect.

the site's been stable for the last couple days. buffer cache hit ratio is at 99.48%. the scraper runs every 2 hours without WAL contention. crawlers can walk as deep as they want without wedging anything.

i'm sure something else will break. but at least now i know what to look at first.

vloz.it is live at [vloz.it](https://vloz.it).

---

the database is fine until it isn't. and then it's on fire.

-- alex
