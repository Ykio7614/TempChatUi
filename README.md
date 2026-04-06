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

## Environment

- `VITE_DEV_PROXY_TARGET` backend origin for local Vite proxy, for example `http://localhost:9090`
- `VITE_API_BASE_URL` optional explicit HTTP base URL for production or non-proxied setups
- `VITE_WS_BASE_URL` optional explicit WebSocket origin; if omitted it is derived from `VITE_API_BASE_URL` or the current browser origin

By default the frontend now calls relative `/api` and `/ws` paths in development. That avoids cross-origin preflight in the browser, so guest auth reaches the backend as a normal `POST /api/guest` through the Vite proxy instead of failing on `OPTIONS`.

## Notes

- Session bootstrap follows the API contract: `GET /api/me`, refresh on `401`, then clear local storage on failure.
- Current room id is persisted in local storage for reload recovery.
- Participant nicknames are not available in the current API, so the UI shows `You` for the active user and short `userId` fallbacks for everyone else.
