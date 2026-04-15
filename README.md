# Muezza: Grounded Quranic Habits

> **Product Philosophy:** *"Spiritual habits break down not because people lack faith or intention, but because the daily structure around that intention is often disconnected. Muezza is not just another utility or a disconnected Quran app. It is an operational layer for self-directed spiritual growth, where daily Islamic obligations meet delightful, gamified motivation with as little cognitive friction as possible."*

Welcome to the source system of **Muezza**: a digital companion that transforms abstract spiritual goals into a structured, visible, and rewarding daily loop. Built around a Tamagotchi-inspired virtual cat (Muezza), the app dynamically visualizes your spiritual energy through the completion of prayers, habits, and Quranic engagement. 

This repository is built for the **Quran Foundation Hackathon 2026**. It is designed around one core constraint: users should feel a deep, grounding connection to their faith without being overwhelmed by chaotic interfaces.

[![Status](https://img.shields.io/badge/SYSTEM-HACKATHON%20READY-emerald?style=flat-square)](#)
[![Integration](https://img.shields.io/badge/API-QURAN%20FOUNDATION-blue?style=flat-square)](#architectural-topography--core-runtime)
[![Format](https://img.shields.io/badge/DESIGN-PWA%20MOBILE%20FIRST-orange?style=flat-square)](#current-system-boundaries)
[![Stack](https://img.shields.io/badge/STACK-React%20%2B%20Vite%20%2B%20Tailwind%20v4-black?style=flat-square&logo=react)](#architectural-topography--core-runtime)

---

## Architectural Topography & Core Runtime

The current system is built as a state-driven, client-heavy mobile-first web application.

* **The Interface**: **React 19 + Vite + Tailwind CSS v4**  
  A fluid single-page application orchestrating the pet's state, daily checklists, and Quran reading experiences.

* **Authentication & Sync**: **Quran Foundation OAuth2 PKCE**  
  True cloud-sync capabilities utilizing the Quran Foundation's `/oauth2/auth` and serverless `/api/token` exchange to maintain user identity.

* **The Content Engine**: **Quran Foundation Content API v4**  
  Serves pristine Uthmani text (`text_uthmani`) alongside Sahih International translations in a specialized reader view.

* **User Data Layer**: **Quran Foundation User APIs**  
  Direct read/write capabilities for the user's **Bookmarks** and **Streaks**, intercepting local-storage loops with authenticated cloud state.

* **The Deployment Substrate**: **Vercel Edge & Serverless**  
  The repository is optimized for Vercel, integrating frontend SPA routing with Node.js serverless functions for secure token exchange.

---

## The Spiritual Loop

Muezza is designed around one continuous, grounding loop rather than an isolated set of productivity tools:

1. A user checks in and is greeted by Muezza, whose energy state reflects the user's current daily progress.
2. The system surfaces the 5 obligatory prayers (synced to local time zones) and daily Sunnah habits.
3. Every completed action yields **Dinar** (currency) and raises the global energy state.
4. The user seamlessly drops into the deeply integrated Quran reader.
5. In the reader, the user can sync their saved Bookmarks directly to their global Quran.com account.
6. The user completes their actions for the day, advancing their **Noor Streak** (synced via the Quran Foundation Streaks API).
7. Earned Dinar can be spent in the Souq to purchase custom hats and items for Muezza.

This means the product does not merely list habits. It holds the operational shape of the spiritual journey itself.

---

## Sub-Systems & Product Surfaces

### 1. Dynamic Energy Engine (The Pet)
The visual representation of Muezza isn't static. It relies on a derived state (`useMemo`) that aggregates habit and prayer completion into a 0-100% "energy" gauge, smoothly transitioning the pet from asleep (low energy) to awake and joyful.

### 2. Obligatory & Sunnah Checklists
Context-aware checklists that not only track task completion but calculate local prayer times gracefully without overwhelming the primary UI. 

### 3. Native Quran Reader
A clean, focused reading environment fetching chapter metadata and verse-by-verse data (with translations). Built to be infinite-scroll ready and elegantly typeset using the dedicated `Amiri` Quran font.

### 4. Cloud Bookmarking Boundaries
The bookmark system acts as the trusted boundary for writes to the user's main Quran.com profile, ensuring continuity when switching between Muezza and standard Quran platforms.

### 5. Evolution Timeline (Noor Streaks)
Instead of a simple number, streaks are gamified into spiritual stages (Spark → Fanoos → Najm → Badr). The app automatically reads the user's historical streak length from the QF Streaks API.

---

## System Behavior Under Constraint

A resilient system should not collapse the moment an external API or network is constrained. The current runtime is explicitly designed to degrade in layers. It features an aggressive **ErrorBoundary** and **Fallback Storage**:

- If the user is unauthenticated, the entire app functions gracefully utilizing `localStorage`.
- If the Quran Foundation API rate-limits or times out, the app silently falls back to local data.
- State is synchronized resiliently so the user is never blocked from their daily habits due to a network partition.

---

## Repo Topography

```text
.
├── api/
│   └── token.js              # Serverless token exchange for OAuth2
├── src/
│   ├── api/
│   │   ├── bookmarks.js      # QF User API Interceptor
│   │   └── streaks.js        # QF User API Interceptor
│   ├── auth/
│   │   ├── AuthContext.jsx   # Global Identity State
│   │   ├── Callback.jsx      # PKCE Resolution Route
│   │   ├── LoginButton.jsx   # OAuth Dispatcher
│   │   └── pkce.js           # Crypto Hash Generater
│   ├── assets/               # Local media
│   ├── App.jsx               # Primary Routing and UI Shell
│   ├── index.css             # Tailwind Directives
│   └── main.jsx              # React Entrypoint
├── public/                   # Static icons & manifest
├── index.html                # App injection point
├── vercel.json               # Platform routing configuration
└── vite.config.js            # Build orchestration
```

---

## Local Ignition Protocol

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Duplicate the environment variables configuration file.

   ```bash
   cp .env.local.example .env.local
   ```
   *(Create `.env.local` if it doesn't exist)*

3. Add the required values supplied by the Quran Foundation Developer Portal. At minimum:
   - `VITE_QURAN_CLIENT_ID`
   - `QURAN_CLIENT_SECRET`
   - `VITE_QURAN_API_BASE=https://oauth2.quran.foundation`
   - `VITE_APP_URL=http://localhost:5173`

4. Start the local app.

   ```bash
   npm run dev
   ```

The development server runs using Vite, proxying the local API routes if needed, and mapping to `http://localhost:5173`.

---

## Deployment Protocol

The repository is fully primed for **Vercel** serverless deployment. 

1. Connect the repository to Vercel.
2. Vercel automatically detects the Vite framework.
3. Configure the **Environment Variables** in the Vercel Dashboard to match your Production Quran Foundation Application keys.
4. Ensure your **Redirect URI** on the QF portal matches `https://your-vercel-domain.vercel.app/callback`.

The `vercel.json` file in the root directory ensures proper SPA rewrites for the OAuth callback process.

---

## License

This project is open-source and intended for hackathon evaluation and educational purposes. See [LICENSE](LICENSE) for the full text.

---

**Engineered with intention for the Quran Foundation Hackathon**  
*Muezza — Grounded Quranic Habits.*
