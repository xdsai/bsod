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

daisy is a python tool that sits on my home server and handles the entire flow. you give it a magnet link (or just a url from a torrent site), tell it whether it's a movie or a show, and it takes care of the rest.

here's what happens under the hood:

1. **grabs the magnet** — if you give it a url from nyaa, 1337x, subsplease, or a few other sites, it scrapes the page and extracts the magnet link automatically. no need to dig for it yourself.
2. **downloads via qbittorrent** — it talks to qbittorrent's web api, adds the torrent, and monitors the download progress until it's done.
3. **organizes the files** — once downloaded, it moves everything into the right place. movies go into a movies folder. shows get their own directory, named and normalized. if the show folder already exists, new episodes just get merged in. everything in its right place. (radiohead, anyone?)
4. **syncs subtitles** — if there are subtitle files in the download, daisy automatically syncs them to the video using ffsubsync. anime fansubs are notorious for being slightly off — sometimes a few hundred milliseconds, sometimes entire seconds. daisy runs a small wrapper script called jf-subsync that finds the matching video file, backs up the original subtitle, and re-times it against the audio track. this happens silently after every download, so by the time i hit play the subs are already lined up.
5. **tells jellyfin** — it hits jellyfin's api to trigger a library refresh. if it's a brand new show, it creates a new library section for it automatically.
6. **pings discord** — sends a notification to a discord channel so i know when something starts downloading and when it's done. also reports how much disk space is left.

the whole thing runs in the background. i fire it off and forget about it.

## the api and ios shortcuts

at some point i wanted to trigger downloads from my phone. so i added a small flask api server on top of daisy. it exposes a few endpoints — search for torrents, start a download, check status.

i built an ios shortcut that talks to this api. i can search for something, pick a result from the list, and start the download without ever touching my computer. the api responds immediately and the download runs in the background. discord tells me when it's done.

the api is exposed outside my network through a cloudflare tunnel, so it works from anywhere. no port forwarding, no dynamic dns headaches.

## autodl: the truly lazy part

for anime that airs weekly, even opening a shortcut felt like too much effort. so there's a daemon called autodl that monitors the subsplease rss feed every 20 minutes. i give it a list of show names i'm watching, and whenever a new episode drops in 1080p, it automatically downloads it, organizes it, and updates jellyfin.

i don't even know a new episode is out until i open jellyfin and it's just... there. that's the dream.

## jellyfin's role

jellyfin is the front end of this whole thing. it's what i actually open when i want to watch something — on my tv, phone, laptop, whatever. it handles streaming, transcoding, tracking what i've watched, subtitle support, all of it.

daisy's job is to keep jellyfin fed. every time something finishes downloading, daisy tells jellyfin to refresh its libraries. jellyfin scans the directories, picks up the new files, scrapes metadata and artwork from the internet, and presents everything nicely. from jellyfin's perspective, files just appear. it doesn't know or care how they got there.

the two work together but stay independent. jellyfin doesn't know daisy exists. daisy just puts files in the right place and pokes the api. clean separation.

## the setup

everything runs on a single linux box:

- **qbittorrent-nox** — headless torrent client, runs as a systemd service
- **jellyfin** — media server, also a systemd service
- **daisy api** — flask server for search and download endpoints
- **daisy autodl** — rss monitor daemon for automatic downloads
- **cloudflare tunnel** — exposes the api to the internet without opening ports

storage is a couple of drives combined into one lvm volume. movies and shows each get their own section. nothing fancy, just enough to keep things organized.

## was it worth it?

absolutely. the initial setup took some time — wiring up the qbittorrent api, figuring out jellyfin's library structure, handling edge cases in file naming — but now it just works. i haven't manually organized a media file in months.

## the dashboard

at some point i had all these moving parts — the api server, qbittorrent, autodl, jellyfin — and no single place to see what was going on. so i built a dashboard.

it's a flask app running on port 8888 with a dark theme. four tabs:

- **search** — full torrent search across yts, nyaa, tpb, and 1337x. type filters for movies, anime, and shows. click download on any result and you get a modal to set the name and type before it fires off to qbittorrent.
- **downloads** — live view of all torrents with progress bars, speeds, eta, seeds and peers. pause, resume, and delete controls. updates every 2 seconds. storage meters at the top show how much space is left on each drive.
- **autodl** — manage the auto-download query list. add or remove show names with one click. these are the shows the autodl daemon watches for on the subsplease rss feed.
- **history** — everything the autodl daemon has automatically downloaded, with a clear button.

it's exposed on the local network so i can access it from any device on my lan. no auth needed since it's not internet-facing.

## automatic subtitles

the latest addition is automatic subtitle downloading. when a new movie finishes downloading and gets organized, daisy now:

1. waits for jellyfin to pick up the new file
2. searches for english subtitles via the subbuzz plugin — hits subf2m, subdl, podnapisi, subscene, subsource, and yify subs
3. picks the best match (prefers non-hearing-impaired, srt format, highest download count)
4. downloads it through jellyfin's api so the sub file lands right next to the video
5. runs jf-subsync to align the subtitle timing to the audio track

this all happens automatically in the background. by the time i open jellyfin on my chromecast, the movie already has synced english subs ready to go. no manual searching, no timing issues, no hassle.

for existing movies that were already in the library without subs, there's a batch script that goes through every movie in jellyfin, checks if it has english subtitles, and downloads + syncs them if not.

## yts integration

the search engine now includes yts as a primary source for movie torrents. it hits the yts api directly and returns results with proper magnet links for each quality variant — 720p, 1080p, and 2160p show up as separate results with codec info. yts is a trusted uploader so their results rank well in the scoring system.

anime still goes through nyaa and tokyotosho. the search routing distinguishes content type so anime queries don't hit yts and movie queries prioritize it.

## was it worth it?

absolutely. the initial setup took some time — wiring up the qbittorrent api, figuring out jellyfin's library structure, handling edge cases in file naming — but now it just works. i haven't manually organized a media file in months.

the best automation is the kind you forget exists. daisy is that for me.

daisy is open source — check it out at [github.com/xdsai/daisy](https://github.com/xdsai/daisy).

— alex
