# Taghyeer

Real-time 1:1 and group chat in the browser.

Login with a phone number and name, search people, start conversations, and message live — including groups.

## Live demo

- Landing: [https://taghyeer-tsk.vercel.app/](https://taghyeer-tsk.vercel.app/)
- Chat: [https://taghyeer-tsk.vercel.app/app](https://taghyeer-tsk.vercel.app/app)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) for the chat chrome
- TanStack Query for server state
- Socket.io for incoming messages

## Docs

- **[Developer guide](docs/developer-guide.md)** — start here to run the app and find your way around
- [API reference](docs/api-doc.md)
- [System design](docs/system-design.md) — written before the UI; this is the “why”
- [Postman collection](docs/Chat-API.postman_collection.json)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Type-check without a full build:

```bash
npm run typecheck
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | REST base (`…/api`) |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io origin (host root, not `/api`) |

Open [http://localhost:3000](http://localhost:3000). Routes: `/` landing, `/login`, `/app` chat.

## Thought process

The longer “why” is in [system design](docs/system-design.md). What follows is how I actually got there.

### Approach

1. **Read the product through before touching code**, and separated what was written down from what was clearly expected anyway (loading, empty, and error states are not always listed, but a blank screen is never the answer).
2. **Called the live API.** Swagger documents requests; it does not spell out bodies or status codes. I hit every REST endpoint and socket event and wrote down what came back. Nothing in the docs is guessed.
3. **Wrote the API reference and a Postman collection** from those responses — [api-doc.md](docs/api-doc.md) and [Chat-API.postman_collection.json](docs/Chat-API.postman_collection.json).
4. **Wrote the [system design](docs/system-design.md) before any UI** — data model, who owns state, how `/` vs `/app` render, and the realtime flow, all based on step 2.
5. **Split the work into GitHub issues on a project board.** Core chat first (login, inbox, thread, send, socket, scroll, groups), landing second. That matches where the product actually lives.
6. **One issue → one branch → one PR**, then merge. Same process for the landing page. Feature-wise commits, not one dump.
7. **Wrote a [developer guide](docs/developer-guide.md)** so the next person does not have to re-derive the API quirks or the folder layout.
8. **Shipped to Vercel and walked the live site** — landing, login, and `/app` — against the same checklist I started with. Demo: [taghyeer-tsk.vercel.app](https://taghyeer-tsk.vercel.app/).

### Architecture

Two findings from step 2 shaped the whole client:

- **REST and the socket return messages in different shapes** (`_id` + ISO string vs `id` + millisecond timestamp). Both land in one domain type via `lib/mappers.ts`.
- **The sender never gets their own message over the socket.** Send is REST-first: append from `POST /messages`. The socket is receive-only for everyone else.

Everything else follows from the design:

- **TanStack Query** for server state. No Redux or Zustand — there is no cross-cutting client store beyond cached server data and a little UI state (composer, stuck-to-bottom, `?c=`).
- **No Zod.** The work is normalization (`_id` → `id`, `lastMessage: {}` → missing), not schema validation. TypeScript covers the shape. A runtime parser would still need those same transforms, plus more code than `type User = { … }` and a `trim()` on login, search, and send.
- **shadcn/ui** for app chrome (forms, dialogs). Landing and message bubbles are custom — that is where a kit would flatten the look.
- **Stick-to-bottom** is the ~80px rule in the design: near the bottom, follow incoming; scrolled up, stay put; send always jumps down.

JWT lives in `localStorage` because the API is Bearer-only. That is an XSS trade-off I accepted; httpOnly cookies are not available without a backend we do not own.

### Design

I wanted the landing page to feel like people talking, not a SaaS dashboard — no default blue/purple gradient. Cream paper (`#F7F1EA`), Fraunces on the hero, Source Sans 3 for body. Chat keeps Geist.

One concrete call: vermillion `#E24B32` **fails WCAG AA as text** (~3.5:1 on cream). It stays a decorative fill. Links and accent text use `#A83422`. The primary button is `#C73E29` with a white label (checked at ~5.1:1). The product preview is static fake data. The extra touch is a mock incoming line after a few seconds — CSS/JS only, no live socket on a public page. The first three bubbles still render if JS is slow.

### AI tool usage

I used Cursor as a pair, not an autonomous generator. Issue → branch → PR was my process, and I looked at each piece before merge. It helped scaffold the app, build the typed client, implement screens from specs I wrote, and turn probe notes into documentation. It did not invent endpoints.

What I changed or rejected:

- Scaled an E.164-only phone check back to “is this a number?” — the API does not validate phones.
- Rejected vermillion as text after the contrast check, not after eyeballing it.
- Plain names (`payloads`, `toTimestampMs`) instead of `dto` / cute timestamps.
- When a stacked PR’s parent branch was deleted, GitHub closed the child. I retargeted onto `main` myself. That is a git problem, not a prompt problem.

### With more time

- Older messages via `limit` / `hasMore`. The `before` cursor was unreliable in testing, so I would not bet the UX on it.
- A socket Live / Offline mark that does **not** log anyone out on disconnect.
- Group admin (rename, add, remove, leave). Create + group thread are already there.
- Retry on a single failed send bubble.

### API issues found

- Search is exact and case-sensitive (`ada` ≠ `Ada`). An empty `q` returns a dump of users, so the app never calls it empty.
- Empty / whitespace messages return `200` and get stored. The composer blocks them.
- `lastMessage: {}` means none, not `null`. The mapper treats it as missing.
- Missing token → `400 NO_TOKEN`. Bad token → `401 INVALID_TOKEN`. The client looks at `error.code`, not only HTTP status, before clearing the session.
- Socket origin is the **host root**, not `/api`. Easy to miss if you only copy the REST base.
- The sender never receives their own `message:new`. That is the finding that matters most, and why send and receive use different transports.

The “If something looks wrong” table in the [developer guide](docs/developer-guide.md) is the short version of this list.
