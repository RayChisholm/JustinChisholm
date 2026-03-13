---
title: "Project: Piano Sight-Reading Trainer"
date: "2026-03-13"
description: "I'm learning piano and struggling to identify bass clef notes on the fly. So I built a web app to practice."
tags: ["project", "next.js", "music", "typescript"]
---

## The Problem

I've been learning piano for about a year now.

The treble clef clicked quickly. Every Good Boy Does Fine. Lines and spaces. Notes on the page started mapping to keys without much thought.

The bass clef is a different story.

I can work it out. Given enough time, I can stare at a note sitting below middle C and eventually figure out what it is. But sight-reading requires something faster than "eventually." It needs to be instinct — the kind of pattern recognition that lives below conscious thought.

I wasn't there yet. And I wasn't sure how to get there.

Flashcard apps existed, but most were either too rigid, too cluttered, or buried behind subscriptions. I wanted something that felt immediate: show me a note, let me answer, tell me if I'm right, move on.

---

## The Reddit Post

While searching for practice strategies, I came across a thread on r/pianolearning.

Someone had posted asking about apps for this exact thing — practicing note identification on the grand staff. And buried in the comments was this:

> "I just want a simple web app where it shows you a note on the staff and you click the key on a piano keyboard to guess it. That's it. No lesson plans, no gamification, just reps."

I read that and thought: that's exactly what I want. And also: I could just build that.

So I did.

---

## The Build

The core of the app is straightforward:

1. Pick a random note from a pool
2. Render it on a grand staff using real music notation
3. Show a clickable piano keyboard
4. Accept an answer, give feedback, move on

The interesting part was getting real music notation rendering in the browser.

### VexFlow

I reached for [VexFlow](https://www.vexflow.com/) — a JavaScript library that renders sheet music as SVG. It handles the hard parts: staff lines, clef symbols, note placement, accidentals, ledger lines, key signatures. All of it comes out as clean, scalable SVG.

The tricky part was rendering a grand staff (treble + bass together, connected by a brace) with a single note on one clef while keeping the other clef clean. VexFlow's `StaveConnector` and `GhostNote` made this manageable. A `GhostNote` fills the empty voice without rendering any visible rest symbol — which was exactly what I needed.

### The Keyboard

The piano keyboard is pure CSS and React. Each octave is a positioned div with white keys in normal flow and black keys absolutely positioned on top. Clicking a white key submits an answer directly. Clicking a black key opens a small modal asking which enharmonic spelling you mean — F# or Gb, for example — since the correct answer might be either.

When you get something wrong, the correct key highlights green at the bottom (a small indicator strip so the active-octave styling doesn't fight it).

### Weighted Randomness

The note selection isn't purely random. Each note in the pool carries a weight that starts at 1. Get a note wrong and its weight increases — making it more likely to come up again. Get it right and the weight drops back down. Over a session, the app naturally focuses on your weak spots without you having to configure anything.

### Modes

There are two practice modes:

**Chromatic** — notes can have accidentals (sharps and flats), no key signature. Good for drilling note identification in isolation.

**Random Key** — picks a real key signature and shows only diatonic notes for that key. Useful for connecting staff reading to actual repertoire.

You can also set a timer if you want to add pressure, and configure how many notes per session (10, 20, or 30).

---

## The Worksheet Feature

One feature I added that I didn't expect to use much: printable worksheets.

You can generate a PDF of 10 or 20 random notes — each rendered on a mini grand staff — with a blank line below each one to write your answer. There's an answer key on the second page.

It turns out that pencil-and-paper practice hits differently. Something about the slower, more deliberate process of writing it down versus clicking a key.

---

## What I Learned

**VexFlow is powerful but opinionated.** Getting the grand staff layout right took some wrestling. The SVG output is clean but the API has quirks — especially around voice formatting and how accidentals are attached to notes.

**CSS specificity will get you.** I spent more time than I'd like debugging why a green highlight wasn't showing on the correct piano key. The answer was that an active-octave background rule had `!important` and higher specificity. The fix was switching from a background color approach to a `::after` pseudo-element, which sits in a completely separate layer.

**Building for yourself is useful forcing function.** Because I actually use this app, I noticed friction immediately. The enharmonic modal felt annoying to implement but it matters — if the answer is Bb and you click the black key, the app needs to know which note you meant. Skipping that would make the whole thing feel broken.

---

## The Reddit Comment Was Right

The feature set is small on purpose.

No accounts. No streaks displayed on a dashboard. No animated confetti. No lesson plans.

Just: here's a note, click the key, was it right, next.

That's the thing I needed. And now it exists.

You can try it [here](/piano).
