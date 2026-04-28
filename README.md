# Muezza: Grounded Quranic Habits
### [System Architecture v7.0 // Unified 5-Tab Protocol]

<p align="center">
  <img src="public/muezza-og.png" width="600" alt="Muezza System Preview" style="border-radius: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.1);" />
</p>

## Product Philosophy

> *"Spiritual decay is rarely a crisis of faith; it is a crisis of friction. Most spiritual tools exist in isolation from the user's daily operational reality. Muezza serves as the **operational layer** for self-directed spiritual growth, where daily Islamic obligations converge with delightful, gamified motivation to eliminate cognitive debt."*

Muezza is a high-fidelity digital companion designed to transmute abstract spiritual intent into a structured, visible, and rewarding daily loop. Built on the **Human Algorithm** framework, the system utilizes a virtual pet (Muezza) to visualize a user's total spiritual energy across prayer, habits, and Quranic engagement.

---

### I. Unified 5-Tab Architecture (Responsive Pro)
*   **Vitals Hub (Home)**: High-density dashboard combining the mascot, prayers, habits, and contextual **Seasonal Missions** that automatically appear based on Islamic calendar proximity.
*   **The Quran**: Immersive reader enhanced with a Daily Ayah Quest, adaptive Reading Plans, and a Rihla Map for thematic exploration.
*   **Muezza Advisor**: 8 Emotional Archetypes providing scholarly counsel grounded in Quranic Tafsir.
*   **Spiritual Souq**: Bi-modal reward engine for acquiring spiritual equipment and refillable sustenance.
*   **Spiritual Path (Noor)**: Progression tracking with a Bookmark Prompt engine to turn saved ayahs into habits, plus an opt-in Community Reflection system.
*   **Responsive Layout**: Content area transitions seamlessly between a focused mobile bottom-nav and an expansive desktop sidebar.

### II. The Ritual Substrate
*   **Auto-Skip Automation**: Background logic engine that automatically marks rituals as "Missed" 15 minutes before the next prayer window opens.
*   **Rose Visual State**: High-fidelity feedback for missed obligations, maintaining spiritual honesty and accountability.
*   **Geolocation Engine**: High-precision location resolution via browser Geolocation + Reverse Geocoding via Nominatim API for accurate prayer timings.
*   **Advisor Hub**: 8 Emotional Archetypes Providing scholarly counsel (grateful, anxious, tired, searching, impatient, lonely, joyful, confident) grounded in Quranic Tafsir.

### II. Identity & Continuity
*   **OAuth2 PKCE Flow**: Secure, stateless authentication bridging Muezza with the global Quran.com user profile.
*   **Cloud Boundary**: Transactional synchronization of **Bookmarks** and **Noor Streaks**, ensuring spiritual continuity across any device.

### III. The Habit Engine & Contextual Quests
*   **Deep-Linked Foundations**: Quran translation/reading habits are natively injected in onboarding and feature contextual bridges to jump directly to the user's latest synced Ayah.
*   **Hijri-Aware Missions**: Seasonal bundles (Ramadan, Dhul Hijjah, Muharram) automatically surface tasks based on proximity to the Islamic calendar.
*   **Energy Memoization**: A derived reactive state aggregating prayers and habits into a 0–100% daily energy state.
*   **Evolution Logic**: Visual pet evolution computational derived from historical streak length (Kitten: 0–7 days, Adult: 8–30 days, Majestic: 31+ days).

---

## The Spiritual Loop [Operational Model]

Muezza operates on a continuous, self-reinforcing grounding loop:

1.  **Check-in & Compassion**: System initializes state, surfacing contextual prayer timings. If a missed day is detected, the protocol triggers a **Morning Reflection** (compassionate delay); if energy hits 100%, it yields **Muezza's Counsel** (positive reinforcement).
2.  **Convergence**: The user completes obligatory and sunnah tasks, yielding **Dinar** (virtual currency) and filling the global energy gauge.
3.  **Immersion**: Native Quran Reader allows for deep reading, audio streaming, and "Ask Muezza" (Tafsir Insight) interactions seamlessly linked from the Home Tab.
4.  **Preservation**: Bookmarks and Streaks are committed to the Quran Foundation cloud, hardening the user's spiritual profile.
5.  **Delight**: Dinar is liquidated in the **Bifurcated Souq** to acquire permanent *Spiritual Equipment* (turban, sajjadah, glasses) or refillable *Sustenance* (Zamzam, camel milk, Madinah catnip, blessed olives) rooted in Islamic lore.

---

## Operational Protocols

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Runtime**: npm or yarn

### Local Ignition
```bash
# 1. Initialize dependencies
npm install

# 2. Configure environment substrate
# Copy .env.example to .env.local and populate Quran Foundation prelive keys.
# Keep the client secret server-side only as QF_CLIENT_SECRET.

# 3. Boot development server
npm run dev
```

### Verification & Convergence
Before merging any architectural changes, ensure the following convergence checks pass:
- ✅ **Build Integrity**: `npm run build` succeeds without lint or type errors.
- ✅ **OAuth Readiness**: Redirect URIs are dynamically sanitized and match the target domain.
- ✅ **Legal Compliance**: Privacy and Terms pages are reachable at `/privacy` and `/terms`.

---

## Deployment Vector

The system is optimized for **Vercel Edge Runtime**. 
- Serverless functions handle secure `/api/token` and `/api/tafsir` orchestration.
- Deployment is automated via Git-trigger on the `main` branch.
- Production launch instructions live in [`DEPLOYMENT.md`](./DEPLOYMENT.md), including the required Quran Foundation production scopes and Vercel environment variables.

**Live Application:** [muezza-app.vercel.app](https://muezza-app.vercel.app/)

---

> [!TIP]
> **Engineering with Intention.** Built for the Quran Foundation Hackathon (Shawwal 1447).  
> **Credit:** [Fadly Uzzaki](https://fadlyzaki-design.vercel.app/)
