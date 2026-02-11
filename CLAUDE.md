# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (standalone output for Docker)
npm run lint         # ESLint
```

## Architecture

This is a Next.js 15 (App Router) portfolio site with a blog. It uses React 19, TypeScript, and CSS Modules.

**Single-page home + multi-page blog:** The home page (`app/page.tsx`) is a single scroll with anchor sections (Hero, About, Projects, Contact). The blog (`app/blog/`) uses real page routing. The Navbar (a client component in `app/layout.tsx`) uses `usePathname()` to switch between anchor links (`#about`) on home and route links (`/#about`) on other pages.

**Configuration-driven content:** `config/site.config.ts` is the single source of truth for personal info, projects, contact links, and theme settings. Components import it directly — no prop drilling.

**Theming:** Three themes (minimal, cyberpunk, retro) defined as CSS variable sets on `[data-theme]` selectors in `globals.css`. Managed by `next-themes` via `lib/theme-provider.tsx`. All component styles reference CSS variables (`--text`, `--surface`, `--accent`, etc.), so themes work automatically everywhere.

**Blog pipeline (build-time only):** Markdown files in `content/blog/` with YAML frontmatter → `lib/blog.ts` parses with `gray-matter` and converts to HTML via `unified` (remark-parse → remark-rehype → rehype-stringify) → statically generated via `generateStaticParams()`. Filename becomes the URL slug.

**Blog frontmatter format:**
```yaml
---
title: "Post Title"
date: "2025-02-10"
description: "Short summary"
tags: ["tag1", "tag2"]
---
```

## Conventions

- CSS Modules for all styling (one `.module.css` per component), using existing CSS variables for theme compatibility
- Import alias: `@/` maps to project root (e.g., `@/components/Navbar`, `@/lib/blog`)
- Responsive breakpoint: `@media (max-width: 640px)`
- Standalone output mode for Docker/Coolify deployment
