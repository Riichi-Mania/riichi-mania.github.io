This README is designed to explain *exactly* what your unique, vibecoded engine does. Since this isn't a standard template, you need a document that helps you (and your LLM co-pilot) understand the custom integrations, like the JavaScript tile rendering.

Here is a `README.md` file designed for your custom, dark-mode, JavaScript-tile-enabled Jekyll setup.

---

### **README.md for Riichi Mania**

Copy the entire block below and create a new file named `README.md` in the root directory of your GitHub repository.

---

```markdown
# 🀄 Riichi Mania (experience_log)

Welcome to the repository for **Riichi Mania**, a minimalist, "Dark Mode" digital notebook documenting my journey of mastering Riichi Mahjong.



**Live Site:** `[YOUR_DOMAIN_HERE]` (e.g., https://riichimania.com)

---

## 🌓 The Vibe & Philosophy

The design philosophy is centered on **"The 3:00 AM Hanchan."** It’s dark, quiet, and focused entirely on analysis and memory.

### Aesthetic Specs
* **Background:** Deep Charcoal (`#121212`)
* **Typography:** Cream (`#F5F5F0`) - Focuses on readability.
* **Accents:**
    * **Dora Red:** (`#e11d48`) - Highlights key decisions and mistakes.
    * **Riichi Yellow:** (`#fbbf24`) - Highlights milestones and big wins.

---

## 🛠️ The Tech Stack (The "Vibecode" Special)

This site is uniquely built to solve the limitations of hosting a Mahjong blog on GitHub Pages.

1.  **Engine:** Jekyll (Native GitHub Pages support).
2.  **Styling:** Tailwind CSS (Via Play CDN for instant customization).
3.  **Hosting:** GitHub Pages (Cost: $0/month).

### 🃏 The Custom Tile Renderer (JavaScript)
Most Jekyll plugins for Mahjong tiles are Ruby Gems, which **will not run** on GitHub Pages. We bypassed this restriction using a custom JavaScript snippet (`/assets/js/tile-renderer.js`).

**How to write tiles in Markdown:**
This script automatically scans your posts for specific brackets `[ ]`. It converts standard "MPSZ" notation into beautiful, stylized tiles.

* **You write:** `[123m 456p 789s 1122z]`
* **The site renders:** Beautiful tiles.

---

## 📂 Project Structure

A barebones, logical structure for rapid writing:

* `_posts/` - Where the magic happens. All your Markdown experience logs go here.
* `_layouts/` - Custom minimalist HTML structures (`default.html`, `post.html`).
* `_data/` - Your control panel.
    * `stats.yml` - **Crucial:** When you rank up, change your rank here. It updates the sidebar of every single post automatically.
* `assets/` -
    * `js/tile-renderer.js` - The custom script that handles the MPSZ notation.
    * `images/` - Place your game screenshots and the logo here.

---

## 🚀 How to Add a New Log

I built this so you can write a post in minutes without touching a server.

1.  **Create a new file** in `_posts/` following the format: `YYYY-MM-DD-title-of-your-log.md`.
2.  **Paste this frontmatter:**

```markdown
---
layout: post
title: "First Hanchan in the Gold Room"
date: 2026-05-09
categories: analysis
tags: Mortal M_Soul Gold_Room
mortal_review: [https://mortal.guest.jp/xxxxxxxxx](https://mortal.guest.jp/xxxxxxxxx)  # Optional AI review link
---

## Summary
Finally hit Tenpai with [1m] [2m] Dora...

### Key Decision Point
I had to choose between keeping [1s] or discard [9p].

`[111m] [23p] [444p] [11s] [9p]`

*Self-reflection: Re-watching the replay, Mortal (AI) confirms this was a mistake. I should have prioritized the safer discard.*

```

3. **Commit and Push:** `git push`. GitHub builds the site automatically. Within 60 seconds, your new experience is live.

---

## ⚙️ How to Customize

Since we are vibecoding, changes are done directly in the code:

* **Change colors:** Edit the Tailwind config or hex codes in `_layouts/default.html`.
* **Add widgets:** Modify `_layouts/post.html` (e.g., adding a section for "My Big 3 Yakuman" gallery).
* **Change tiles:** Modify `assets/js/tile-renderer.js` to point to a different tile image CDN.

---

## 🧑‍🤝‍🧑 Contribution & Acknowledgements

* **Code:** This project was co-piloted (vibecoded) with Claude (Anthropic).
* **Tiles:** Asset library is utilizing [`mahjong-tile-images`](https://www.google.com/search?q=https://github.com/mizunagi-kb/mahjong-tile-images) or compatible CDN.
* **Content:** My soul.

```markdown
# To contact me, open an Issue.

```

```

***
