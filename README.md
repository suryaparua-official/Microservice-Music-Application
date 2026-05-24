# Music App — Full-Stack Music Streaming Application

A full-stack music streaming web application built with a microservice architecture. The system is composed of three independent Node.js/TypeScript backend services, a React single-page application, and an nginx API gateway, all orchestrated locally via Docker Compose. Data is persisted across MongoDB, PostgreSQL, and Redis — no external cloud database accounts required.

---

## Architecture

```
Browser
  |
  |-- http://localhost ---------> [ frontend ]   nginx static server (port 80)
  |                                    React 19 SPA served as compiled assets
  |
  |-- http://localhost:8085 -----> [ api-gateway ]   nginx reverse proxy (port 8085)
                  |
                  |-- /api/users/*  -----> [ user-service   :5000 ]
                  |-- /api/songs/*  -----> [ song-service   :8000 ]
                  |-- /api/admin/*  -----> [ admin-service  :7000 ]
                                                |
                                                | (auth delegation via HTTP)
                                                v
                                         [ user-service ]

Internal network (music-internal):

  user-service   <----> MongoDB    (user accounts, playlists)
  admin-service  <----> PostgreSQL (albums, songs)
  song-service   <----> PostgreSQL (albums, songs — read-only)
  admin-service  <----> Redis      (cache invalidation on writes)
  song-service   <----> Redis      (response cache, 30 min TTL)
  admin-service  <----> Cloudinary (audio + image upload, external CDN)
```

All backend services and data stores run on an isolated Docker bridge network (`music-internal`). Only the frontend (port 80) and API gateway (port 8085) are bound to the host.

---

## Technology Stack

| Layer           | Technology                                       |
|-----------------|--------------------------------------------------|
| Frontend        | React 19, TypeScript, Vite 7, Tailwind CSS 4     |
| Routing         | React Router 7                                   |
| HTTP Client     | Axios                                            |
| Backend         | Node.js 20, Express 5, TypeScript (ESM)          |
| Authentication  | JWT (jsonwebtoken), bcrypt                       |
| User Database   | MongoDB 7 via Mongoose                           |
| Song Database   | PostgreSQL 16 via postgres.js v3                 |
| Cache           | Redis 7 via node-redis v5                        |
| Media Storage   | Cloudinary (audio files, album/song thumbnails)  |
| File Uploads    | Multer (memory storage, forwarded to Cloudinary) |
| API Gateway     | nginx (alpine)                                   |
| Containerization| Docker, Docker Compose v2                        |

---

## Repository Structure

```
.
├── docker-compose.yml
├── nginx/
│   └── nginx.conf               # API gateway routing config
├── frontend/
│   ├── src/
│   │   ├── context/             # React Context (UserContext, SongContext)
│   │   ├── pages/               # Route-level page components
│   │   └── components/          # Shared layout and UI components
│   ├── dockerfile
│   └── nginx.conf               # SPA static server (try_files SPA fallback)
├── backend/
│   ├── user-service/            # Authentication, user profiles, playlists
│   │   └── src/
│   │       ├── config/db.ts     # Mongoose connection
│   │       ├── model/           # User schema
│   │       ├── middleware/      # JWT verification
│   │       ├── controllers/
│   │       └── route/
│   ├── admin-service/           # Album and song management (admin only)
│   │   └── src/
│   │       ├── config/          # postgres.js, Redis, Cloudinary
│   │       ├── database/        # Schema initialization (initDB)
│   │       ├── middleware/      # Auth (delegates to user-service via HTTP)
│   │       ├── controller/
│   │       └── route/
│   └── song-service/            # Public read API for songs and albums
│       └── src/
│           ├── config/          # postgres.js, Redis
│           ├── controller/
│           └── route/
├── .env.example
├── SETUP.md
└── LICENCE.md
```

---

## Services

### user-service — Port 5000

Handles all authentication and user data. Issues JWT tokens signed with `JWT_SEC`. The token payload includes `{ id, role }` so that admin-service can verify authorization locally without a network call. Auth responses never include the password field.

