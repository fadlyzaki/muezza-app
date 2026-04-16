# Muezza Deployment Guide

This guide outlines how to deploy Muezza to production (e.g., Vercel) and how to toggle between the **Pre-live** and **Production** Quran Foundation environments.

## 1. Environment Variables

Configure the following variables in your deployment platform (Vercel, Netlify, etc.).

### Common Variables
| Variable | Value |
|---|---|
| `VITE_APP_URL` | `https://your-production-domain.com` |
| `VITE_QURAN_CLIENT_ID` | Your Quran Foundation Client ID |
| `QF_CLIENT_SECRET` | Your Quran Foundation Client Secret |

### Environment Toggle
To switch between environments, set the `VITE_QF_ENV` variable:

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

## 2. Whitelisting Redirect URIs

In your Quran Foundation Developer Dashboard, ensure the following Redirect URIs are explicitly whitelisted:

- `http://localhost:5173/callback` (for local development)
- `https://your-production-domain.com/callback` (for production)

## 3. Deployment Steps

1. **Push to GitHub**: Commit your changes and push them to your repository.
2. **Connect to Vercel**: Import your project into Vercel.
3. **Set Variables**: Add the variables listed above in the "Environment Variables" section of the Vercel project settings.
4. **Deploy**: Trigger a new deployment.

## 4. Verification

After deployment, visit `https://your-production-domain.com/callback` (or simply log in). If the authentication flow completes and you can see your bookmarks/streaks, the integration is successful.
