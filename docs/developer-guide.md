# Developer guide

Onboarding for Taghyeer — real-time 1:1 and group chat. Read this first, then the [system design](./system-design.md) only when you need the “why.”

## First 10 minutes

```bash
git clone <repo>
cd taghyeer
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
|---|---|
| `npm run dev` | Local app |
| `npm run typecheck` | TypeScript errors (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

Env (already filled in `.env.example`):

| Variable | Meaning |
|---|---|
| `NEXT_PUBLIC_API_URL` | REST, including `/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io **host root** — not `/api` |

## What we are building

- `/` — marketing landing (hero window, capabilities, spotlights, details, FAQ, closer)
- `/login` — phone + name (auto-register)
- `/app` — inbox (latest activity first; session unread on closed chats), search, groups, history, send, live incoming, stick-to-bottom scroll

The live backend is REST + Socket.io. We do not own it. Documented in [api-doc.md](./api-doc.md) and [Chat-API.postman_collection.json](./Chat-API.postman_collection.json).

**Now:** core chat, landing, and the [README write-up](../README.md#thought-process).  
**Next:** send the repo and the two live demo links.

## Where code lives

```
src/
  app/                 Routes only. Keep these thin.
    page.tsx           /
    login/page.tsx     /login
    app/page.tsx       /app
  features/            Product UI (auth, inbox, thread, groups, landing) — add here
  components/ui/       shadcn primitives (Button, Input, Dialog, Sheet, …)
  lib/
    types.ts           Domain models the UI uses (`id`, timestamps in ms)
    mappers.ts         Server JSON → domain
    utils.ts           `cn()` for class names
    api/               HTTP only (no React)
```

Screens live in `features/`, not in `app/` pages.

## Data layer (`src/lib`)

UI talks to **endpoint modules**, not `fetch` directly.

```
login / getMe     →  lib/api/auth.ts
search people     →  lib/api/users.ts
inbox / 1:1 / group / history →  lib/api/conversations.ts
send message      →  lib/api/messages.ts
```

Supporting files:

| File | Responsibility |
|---|---|
| `lib/api/payloads.ts` | JSON **as the server sends it** (`_id`, ISO dates, socket `id`) |
| `lib/api/client.ts` | `fetch`, JSON, Bearer token |
| `lib/api/error.ts` | `{ error: { message, code } }` → `ApiError` |
| `lib/api/token.ts` | JWT in `localStorage` |
| `lib/mappers.ts` | Payloads → `lib/types.ts` |
| `lib/types.ts` | What the UI should use |

Incoming realtime (`message:new`) is `lib/socket.ts`. Send stays REST.

`createdAt` in domain types is **milliseconds since 1 Jan 1970**. REST sends an ISO string; sockets send a number. `toTimestampMs()` normalizes both.

## Conventions

- **Branch first**, then code. One GitHub issue → one PR.
- **One commit per feature** (not a dump of unrelated edits).
- **JSDoc** on functions: short summary, `@param`, `@returns`.
- **No Zod.** Types + mappers + a few `trim()` checks. See system design §11.
- **shadcn** for app chrome (forms, dialogs, sheets). Landing and message bubbles stay custom.
- **Do not call** `GET /users/search` with an empty `q`.
- **Search is exact and case-sensitive.** The API does not fold case or match partial words; `ada` and `Ada` can return different people.
- **Do not send** whitespace-only messages (`sendMessage` already rejects them). The API would store `""`.
- **Inbox sort is client-side.** Each sidebar tab is `lastMessage.createdAt` desc, then `updatedAt`. The API does not guarantee order.
- **Unread is session-only.** Mark a row when `message:new` arrives and that chat is not open; clear on open. No server read state — do not persist a count.
- **Do not send** a free-text phone. The API does not verify numbers; the login form only checks that the value is a number.
- Names should be obvious in review (`payloads`, `toTimestampMs` — not `dto`, `epoch`).

## Auth (for the next ticket)

1. `POST /auth/login` with `{ phone, name }` — no Bearer header.
2. `setToken(session.token)` from `lib/api/token.ts`.
3. Later calls use Bearer automatically via `apiRequest`.
4. Restore with `getMe()`. Missing token is **`400 NO_TOKEN`**, bad JWT is **`401 INVALID_TOKEN`**.

## If something looks wrong

| Symptom | Check |
|---|---|
| Socket never connects | Origin is `NEXT_PUBLIC_SOCKET_URL`, not the REST `/api` URL |
| Own send does not appear | Sender has no `message:new`; use the REST response |
| Inbox `lastMessage` empty | API sends `{}` — mapper turns that into `undefined` |
| Search misses a known name | Query must match the stored spelling and case (`Ada`, not `ada`) |
| 1:1 with your own `userId` opens the wrong chat | API returns an existing unrelated conversation (`200`). Search and new-group exclude you (`person.id !== me.id`) |
| `tsc` not found | Use `npm run typecheck`, not a global `tsc` |
| Types missing `LayoutProps` | Run `npm run dev` once so Next generates `.next/types` |

## Deeper reading

| Need | Doc |
|---|---|
| Why we chose Query, sockets, scroll rules | [system-design.md](./system-design.md) |
| Exact request/response shapes | [api-doc.md](./api-doc.md) |
| Click through the API | Postman collection in this folder |
