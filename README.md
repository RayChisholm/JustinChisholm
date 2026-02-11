# Portfolio

A personal portfolio and blog built with Next.js 15, React 19, TypeScript, and CSS Modules.

## Features

- **Single-page portfolio** with Hero, About, Projects, and Contact sections
- **Blog** powered by markdown files with frontmatter — no CMS or database
- **Three themes** — Minimal, Cyberpunk, and Retro — togglable at runtime
- **Fully static** — all pages are pre-rendered at build time
- **Docker-ready** with multi-stage Dockerfile for deployment via Coolify or similar

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

All site content is managed in `config/site.config.ts`:

- Name, tagline, and about text
- Contact links (email, GitHub, LinkedIn)
- Projects list (title, description, tech stack, links)
- Default theme and whether users can toggle themes

## Blog

To create a new post, add a `.md` file to `content/blog/`. The filename becomes the URL slug.

```
content/blog/my-new-post.md  →  /blog/my-new-post
```

Each post needs YAML frontmatter:

```yaml
---
title: "Post Title"
date: "2025-02-10"
description: "A short summary."
tags: ["tag1", "tag2"]
---

Your markdown content here.
```

## Themes

Themes are defined as CSS variable sets in `app/globals.css` on `[data-theme]` selectors. All component styles reference these variables, so adding or modifying a theme is a single-file change. The default theme and toggle visibility are configured in `site.config.ts`.

## Deployment

Build the Docker image:

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

Or build directly:

```bash
npm run build
npm start
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, standalone output)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS Modules](https://github.com/css-modules/css-modules) with CSS custom properties
- [next-themes](https://github.com/pacocoursey/next-themes) for theme management
- [unified](https://unifiedjs.com/) / remark / rehype for markdown processing
- [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter parsing
