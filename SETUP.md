# Music App — Docker Setup Guide

## Quick Start

```bash
# 1. Copy the environment file and fill in your credentials
cp .env.example .env

# 2. Start everything
docker compose up --build

# 3. Open the app
#   Frontend  → http://localhost
#   API       → http://localhost:8085
```

---

## Architecture

```
Browser
  │
  ├─── http://localhost ──────────────► frontend (nginx, port 80)
  │                                        React SPA served as static files
  │
  └─── http://localhost:8085 ─────────► api-gateway (nginx, port 8085)
           │
           ├─ /api/users/*  ──────────► user-service   (port 5000)
           ├─ /api/songs/*  ──────────► song-service   (port 8000)
           └─ /api/admin/*  ──────────► admin-service  (port 7000)

Internal Docker network (music-internal):
  user-service   ◄──── mongodb  (port 27017)
  admin-service  ◄──── postgres (port 5432)
  song-service   ◄──── postgres (port 5432)
  admin-service  ◄──── redis    (port 6379)
  song-service   ◄──── redis    (port 6379)
  admin-service  ──────────────────────────► user-service (auth delegation via HTTP)
```

---

## Services

| Container            | Image / Build           | Exposed Port | Purpose                         |
|----------------------|-------------------------|--------------|---------------------------------|
| `music-frontend`     | ./frontend              | 80           | React SPA (nginx static server) |
| `music-api-gateway`  | nginx:alpine            | 8085         | Reverse proxy / API gateway     |
| `music-user-service` | ./backend/user-service  | —            | Auth, profiles, playlists       |
| `music-admin-service`| ./backend/admin-service | —            | Album/song management           |
| `music-song-service` | ./backend/song-service  | —            | Read-only song/album data       |
| `music-mongodb`      | mongo:7.0               | —            | User data (internal only)       |
| `music-postgres`     | postgres:16-alpine      | —            | Songs/albums data (internal)    |
| `music-redis`        | redis:7-alpine          | —            | Response cache (internal)       |

All backend services and databases communicate on the isolated `music-internal` bridge network. Only the frontend (port 80) and API gateway (port 8085) are exposed to the host.

---

## Environment Variables

Only four values need to be configured in the root `.env`:

| Variable          | Required | Description                              |
|-------------------|----------|------------------------------------------|
| `JWT_SEC`         | Yes      | Secret key for signing JWT tokens        |
| `Cloud_Name`      | Yes      | Cloudinary cloud name (media uploads)    |
| `Cloud_Api_Key`   | Yes      | Cloudinary API key                       |
| `Cloud_Scret_Key` | Yes      | Cloudinary API secret                    |

All database connection strings, hostnames, and ports are automatically configured by Docker Compose. No MongoDB Atlas, Neon, or Redis Labs accounts are needed.

> **Cloudinary** is the only external service that cannot be replaced locally — it handles audio/image upload, storage, and CDN delivery for the admin panel.

---

## Persistent Data

Named volumes preserve data across container restarts:

| Volume          | Contents                 |
|-----------------|--------------------------|
| `mongodb_data`  | User accounts, playlists |
| `postgres_data` | Albums and songs         |
| `redis_data`    | Redis AOF persistence    |

To reset all data:

```bash
docker compose down -v
```

---

## Useful Commands

```bash
# Start in detached mode
docker compose up -d --build

# Tail all logs
docker compose logs -f

# Logs for a specific service
docker compose logs -f admin-service

# Stop without removing data
docker compose stop

# Stop and remove containers + volumes (full reset)
docker compose down -v

# Rebuild a single service
docker compose up -d --build song-service
```

---

## Local Development (without Docker)

Each service has its own `.env` file for local development:

| Service       | `.env` location                   | Default port |
|---------------|-----------------------------------|--------------|
| user-service  | `backend/user-service/.env`       | 5000         |
| admin-service | `backend/admin-service/.env`      | 7000         |
| song-service  | `backend/song-service/.env`       | 8000         |
| frontend      | `frontend/.env`                   | 5173 (Vite)  |

Start infrastructure containers:

```bash
docker run -d -p 27017:27017 mongo:7.0
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=musicapp -e POSTGRES_PASSWORD=musicapp -e POSTGRES_DB=musicapp \
  postgres:16-alpine
docker run -d -p 6379:6379 redis:7-alpine
```

For the frontend, both `VITE_API_BASE_URL` and `VITE_ADMIN_SERVER_URL` must point to a single origin that routes `/api/users/*`, `/api/songs/*`, and `/api/admin/*`. The easiest approach is to keep the nginx API gateway running in Docker while running other services on the host:

```bash
# Start only infrastructure + gateway
docker compose up -d mongodb postgres redis api-gateway

# Then run services locally
cd backend/user-service && npm run dev
cd backend/admin-service && npm run dev
cd backend/song-service && npm run dev
cd frontend && npm run dev
```

`frontend/.env` for local development:

```env
VITE_API_BASE_URL=http://localhost:8085
VITE_ADMIN_SERVER_URL=http://localhost:8085
```

---

## Database Notes

- **PostgreSQL schema** is auto-created by `admin-service` on first startup via `initDB()`. Safe to restart.
- **MongoDB schema** is managed by Mongoose — no manual migration needed.
- **Redis** is used for caching only (TTL 30 min). Cache data loss on restart is safe and handled gracefully.

---

## Creating an Admin Account

User accounts default to `role: "user"`. Promote a user to admin via the MongoDB shell:

```bash
docker exec -it music-mongodb mongosh
use music-app
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

The admin panel is accessible at `http://localhost/admin/dashboard`.
