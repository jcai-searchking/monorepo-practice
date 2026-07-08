# Plan: First vertical slice — Angular "Create Lobby" (auth + form → 201)

## Goal
Turn the working backend into something a real person can use: scaffold an Angular app in `apps/web`, do Google sign-in to obtain the JWT, and submit a create-lobby form to `POST /lobbies` → 201. Thin, end-to-end. User is NEW to Angular (teach as we go).

## Context (discovered)
- `apps/web` empty (README only). Monorepo = npm workspaces + Turbo. `packages/shared` exists (near-empty) → home for shared types.
- Google auth proven via `apps/api/scratch/google-test.html` (GSI client id `632039701652-478v5m9fu3l48eq4gvs3n0n64j2is7e3.apps.googleusercontent.com` → id_token → POST /auth/google → { user, accessToken }).
- `createGoogleUser` defaults role PLAYER; `POST /lobbies` needs HOST/ADMIN → must promote user to HOST in DB.
- API likely has NO CORS middleware (app.ts = express.json + cookieParser only) → must add for localhost:4200.
- Test/dev DB = local Homebrew postgres@15 (user jcai, db users_api_test). Start: `brew services start postgresql@15`.

## Decisions
- Angular v17+ standalone components, routing, CSS, NO SSR (keep simple).
- Token stored in localStorage for MVP (note XSS tradeoff; revisit later).
- Shared types = plain TS interfaces + string-literal unions in `packages/shared` (NOT derived from Zod/Prisma, to avoid coupling web to backend internals).
- Role promotion via Prisma Studio (`npx dotenv -e .env -- prisma studio`).
- Scaffold with `npx @angular/cli new` (no global install).

## Phases / Steps

### Phase 0 — Prereqs (verify environment)
1. DB up: `brew services start postgresql@15`; API dev: `npm run dev` (apps/api).
2. Sanity: hit `POST /auth/google` with a token from google-test.html; confirm { accessToken } returns.
3. Google Cloud Console: ensure OAuth client has `http://localhost:4200` as an Authorized JavaScript origin (external step — may block sign-in if missing).

### Phase 1 — Scaffold Angular app (apps/web)
4. Scaffold Angular into apps/web (handle existing README.md). Standalone, routing, CSS, skip SSR.
5. Verify `ng serve` runs on http://localhost:4200. Confirm it's a proper npm-workspace member (turbo dev/build/lint pick it up).

### Phase 2 — Shared types (packages/shared)
6. In `packages/shared/src/index.ts`: define `SkillLevel`/`GenderFormat` literal unions, `CreateLobbyRequest`, `Lobby`/`LobbyResponse`, `GoogleLoginResponse` ({ user, accessToken }).
7. Ensure both apps can import from `@my-app/shared` (tsconfig paths / workspace resolution).

### Phase 3 — CORS on the API (backend change)
8. Add `cors` middleware to `apps/api/src/app.ts` allowing `http://localhost:4200` (credentials as needed). Install `cors` + `@types/cors` if missing.

### Phase 4 — Auth in Angular (Google sign-in)
9. Load Google Identity Services (GSI) script (index.html) using the existing client id.
10. `AuthService`: render/trigger GSI → get id_token → POST `/auth/google` → store `accessToken` (localStorage) → expose `isLoggedIn`/`getToken`.
11. Login page/component with the Google button + callback wiring.

### Phase 5 — Create-lobby feature
12. `authInterceptor` (functional HttpInterceptor) attaches `Authorization: Bearer <token>` to API calls.
13. `LobbyService.createLobby(dto: CreateLobbyRequest)` → POST `/lobbies` → returns created lobby.
14. Create-lobby reactive form: fields = lobbyName, location, startTime, endTime, price, skillLevel (select), genderFormat (select), allowToApply (checkbox). Client-side validation mirrors schema (min lengths, future dates, end>start).
15. On submit: call service; show success (render returned lobby) or map errors (401 not logged in / 403 not a host / 400 invalid).

### Phase 6 — Promote to HOST + manual E2E
16. Sign in once (creates PLAYER user). Open Prisma Studio; set that user's `role` = HOST.
17. Sign OUT then back IN (JWT role is baked at login — must re-login to get a HOST token).
18. Submit the form → expect 201 + rendered lobby.

## Relevant files
- `apps/web/**` — new Angular app (scaffold).
- `apps/web/src/index.html` — add GSI `<script>`.
- `apps/web/src/app/auth/auth.service.ts`, `login.component.ts` — Google sign-in + token storage.
- `apps/web/src/app/core/auth.interceptor.ts` — attach Bearer token.
- `apps/web/src/app/lobby/lobby.service.ts`, `create-lobby.component.ts` — form + POST.
- `packages/shared/src/index.ts` — shared request/response types + enums.
- `apps/api/src/app.ts` — add CORS for http://localhost:4200 (ref: existing `app.use(express.json())` block).
- Google Cloud Console (external) — authorized JS origin localhost:4200.

## Verification
1. `ng serve` → app loads at localhost:4200.
2. Click Google button → network shows POST /auth/google → 200 with accessToken; token stored.
3. As HOST (after promotion + re-login): submit form → POST /lobbies → 201; UI renders returned lobby incl. host name.
4. Manual failure checks: (a) logged out → create blocked/401; (b) before promotion (PLAYER) → 403; (c) invalid form → client validation and/or 400.
5. `npm test` (apps/api) still green (no backend regressions beyond CORS).

## Further considerations
1. Google authorized origins — if sign-in fails with origin error, add http://localhost:4200 in Google Cloud Console. (Blocker risk.)
2. Stale-token role — promoting to HOST requires re-login; document this so it's not confusing.
3. Shared types coupling — keep `@my-app/shared` as plain DTOs; do NOT import Prisma/Zod there. Optionally later: have the API response-type reference these too.
4. Token storage — localStorage is fine for MVP; note XSS tradeoff, revisit (httpOnly cookie) post-MVP.
