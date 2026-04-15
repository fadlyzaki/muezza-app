# Product Requirements Document (PRD)
# Muezza — Grounded Quranic Habits

> **Product Philosophy:** *"Spiritual habits break down not because people lack faith, but because the daily structure around that faith is disconnected. Muezza is an operational layer for self-directed spiritual growth, where Islamic obligations meet delightful, gamified motivation with as little cognitive friction as possible."*

**Hackathon:** Quran Foundation Hackathon (Ramadan — Shawwal 1447)  
**Platform:** Mobile-First Progressive Web Application  
**Stack:** React 19, Vite 8, Tailwind CSS v4, Lucide Icons  
**Repository:** [github.com/fadlyzaki/muezza-app](https://github.com/fadlyzaki/muezza-app)  
**Last Updated:** April 15, 2026

---

## 1. System Status Overview

| Surface | Status | Notes |
|---|---|---|
| Onboarding Flow | ✅ Shipped | 4-step guided flow with path selection |
| Home Dashboard | ✅ Shipped | Mascot, energy, prayers, habits |
| Quran Reader | ✅ Shipped | Full 114-surah reader with translations |
| Souq (Shop) | ✅ Shipped | 4 items with dynamic SVG equipping |
| Noor Streak Tab | ✅ Shipped | Evolution timeline with cloud sync UI |
| OAuth2 PKCE | ✅ Shipped | Pre-production credentials configured |
| Streaks User API | ✅ Shipped | Cloud-synced via QF `/auth/v1/streaks` |
| Bookmarks User API | ✅ Shipped | Per-verse bookmark toggle in reader |
| Vercel Deployment | ✅ Shipped | Serverless `/api/token` for token exchange |
| Error Boundary | ✅ Shipped | Graceful crash recovery with cat fallback |

---

## 2. Core Mechanics (Implemented)

### 2.1 The Mascot (Muezza)

Muezza is a dynamic SVG cat whose visual state is derived from the user's daily progress.

- **Energy System:** Completing habits and prayers fills a 0–100% energy bar. Each habit contributes its `reward` value. The bar is capped at 100%.
- **Interactivity:** When `energy > 0`, tapping Muezza triggers a petting animation with floating hearts (❤️💖). When `energy === 0`, Muezza sleeps with floating Z's.
- **The Journey (Rihla):** At 100% energy, a "Send on a Journey" button appears. Muezza departs with a loading animation ("Connecting to quran.ai MCP...") and returns with a randomly selected, pre-verified piece of Islamic wisdom (verse + classical tafsir + source attribution).
- **Dynamic Equipment:** Items purchased in the Souq visually appear on the SVG — Kufi hat, glasses, sajjadah rug, or golden lantern.

### 2.2 Virtual Economy

| Mechanic | Implementation |
|---|---|
| **Currency** | Dinar (persisted via `localStorage`) |
| **Prayer Reward** | +10 Dinar per obligatory prayer completed |
| **Habit Reward** | +25 Dinar per Sunnah/custom habit completed |
| **Souq Items** | Crimson Sajjadah (60), Emerald Kufi (100), Scholarly Glasses (150), Golden Fanoos (200) |
| **Equip Logic** | Items are stored in `inventory[]` and rendered conditionally on the CatSVG |

### 2.3 The Noor Streak System

Replaces a generic "fire" streak with a culturally resonant progression of light:

| Stage | Range | Symbol |
|---|---|---|
| The Spark | Day 1–3 | 🔥 A flickering flame |
| The Fanoos | Day 4–10 | 🏮 A glowing lantern |
| The Najm | Day 11–29 | ⭐ A shining star |
| The Badr | Day 30+ | 🌕 The full moon |

When authenticated via OAuth2, the streak is fetched from the Quran Foundation Streaks API. When offline, it falls back to a local counter.

---

## 3. Feature Surfaces (Implemented)

### 3.1 Guided Onboarding (4 Steps)

New users are greeted with a premium dark-emerald onboarding flow before reaching the dashboard:

1. **Welcome** — Bismillah calligraphy, sleeping Muezza, "Assalamu'alaikum" greeting.
2. **Every Deed Counts** — Explanation of the prayer/habit/energy loop with a simulated energy bar.
3. **Choose Your Path** — Three curated journeys:
   - 📖 **Quran Journey:** Read 1 Page · Listen to Surah recitation · Reflect on Ayah meaning
   - 🕌 **Prayer Devotion:** Pray Fajr on time · Make Dhikr after prayer · Pray 2 Rakat Sunnah
   - 🌙 **Noble Character:** Act of kindness · Say Alhamdulillah 10x · Take care of Jasad
4. **Launch** — Confirmation of chosen focus, transition to the main dashboard.

The selected path **replaces the default habit set** entirely, ensuring the dashboard reflects the user's spiritual intention from the first screen.

### 3.2 Home Dashboard

- **Dynamic Greeting:** Adjusts based on local time (Morning/Afternoon/Evening) with the current date.
- **Unified Mascot + Energy Card:** Compact card combining the cat visualization and the energy progress bar.
- **Obligatory Prayers Widget:** Tracks Fajr, Dhuhr, Asr, Maghrib, Isha with icon-mapped buttons. Integrates with the Aladhan API for auto-skip logic (30-minute grace window).
- **Custom Habit Checklist:** Displays the path-selected habits. Users can add custom habits categorized as Ruh (Soul), Aql (Mind), Jasad (Body), or Qalb (Heart).

### 3.3 The Quran Reader

- **Surah Index:** Fetches all 114 chapters from `api.quran.com/api/v4/chapters`.
- **Verse Display:** Uthmani Arabic script (`text_uthmani`) with Saheeh International translation (ID: 20).
- **Pagination:** 20 verses per page with "Load More" and "Read Next Surah" navigation.
- **Ask Muezza (Tafsir):** Per-verse button that triggers a simulated MCP journey returning contextual tafsir.
- **Cloud Bookmarks:** Authenticated users can bookmark any verse. Bookmarks sync to the user's Quran.com profile via the Bookmarks User API.
- **Habit Synergy:** A sticky "Mark Done" banner appears for the daily reading habit while inside the reader.

### 3.4 Souq (Shop)

Four purchasable items that dynamically render on the CatSVG. Items are persisted in `localStorage` and survive sessions.

### 3.5 Noor Tab (Streak & Sync)

- Displays the evolution timeline (Spark → Fanoos → Najm → Badr).
- Shows a "Sync with Quran.com" button for OAuth2 login.
- When authenticated, displays cloud streak data and a logout option.

---

## 4. API & Integration Architecture

### 4.1 Quran Foundation Content API v4 ✅
| Endpoint | Purpose |
|---|---|
| `GET /api/v4/chapters` | Fetch 114 Surah metadata |
| `GET /api/v4/verses/by_chapter/{id}` | Fetch Uthmani text + translations |

### 4.2 Quran Foundation User APIs ✅
| Endpoint | Purpose |
|---|---|
| `GET /auth/v1/streaks` | Read user's cloud streak |
| `GET /auth/v1/bookmarks` | Read user's saved bookmarks |
| `POST /auth/v1/bookmarks` | Save a verse bookmark |

### 4.3 Quran Foundation OAuth2 ✅
| Endpoint | Purpose |
|---|---|
| `GET /oauth2/auth` | Initiate PKCE authorization |
| `POST /oauth2/token` | Exchange code for access token (via serverless `/api/token`) |

### 4.4 Aladhan Prayer Times API ✅
| Endpoint | Purpose |
|---|---|
| `GET /v1/timingsByCity` | Fetch prayer times for auto-skip logic |

### 4.5 Quran MCP (Simulated) ⚠️
The "Ask Muezza" tafsir feature currently uses a **simulated delay + pre-authored content**. It does not call a live MCP endpoint.

---

## 5. Persistence Architecture

| Data | Storage | Cloud Sync |
|---|---|---|
| Prayers state | `localStorage` | ❌ Local only |
| Habits state | `localStorage` | ❌ Local only |
| Dinar balance | `localStorage` | ❌ Local only |
| Inventory (items) | `localStorage` | ❌ Local only |
| Streak count | `localStorage` + API | ✅ When authenticated |
| Bookmarks | In-memory + API | ✅ When authenticated |
| Onboarding flag | `localStorage` | ❌ Local only |
| OAuth tokens | `localStorage` | N/A |

---

## 6. Known Gaps & Missing Features

### 🔴 Critical (Hackathon Eligibility)

| Gap | Impact | Effort |
|---|---|---|
| **Live MCP Integration** | The "Ask Muezza" tafsir is simulated, not calling a real Quran MCP endpoint. Judges may notice the responses are static. | Medium — requires a serverless function to proxy requests to `mcp.quran.ai` |
| **Production OAuth2 Testing** | The app uses pre-production credentials (`prelive-oauth2`). The production endpoint has "NO authentication / user features by default." Need to confirm production credentials work. | Low — swap env vars and test |

### 🟡 Important (Product Quality)

| Gap | Impact | Effort |
|---|---|---|
| **No Geolocation for Prayer Times** | Prayer times are hardcoded to "Padang, Indonesia". Users in other cities get incorrect auto-skip timing. | Low — use `navigator.geolocation` + reverse geocoding |
| **No Day Reset Logic** | Habits and prayers don't auto-reset at midnight. Users must manually trigger the "Journey" completion to reset. | Low — add a date-check effect |
| **No Amiri/Quran Font** | The Arabic text uses the app's default Inter font instead of a proper Quranic typeface (e.g., Amiri Quran). | Low — add Google Font import |
| **Habit Editing/Deletion** | Users can add custom habits but cannot edit or delete them. | Low |
| **No Audio Recitation** | The Quran reader has no audio playback integration. | Medium — QF Audio API available |
| **No Translation Language Toggle** | Only Saheeh International (English) is available. No Indonesian or other language options. | Low — parameterize translation ID |
| **Tafsir Responses Are Identical** | The per-verse "Ask Muezza" generates a templated response with the same structure every time. It doesn't pull real tafsir data. | Medium — use QF Tafsir API |

### 🟢 Nice to Have (Post-Hackathon)

| Gap | Impact | Effort |
|---|---|---|
| **Push Notifications** | Remind users before prayers. PWA notification support. | Medium |
| **Cross-Device Sync** | Replace `localStorage` with a backend (Firebase/Supabase) for habits, dinar, and inventory. | High |
| **Leaderboards** | Social motivation through friend/community streak boards. | High |
| **Voice Recitation** | Record and compare pronunciation using QF Audio APIs. | High |
| **Ramadan Mode** | Special seasonal content, Tarawih tracking, Iftar countdown. | Medium |
| **Widget / Home Screen** | PWA install prompt and home screen widget for quick prayer check-off. | Medium |
| **Cat Evolution** | Muezza visually evolves (kitten → adult → majestic) as the user's lifetime streak grows. | Medium |
| **Offline Mode** | Service worker caching for reading Quran without internet. | Medium |

---

## 7. File Architecture

```
muezza-app/
├── api/
│   └── token.js                  # Vercel serverless: OAuth2 token exchange
├── src/
│   ├── api/
│   │   ├── bookmarks.js          # QF Bookmarks API client
│   │   └── streaks.js            # QF Streaks API client
│   ├── auth/
│   │   ├── AuthContext.jsx       # Global OAuth2 state provider
│   │   ├── Callback.jsx          # PKCE callback handler
│   │   ├── LoginButton.jsx       # Login/logout UI
│   │   └── pkce.js               # Code challenge crypto helpers
│   ├── components/
│   │   ├── CatSVG.jsx            # Reusable mascot component
│   │   └── Onboarding.jsx        # 4-step onboarding flow
│   ├── App.jsx                   # Primary application shell (~1170 lines)
│   ├── index.css                 # Tailwind directives
│   └── main.jsx                  # React entrypoint with route switching
├── public/
│   └── logo.png                  # Premium branded logo
├── index.html                    # SEO-optimized shell
├── vercel.json                   # SPA routing + API rewrites
├── .env.local                    # OAuth2 credentials (git-ignored)
└── package.json                  # React 19 + Vite 8 + Tailwind v4
```

---

## 8. Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `VITE_QURAN_CLIENT_ID` | OAuth2 client identifier | ✅ For auth features |
| `QURAN_CLIENT_SECRET` | OAuth2 client secret (server-side only) | ✅ For auth features |
| `VITE_QURAN_API_BASE` | OAuth2 endpoint base URL | ✅ For auth features |
| `VITE_APP_URL` | Application URL for redirect URI | ✅ For auth features |

---

## 9. Verification & Quality

| Metric | Value |
|---|---|
| ESLint Errors | 0 |
| Production Build Time | ~250ms |
| JS Bundle (gzip) | ~76 KB |
| CSS Bundle (gzip) | ~8.7 KB |
| External Dependencies | 3 (`react`, `react-dom`, `lucide-react`) |

---

## 10. Priority Actions for Hackathon Submission

1. **Swap to production OAuth2 credentials** once confirmed working.
2. **Add geolocation** for prayer times instead of hardcoded city.
3. **Import Amiri Quran font** for authentic Arabic rendering.
4. **Record 2–3 minute demo video** showcasing:
   - Onboarding flow + path selection
   - Prayer tracking + habit completion + energy filling
   - Quran reader + bookmarking a verse
   - OAuth2 login + cloud streak sync
5. **Submit** with GitHub repo link + Vercel deployment URL.

---

**Engineered by:** Fadly Uzzaki  
*Muezza — Grounded Quranic Habits.*
