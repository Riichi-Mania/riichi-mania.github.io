# 牌局 Haipai — Midnight Parlor Mahjong Blog

A Riichi Mahjong experience log built with Jekyll + Tailwind CSS.
Deep charcoal. Cream text. Dora Red accents. Tile rendering in pure JS.

---

## 🀄 Quick Setup

### 1. Clone & install

```bash
git clone https://github.com/yourusername/midnight-parlor.git
cd midnight-parlor
bundle install
```

### 2. Run locally

```bash
bundle exec jekyll serve --livereload
# → http://localhost:4000
```

### 3. Deploy to GitHub Pages

Push to a repo named `<yourusername>.github.io` (or any repo — set the `baseurl` in `_config.yml`).

GitHub Pages builds Jekyll automatically. No GitHub Actions needed for this stack since we use the Tailwind Play CDN.

> **Note:** The Tailwind Play CDN is perfect for a low-traffic personal blog. If you want to ship a production-optimized build (purged CSS, no CDN dependency), set up a GitHub Actions workflow with Node + `npx tailwindcss`.

---

## 📁 Structure

```
midnight-parlor/
├── _config.yml              ← Site settings, plugins
├── _data/
│   └── stats.yml            ← YOUR RANK + STATS — edit this!
├── _layouts/
│   ├── default.html         ← Base HTML shell (nav, footer, fonts)
│   └── post.html            ← Post layout with sidebar
├── _posts/
│   └── 2026-05-09-first-hanchan.md   ← Sample post
├── assets/
│   └── js/
│       └── tiles.js         ← Mahjong tile renderer
├── index.html               ← Feed / home page
└── Gemfile
```

---

## 🀇 Writing Posts

Create files in `_posts/` named `YYYY-MM-DD-slug.md`.

### Front Matter

```yaml
---
layout: post
title: "Your post title"
subtitle: "One-line teaser shown in cards and post header"
date: 2026-05-10
tags: [riichi, review, tanyao]
platform: "Mahjong Soul"   # or Tenhou, RiichiCity, etc.
hanchan: 2                 # running game number (optional)
result: "1st"              # 1st / 2nd / 3rd / 4th / Win / Loss
final_score: +34500        # raw score
uma: +30                   # uma-adjusted points
win_count: 3
deal_ins: 1
---
```

### Tile Notation

Write hand notation anywhere in your Markdown inside `[square brackets]`:

```
I opened with [1m2m3m 4p5p6p 7s8s9s 1z1z | 5m6m7m] and waited on East.
```

**Notation format:**
- `123m` = 1-2-3 manzu (characters)
- `456p` = 4-5-6 pinzu (circles)  
- `789s` = 7-8-9 souzu (bamboo)
- `1234567z` = East/South/West/North/Haku/Hatsu/Chun
- `0m` / `0p` / `0s` = Red five (akadora)
- Space between groups = visual separator (melded groups)
- `|` = explicit separator (e.g. before the winning tile)
- Uppercase suit letter = called tile, renders sideways: `123M`

---

## 🎨 Updating Your Stats

Edit `_data/stats.yml`:

```yaml
rank: "Jade ✦✦✦"
total_games: 52
first_rate: 29.1
win_rate: 22.0
deal_in_rate: 10.8
```

The rank badge in the navbar, the sidebar on every post, and the hero card on the index all update automatically.

---

## 🎨 Colour Reference

| Token | Hex | Use |
|-------|-----|-----|
| `--c-bg` | `#121212` | Page background |
| `--c-surface` | `#1a1a1a` | Section backgrounds |
| `--c-card` | `#1f1f1f` | Card backgrounds |
| `--c-cream` | `#f5edd6` | Primary text |
| `--c-dora` | `#e11d48` | Dora Red — accents, 1st place |
| `--c-riichi` | `#fbbf24` | Riichi Yellow — rank, links |
| `--c-bamboo` | `#4ade80` | Bamboo Green — positive stats |
| `--c-sky` | `#38bdf8` | Sky Blue — pinzu tiles |
