# URL Shortener with Analytics Dashboard

A production-grade URL shortener inspired by bit.ly, built to show the system design tradeoffs behind fast redirects, abuse prevention, and analytics pipelines.

## The Problem

Every redirect can become a database query. At scale, millions of redirects per day turn that simple lookup into a performance bottleneck. This project explores how caching, async processing, and rate limiting solve that while keeping the product experience polished.

## Features

- Create short links with 6-character nanoid slugs
- Optional custom slugs
- Link expiry dates
- Redis-backed redirect cache with a 24 hour TTL
- BullMQ click tracking so redirects do not wait on analytics writes
- MongoDB click analytics with country, city, device, browser, referrer, and IP
- Rate limiting: 10 creates/hour per anonymous IP and 100 creates/hour per authenticated user
- Dashboard for all links with click counts, QR codes, copy, open, and delete actions
- Per-link analytics charts for clicks over time, top countries, device mix, and referrers
- JWT authentication endpoints

## Architecture Decisions

**Why Redis for caching?** MongoDB queries usually take milliseconds; Redis lookups are typically sub-millisecond. For a URL shortener, redirect speed is the product. With Redis, active links avoid repeated database reads.

**Why BullMQ for click tracking?** Click tracking is not required to complete a redirect. Pushing click events to a queue lets the API redirect immediately while a worker writes analytics in the background.

**Why nanoid over sequential IDs?** Sequential IDs are predictable, which makes it easy to enumerate private or obscure links. Nanoid produces random, non-sequential slugs.

**Why denormalize `totalClicks` onto `Link`?** Counting click documents on every dashboard load is slow as data grows. Incrementing `totalClicks` in the worker keeps dashboard reads O(1).

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Cache and queue: Redis, BullMQ
- Auth and abuse prevention: JWT, bcrypt, express-rate-limit, Redis store
- Frontend: React, Vite, React Router, Recharts, qrcode.react

## Project Structure

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
    components/Charts/
    components/LinkCard.jsx
    lib/api.js
    pages/Home.jsx
    pages/Dashboard.jsx
    pages/Analytics.jsx
    App.jsx
```

## Run Locally

Start MongoDB and Redis locally, then create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
npm install
npm run install:all
```

Run the API, worker, and frontend:

```bash
npm run dev
npm run start:worker
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## API Overview

```http
POST /api/shorten
GET /:slug
GET /api/shorten/links
DELETE /api/shorten/links/:slug
GET /api/shorten/links/:slug/qr
GET /api/analytics/:slug?range=7d
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Anonymous dashboard ownership uses a browser-local `x-owner-key` header. Authenticated requests use `Authorization: Bearer <token>`.

## What I Would Do Differently at Scale

- Move analytics to a time-series database such as TimescaleDB or InfluxDB
- Add a CDN or edge worker layer in front of hot redirects
- Shard MongoDB by slug prefix for horizontal scale
- Add dead-letter queue inspection and replay tooling
- Hash or truncate stored IP addresses for stricter privacy posture

## Resume Bullet

Built a production-grade URL shortener with Redis caching, BullMQ async click tracking, and a real-time analytics dashboard, reducing simulated redirect latency versus a naive DB-only implementation; includes rate limiting, geo-IP tracking, QR codes, and device analytics.
