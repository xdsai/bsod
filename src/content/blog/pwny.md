---
title: "pwny: a wifi pentesting kiosk that fits in your pocket"
date: 2026-02-16
description: "how i built a touchscreen wifi hacking tool on a raspberry pi 5."
tags: ["security", "raspberry-pi", "wifi", "python"]
---

hey.

so i built a thing. it's called **pwny**, a fullscreen touchscreen wifi pentesting kiosk that runs on a raspberry pi 5 with a tiny 480x320 spi display. you tap your way through scanning networks, deauthing clients, capturing wpa handshakes, cracking passwords, and even spinning up a rogue hotspot that bridges through a cracked network. all from a device that fits in your hand.

this is the kind of project i build for fun and then realize i should probably write about.

## the idea

i wanted a self-contained wifi auditing tool. something portable that doesn't need a laptop. plug in a usb wifi adapter that supports monitor mode, boot up the pi, and you've got a handheld pentesting station with a gui you can actually use with your thumbs.

no x11, no wayland, no desktop environment. the gui renders directly via sdl2's kmsdrm backend, straight to the framebuffer. the touchscreen talks through an ads7846 spi controller with calibrated coordinate inversion to match the physical screen orientation. it's janky in the best way.

## hardware

the setup is pretty minimal:

- **raspberry pi 5** — the brains
- **480x320 spi touchscreen** — ads7846 touch controller, tiny but usable
- **usb wifi adapter** — needs to support monitor mode and ap mode (i use an rt2800usb chipset). this does the actual hacking: sniffing, injecting, deauthing
- **pi's built-in wlan0** — used for the leech ap's upstream connection
- **microsd card** — stores captures and wordlists

the usb adapter does double duty: monitor mode for capturing handshakes, and ap mode for the rogue hotspot. the built-in wifi handles the station connection to the cracked network. two radios, one device.

## the workflow

the whole thing follows a natural pentesting flow:

### 1. scan

hit the scan button and nmcli does a sweep. networks show up color-coded: green means wpa2-psk (vulnerable to handshake capture), red means wpa3/sae or enterprise (not attackable with this tool), yellow means open. sorted with the juicy targets on top.

tap a network to select it as your target.

### 2. attack

this is where it gets fun. entering the attack screen fires up monitor mode on the usb adapter, creates a `mon1` interface, tunes to the target's channel (with full dfs support for 5ghz), and initializes scapy for packet capture.

two main buttons here:

- **pcap on/off** — starts/stops packet capture filtered to the target bssid. scapy's `AsyncSniffer` grabs every dot11 frame that matches, and a real-time eapol breakdown shows you how many handshake messages you've caught from the ap vs the client.
- **deauth on/off** — fires up `aireplay-ng -0 0` for continuous deauthentication. this kicks clients off the network, forcing them to reconnect and generate those sweet eapol 4-way handshake frames. it auto-stops when a handshake is detected.

the ui shows live stats: packet count, eapol breakdown (how many from the ap, how many from clients), and a green "HS CAPTURED" banner when you've got what you need.

### 3. brute force

once you've captured a handshake, you crack it. two modes:

**dictionary attack** — pick a wordlist from the `dicts/` folder (ships with lists from 447 to 204k probable wpa passwords, plus rockyou-wpa if you add it). runs `aircrack-ng` in the background with live progress: keys tested, percentage, kh/s throughput, elapsed time, eta.

**rng brute force** — toggle character sets (lowercase, uppercase, digits, special chars), set a min/max length, and it generates every permutation with `itertools.product` and pipes them into aircrack-ng via stdin. the combination counter shows you exactly how futile (or feasible) your attempt is before you start.

cracked passwords get stored in `pcap_info.json` and are available everywhere in the app. the attack screen, pcap browser, and leech ap all know the password once it's cracked.

### 4. leech ap

this is my favorite part. once you've cracked a network, you can create a transparent wifi bridge:

1. the pi connects to the cracked network as a station on `wlan0`
2. a new hotspot goes up on the usb adapter (`ap0`) with hostapd
3. dnsmasq serves dhcp to clients connecting to the hotspot
4. nftables handles nat masquerading
5. policy routing (table 100) ensures hotspot traffic routes through `wlan0`, not `eth0`

the result: anyone who connects to your hotspot gets full internet through the cracked upstream network. you configure the leech ssid and password (or leave it open). live status shows connected clients and uptime.

it's like a wifi pineapple but built from scratch with python and duct tape.

## under the hood

some of the more interesting technical bits:

**phy auto-detection** — the usb adapter's phy name (phy0, phy1, etc.) can change after reboots or usb re-enumeration. the code scans `/sys/class/ieee80211/*/device` symlinks, resolves them, and picks the one backed by a usb bus. no hardcoded phy names.

**dfs channel support** — channels 52-64 and 100-140 in the 5ghz band require a channel availability check before you can use them. most drivers let monitor interfaces skip this (they're passive), but when they don't, the tool spins up a temporary hostapd instance to perform cac, watches for `DFS-CAC-COMPLETED` in the output, then tears it down and retunes. weather radar channels (120-128) need a 10-minute cac — the code handles that too. if cac fails (radar detected), it falls back to channel 36.

**aircrack output parsing** — aircrack-ng uses carriage returns to overwrite progress lines in place. a custom `_read_cr_lines()` function reads raw bytes and splits on both `\r` and `\n` to catch those in-place updates. ansi escape codes get stripped via regex. it's the kind of plumbing you don't think about until it doesn't work.

**thread-safe kivy updates** — all heavy operations (scanning, capturing, brute forcing, leech setup) run in daemon threads. gui updates get marshalled back to the main loop via `Clock.schedule_once()` — the only safe way to touch kivy widgets from a background thread. miss this and you get random segfaults.

**eapol 4-way handshake detection** — the code inspects each eapol frame's type (type 3 = eapol-key, which is the wpa handshake) and checks `Dot11.addr2` to determine direction. source mac == bssid means it's from the ap (m1 or m3), anything else is from the client (m2 or m4). you need at least one from each side for a valid handshake. non-key eapol (start/logoff/eap) gets flagged separately as a hint that you might be looking at wpa-enterprise, which isn't crackable with psk brute force.

## the gui

the whole ui is built in kivy, coded entirely in python, no kv language files. 480x320 is tiny, so every pixel matters. custom `APRow` widgets with rounded rectangles and accent bars for selection. a `MetricBar` at the top of every screen showing cpu/ram/disk/temp. scrollable logs. popup dialogs for confirmations.

it runs as a systemd service (`kivy-pwny.service`) that auto-starts on boot, takes over tty1, and renders fullscreen. the touchscreen calibration is handled by the launch script that auto-detects the ads7846 event node and writes kivy's hidinput config with inverted axes and pressure thresholds.

## why

partly because i wanted a portable pentest tool. partly because i wanted to learn how monitor mode, packet injection, and wpa handshakes actually work at the scapy/driver level rather than just running aircrack and hoping. and partly because building a kiosk gui on a pi with no desktop environment sounded like a fun challenge.

it was all of those things. especially the fun part.

the code is [on github](https://github.com/xdsai/pwny). if you want to build something similar or just poke around, the architecture is straightforward: nmcli for scanning, scapy for capture, aircrack-ng/aireplay-ng for the heavy lifting, hostapd/dnsmasq/nftables for the hotspot, and kivy for the ui. string it together with some threading and you've got a pocket wifi lab.

---

build things. break things (with permission). document what you learn.

— alex
