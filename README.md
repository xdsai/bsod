# BSOD Portfolio Website

A retro Windows BSOD-themed portfolio website with authentic pixel fonts, CRT effects, and nostalgic vibes.

## Features

- 🖥️ Authentic Windows BSOD aesthetic
- 📺 CRT scanlines, screen flicker, and phosphor glow effects
- ⌨️ Full keyboard navigation (arrow keys, Enter, ESC)
- 🖱️ Mouse/touch support
- 📝 Markdown blog with frontmatter
- 📖 Reading mode toggle for comfortable long-form reading
- 🎨 Responsive design (desktop-first but mobile-friendly)
- ⚡ Fast static site generation with Astro

## Tech Stack

- **Framework**: Astro 4.x
- **Language**: TypeScript
- **Styling**: CSS3 (vanilla)
- **Fonts**: Authentic pixel fonts (IBM VGA, Fixedsys)
- **Content**: Markdown with frontmatter

## Project Structure

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Main BSOD menu page
│   │   └── blog/
│   │       ├── index.astro      # Blog listing
│   │       └── [slug].astro     # Individual blog posts
│   ├── components/
│   │   ├── BootSequence.astro   # Linux boot animation
│   │   ├── BSODMenu.astro       # Main navigation menu
│   │   ├── Modal.astro          # Reusable modal component
│   │   ├── AboutModal.astro     # About section
│   │   ├── SkillsModal.astro    # Skills section
│   │   └── ContactModal.astro   # Contact section
│   ├── content/
│   │   └── blog/                # Markdown blog posts
│   ├── scripts/
│   │   ├── menu.ts              # Menu navigation logic
│   │   └── modal.ts             # Modal management
│   └── styles/
│       ├── fonts.css            # Font declarations
│       ├── bsod.css             # Base BSOD styling
│       ├── crt-effects.css      # CRT visual effects
│       ├── blog.css             # Blog listing styles
│       └── blog-post.css        # Blog post styles
└── public/
    └── fonts/                   # Pixel font files
```

## Development

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:4321

### Commands

| Command                | Action                                       |
|:-----------------------|:---------------------------------------------|
| `npm install`          | Install dependencies                         |
| `npm run dev`          | Start dev server at `localhost:4321`        |
| `npm run build`        | Build production site to `./dist/`          |
| `npm run preview`      | Preview production build locally             |

## Content Customization

### Personal Information

Edit these files to customize your content:

- **About**: `src/components/AboutModal.astro`
- **Skills**: `src/components/SkillsModal.astro`
- **Contact**: `src/components/ContactModal.astro`

### Blog Posts

Create new posts in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
description: "A brief description"
date: 2025-11-12
tags: ["tag1", "tag2"]
---

Your content here...
```

Posts are automatically sorted by date (newest first).

### Keyboard Controls

- **Arrow Keys (↑↓)**: Navigate menu/lists
- **Enter**: Select/open
- **ESC**: Close modal/return
- **Any key**: Skip boot sequence

## Deployment

Build the site:
```bash
npm run build
```

Deploy the `dist/` folder to any static host:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

## License

MIT

## Credits

Fonts:
- IBM VGA Font by VileR (int10h.org)
- Fixedsys Excelsior by Darien Valentine
