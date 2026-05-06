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

Muezza uses Quran Foundation APIs across content, OAuth, and optional user sync. Quran Foundation has approved the full production OAuth surface for the current release, including bookmarks, streaks, reading sessions, goals, notes, preferences, posts, and profile access. The app still keeps local fallbacks so stale tokens or temporary API failures do not interrupt core use.

| Domain | Integrated Endpoints | Implementation Status |
|---|---|---|
| **Content API v4** | `GET /v4/chapters`<br>`GET /v4/verses/by_chapter/{id}` | Fully Integrated |
| **Tafsir API v4** | `GET /v4/tafsirs/{id}/by_ayah/{verse}` | Fully Integrated |
| **Audio CDN** | `https://audio.qurancdn.com/...` | Fully Integrated |
| **User APIs: Production Approved** | `GET /auth/v1/streaks`<br>`POST /auth/v1/activity-days`<br>`GET /auth/v1/bookmarks`<br>`POST /auth/v1/collections/__default__/bookmarks` | Fully Integrated |
| **User APIs: Advanced Sync** | `POST /auth/v1/reading-sessions`<br>`POST /auth/v1/goals`<br>`POST /auth/v1/notes`<br>`GET /auth/v1/preferences`<br>`POST /auth/v1/posts`<br>`GET /auth/v1/users/profile` | Production-enabled with local fallback |
| **Auth / OAuth2** | `GET /oauth2/auth`<br>`POST /oauth2/token` | Fully Integrated (Basic Auth Exchange) |
| **Aladhan API** | `GET /v1/timings` (Prayer times) | Integrated (Requires Geo-permission) |
| **Nominatim API** | `GET /search` (City fallback) | Integrated (Manual location override) |

### 4.1 API Scope Matrix

| Feature | Endpoint / Scope | Code Status | Production OAuth Status | Fallback Behavior | Next Action |
|---|---|---|---|---|---|
| OAuth login | `GET /oauth2/auth`, `POST /oauth2/token` | Implemented | Approved with current client settings | User remains local-first if login fails | Keep redirect URI and origin aligned with production |
| Bookmark sync | `bookmark`, `collection`; `/bookmarks`, `/collections/__default__/bookmarks` | Implemented | Approved | Bookmark UI requires Quran.com sync; existing local app state remains safe | Verify add/list bookmark flow after each production deploy |
| Noor streak sync | `streak`, `activity_day`; `/streaks`, `/activity-days` | Implemented | Approved | Local streak remains source of continuity when sync fails | Continue using QURAN activity days for production |
| Reading session sync | `reading_session`; `/reading-sessions` | Implemented | Approved | Reading plans and mission progress stay in localStorage if sync fails | Verify production token grants scope after fresh login |
| Goal sync | `goal`; `/goals` | Implemented | Approved | Selected plan is stored locally and status shows local save if sync fails | Verify plan selection sync in production |
| Private notes | `note`; `/notes` | Implemented | Approved | Reflection drafts remain local if sync fails | Verify private note save in production |
| Preferences | `preference`; `/preferences` | Implemented | Approved | App ignores missing preferences and keeps defaults | Verify preferences request after fresh login |
| Community posts | `post`; `/posts` | Implemented behind opt-in | Approved | Publish action keeps reflection local if sync fails | Verify opt-in publishing flow |
| User profile | `user` / profile access; `/users/profile` | Implemented as best-effort | Approved | OAuth token fallback labels the user as synced if profile fetch fails | Verify profile display after fresh login |

---

## 5. Value Expansion Roadmap

Muezza's next phase should make the app feel timely, Quran-grounded, and emotionally alive while staying resilient. Advanced Quran Foundation scopes are production-approved, and the app keeps local-first behavior as a reliability layer rather than as a product limitation.

| Opportunity | Concept | Quran Foundation / App Leverage | Priority | Status |
|---|---|---|---|---|
| **Seasonal Bundle Tasks** | Limited-time mission packs for Ramadan, Dhul Hijjah / Hajj / Idh Adha, Muharram, and weekly Jummah. Each bundle converts a sacred season into clear daily tasks, reflections, and rewards. | Habit Engine, prayer flow, Noor Streaks, Souq rewards, Quran reader deep links. | High | ✅ Local-first v1 |
| **Ramadan Companion Mode** | Daily juz/page plan, taraweeh reflection prompt, sadaqah tracker, suhoor/iftar intention nudges, and a Laylatul Qadr quest across the last ten nights. | Verses by juz/page, audio recitation, Tafsir API, streak sync, local habit progress. | High | ✅ Local-first v1 |
| **Dhul Hijjah / Hajj Path** | First 10 days challenge, sacrifice reflection, takbir reminders, Hajj rites learning path, and Idh Adha gratitude tasks. | Quranic theme collections, tafsir grounding, seasonal Souq items, Muezza journey rewards. | High | ✅ Local-first v1 |
| **Muharram / Islamic New Year Reset** | A gentle annual reset for intentions, Hijrah reflection, spiritual goal setting, and a year-long Noor direction. | Quran Reflect-style prompts, user goals/notes APIs where available, onboarding path refresh. | Medium | ✅ Local-first v1 |
| **Weekly Jummah Rhythm** | Friday micro-bundle with Surah Al-Kahf reminder, salawat goal, charity nudge, and a Friday reflection reward. | Quran reader deep link, audio recitation, bookmarks, weekly streak affordances. | Medium | ✅ Local-first v1 |
| **Ayah of the Day Missions** | A daily ayah becomes an actionable mission: read, listen, reflect, save, or connect it to one small act. | Random/ranged verse retrieval, translations, audio, tafsir, bookmarks. | High | ✅ Integrated |
| **Adaptive Quran Plans** | Plans by juz, page, surah, theme, or time budget so users can maintain Quran engagement even on low-energy days. | Content API divisions, verse pagination, audio metadata, reading session APIs where available. | High | ✅ Local-first v1 + approved sync |
| **Bookmark-Driven Habits** | Saved ayahs can suggest gentle habit prompts, reflection cards, or Rihla destinations based on the user's own Quran journey. | Quran Foundation bookmarks, verse metadata, tafsir, local habit creation. | Medium | ✅ Integrated |
| **Audio Recitation Streaks** | Listening quests reward users for completing short recitation sessions, repeating memorization passages, or finishing a surah audio track. | Audio CDN, reciter selection, local progress, Noor Streaks. | Medium | ✅ Local-first v1 |
| **Compassionate Catch-Up Quests** | Missed days unlock restorative tasks instead of punitive streak loss: make up a reflection, read a short passage, or reset with intention. | Current auto-skip ritual logic, habit engine, Muezza counsel, streak fallback. | High | ✅ Integrated |
| **Rihla Map** | Muezza's 100% energy journey becomes a map through Quranic themes such as sabr, shukr, tawbah, rizq, mercy, and courage. | Tafsir API, thematic verse ranges, mascot progression, Souq collectibles. | Medium | ✅ Local-first v1 |
| **Private Community Challenges** | Optional global or friend-level challenges show aggregate participation without exposing private worship logs. | Quran Foundation profile linkage, anonymous counters, local-first privacy posture. | Low | ✅ Opt-in Reflection v1 |

