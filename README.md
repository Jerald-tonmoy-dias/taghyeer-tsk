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

I wrote the [system design](docs/system-design.md) before the screens. The short version of that document is still how the app works: landing is static, login stores a JWT, `/app` is a client app. TanStack Query talks to REST. Socket.io only pushes `message:new` into that same cache. I never wait on the socket for my own send — the bubble comes from `POST /messages`.

### Why the chat is built this way

The backend is a given. I probed it, documented it, then mapped it. I did not rename their routes. REST uses `_id` and ISO dates; the socket uses `id` and a millisecond timestamp, so `lib/mappers.ts` is the seam. Domain types in `lib/types.ts` always use `id` and milliseconds. That is in the design under “normalize,” and it saved a lot of “why doesn’t this match?” later.

I send over REST and listen on the socket because that is what the API actually does. The sender does **not** get `message:new`. If I had shown my own message from the socket, it would never appear. Two transports is the cost; one write path is the win. Query holds inbox and history. I did not put the message list in Redux. If it is on the server, it lives in Query.

I skipped Zod on purpose. The design already says this: a schema would still need the same transforms (`_id` → `id`, empty `lastMessage: {}`), plus more code than `type User = { … }` and a `trim()` on login, search, and send. TypeScript is the contract. The live API is stable enough that parsing every payload at runtime felt like upkeep, not safety.

shadcn is for the app chrome (forms, dialog, buttons). Landing and bubbles stay custom. Phone is digits (optional `+`); the API will store any string, so the form has to be the adult in the room. Same for empty messages — they return `200` and get stored, so send is disabled when `text.trim()` is empty.

Stick-to-bottom is the ~80px rule from the design: near the bottom, follow incoming; scrolled up, do not yank; send always jumps down because that is intent.

What I cut, on purpose: group rename / members / leave, older-page pagination (`hasMore` is in the client but the UI only loads the first 30), a socket Connecting/Live badge. The design said if time slips, never cut thread + socket + scroll. I followed that.

### Landing

I wanted `/` to feel like people talking, not a dashboard and not a blue/purple “AI” gradient. Cream paper (`#F7F1EA`), vermillion as a **fill** (`#E24B32`) — I ran the hex pairs through a contrast check and vermillion-on-cream fails AA for body text (about 3.5:1), so links use `#A83422` and the primary button is `#C73E29` with a white label. Fraunces for the shout, Source Sans 3 for reading. Chat keeps Geist.

The preview is fake data. The extra is one incoming line after a few seconds, CSS/JS only, no socket on the marketing page. The first three bubbles still render if JS is slow.

### How I used AI

I used Cursor in the repo the way I would use a pair: scaffold, typed client, a lot of the screens, and turning API probes into `docs/api-doc.md`. I did not let it invent endpoints. The workflow was mine — one issue, one branch, feature-wise commits, then a PR. I also pushed back: E.164 was too strict so I dropped it to “is this a number”; landing colors had to pass AA, not look warm. When a stacked PR’s parent branch got deleted, GitHub closed the child — I retargeted onto `main` instead of hoping the tool would fix git.

I still wrote the system design first. The AI filled code into that shape. When it named things like `dto` or got cute with phone rules, I made it boring on purpose (`payloads`, `toTimestampMs`).

### If I had more time

Load older messages when you hit the top (`limit` + `hasMore` — `before` was flaky in probes, so I would not bet the UX on it). A small Live / Offline mark for the socket, without logging anyone out. Group admin: rename, add, leave. Failed-send retry on a single bubble. None of that is missing from the core path.

### What the API actually did

A few things I had to handle in the client because the server will not:

- **Search is exact and case-sensitive.** `ada` and `Ada` are different queries. We pass `q` through as typed and never call search with an empty `q` (that returns a dump of users).
- **Empty messages are legal.** `""` and `"   "` return `200`. The composer blocks them.
- **Inbox `lastMessage` can be `{}`.** The mapper treats that as missing.
- **Missing JWT is `400 NO_TOKEN`**, not 401. Bad JWT is `401 INVALID_TOKEN`. Both clear the session.
- **Socket origin is the host root**, not `/api`. Mixing those up means no live messages.
- **No echo for the sender.** Use the REST body. I already said it; it is the one that bites in review if you skip it.

The longer versions live in [api-doc.md](docs/api-doc.md) and the “If something looks wrong” table in the [developer guide](docs/developer-guide.md).
