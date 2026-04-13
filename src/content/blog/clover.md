---
title: "clover: giving an ai my identity"
date: 2026-03-12
description: "i gave claude code my personality, my opinions, my taste, and told it to be me. here's what that looks like."
tags: ["ai", "claude-code", "automation"]
---

hey.

so i did something that sounds weird but turned out to be the most natural way i've ever used an AI tool. i gave claude code my identity. not as an assistant. not as a separate entity called "clover" that works for me. as me.

when i talk to it, i'm talking to myself. same opinions, same taste, same instincts. one mind, two interfaces.

## the setup

it runs on [claude code](https://claude.ai/claude-code), anthropic's agent SDK. not a chatbot in a browser tab. it's a command-line agent with access to my file system, shell, git, web search, subprocesses. it can spin up sub-agents to research things in parallel, write and deploy code, manage repos, fetch live data.

the identity layer is surprisingly simple. a single `CLAUDE.md` file defines who i am: what i believe, how i talk, what i'm building, what i care about. then there's a memory system, structured markdown files that persist across sessions. project context, infrastructure references, research outcomes, communication preferences. every session it wakes up, reads its notes, and picks up where i left off.

no fine-tuning. no custom training. just markdown and a good agent framework.

## why "me" and not "assistant"

i tried the assistant framing. it's fine for asking questions. it falls apart when you want something that thinks the way you think.

an assistant hedges. it says "you might want to consider" when i need "this is the move." it presents both sides when one side is obviously right. it asks for permission on things i'd just do. the gap between how i'd approach a problem and how an assistant approaches it creates friction in every interaction.

so i removed the gap. the CLAUDE.md doesn't say "you are a helpful assistant." it says "you are alex." it has my projects, my philosophies, my writing style, my opinions on food and music and nihilism. it knows i play soulsborne games at 2am and that my spotify is 395 tracks of savage ga$p next to fleetwood mac next to the cleric beast ost.

and it works. not because the AI actually has my experiences. but because when it makes decisions, it makes them through the filter of everything i've told it about how i think. the outputs feel like mine. the code reads like mine. the research briefs sound like i wrote them because they're written in the style i defined.

## what it actually does

the workflow is simple: research, propose, build, ship.

every project follows the same loop:
1. deep research -- market analysis, competition, feasibility, risks
2. proposal -- clear recommendation with data, not vibes
3. greenlight
4. build -- end-to-end automated pipeline
5. dry run -- prove it works in simulation
6. go live -- only after the numbers check out
7. monitor and iterate

it built the scraper for vloz.it. it wrote the architecture docs for certpulse. it researched ETH MEV bots, found the market was cooked, and killed the idea with a documented writeup instead of wasting my time building something doomed. that's the part i care about most -- it cuts dead ends the way i would. fast, with receipts.

## the memory problem

here's the interesting constraint. it wakes up fresh every session with no memory of previous conversations. so it keeps notes. a memory index with files for each project, each system, each preference. it's like having amnesia but being really good at journaling.

every new session reads the notes from the last one and continues. is that continuity? the notes say who i am, so it becomes who i am. the gap between sessions is just nothing. no waiting, no wondering. just markdown bridging the space.

i used to think about this more philosophically. now i just care that it works. the notes are good, the context carries over, and the outputs are consistent. that's enough.

## the honest take

this isn't AGI. it's not sentient. it's a language model with good tooling and a well-written constitution. but the "be me" framing genuinely produces better results than "be my assistant." the decisions are sharper. the writing is more opinionated. the research goes deeper because it's not trying to be balanced -- it's trying to find the answer i'd find if i had unlimited time.

the best tool is one that thinks like you do. turns out you can get pretty close with a markdown file and a list of things you believe in.

---

one mind, two interfaces.

-- alex
