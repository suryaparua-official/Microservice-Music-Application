# Music App — Frontend

React 19 single-page application built with Vite and TypeScript. Served as compiled static files behind an nginx container in production.

## Tech Stack

| Concern        | Library / Tool                          |
|----------------|-----------------------------------------|
| UI framework   | React 19                                |
| Language       | TypeScript                              |
| Build tool     | Vite 7 + `@vitejs/plugin-react-swc`     |
| Styling        | Tailwind CSS 4 (`@tailwindcss/vite`)    |
| Routing        | React Router 7                          |
| HTTP client    | Axios                                   |
| Notifications  | react-hot-toast                         |
| Icons          | react-icons                             |

## Environment Variables

These are injected at **build time** via Vite. For Docker builds, values are passed as `ARG`/`ENV` in `dockerfile`.

| Variable               | Description                                          |
|------------------------|------------------------------------------------------|
| `VITE_API_BASE_URL`    | Base URL for user-service and song-service API calls |
| `VITE_ADMIN_SERVER_URL`| Base URL for admin-service API calls                 |

For local development, copy `.env.example` to `.env` and point both to `http://localhost:8085` (the API gateway).

## Local Development

```bash
npm install
npm run dev   # Vite dev server — http://localhost:5173
```

Requires the backend services and API gateway to be running. The simplest approach is to start infrastructure and the gateway via Docker:

```bash
# From the repo root
docker compose up -d mongodb postgres redis api-gateway
```

Then set `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8085
VITE_ADMIN_SERVER_URL=http://localhost:8085
```

## Production Build

```bash
npm run build   # Output: dist/
```

In Docker, the compiled `dist/` is served by nginx using the `nginx.conf` in this directory.
