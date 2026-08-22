# Taghyeer

Real-time 1:1 and group chat in the browser.

Login with a phone number and name, search people, start conversations, and message live — including groups.

## Live demo

- Landing: [https://taghyeer-tsk.vercel.app/](https://taghyeer-tsk.vercel.app/)
- Chat: [https://taghyeer-tsk.vercel.app/app](https://taghyeer-tsk.vercel.app/app)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (Radix primitives)
- TanStack Query for server state
- Socket.io for incoming messages

## Docs

- **[Developer guide](docs/developer-guide.md)** — start here to run the app and find your way around
- [API reference](docs/api-doc.md)
- [System design](docs/system-design.md)
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

The longer “why” is in [system design](docs/system-design.md). This is how I actually did the work.

### How I started

I read the product notes and the Swagger page before I wrote any UI. Swagger listed the routes. It did not list response bodies or status codes. So I called every endpoint and socket event myself and wrote down what came back. Nothing in the docs is guessed.

From those notes I wrote the [API reference](docs/api-doc.md) and a [Postman collection](docs/Chat-API.postman_collection.json). Then I wrote a [system design](docs/system-design.md). That design changed while I built. I still used it as the map: data model, who owns state, how `/` and `/app` render, and how realtime should work.

Then I split the work into GitHub issues on a project board. The workflow was **issue → branch → PR → self-review → merge**. One issue, one branch, one PR. I reviewed each PR myself before merging. There was a lot of back and forth. The rule I kept: **core chat first** (login, inbox, thread, send, socket, scroll, groups), landing second.

I also wrote a [developer guide](docs/developer-guide.md) so the next person does not have to re-learn the API quirks from scratch.

### Architecture

Two things from those live API calls shaped the client.

REST and the socket return messages in different shapes. REST uses `_id` and an ISO date. The socket uses `id` and a millisecond timestamp. Both get mapped into one type in `lib/mappers.ts`.

**I never get my own message back on the socket.** So send is REST-first. The bubble comes from `POST /messages`. The socket is only for other people’s messages. If I had waited on the socket, my own line would never show up.

The rest follows from that:

- **TanStack Query** holds server state. I did not add Redux or Zustand. There was nothing else to store besides cached API data and a little UI state (composer, stuck-to-bottom, which chat is open).
- **No Zod.** I needed to reshape payloads (`_id` → `id`, `lastMessage: {}` → missing), not validate them. TypeScript covers the shape. A runtime parser would still need the same transforms.
- **shadcn/ui** for forms and dialogs. Landing and message bubbles are custom, so a component kit would not flatten the look.
- **Stick-to-bottom** uses an ~80px rule. If you are near the bottom, follow new messages. If you scrolled up, stay put. If you send, always jump down.

The JWT lives in `localStorage` because the API is Bearer-only. That is an XSS trade-off. An httpOnly cookie would need a backend we do not own.

### Design

I did not want a generic dashboard or a purple gradient. The landing tokens in `globals.css` are a cool off-white (`#F8FAFC`) and one blue (`#2563EB`) for buttons and links. Headlines use **Newsreader**. Body text uses **Plus Jakarta Sans**. Small labels use JetBrains Mono.

`/`, `/login`, and `/app` share those same color tokens and fonts. `/app` is not a separate Geist / default-shadcn theme. Geist is only the root fallback on `<html>`. Chat bubbles use Inter on top of the same product colors.

A few concrete calls:

- **A chat mock under the hero**, so you see the room before you sign up. The thread is fake data. One extra line shows up after a short pause. That is CSS and a timer. There is no live socket on the public page.
- **One main button** (“Open the Chat App”) and a two-line title. The header stays simple.
- **Three short cards** for what it does: search and start, 1:1 and groups, live messages. Not a long feature list.
- **A details block** for the less visible bits: empty send is blocked, scroll does not yank you, and loading / empty / error are handled.

I did not add a FAQ. Extra questions would have padded the page. The timed incoming bubble is the extra.

### How I used AI

I used **Claude and Cursor** to talk through the idea and to build most of the app. I used **ChatGPT** when I needed a second pass on copy.

They helped scaffold the project, build the typed API client, implement screens from specs I wrote, and turn probe notes into documentation. They did not invent endpoints.

What I changed or rejected:

- The first phone check wanted a strict international format. The API does not validate phones, so I changed it to “is this a number?”
- An early accent used warm red as headline text. It failed a contrast check, so it did not ship. The shipped accent is blue `#2563EB`.
- I kept plain names (`payloads`, `toTimestampMs`) instead of `dto` and cute timestamp helpers.
- When a stacked PR’s parent branch was deleted, GitHub closed the child. I retargeted that PR onto `main` myself. That is a git problem, not a prompt problem.

The process stayed **issue → branch → PR → self-review → merge**. I looked at each piece before merging.

### With more time

- Older messages already load when you hit the top. I would keep using `limit` / `hasMore`. The `before` cursor was unreliable in testing.
- A small Live / Offline mark for the socket that does **not** log anyone out on disconnect.
- Group admin: rename, add, leave. Create and group chat are already there.
- Retry on a single failed send bubble.

### What the API actually did

A few things I had to handle in the client because the server will not:

- Search is exact and case-sensitive (`ada` ≠ `Ada`). An empty query returns a dump of users, so the app never calls it empty.
- Empty or whitespace messages return `200` and get stored. The composer blocks them.
- `lastMessage: {}` means none, not `null`. The mapper treats it as missing.
- Missing token → `400 NO_TOKEN`. Bad token → `401 INVALID_TOKEN`. The client looks at `error.code`, not only HTTP status, before clearing the session.
- Socket origin is the **host root**, not `/api`. Easy to miss if you only copy the REST base.
- The sender never receives their own `message:new`. That is why send and receive use different transports.

The “If something looks wrong” table in the [developer guide](docs/developer-guide.md) is the short version of this list.
