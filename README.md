# Snaplink — URL Shortener with Analytics Dashboard

A production-grade URL shortener inspired by Bitly, built to demonstrate a complete SaaS workflow with fast redirects, analytics, auth, abuse prevention, and modern React UI.

**🔗 Live Demo:** [snaplink-pink.vercel.app](https://snaplink-pink.vercel.app/)
**⚙️ Live API:** [peaceful-luck-production-9c6d.up.railway.app](https://peaceful-luck-production-9c6d.up.railway.app/)

> Note: the backend runs on Railway's free tier and may take a few seconds to respond on the first request after inactivity.

## Why this project stands out

This application is designed to be interview-ready by combining:

- Real product UX with link creation, dashboards, per-link analytics, and QR generation
- Fast server-side redirects using Redis cache
- Background analytics ingestion with BullMQ and Redis queues
- Secure authentication using JWT and Google OAuth login
- Rate limiting and abuse protection for anonymous and authenticated users
- A modern React/Vite frontend with charts and dashboard flows

## Core Features

- Shorten URLs using random 6-character `nanoid` slugs
- Optional custom slugs and link expiration dates
- Fast redirect performance with Redis lookup cache
- Authenticated user sessions with JWT token issuance
- Google Sign-In integration with automatic account creation
- Automatic onboarding of Google users on first login
- Persistent analytics with click tracking by device, browser, country, referrer, and IP
- Background click ingestion via BullMQ worker to keep redirects fast
- Dashboard listing with copy, open, delete, and QR code actions
- Per-link analytics: click timeline, country breakdown, device mix, and referrer insights
- Rate limits for anonymous users and authenticated users
- Anonymous link ownership using local `x-owner-key` tracking

## Latest additions

- `Continue with Google` login button in the React auth page
- Backend `/api/auth/google` endpoint for Google ID token verification
- Automatic user creation when a Google account logs in for the first time
- JWT-based session handling returned after social login
- Deployed to production: frontend on Vercel, backend + worker on Railway

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Queue + cache: Redis, BullMQ
- Auth: JWT, bcrypt, Google OAuth
- Frontend: React, Vite, React Router, Recharts, qrcode.react
- Utilities: validator, geoip-lite, express-rate-limit
- Infrastructure: MongoDB Atlas, Upstash Redis, Railway, Vercel

## Architecture highlights

- `Redis` is used to speed up redirect lookups and reduce MongoDB read pressure
- `BullMQ` moves click analytics writes out of the request path, enabling fast redirects
- `MongoDB` stores link and click audit data while `Link.totalClicks` is denormalized for dashboard performance
- `Google OAuth` is implemented via client-side token exchange and secure backend verification
- `JWT` authorizes protected API routes and keeps session logic simple

## Project structure

```text
server/
  src/
    lib/redis.js
    lib/queue.js
    middleware/auth.js
    middleware/rateLimit.js
    models/Click.js
    models/Link.js
    models/User.js
    routes/auth.js
    routes/analytics.js
    routes/shorten.js
    workers/clickTracker.js
    index.js
client/
  src/
    components/
      Charts/
        ClickLineChart.jsx
        CountryBarChart.jsx
        DevicePieChart.jsx
      LinkCard.jsx
    lib/api.js
    pages/
      Auth.jsx
      Analytics.jsx
      Dashboard.jsx
      Home.jsx
    App.jsx
    main.jsx
    styles.css
```

## Setup

1. Copy environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

2. Install dependencies:

```bash
cd server && npm install
cd ..\client && npm install
```

3. Configure local env values:

- `server/.env`
  - `PORT`
  - `CLIENT_URL`
  - `PUBLIC_BASE_URL`
  - `MONGODB_URI`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`
- `client/.env`
  - `VITE_API_URL`
  - `VITE_GOOGLE_CLIENT_ID`

4. Run the services:

```bash
# In server folder
npm run dev

# In another terminal, run the worker
npm run worker

# In client folder
npm run dev
```

## Running locally

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`

## API endpoints

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
GET /api/auth/me
POST /api/shorten
GET /:slug
GET /api/shorten/links
DELETE /api/shorten/links/:slug
GET /api/analytics/:slug?range=7d
```

## Future scaling ideas

- Add a CDN or edge layer for ultra-fast redirect delivery
- Move analytics storage to a time-series database for large-scale reporting
- Add multi-tenant support and role-based access controls
- Add replay tooling for failed analytics jobs
- Introduce IP hashing and GDPR-safe analytics storage