### 5.1 Improvement Options

**Production Readiness**
- Scope-gated UI states now show active, stale, or local-first status based on the granted token scopes.
- Refresh tokens are kept in server-managed `HttpOnly` cookies instead of browser localStorage.
- Noor now includes a compact sync health panel for bookmarks, streaks, reading sessions, notes, goals, posts, and profile.
- Add a production OAuth smoke checklist covering redirect URI, accepted scopes, callback, bookmark write, and activity-day write.

**Quran Engagement**
- Add smarter reading plans by time budget, juz, page, surah, theme, and recovery mode.
- Add memorization mode with repeat audio, verse hiding, self-check, and short review streaks.
- Expose reciter choice and translation/resource settings once the current English-only reader is stable.
- Turn bookmarked ayahs into suggested actions, duas, reflection prompts, or tiny habit templates.

**Retention**
- Add seasonal badges and Souq unlocks that are earned through Ramadan, Dhul Hijjah, Muharram, and Jummah tasks.
- Expand compassionate recovery flows so missed days create restorative quests instead of only streak pressure.
- Add lightweight reminders for prayer windows, reading plan progress, Jummah, and seasonal missions.
- Add weekly recap cards that celebrate completed acts without exposing private worship details.

**Community And Privacy**
- Keep community features opt-in, publish-only, and separate from private prayer/habit logs.
- Add anonymous aggregate challenges before friend-level or public identity features.
- Add privacy controls for reflection posts, Quran Reflect sharing, profile display, and delete/export flows.
- Use verified profile identity for community features while keeping prayer and habit data private.

**Data Resilience**
- Add local export/import for habits, prayer state, inventory, reflections, and mission progress.
- Add an offline sync queue for reading sessions, notes, goals, and posts so temporary API failures do not lose intent.
- Add conflict states that explain when local progress differs from Quran Foundation cloud state.
- Add graceful 401/403 handling that disables only the affected advanced sync feature, not the full app.

### 5.2 Differentiation Opportunities

- **Season-aware spirituality:** Muezza can feel different during Ramadan, Dhul Hijjah, Muharram, and Jummah without asking the user to build plans from scratch.
- **Quran as the task engine:** Instead of treating Quran content as a separate reader tab, ayahs, tafsir, audio, bookmarks, and reading progress can generate meaningful daily actions.
- **Playful but grounded retention:** Seasonal Muezza outfits, badges, Souq items, surprise micro-rewards, and Rihla destinations make consistency delightful while keeping the product anchored in Islamic values.
- **Compassion over guilt:** Catch-up quests and gentle reset flows preserve momentum for real humans with imperfect weeks.
- **Privacy-preserving community:** Social motivation should remain optional and aggregate-first, maintaining Muezza's local-first handling of personal worship data.

### 5.3 Approved Production Scopes

Quran Foundation has approved the expanded OAuth2 scopes needed to make the newest 5-Tab implementation cloud-native in production:
- **Reading Sessions (`reading_session`)**: Sync Quran Reading Plans, Daily Ayah reads, Rihla completions, and seasonal mission reading activity across devices.
- **Goals (`goal`)**: Sync selected reading plans and seasonal Quran goals instead of keeping them only in localStorage.
- **Notes (`note`)**: Sync private reflection notes from Community Reflection, Rihla Map, and seasonal prompts.
- **Preferences (`preference`)**: Persist user reader and mission preferences across devices.
- **Community Posts (`post`)**: Publish opt-in reflections only when the user explicitly chooses to share.
- **Extended User Profile (`user`, plus `openid`/`offline_access`)**: Support safer identity, longer sessions, and privacy-preserving community features.
- **Seasonal Streak Hooks**: Extend current `streak` and `activity_day` usage so Ramadan, Dhul Hijjah, Jummah, and recovery quests can map to dedicated backend streak categories when available.

---

**Engineered by:** Fadly Uzzaki  
*Muezza — Grounded Quranic Habits.*