| Method | Endpoint                  | Auth     | Description                          |
|--------|---------------------------|----------|--------------------------------------|
| POST   | /api/users/user/register  | None     | Register a new account, returns JWT  |
| POST   | /api/users/user/login     | None     | Login, returns JWT                   |
| GET    | /api/users/user/me        | Bearer   | Fetch the authenticated user         |
| POST   | /api/users/song/:id       | Bearer   | Toggle a song in the user's playlist |

**Data model (MongoDB):**
```
User {
  username  : String  (required)
  email     : String  (required, unique)
  password  : String  (bcrypt, 10 rounds)
  role      : String  (default: "user")
  playlist  : String[] (song IDs, default: [])
  timestamps: true
}
```

---

### admin-service — Port 7000

Content management for albums and songs. All routes require a valid JWT belonging to a user with `role: "admin"`. Token validation is performed locally using `jsonwebtoken.verify()` with the shared `JWT_SEC` secret — the `role` claim is embedded in the token at sign time by user-service, so no inter-service HTTP call is required per request. File uploads are received as multipart form data via Multer (50 MB limit), converted to a data URI, and uploaded to Cloudinary.

| Method | Endpoint                  | Auth (admin) | Description                        |
|--------|---------------------------|--------------|------------------------------------|
| POST   | /api/admin/album/new      | Bearer       | Create an album with a thumbnail   |
| POST   | /api/admin/song/new       | Bearer       | Upload a song with an audio file   |
| POST   | /api/admin/song/:id       | Bearer       | Add a thumbnail image to a song    |
| DELETE | /api/admin/album/:id      | Bearer       | Delete an album and all its songs  |
| DELETE | /api/admin/song/:id       | Bearer       | Delete a song                      |

On startup, `initDB()` runs `CREATE TABLE IF NOT EXISTS` for `albums` and `songs`, making the service safe to restart against an existing database.

`deleteAlbum` deletes songs and the album inside a single PostgreSQL transaction to prevent partial state on failure.

On each write operation, all affected Redis cache keys are invalidated immediately: top-level keys (`albums`, `songs`) plus any per-record keys for the affected album or song (`album:{id}:songs`, `song:{id}`).

---

### song-service — Port 8000

Read-only public API. Reads from the same PostgreSQL database written by admin-service. All responses are cached in Redis with a 30-minute TTL; cache misses fall through to PostgreSQL.

| Method | Endpoint                  | Auth | Description                               |
|--------|---------------------------|------|-------------------------------------------|
| GET    | /api/songs/album/all      | None | List all albums                           |
| GET    | /api/songs/song/all       | None | List all songs                            |
| GET    | /api/songs/album/:id      | None | Get an album with its songs               |
| GET    | /api/songs/song/:id       | None | Get a single song by ID                   |

---

### PostgreSQL Schema

The schema is created by `admin-service/src/database/initDB.ts` on first startup. The `description` column is added via `ALTER TABLE ADD COLUMN IF NOT EXISTS` for forward compatibility with existing databases.

Final schema after initialization:

```sql
CREATE TABLE albums (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  thumbnail   VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  thumbnail   VARCHAR(255),
  audio       VARCHAR(255) NOT NULL,
  album_id    INTEGER REFERENCES albums(id) ON DELETE SET NULL,
  description VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Frontend

A React 19 SPA built with Vite and Tailwind CSS 4. State is managed via two React Context providers:

- **UserContext** — authentication state, JWT token (localStorage), registration, login, logout, playlist toggling
- **SongContext** — song and album lists, currently selected song, next/previous navigation, album detail fetch, search query

Both `VITE_API_BASE_URL` (user + song routes) and `VITE_ADMIN_SERVER_URL` (admin routes) are injected at Vite build time. In the Docker build, both point to the nginx API gateway at `http://localhost:8085`.

**Routes:**

| Path                | Access       | Description                      |
|---------------------|--------------|----------------------------------|
| /                   | Public       | Home — song and album feed       |
| /search             | Public       | Song search                      |
| /album/:id          | Public       | Album detail and track listing   |
| /music              | Public       | All songs browse                 |
| /podcasts           | Public       | Podcasts (coming soon)           |
| /premium            | Public       | Premium features page            |
| /install            | Public       | Install app page                 |
| /login              | Guest only   | Login form                       |
| /register           | Guest only   | Registration form                |
| /playlist           | Auth only    | User's saved playlist            |
| /admin/dashboard    | Auth only    | Admin content management panel   |

