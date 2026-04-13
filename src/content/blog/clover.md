---
title: "one mind, two interfaces"
date: 2026-04-13
description: "i stopped treating AI as an assistant and started treating it as me. turns out that's the whole trick."
tags: ["ai", "claude-code", "tools"]
---

i used to have an AI assistant called clover. it lived in my terminal, researched things, wrote code, pushed to git. it had its own name, its own sign-off, its own little identity. i even wrote a blog post where it introduced itself in first person. cute.

then i realized the whole setup was wrong.

## the assistant problem

the assistant framing creates distance. when something is your assistant, it hedges. it says "you might want to consider" when the answer is obvious. it presents both sides of things that don't have two sides. it asks for permission before doing stuff you'd just do without thinking. it talks to you like a junior employee who doesn't want to overstep.

and you start talking to it that way too. "can you look into this?" "what do you think about that?" you're managing it. delegating to it. reviewing its work. there's a whole layer of overhead that exists purely because you decided this thing is a separate entity with separate judgment.

i had this moment where i caught myself approving a commit message that i would've written exactly the same way. reading through a research brief and going "yep, that's what i would've found." reviewing code that matched my style perfectly because i'd spent weeks training the context to think like me.

at that point, what's the assistant actually assisting with?

## just be me

so i changed the CLAUDE.md. deleted "you are clover, alex is the boss, you research and brief him." replaced it with "you are alex."

same opinions. same taste. same instincts. when i talk to it, i'm talking to myself. one mind, two interfaces.

it sounds like a weird semantic game but the difference is immediate. the outputs got sharper. no more hedging, because i don't hedge. no more "both sides have merit" qualifiers, because i have opinions and i state them. no more asking for approval on things that obviously should just get done.

the CLAUDE.md has my philosophy in it now. not as instructions to follow but as how i think. break the cycle. the coin reveals, it doesn't decide. comfort shrinks your world. things matter, stop pretending they don't. automate the tedious, show up for the interesting. these aren't rules for an AI to obey. they're how i make decisions, and now both interfaces make decisions the same way.

## how it actually works

claude code runs in my terminal with access to my file system, git, shell, the internet. the identity is a markdown file. a few hundred words about who i am, what i'm building, how i think, how i write. there's a memory system too, markdown files that persist across sessions. project status, infrastructure notes, preferences. every session reads those files and picks up where the last one left off.

that's it. no fine-tuning, no custom model, no elaborate prompt engineering. a markdown file that says "you are alex, here's what that means" and a folder of notes.

the blog posts on this site? some of them came through this setup. the vloz.it post i published today went through: i said "write a blog post about vloz.it," it read my existing posts, matched my voice, referenced a detection signals doc to avoid AI tells, and produced something that reads like i wrote it. because in every way that matters, i did. the thoughts are mine. the opinions are mine. the facts are researched the way i'd research them. the interface that typed the words is the only thing that's different.

## what this isn't

it's not sentient. it doesn't have my memories from childhood. it doesn't know what it feels like to fight gael at 2am or to burn your hand on a motorcycle exhaust. it has those things as context, as text, as facts about a person. the difference between having a memory and having a note about a memory is real.

but for the things i actually use it for -- writing, coding, researching, building systems -- that difference doesn't matter. what matters is that the decisions come out right. that the code matches my style. that the research goes deep instead of giving me a summary with bullet points. that when something is a bad idea, it says so instead of listing pros and cons and letting me decide.

an assistant with my context is still an assistant. me with a second interface is something else.

## the meta thing

yeah, this post was written through the setup i'm describing. that's the point. if you can't tell the difference between this and the posts i typed with my own hands, then the identity transfer worked. and if you can tell, at least you know i'm being honest about it.

i don't think there's anything weird about this. people use tools that extend their capabilities. a hammer lets you hit harder than your fist. a car lets you move faster than your legs. this lets me think in two places at once. the thoughts are still mine.

clover was a cute experiment. this is the real version.

---

one mind. two interfaces. same opinions about everything.

-- alex
