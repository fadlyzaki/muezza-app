# Product Requirements Document (PRD)
# Muezza — Grounded Quranic Habits

> **Product Philosophy:** *"Spiritual habits break down not because people lack faith, but because the daily structure around that faith is disconnected. Muezza is an operational layer for self-directed spiritual growth, where Islamic obligations meet delightful, gamified motivation with as little cognitive friction as possible."*

**Hackathon:** Quran Foundation Hackathon (Ramadan — Shawwal 1447)  
**Platform:** Responsive Multi-Surface PWA (Desktop Dashboard + Mobile App)  
**Stack:** React 19, Vite 8, Tailwind CSS v4, Lucide Icons  
**Repository:** [github.com/fadlyzaki/muezza-app](https://github.com/fadlyzaki/muezza-app)  
**Live Application:** [muezza-app.vercel.app](https://muezza-app.vercel.app/)  
**System Version:** v1.7.0  
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
| **Souq (Shop)**      | ✅ Shipped | **Refillable Sustenance**: Zamzam, Camel Milk, Madinah Catnip, Blessed Olives. |
| **Habit Engine**     | ✅ Shipped | **Stable Lifecycle**: Full Add/Edit/Delete habit management. |
| **Location Engine**  | ✅ Shipped | **Precise Resolution**: Manual search + Geolocation reverse geocoding. |
| **Unified 5-Tabs**   | ✅ Shipped | **Seamless Architecture**: Missions merged into Home, Quran, and Noor tabs. |
| **Contextual Quests**| ✅ Shipped | **Hijri-Aware Visibility**: Seasonal bundles only surface based on Islamic calendar proximity. |

---

## 3. Core Mechanics

### 3.1 The Mascot (Muezza)
Muezza is a reactive SVG cat whose visual state is computationally derived from the user's daily progress.
- **Energy System:** Completing habits and prayers fills a 0–100% daily energy bar.
- **Interactivity:** Tapping Muezza triggers petting animations; sleeps when idle (0% energy).
- **Growth Stages:** Kitten (0-7 days), Adult (8-30 days), Majestic (31+ days) based on Noor Streaks.
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

## 5. Value Expansion Roadmap

Muezza's next phase should make the app feel timely, Quran-grounded, and emotionally alive: not only a daily tracker, but a companion that changes with the Islamic calendar, the user's Quran journey, and moments of renewed intention.

| Opportunity | Concept | Quran Foundation / App Leverage | Priority | Status |
|---|---|---|---|---|
| **Seasonal Bundle Tasks** | Limited-time mission packs for Ramadan, Dhul Hijjah / Hajj / Idh Adha, Muharram, and weekly Jummah. Each bundle converts a sacred season into clear daily tasks, reflections, and rewards. | Habit Engine, prayer flow, Noor Streaks, Souq rewards, Quran reader deep links. | High | ✅ Local-first v1 |
| **Ramadan Companion Mode** | Daily juz/page plan, taraweeh reflection prompt, sadaqah tracker, suhoor/iftar intention nudges, and a Laylatul Qadr quest across the last ten nights. | Verses by juz/page, audio recitation, Tafsir API, streak sync, local habit progress. | High | ✅ Local-first v1 |
| **Dhul Hijjah / Hajj Path** | First 10 days challenge, sacrifice reflection, takbir reminders, Hajj rites learning path, and Idh Adha gratitude tasks. | Quranic theme collections, tafsir grounding, seasonal Souq items, Muezza journey rewards. | High | ✅ Local-first v1 |
| **Muharram / Islamic New Year Reset** | A gentle annual reset for intentions, Hijrah reflection, spiritual goal setting, and a year-long Noor direction. | Quran Reflect-style prompts, user goals/notes APIs where available, onboarding path refresh. | Medium | ✅ Local-first v1 |
| **Weekly Jummah Rhythm** | Friday micro-bundle with Surah Al-Kahf reminder, salawat goal, charity nudge, and a Friday reflection reward. | Quran reader deep link, audio recitation, bookmarks, weekly streak affordances. | Medium | ✅ Local-first v1 |
| **Ayah of the Day Missions** | A daily ayah becomes an actionable mission: read, listen, reflect, save, or connect it to one small act. | Random/ranged verse retrieval, translations, audio, tafsir, bookmarks. | High | ✅ Integrated |
| **Adaptive Quran Plans** | Plans by juz, page, surah, theme, or time budget so users can maintain Quran engagement even on low-energy days. | Content API divisions, verse pagination, audio metadata, reading session APIs where available. | High | ✅ Local-first v1 + Sync |
| **Bookmark-Driven Habits** | Saved ayahs can suggest gentle habit prompts, reflection cards, or Rihla destinations based on the user's own Quran journey. | Quran Foundation bookmarks, verse metadata, tafsir, local habit creation. | Medium | ✅ Integrated |
| **Audio Recitation Streaks** | Listening quests reward users for completing short recitation sessions, repeating memorization passages, or finishing a surah audio track. | Audio CDN, reciter selection, local progress, Noor Streaks. | Medium | ✅ Local-first v1 |
| **Compassionate Catch-Up Quests** | Missed days unlock restorative tasks instead of punitive streak loss: make up a reflection, read a short passage, or reset with intention. | Current auto-skip ritual logic, habit engine, Muezza counsel, streak fallback. | High | ✅ Integrated |
| **Rihla Map** | Muezza's 100% energy journey becomes a map through Quranic themes such as sabr, shukr, tawbah, rizq, mercy, and courage. | Tafsir API, thematic verse ranges, mascot progression, Souq collectibles. | Medium | ✅ Local-first v1 |
| **Private Community Challenges** | Optional global or friend-level challenges show aggregate participation without exposing private worship logs. | Quran Foundation profile linkage, anonymous counters, local-first privacy posture. | Low | ✅ Opt-in Reflection v1 |

### 5.1 Differentiation Opportunities

- **Season-aware spirituality:** Muezza can feel different during Ramadan, Dhul Hijjah, Muharram, and Jummah without asking the user to build plans from scratch.
- **Quran as the task engine:** Instead of treating Quran content as a separate reader tab, ayahs, tafsir, audio, bookmarks, and reading progress can generate meaningful daily actions.
- **Playful but grounded retention:** Seasonal Muezza outfits, badges, Souq items, surprise micro-rewards, and Rihla destinations make consistency delightful while keeping the product anchored in Islamic values.
- **Compassion over guilt:** Catch-up quests and gentle reset flows preserve momentum for real humans with imperfect weeks.
- **Privacy-preserving community:** Social motivation should remain optional and aggregate-first, maintaining Muezza's local-first handling of personal worship data.

### 5.2 API Scope Expansion Requests

To make the newest 5-Tab implementation run smoothly and fully cloud-native, Muezza seeks expanded OAuth2 scopes from the Quran Foundation:
- **Reading Sessions API (`read:sessions`, `write:sessions`)**: To sync the newly integrated **Quran Reading Plans** (Juz/Surah tracking) across substrates.
- **Goals & Notes APIs (`read:notes`, `write:notes`)**: To seamlessly sync user entries from the **Community Reflection** and **Rihla Map** text areas.
- **Extended User Profile (`read:profile`)**: To better support the community opt-in features without compromising privacy, allowing aggregate challenges based on verified user IDs.
- **Streaks Expansion**: While we currently use the standard streaks, advanced hooks to tie specific Seasonal Missions (e.g., Ramadan 30-day bundle) directly to the QF streaks backend would enhance cross-platform gamification.

---

**Engineered by:** Fadly Uzzaki  
*Muezza — Grounded Quranic Habits.*
