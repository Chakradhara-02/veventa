# Deployment Guide

This project deploys best as:

- Backend: Render/Railway/Fly/VM (Node web service)
- Frontend: Vercel or GitHub Pages (static site)

## 1) Backend Deployment (Render Recommended)

`render.yaml` is included for blueprint deployment.

### Service Type

- Use **Web Service** (not Postgres, not Static Site).

### Build / Start

- Build Command: `corepack pnpm install && corepack pnpm run build`
- Start Command: `corepack pnpm run start`

### Required Backend Environment Variables

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN` (comma-separated frontend URLs)

Example `CORS_ORIGIN`:

```text
https://your-frontend.vercel.app,https://<username>.github.io
```

### Health Check

After deploy, verify:

```text
https://your-backend-domain/healthz
```

## 2) Frontend Deployment on Vercel

### Settings

- Framework: Vite
- Build Command: `corepack pnpm run build:web`
- Output Directory: `dist/public`

### Frontend Environment Variables

- `VITE_API_URL=https://your-backend-domain`
- `VITE_USE_HASH_ROUTER=false`
- `VITE_BASE_PATH=/`

`vercel.json` is included for SPA route fallback.

## 3) Frontend Deployment on GitHub Pages

Workflow file is included:

- `.github/workflows/deploy-gh-pages.yml`

Before first deploy:

1. Enable GitHub Pages source = GitHub Actions.
2. Add repository secret: `VITE_API_URL`.
3. Push to `main`.

Workflow auto-sets:

- `VITE_USE_HASH_ROUTER=true`
- `VITE_BASE_PATH=/<repo-name>/`

## 4) Final Verification Checklist

1. Backend logs show successful MongoDB connection.
2. Register a user from frontend.
3. Login works and dashboard opens.
4. Event list loads from backend.
5. CORS errors are absent in browser console.

## 5) Security Checklist

1. Do not commit `.env`.
2. Keep secrets only in hosting env settings.
3. Rotate MongoDB password if it was ever exposed.
4. Use a 32-byte+ random `JWT_SECRET`.
