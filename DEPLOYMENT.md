# Muezza Deployment Guide

This guide outlines how to deploy Muezza to production (e.g., Vercel) and how to toggle between the **Pre-live** and **Production** Quran Foundation environments.

## 1. Production Readiness

Muezza is currently wired for Quran Foundation **prelive** locally and can be switched to **production** by changing environment variables only. Do not ship prelive credentials to production.

Before launch, request/confirm a Quran Foundation production OAuth app with these settings:

- Redirect URI: `https://muezza-app.vercel.app/callback`
- Allowed origin: `https://muezza-app.vercel.app`
- User API scopes approved for production: `user`, `bookmark`, `collection`, `streak`, `activity_day`, `reading_session`, `goal`, `note`, `preference`, `post`
- Optional session scopes, only when Quran Foundation confirms they are enabled for this client: `openid`, `offline_access`
- Production client ID and production client secret

> [!IMPORTANT]
> The production login intentionally avoids `openid` and `offline_access` by default because the current production client rejects `openid`. Existing users should run a fresh login after deployment so the returned OAuth token includes the production-safe User API permissions.

## 2. Environment Variables

Configure the following variables in your deployment platform. In Vercel, add them under **Project Settings → Environment Variables** for the **Production** environment.

### Common Variables
| Variable | Value |
|---|---|
| `VITE_APP_URL` | `https://muezza-app.vercel.app` |
| `VITE_QURAN_CLIENT_ID` | `f5f9b40f-0419-4b3b-be9a-7dd290c643a6` |
| `VITE_QURAN_AUTH_SCOPES` | `user bookmark collection streak activity_day reading_session goal note preference post` |
| `QF_CLIENT_SECRET` | Your Quran Foundation production Client Secret |

> [!IMPORTANT]
> `QF_CLIENT_SECRET` is server-side only. Never create `VITE_QURAN_CLIENT_SECRET`; any `VITE_` variable is bundled into browser code.

### Environment Toggle
Set `VITE_QF_ENV` explicitly:

#### For Pre-live (Testing)
| Variable | Value |
|---|---|
| `VITE_QF_ENV` | `prelive` |

#### For Production (Launch)
| Variable | Value |
|---|---|
| `VITE_QF_ENV` | `production` |

> [!IMPORTANT]
> When switching from `prelive` to `production`, ensure you also update the `VITE_QURAN_CLIENT_ID` and `QF_CLIENT_SECRET` to the production credentials provided by the Quran Foundation Team.

### Optional Host Overrides
Leave these unset unless Quran Foundation provides custom hosts:

| Variable | Production Default |
|---|---|
| `VITE_QURAN_AUTH_BASE` | `https://oauth2.quran.foundation` |
| `VITE_QURAN_USER_API_BASE` | `https://apis.quran.foundation` |

### Optional OIDC / Refresh Tokens
Leave this unset unless Quran Foundation confirms the production OAuth client can request `openid` and `offline_access`. When enabling it, add `openid offline_access` back into `VITE_QURAN_AUTH_SCOPES` too:

| Variable | Value |
|---|---|
| `VITE_QURAN_ENABLE_OIDC` | `true` |

## 3. Whitelisting Redirect URIs

In your Quran Foundation Developer Dashboard, ensure the following Redirect URIs are explicitly whitelisted:

- `http://localhost:5173/callback` (for local development)
- `https://muezza-app.vercel.app/callback` (for production)

## 4. Deployment Steps

1. **Set production variables** in Vercel:
   - `VITE_APP_URL=https://muezza-app.vercel.app`
   - `VITE_QF_ENV=production`
   - `VITE_QURAN_CLIENT_ID=f5f9b40f-0419-4b3b-be9a-7dd290c643a6`
   - `VITE_QURAN_AUTH_SCOPES=user bookmark collection streak activity_day reading_session goal note preference post`
   - `QF_CLIENT_SECRET=<production client secret>`
2. **Remove prelive-only overrides** from the production environment:
   - `VITE_QURAN_API_BASE=https://prelive-oauth2.quran.foundation`
   - `VITE_QURAN_AUTH_BASE=https://prelive-oauth2.quran.foundation`
   - `VITE_QURAN_USER_API_BASE=https://apis-prelive.quran.foundation`
3. **Deploy** from the production branch.
4. **Open a private browser window** and run a fresh login flow. Existing prelive tokens will not work against production.

## 5. Verification

After deployment, verify:

- Login redirects to Quran Foundation production OAuth, not prelive.
- Login URL does not request `openid` or `offline_access` unless `VITE_QURAN_ENABLE_OIDC=true` is intentionally enabled.
- Callback returns to `https://muezza-app.vercel.app/callback`.
- Browser User API requests go to same-origin `/api/qf-user`; the serverless proxy forwards to `https://apis.quran.foundation`, not `https://apis-prelive.quran.foundation`.
- Streak request uses `/auth/v1/streaks?type=QURAN&first=20`.
- Activity-day request uses `/auth/v1/activity-days` with `type=QURAN`.
- Bookmark request uses `/auth/v1/bookmarks?type=ayah&mushafId=4&first=20`.
- Bookmark write uses `/auth/v1/collections/__default__/bookmarks`.
- Noor → Spiritual Archives shows the correct Surah name and Ayah number.
- Noor → Sync Health shows active statuses for Bookmarks, Noor Streaks, Reading Sessions, Goals, Private Notes, Community Posts, and Profile after a fresh login.
- Advanced sync calls for `/reading-sessions`, `/goals`, `/notes`, `/preferences`, `/posts`, and `/users/profile` succeed in production, while still failing gracefully with local fallback if the token is stale or production returns 401/403.
- Browser local storage contains new production tokens after login; clear old local storage if testing after prelive.

## 6. Scope Regression Path

If Quran Foundation temporarily disables an approved scope, keep the app deployed and reduce `VITE_QURAN_AUTH_SCOPES` to the last confirmed working subset. The Noor Sync Health panel and local fallbacks should make the affected surfaces visible without breaking the rest of the app.