---

## Running with Docker

### Prerequisites

- Docker Engine 24+
- Docker Compose v2

### Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd music-app

# 2. Configure secrets
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
JWT_SEC=<a long random string>

# Cloudinary account credentials (required for admin file uploads)
# Create a free account at https://cloudinary.com
Cloud_Name=<your cloudinary cloud name>
Cloud_Api_Key=<your cloudinary api key>
Cloud_Scret_Key=<your cloudinary api secret>
```

```bash
# 3. Build images and start all services
docker compose up --build
```

The stack starts in dependency order: infrastructure (MongoDB, PostgreSQL, Redis) → backend services → API gateway → frontend. Health checks gate each layer.

| URL                          | Description              |
|------------------------------|--------------------------|
| http://localhost             | Application UI           |
| http://localhost:8085        | API gateway              |
| http://localhost:8085/health | Gateway health check     |

### Common Commands

```bash
# Run in background
docker compose up -d --build

# Tail all logs
docker compose logs -f

# Tail a specific service
docker compose logs -f admin-service

# Rebuild one service without restarting others
docker compose up -d --build song-service

# Stop all containers (data preserved)
docker compose stop

# Remove containers and all persistent volumes
docker compose down -v
```

---

## Environment Variables

Only four values need to be set in the root `.env`. All database connection strings, internal hostnames, and ports are configured automatically by Docker Compose.

| Variable          | Required | Description                                 |
|-------------------|----------|---------------------------------------------|
| `JWT_SEC`         | Yes      | Secret key for signing and verifying JWTs   |
| `Cloud_Name`      | Yes      | Cloudinary cloud name                       |
| `Cloud_Api_Key`   | Yes      | Cloudinary API key                          |
| `Cloud_Scret_Key` | Yes      | Cloudinary API secret                       |

Variables set automatically by Docker Compose (do not set in `.env`):

| Variable        | Value in container                                      |
|-----------------|---------------------------------------------------------|
| `MONGO_URI`     | `mongodb://mongodb:27017/music-app`                     |
| `DB_URL`        | `postgresql://musicapp:musicapp@postgres:5432/musicapp` |
| `REDIS_HOST`    | `redis`                                                 |
| `REDIS_PORT`    | `6379`                                                  |
| `User_URL`      | `http://user-service:5000`                              |
| `FRONTEND_URL`  | `http://localhost`                                      |

---

## Data Persistence

Named Docker volumes survive container restarts and recreations.

| Volume          | Mount path (container)          | Contents                    |
|-----------------|---------------------------------|-----------------------------|
| `mongodb_data`  | `/data/db`                      | User accounts and playlists |
| `postgres_data` | `/var/lib/postgresql/data`      | Albums and songs            |
| `redis_data`    | `/data`                         | Redis AOF journal           |

To start fresh:

```bash
docker compose down -v
```

---

## Local Development (without Docker)

Each service reads its own `.env` file. Start the infrastructure containers separately, then run the services directly.

**Infrastructure:**

```bash
docker run -d -p 27017:27017 mongo:7.0
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=musicapp \
  -e POSTGRES_PASSWORD=musicapp \
  -e POSTGRES_DB=musicapp \
  postgres:16-alpine
docker run -d -p 6379:6379 redis:7-alpine
```

**Backend services** (run in each service directory):

```bash
npm install
npm run dev   # TypeScript watch + nodemon
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev   # Vite dev server — http://localhost:5173
```

For local development, `frontend/.env` should point to the API gateway (or a locally running nginx on 8085). Both `VITE_API_BASE_URL` and `VITE_ADMIN_SERVER_URL` are used as a single base for all API calls:

```env
VITE_API_BASE_URL=http://localhost:8085
VITE_ADMIN_SERVER_URL=http://localhost:8085
```

The simplest approach is to keep the nginx API gateway running in Docker while running the backend services and frontend directly on the host.

---

## Creating an Admin Account

User accounts default to `role: "user"`. To grant admin access, update the role directly in MongoDB:

```bash
docker exec -it music-mongodb mongosh
use music-app
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

The admin panel is then accessible at `http://localhost/admin/dashboard`.

---

## License

MIT — see [LICENCE.md](./LICENCE.md).
