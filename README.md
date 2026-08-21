# Taghyeer

Real-time 1:1 and group chat in the browser.

Login with a phone number and name, search people, start conversations, and message live — including groups.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (Radix primitives)
- TanStack Query for server state
- Socket.io for incoming messages

## Docs

- [API reference](docs/api-doc.md)
- [System design](docs/system-design.md)
- [Postman collection](docs/Chat-API.postman_collection.json)

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | REST base (`…/api`) |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io origin (host root, not `/api`) |

Open [http://localhost:3000](http://localhost:3000). Routes: `/` landing, `/login`, `/app` chat.

## Status

Core chat is being built. The API contract is documented; the app, landing page, and deploy follow.
