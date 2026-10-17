# PlayGrow

PlayGrow is a game discovery and rewards platform with an Expo mobile app, a
Next.js company/admin portal, and an Express API backed by MongoDB.

## Applications

- `apps/app` — Expo mobile app for players
- `apps/web` — company and administrator portal
- `apps/server` — Express API, authentication, and game/company data

## Local development

1. Start MongoDB and configure `MONGODB_URI` and `JWT_SECRET` using
   `apps/server/.env.example`.
2. Configure the API's allowed web and mobile origins and optional initial
   administrator credentials as described in `apps/server/README.md`.
3. Install dependencies and start the API from `apps/server`.
4. Set `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` and start the portal.
5. Set `EXPO_PUBLIC_API_URL` in `apps/app/.env` and start Expo. For a physical
   device or Android emulator, use the development machine's reachable LAN or
   emulator host address instead of `localhost`.

Public registration is available to players and game companies. Administrator
accounts are provisioned by the API configuration; the server enforces role
permissions regardless of client-side navigation.