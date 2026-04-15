# Product Requirements Document (PRD)
# Muezza — Grounded Quranic Habits

> **Product Philosophy:** *"Spiritual habits break down not because people lack faith, but because the daily structure around that faith is disconnected. Muezza is an operational layer for self-directed spiritual growth, where Islamic obligations meet delightful, gamified motivation with as little cognitive friction as possible."*

**Hackathon:** Quran Foundation Hackathon (Ramadan — Shawwal 1447)  
**Platform:** Responsive Multi-Surface PWA (Desktop Dashboard + Mobile App)  
**Stack:** React 19, Vite 8, Tailwind CSS v4, Lucide Icons  
**Repository:** [github.com/fadlyzaki/muezza-app](https://github.com/fadlyzaki/muezza-app)  
**Live Application:** [muezza-app.vercel.app](https://muezza-app.vercel.app/)  
**System Version:** v1.6.0  
**Last Updated:** April 2026

---

## 1. Executive Summary

Muezza is a mobile-first web app designed to bridge the gap between abstract spiritual intent and daily execution. Through a gamified loop utilizing a virtual pet (Muezza), users manage obligatory prayers, complete customizable sunnah habits, read and listen to the Quran, and interact with classical Tafsir. The product heavily leverages the **Quran Foundation v4 API Ecosystem**, serving as a prime example of an integrated, highly polished consumer interface built on top of QF's infrastructure.

## 2. System Status Overview

| Surface / Feature | Status | Notes |
|---|---|---|
| **Onboarding Flow** | ✅ Shipped | 4-step guided flow with dynamic habit path selection |
| **Ritual Engine**    | ✅ Shipped | **Auto-Skip Automation**: Rituals mark as missed 15m before next prayer. |
| **Responsive UI**    | ✅ Shipped | **Responsive Pro**: Sidebar Dashboard for Desktop, Bottom Nav for Mobile. |
| **Advisor Hub**      | ✅ Shipped | **8 Emotional Archetypes**: Expanded scholarly counsel with Session Analytics. |
| **Souq (Shop)**      | ✅ Shipped | **Sustenance Added**: Ajwa Dates, Zamzam, Honey, Milk. |
| **Habit Engine**     | ✅ Shipped | **Stable Lifecycle**: Full Add/Edit/Delete habit management. |
| **Location Engine**  | ✅ Shipped | **Precise Resolution**: Manual search + Geolocation reverse geocoding. |

---

## 3. Core Mechanics

### 3.1 The Mascot (Muezza)
Muezza is a reactive SVG cat whose visual state is computationally derived from the user's daily progress.
- **Energy System:** Completing habits and prayers fills a 0–100% daily energy bar.
- **Interactivity:** Tapping Muezza triggers petting animations; sleeps when idle (0% energy).
- **The Journey (Rihla):** At 100% energy, users can "Send on a Journey" to retrieve grounded reflections.
- **Dynamic Equipment:** Items purchased in the Souq (hats, glasses, rugs) are overlaid on the vector graphics.

### 3.2 Virtual Economy
- **Currency:** Dinar (D)
- **Earn Rate:** +10 Dinar per Obligatory Prayer | +25 Dinar per Sunnah/Custom Habit
- **Drain Rate:** N/A (Positive reinforcement only)

### 3.3 The Noor Streak System
Replaces generic generic streaks with a resonant progression of light:
- **The Spark (🔥):** Day 1–3
- **The Fanoos (🏮):** Day 4–10
- **The Najm (⭐):** Day 11–29
- **The Badr (🌕):** Day 30+
_Streaks are synced via the QF Streaks API. Offline fallback ensures reliability._

---

## 4. API Integration Architecture

Muezza extensively utilizes the Quran Foundation capabilities:

| Domain | Integrated Endpoints | Implementation Status |
|---|---|---|
| **Content API v4** | `GET /v4/chapters`<br>`GET /v4/verses/by_chapter/{id}` | Fully Integrated |
| **Tafsir API v4** | `GET /v4/tafsirs/{id}/by_ayah/{verse}` | Fully Integrated |
| **Audio CDN** | `https://audio.qurancdn.com/...` | Fully Integrated |
| **User APIs** | `GET /auth/v1/streaks`<br>`POST /auth/v1/bookmarks` | Fully Integrated |
| **Auth / OAuth2** | `GET /oauth2/auth`<br>`POST /oauth2/token` | Fully Integrated (Basic Auth Exchange) |
| **Aladhan API** | `GET /v1/timings` (Prayer times) | Integrated (Requires Geo-permission) |
| **Nominatim API** | `GET /search` (City fallback) | Integrated (Manual location override) |

---

## 5. Known Gaps & Future Roadmap

| **Technical Polish** | Zero-downtime loaders (Skeletons) and absolute OG paths. | High | ✅ Integrated |

---

**Engineered by:** Fadly Uzzaki  
*Muezza — Grounded Quranic Habits.*
