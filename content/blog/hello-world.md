---
title: "Hello World: Starting a Blog"
date: "2025-02-10"
description: "The first post on my new blog — why I decided to start writing, and what to expect."
tags: ["meta", "writing"]
---

## Why a blog?

I've been building things for a while now, but I've rarely taken the time to write about the process. This blog is my attempt to change that.

Writing helps me think more clearly about the problems I'm solving and the decisions I'm making. It also creates a record I can look back on — and hopefully, something useful for others who are working through similar challenges.

## What to expect

I plan to write about:

- **Projects I'm building** — what went well, what didn't, and what I learned
- **Tools and workflows** — the dev setup, libraries, and processes I find useful
- **Technical deep-dives** — breaking down interesting problems I've encountered

No fixed schedule. I'll publish when I have something worth sharing.

## The stack behind this blog

This blog is built right into my portfolio site. Posts are authored as markdown files, parsed at build time, and statically generated with Next.js. No CMS, no database — just files in a repo.

The setup is intentionally simple:

1. Write a `.md` file with some frontmatter
2. Drop it in the `content/blog/` directory
3. Deploy

That's it. If you're curious about the implementation, the source is on [GitHub](https://github.com/raychisholm/justinchisholm).
