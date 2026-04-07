# TempChatUi

React + TypeScript frontend for the temporary chat API.

## Stack

- Vite
- React
- TypeScript
- React Router
- Zustand

## Project structure

- `src/components` reusable UI and feature components
- `src/pages` route-level screens
- `src/hooks` custom hooks for bootstrap and realtime
- `src/services` REST and WebSocket clients
- `src/store` global app state
- `src/utils` formatting, storage, and error helpers
- `src/types` shared TypeScript contracts

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example:

```bash
cp .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

## Docker

### Local dev

Run the Vite dev server in Docker with live source mounts:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The app will be available on `http://localhost:5173`.

### Production

1. Copy the production env template:
```bash
cp .env.prod.example .env.prod
```

2. Fill in:

- `VITE_API_BASE_URL`
- `VITE_WS_BASE_URL`

3. Make sure the external Docker network exists on the server:

```bash
docker network create web || true
```

4. Start the stack:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

The production stack contains only the `tempchat-ui` container. HTTPS is expected to be terminated by the already running shared Caddy from the API stack.

## CI/CD

A GitHub Actions deploy workflow is included at:

- `.github/workflows/deploy.yml`

It follows the same pattern as the API repo:

- SSH into the server
- `rsync` project files into `SERVER_PATH`
- ensure shared Docker network `web` exists
- run `docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build`

Required GitHub secrets:

- `SERVER_HOST`
- `SERVER_PORT`
- `SERVER_USER`
- `SERVER_PATH`
- `SERVER_SSH_KEY`

Recommended value:

- `SERVER_PATH=/opt/tempchatUi`

Typical manual server deploy flow:

```bash
docker network create web || true
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## Environment

- `VITE_DEV_PROXY_TARGET` backend origin for local Vite proxy, for example `http://localhost:9090`
- `VITE_API_BASE_URL` optional explicit HTTP base URL for production or non-proxied setups
- `VITE_WS_BASE_URL` optional explicit WebSocket origin; if omitted it is derived from `VITE_API_BASE_URL` or the current browser origin

If production env vars are missing, the frontend falls back to `https://api.<current-host>` on non-localhost domains. For example `https://tempchat.ru` will use `https://api.tempchat.ru`.

By default the frontend now calls relative `/api` and `/ws` paths in development. That avoids cross-origin preflight in the browser, so guest auth reaches the backend as a normal `POST /api/guest` through the Vite proxy instead of failing on `OPTIONS`.

## Notes

- Session bootstrap follows the API contract: `GET /api/me`, refresh on `401`, then clear local storage on failure.
- Current room id is persisted in local storage for reload recovery.
- Participant nicknames are not available in the current API, so the UI shows `You` for the active user and short `userId` fallbacks for everyone else.
