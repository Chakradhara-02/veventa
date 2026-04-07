# V'eventa Frontend

Frontend application built with React + Vite.

## Frontend Scope

- Public pages: home, events, event detail
- Auth pages: login and register
- User pages: memories, chat
- Dashboard pages: overview, my events, create event, participants, analytics

## Key Frontend Modules

- Routing: `react-router-dom`
- Data fetching: `@tanstack/react-query`
- API client: `@trpc/client`, `@trpc/react-query`
- App-level state/actions: `src/context/AppContext.jsx`
- Theme system: `src/context/ThemeContext.jsx`

## Environment Variables

Frontend can run in two API modes:

```env
# same host mode (backend and frontend served together)
VITE_API_URL=

# external backend mode (static frontend host)
# VITE_API_URL=https://your-backend-domain

VITE_USE_HASH_ROUTER=false
VITE_BASE_PATH=/
```

## Commands

From project root:

```bash
corepack pnpm dev
corepack pnpm run build:web
```

## Auth Behavior

1. On login/register, backend returns JWT.
2. Frontend stores token in `localStorage` as `authToken`.
3. Token is attached to tRPC requests in `Authorization` header.
4. `auth.me` query hydrates current user on refresh.

## UI Notes

- Main global styles are in `src/index.css`.
- Reusable visual components are in `src/components`.
- Page-level behavior and route UI are in `src/pages`.
