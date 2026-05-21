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

This app calls the Anthropic Claude API. You need a proxy or backend to keep your key secure.

For local development, create a `.env` file:

```bash
VITE_ANTHROPIC_API_KEY=your_key_here
```

> ⚠️ **Never commit your API key to GitHub.** Add `.env` to `.gitignore`.

Then update `src/App.jsx` to use:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
}
```

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`

## 📦 Build & Deploy

```bash
npm run build
```

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://gleimbek.github.io/scriptgen-ai",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion** for animations
- **Claude claude-sonnet-4-20250514** API (Anthropic)
- **Google Fonts** — Bebas Neue + DM Sans + JetBrains Mono
- Zero external UI libraries — 100% custom CSS

## 📁 Project Structure

```
scriptgen-ai/
├── src/
│   ├── components/
│   │   ├── Header.jsx / Header.css
│   │   ├── ScriptForm.jsx / ScriptForm.css
│   │   └── ScriptOutput.jsx / ScriptOutput.css
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
