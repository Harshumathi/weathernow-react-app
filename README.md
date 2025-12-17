# 🌤️ Weather Now (React)

[Live Demo →](https://instantweathercondition.netlify.app)

<p align="center">
  <a href="https://dlnswc-3000.csb.app/" target="_blank" rel="noreferrer">
    <img src="website-screenshot.png" alt="Weather Now — Live site screenshot" width="900"/>
  </a>
</p>

A clean, responsive weather app built with **React** that lets users:
- 🔎 Search weather by **city name**, or
- 📍 Use **current location** via the browser's Geolocation API

The app fetches data from **Open‑Meteo** (forecast + current weather), with optional reverse‑geocoding via **BigDataCloud** for location names. It includes graceful **loading/empty/error states**, a friendly **welcome screen**, and dynamic background imagery that changes with weather conditions.

---

## ✨ Features
- **City search** (Open‑Meteo Geocoding) — type a city to see current weather
- **Use My Location** — one tap to get weather at your current coordinates
- **Current conditions**: temperature (°C), wind speed, and a simple emoji condition
- **Dynamic background** — background images adapt to the weather code (sunny, cloudy, rain, etc.)
- **Robust UX** — error messages for network issues, empty results, geolocation permission denied
- **No API keys required** — all public endpoints

---

## 🧰 Tech Stack
- **React** (SPA)
- **CSS** (no Tailwind dependency, production‑safe)
- **APIs**:
  - Open‑Meteo **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search?name={q}&count=1`
  - Open‑Meteo **Forecast**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`
  - BigDataCloud **Reverse Geocoding** (for “Use My Location” naming): `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en`
- **CORS fallback** (when hosting blocks cross‑origin requests):
  - `https://corsproxy.io/?{URL}`
  - `https://api.allorigins.win/raw?url={encodedURL}`

> ⚠️ Note: Proxies are used **only when needed**. Direct API calls are attempted first.

---

## 🚀 Quick Start

### 1) Prerequisites
- **Node.js** 18+ and **npm** (or **pnpm/yarn**)

### 2) Install dependencies
```bash
npm install
```

### 3) Run locally (dev server)
```bash
npm start
```
- Opens at `http://localhost:3000` (Create React App default) or your bundler's default port.

### 4) Build for production
```bash
npm run build
```
- Outputs a minified build to `build/` (for CRA) or `dist/` for other bundlers.

---

## 📦 Project Structure (key files)
```
src/
  App.js          # Main UI & logic
  App.css         # Component styles (no Tailwind required)
  index.js        # App bootstrap (ReactDOM render)
  index.css       # Global resets / fonts
  App.test.js     # (Optional) example test
public/
  favicon.ico
  index.html
```

If you previously used Tailwind, this version removes that dependency to ensure the UI renders correctly on all hosts without extra build steps.

---

## 🔗 APIs & Data Flow

### A) City Search → Weather
1. **Geocoding**: look up `{city}` to get `{latitude, longitude}`  
   `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1`
2. **Forecast**: fetch current weather for `{lat, lon}`  
   `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`

### B) Use My Location
1. Browser `navigator.geolocation.getCurrentPosition()` → `{lat, lon}`
2. (Optional) Reverse geocode name:  
   `https://api.bigdatacloud.net/data/reverse-geocode-client?...`
3. Call **Open‑Meteo** forecast with `{lat, lon}`

### C) CORS Strategy
- Try **direct** API call.
- If blocked, retry with **`corsproxy.io`**, then **`allorigins`** as a fallback.

---

## 🖼️ UI/UX Notes
- **Welcome hero** with friendly text and soft blur over a background image.
- **Primary actions** front and center: “Search” + “Use My Location”.
- **Dynamic backgrounds** map Open‑Meteo `weathercode` to a corresponding image.
- **Clear errors** for: empty input, city not found, network failure, denied geolocation.
- **Accessible**: readable contrast, large touch targets, semantic HTML.

---

## 🧪 Testing
Basic test setup (Jest + React Testing Library) can be expanded:
```bash
npm test
```
Examples you can add:
- renders welcome screen
- handles empty city submit -> shows error
- mocks geocoding response -> renders weather card
- geolocation permissions denied -> shows error

---

## ☁️ Deployment

### ✅ CodeSandbox (instant)
- Open **CodeSandbox** → *Import from GitHub* (or *Create Sandbox → Static*).
- If importing from your repo, CodeSandbox auto‑detects the CRA setup and runs `npm start`.
- If using a single‑file export, create a *Static* sandbox and drop your files in.  
- Share the **sandbox URL** as your live demo:  
  **https://dlnswc-3000.csb.app/**

### Vercel (recommended)
1. Import the repo in **Vercel**.
2. Framework preset: **Create React App** (or auto-detected).
3. Build Command: `npm run build`  
   Output directory: `build`
4. Deploy → share the live URL.

### Netlify
- New site from Git → select repo
- Build: `npm run build`  
  Publish directory: `build`

### GitHub Pages (CRA)
```bash
npm install gh-pages --save-dev
# add to package.json:
# "homepage": "https://<user>.github.io/<repo>",
# "scripts": { "predeploy":"npm run build", "deploy":"gh-pages -d build" }
npm run deploy
```

> After deploying, test **Search** and **Use My Location**. If a host blocks cross‑origin requests, the app automatically tries CORS proxies.

---

## 🔮 Roadmap Ideas
- °C / °F toggle
- Weather icon set & descriptive text based on `weathercode`
- Hourly/weekly charts (temperature, precipitation)
- Saved favorites (localStorage)
- Offline caching via Service Worker

---

## 🛡️ License
MIT — feel free to use, modify, and share.

---

## 🙏 Acknowledgements
- Weather data: **Open‑Meteo** (https://open-meteo.com/)
- Reverse Geocoding: **BigDataCloud**
- Background images: Unsplash photographers (attribution within code comments)
