---
title: "vloz.it: why i'm building a bazos competitor"
date: 2026-04-13
description: "bazos just added bank verification. that's not a security feature, it's a sign the platform is cracking under its own weight."
tags: ["startup", "classifieds", "czech", "slovakia"]
---

if you're not from czech republic or slovakia, you've probably never heard of bazos. it's our craigslist. 2.7 million active listings, somewhere around 100,000 new ones every day, and the whole thing has been run by one guy from a village near olomouc since 2003.

bazos isn't just popular. it's a verb. "dej to na bazos" means "put it on bazos" the same way americans say "just google it." people don't think about where to sell their old couch. they go to bazos, same as they've done for twenty years.

so why would anyone try to compete with that?

## the 1 CZK wall

in early 2026, bazos quietly rolled out a change that pissed off a lot of people. before you can view a seller's phone number, send them an email, or post a listing on the web version, you now have to send 1 CZK (about 4 cents) from your bank account to bazos. your phone number goes in the payment reference so they can link your bank to your phone.

the idea makes sense on paper. scammers were buying prepaid SIM cards in bulk, creating unlimited verified identities, and running phishing operations at scale. bank accounts are harder to get than SIM cards, so tying phone to bank account makes mass-scamming more expensive.

the reaction was not great. czech and slovak media ran headlines like "bazos is no longer free" and "bazos radically changes rules for everyone." forums filled up with people asking if the 1 CZK request was itself a scam, which is kind of darkly funny. the user rating on recenzer.cz sits at 5.1 out of 10. professional reviewers give it 9.5. that gap tells you everything.

and the best part: it's not even working that well. one user on arecenze.cz reported paying their crown, posting a listing, and getting a suspicious courier scam offer within five minutes. turns out scammers can also verify with a real bank account once and keep doing their thing.

## the real problem

here's what's actually going on. bazos processes roughly 100,000 new listings per day across czech republic and slovakia. even a 1% scam rate means a thousand fake listings hitting the platform daily. the scam database at podvodnabazaru.cz has logged over 21,000 reports totaling 266 million CZK in losses. that's about 10.6 million euros stolen through marketplace scams, with bazos holding the majority share.

the most common pattern is dead simple: scammer contacts a seller, says they're interested, sends a fake DPD or GLS payment link. victim enters their bank credentials. account drained. a 55-year-old lost 189,000 CZK selling winter tires this way.

bazos has 4 part-time moderators. the entire codebase lives in one person's head with no documentation and no succession plan beyond "maybe my children someday." there's no in-app messaging, so every conversation happens off-platform where bazos has zero visibility. no fraud detection system. their terms of service explicitly say they bear no responsibility for misuse of personal data.

the bank verification wasn't added to protect users. it was added because the platform is drowning in fraud at a scale it can't manage with four moderators and no tooling. it's a platform problem being passed down to users as friction.

## small scale is a feature

here's the thing that clicked for me. all of bazos's hardest problems are problems of scale. when you're processing 100,000 listings a day with no moderation infrastructure, you need blunt instruments like bank verification to keep the platform functional. you can't review listings manually. you can't build trust systems. you just throw up a wall and hope it filters out enough garbage.

a new platform doing 500 listings a day doesn't have that problem. SMS verification plus basic rate limiting (cap listings per phone number per day, cooldown period on new numbers) is plenty. you can actually moderate. you can actually look at reports. you don't need to ask people for their bank details to post a used bicycle.

bank verification becomes necessary at bazos-level volume. that would be a nice problem to have.

## what i'm building

vloz.it is a classifieds platform for slovakia and czech republic. that's it. not a marketplace, not a social network, not an "AI-powered shopping experience." a bulletin board where people post things they want to sell and other people contact them about it. same model bazos has used for two decades.

the differences are in execution. search that uses AND logic instead of OR (on bazos, searching "red couch" returns every red thing and every couch separately, which is genuinely insane for a search engine in 2026). phone numbers encrypted before storage instead of sitting in plaintext. a UI that doesn't look like it was last updated when firefox 1.0 shipped.

the chicken-and-egg problem with marketplaces is that nobody posts on a platform with no listings, and nobody browses a platform with no listings. i solved that by scraping bazos. a python script runs every two hours on a VPS, pulls listings from bazos.sk and bazos.cz, and indexes them on vloz.it. users see real inventory from day one. native listings grow alongside the scraped ones over time.

is that aggressive? yeah. but bazos scrapes other sites too, and their robots.txt doesn't disallow it. classifieds are public data. the whole point is for people to see them.

## the moat question

i'd be lying if i said this was easy. bazos's real advantage has nothing to do with technology. it's twenty years of cultural habit. when someone in bratislava wants to sell something, the thought "use bazos" fires automatically, the same way "use google" does for search. you don't beat that with better filters or nicer CSS.

the honest answer is that i don't know if vloz.it will work. the bank verification backlash opened a window. people are annoyed, confused, and for the first time in years, actively looking for alternatives. but that window won't stay open forever. bazos could roll back the verification, improve it, or people could just get used to it.

what i do know is that the structural problems at bazos aren't going away. one developer, no team, no moderation infrastructure, no messaging, no fraud detection. those are the things that created the scam problem in the first place, and bank verification doesn't fix any of them. it just makes posting more annoying.

if bazos ever stumbles badly enough that people actually try something else, i want vloz.it to be the something else. and building it costs me basically nothing. the whole stack runs on cloudflare free tier and a $25/month supabase instance. i can keep this running indefinitely without it mattering financially.

## the bet

the bet is simple: bazos is a single point of failure for CZ/SK classifieds, and single points of failure eventually fail. maybe not this year. maybe not because of bank verification specifically. but someday that one guy is going to retire, or the scam problem is going to get bad enough that users leave on their own, or some regulatory change is going to hit and there's no team to respond to it.

when that happens, having a working alternative already live with real listings indexed is worth more than scrambling to build one from scratch.

in the meantime, it's a good project. i'm learning svelte 5, getting familiar with cloudflare's edge stack, and building something that people in my country might actually use. worst case, it's a portfolio piece. best case, it's the thing that catches fire when bazos finally trips.

vloz.it is live at [vloz.it](https://vloz.it).

-- alex
