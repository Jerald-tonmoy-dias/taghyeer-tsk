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

The longer “why” lives in [system design](docs/system-design.md). This is the story of how I got there.

### How I started

After I got the work I sat with the product notes and the Swagger page before I wrote any UI. Swagger listed the routes. It did not spell out bodies or status codes, so I called every endpoint and socket event myself and wrote down what came back. Nothing in the docs is guessed.

From those notes I wrote the [API reference](docs/api-doc.md) and a [Postman collection](docs/Chat-API.postman_collection.json), then a [system design](docs/system-design.md). That design changed as I built — I expected that. I still used it as the map: data model, who owns state, how `/` and `/app` render, and how realtime should work.

Then I split the map into GitHub issues and moved them on a project board. One issue, one branch, one PR. I reviewed each one myself, then merged. There was a lot of back and forth. The rule I kept was simple: **core chat first** (login, inbox, thread, send, socket, scroll, groups), landing second.

I also wrote a [developer guide](docs/developer-guide.md) so the next person does not have to re-learn the API quirks from scratch.

### Architecture

Two findings from those live calls shaped the whole client.

REST and the socket return messages in different shapes — `_id` plus an ISO date on REST, `id` plus a millisecond timestamp on the socket. Both land in one type through `lib/mappers.ts`.

And **I never get my own message back on the socket.** Send is REST-first: the bubble comes from `POST /messages`. The socket is only for everyone else. If I had waited on the socket, my own line would never appear.

Everything else follows from that:

- **TanStack Query** holds server state. I did not add Redux or Zustand. There was nothing extra to store besides cached API data and a little UI state (composer, stuck-to-bottom, which chat is open).
- **No Zod.** The work is reshaping payloads (`_id` → `id`, `lastMessage: {}` → missing), not validating them. TypeScript covers the shape. A runtime parser would still need the same transforms.
- **shadcn/ui** for forms and dialogs. Landing and message bubbles are custom, so a kit would not flatten the look.
- **Stick-to-bottom** is an ~80px rule: near the bottom, follow incoming; scrolled up, stay put; send always jumps down.

The JWT lives in `localStorage` because the API is Bearer-only. That is an XSS trade-off I accepted. An httpOnly cookie would need a backend we do not own.

Madagascar

### Design

I wanted `/` to feel like people talking, not a dashboard and not a blue-purple gradient template. Cream paper, Newsreader on the shout, Plus Jakarta Sans for reading. Chat and login share that same product chrome so the jump from marketing to the app does not feel like a different product.

A few concrete calls:

- **A real chat mock high on the page**, right under the hero, so you see the room before you sign up. The thread is fake data. One extra line “arrives” after a short pause — CSS and a timer only. No live socket on a public page.
- **One main button** (“Open the Chat App”) and a two-line title, so the header stays quiet.
- **Three short cards** for what it actually does: search and start, 1:1 and groups, live messages. Not a feature dump.
- **A details block** for the unglamorous bits — empty send blocked, scroll that does not yank you, loading / empty / error — so the page says the app is careful, not only pretty.

I did not add a FAQ. A list of made-up questions would have padded the page. The timed incoming bubble is the extra.

### How I used AI

I used a few tools, not one. **Claude and Cursor** for talking through the idea and most of the build. **Gemini** when I was pushing on visual layout. **ChatGPT** when I needed a second pass on copy.

They helped scaffold the app, build the typed client, implement screens from specs I wrote, and turn probe notes into documentation. They did not invent endpoints.

What I changed or rejected:

- The first phone check wanted a strict international format. The API does not validate phones, so I made it “is this a number?”
- Warm red as headline text failed a contrast check, so it did not ship that way. The page later settled on one blue for buttons and links.
- Plain names (`payloads`, `toTimestampMs`) instead of `dto` and cute timestamps.
- When a stacked PR’s parent branch was deleted, GitHub closed the child. I retargeted onto `main` myself. That is a git problem, not a prompt problem.

Issue → branch → PR was my process. I looked at each piece before merge.

### With more time

- Older messages already load when you hit the top. I would keep trusting `limit` / `hasMore`. The `before` cursor was unreliable in testing.
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
- The sender never receives their own `message:new`. That is the finding that matters most, and why send and receive use different transports.

The “If something looks wrong” table in the [developer guide](docs/developer-guide.md) is the short version of this list.
