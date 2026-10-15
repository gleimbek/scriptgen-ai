# ScriptGen AI ⚡

> AI-powered short video script generator for TikTok, Instagram Reels & YouTube Shorts

![ScriptGen AI](https://img.shields.io/badge/Built%20with-React%20%2B%20Claude%20API-ff3c00?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 🎬 What it does

Drop your video idea and get a complete, ready-to-shoot script in seconds:

- **Structured breakdown** — Hook, Setup, Content, CTA with timing for each section
- **Viral score** — AI estimates how likely the script is to perform well
- **Caption generator** — Ready-to-post caption with hashtags
- **Production tips** — 3 specific tips to maximize performance
- **Multi-platform** — Optimized for TikTok, Instagram Reels, YouTube Shorts
- **Multi-language** — English, Spanish, Portuguese, French

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/gleimbek/scriptgen-ai.git
cd scriptgen-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

The browser never sees the key. The form posts to `/api/generate`, a serverless function in `api/generate.js` that validates the fields, builds the prompt and calls Claude with the key from the server's environment.

For local development, create a `.env` file in the project root:

```bash
ANTHROPIC_API_KEY=your_key_here
# Optional: use a different model (default: claude-sonnet-5-5)
# ANTHROPIC_MODEL=claude-haiku-5-5
```

> ⚠️ Don't prefix the key with `VITE_`. Vite copies every `VITE_` variable into the public JavaScript bundle, where anyone can read it. `.env` is already in `.gitignore`.

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`. The Vite dev server also serves `/api/generate`, so you don't need the Vercel CLI.

## 📦 Deploy to Vercel

1. Import the repo in Vercel (framework preset: Vite).
2. In **Settings → Environment Variables**, add `ANTHROPIC_API_KEY`.
3. Deploy. Vercel builds the site with `npm run build` and runs `api/generate.js` as a function.

GitHub Pages can't run the server function, so it isn't a deploy target for this app.

To keep a public demo from running up your bill, set a monthly spend limit for the key's workspace in the Claude Console.

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion** for animations
- **Claude API** (`claude-sonnet-5-5`), called from a Vercel serverless function
- **Google Fonts** — Bebas Neue + DM Sans + JetBrains Mono
- Zero external UI libraries — 100% custom CSS

## 📁 Project Structure

```
scriptgen-ai/
├── api/
│   └── generate.js        ← server function: validation, prompt, Claude call
├── src/
│   ├── components/
│   │   ├── Header.jsx / Header.css
│   │   ├── ScriptForm.jsx / ScriptForm.css
│   │   └── ScriptOutput.jsx / ScriptOutput.css
│   ├── options.js         ← form choices shared with the server
│   ├── App.jsx / App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Design

Bold editorial aesthetic with:
- **Bebas Neue** display font for headings
- **JetBrains Mono** for labels and metadata  
- **#ff3c00** accent color (orange-red)
- Dark theme with noise texture overlay
- Skeleton loaders while generating

## 📄 License

MIT — free to use and modify.

---

Built by [Gustavo Leimbek](https://github.com/gleimbek) · [Portfolio](https://gleimbek.github.io/portfolio)
