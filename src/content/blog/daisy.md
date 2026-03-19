---
title: "daisy: my lazy media pipeline"
date: 2026-02-23
description: "how i automated downloading, organizing, and streaming media on my home server with a python tool called daisy."
tags: ["homelab", "automation", "jellyfin", "media"]
---

i watch a lot of anime and movies. at some point the cycle of searching for torrents, downloading them, renaming files, putting them in the right folder, and then telling jellyfin to rescan got old. so i built a thing called daisy to do all of it for me.

## the problem

the manual workflow looked something like this: find a torrent, copy the magnet link, paste it into qbittorrent, wait for it to finish, then move the file into the right directory structure so jellyfin can actually find it. for movies that's one folder. for shows it's a folder per show with episodes inside. then you hit "scan library" in jellyfin and hope it picks everything up correctly.

multiply that by a dozen shows airing weekly and it gets tedious fast.

## what daisy does

daisy is a python tool that sits on my home server and handles everything from download to playback. you give it a magnet link (or just a url from a torrent site), tell it whether it's a movie or a show, and it takes care of the rest:

1. **grabs the magnet** — if you give it a url from nyaa, 1337x, subsplease, or a few other sites, it scrapes the page and extracts the magnet link. no need to dig for it yourself.
2. **downloads via qbittorrent** — talks to qbittorrent's web api, adds the torrent, monitors progress until it's done.
3. **organizes the files** — movies go into a movies folder. shows get their own directory, named and normalized. if the show folder already exists, new episodes get merged in. everything in its right place.
4. **handles subtitles** — two layers here. first, if the torrent comes with subtitle files (common with anime fansubs), daisy runs ffsubsync to align the timing to the audio track — fansubs are notorious for being slightly off. second, for movies, it automatically downloads english subtitles from external sources via jellyfin's subbuzz plugin (hits subf2m, subdl, podnapisi, subscene, subsource, and yify subs), picks the best match, and syncs the timing. by the time i hit play on my chromecast, subs are already there and lined up.
5. **updates jellyfin** — triggers a library refresh so the new content appears immediately. if it's a brand new show, it creates a library section for it automatically. jellyfin handles the rest — metadata, artwork, transcoding, streaming to whatever device i'm on.
6. **pings discord** — sends notifications when downloads start, finish, or fail. also reports disk space.

the whole thing runs in the background. i fire it off and forget about it.

## searching and downloading

there are a few ways to feed daisy:

**the search engine** queries yts, nyaa, the pirate bay, and 1337x in parallel. yts is the primary source for movies — it returns results per quality variant (720p/1080p/2160p) with codec info. anime goes through nyaa. results are ranked by a scoring system that weighs seeders, quality, and trusted uploaders.

**the api server** exposes this as http endpoints — search, download, quick-download (search + grab best result in one call). it's what everything else talks to.

**ios shortcuts** — i built a shortcut that hits the api. search for something from my phone, pick a result, start the download. the api is exposed through a cloudflare tunnel so it works from anywhere.

**the dashboard** — a web ui for when i want more control. more on that below.

## autodl: the truly lazy part

for anime that airs weekly, even opening a shortcut felt like too much effort. there's a daemon called autodl that monitors the subsplease rss feed every 20 minutes. i give it a list of show names i'm watching, and whenever a new episode drops in 1080p, it automatically downloads it, organizes it, and updates jellyfin.

i don't even know a new episode is out until i open jellyfin and it's just... there. that's the dream.

## letterboxd watchlist: the even lazier part

autodl solved anime. but for movies i was still doing the manual thing — see something interesting, open a shortcut, search, download. then i realized i already have a place where i save movies i want to watch: my letterboxd watchlist.

so now daisy watches it. a daemon polls my letterboxd watchlist every 2 minutes, and when a new movie shows up, it searches for torrents and picks the best one automatically. the trick is that "best" is subjective — you want 1080p, good seeders, a trusted source, reasonable file size — so instead of writing a bunch of heuristics, i just ask an llm.

the watchlist daemon sends the search results to a local claude proxy and asks it to pick the best 1080p torrent. it evaluates seeders, source quality (prefers yts, bluray, web-dl), file size (1-5gb sweet spot), and returns either a pick or "SKIP" if nothing looks good. the selected torrent gets sent to the daisy api and the normal pipeline takes over — download, organize, subtitles, jellyfin, discord notification.

movies i've already processed get tracked in `watchlist_seen.json` so nothing gets downloaded twice. the whole loop is: add a movie on letterboxd from my phone → it shows up in jellyfin a few minutes later. zero interaction on my end.

## the dashboard

with all these moving parts i wanted a single place to see what's going on. the dashboard is a flask app on port 8888 with four tabs:

- **search** — full torrent search with type filters for movies, anime, and shows. click download on any result, set the name and type, and it fires off to qbittorrent.
- **downloads** — live view of all torrents with progress bars, speeds, eta, seeds and peers. pause, resume, and delete controls. storage meters show how much space is left on each drive. updates every 2 seconds.
- **autodl** — add or remove show names from the auto-download watch list.
- **history** — everything the autodl daemon has grabbed, with a clear button.

it's on the local network so i can hit it from any device on my lan.

## the setup

everything runs on a single linux box as systemd services:

- **qbittorrent-nox** — headless torrent client
- **jellyfin** — media server and streaming frontend
- **daisy api** — flask server for search and download endpoints
- **daisy autodl** — rss monitor daemon
- **daisy watchlist** — letterboxd monitor daemon
- **daisy dashboard** — web ui on port 8888
- **cloudflare tunnel** — exposes the api without opening ports

storage is an lvm volume spanning a couple of drives. movies and shows each get their own section. nothing fancy, just enough to keep things organized.

## was it worth it?

absolutely. the initial setup took some time (wiring up the qbittorrent api, figuring out jellyfin's library structure, handling edge cases in file naming) but now it just works. i haven't manually organized a media file in months.

daisy is open source, check it out at [github.com/xdsai/daisy](https://github.com/xdsai/daisy).

— alex
