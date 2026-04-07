# V'eventa

Event discovery and management platform with authentication, role-based access, registrations, chat, memories, and analytics.

## What This Project Includes

- React frontend with route-based pages and dashboard flows
- Express + tRPC backend with typed procedures
- MongoDB persistence through Mongoose models
- JWT authentication for login/session continuity
- Deployment-ready setup for static frontend + hosted backend

## Core Features

- User registration and login
- Role support: participant, organizer, admin
- Event listing, filtering, details, create/update/delete
- Event registration and cancellation
- Team/group management for events
- Event chat and memory sharing modules
- Dashboard analytics views

## Tech Stack

- Frontend: React 19, Vite, TanStack Query, tRPC client
- Backend: Node.js, Express, tRPC server, Zod
- Database: MongoDB Atlas + Mongoose
- Auth: JWT (jsonwebtoken)
- Tooling: TypeScript, Vitest, pnpm

## How We Built It

1. Defined domain models (`User`, `Event`, `Registration`, `Memory`, `Chat`, `Group`) in Mongoose.
2. Added typed backend procedures in routers for each module (`auth`, `events`, `registrations`, `memories`, `chats`, `groups`, `analytics`).
3. Added auth middleware (`public`, `protected`, `organizer`, `admin`) to secure sensitive procedures.
4. Connected React pages to tRPC hooks through a centralized context layer.
5. Added deployment-safe environment handling (`dotenv`, configurable API URL, CORS, platform `PORT`).
6. Added CI/deployment docs and build scripts for Vercel/GitHub Pages frontend and hosted backend.

## Local Setup

### Prerequisites

- Node.js 20+
- pnpm via Corepack
- MongoDB Atlas connection string

### 1) Install

```bash
corepack pnpm install
```

### 2) Environment

Create `.env` in project root:

```env
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-strong-secret
NODE_ENV=development
PORT=3000

# Optional for deployed frontend
VITE_API_URL=
CORS_ORIGIN=
VITE_USE_HASH_ROUTER=false
VITE_BASE_PATH=/
```

### 3) Run Development Server

```bash
corepack pnpm dev
```

### 4) Quality Checks

```bash
corepack pnpm run check
corepack pnpm run test
corepack pnpm run build
```

## Project Structure

- `client/`: React frontend
- `server/`: Express/tRPC backend
- `server/models/`: Mongoose schemas
- `server/routers/`: API modules
- `shared/`: shared constants/types
- `dist/`: production build output

## Deployment Overview

- Frontend: Vercel or GitHub Pages (static)
- Backend: Render/Railway/Fly/VM (Node service)
- Full guide: see `DEPLOYMENT.md`

## Documentation Map

- Backend details: `BACKEND_README.md`
- Frontend-to-backend usage: `API_INTEGRATION_GUIDE.md`
- Deployment steps: `DEPLOYMENT.md`
- Development roadmap: `todo.md`
