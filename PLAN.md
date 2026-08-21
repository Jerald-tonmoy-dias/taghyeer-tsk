# Taghyeer — Senior Frontend Take-Home

**Deadline:** Aug 22, 2026, 4:00 PM
**Stack:** React / Next.js
**API:** https://frontend-task-chatapp.onrender.com
**Docs:** https://frontend-task-chatapp.onrender.com/docs/

---

## 1. What this task actually is

A 24-hour take-home with **three parts**. Later parts depend on earlier ones. Reviewers care more about how you think, structure code, and make decisions than about a huge feature list.

**Required at submission (all of these):**

- Public GitHub repo (or private with access granted)
- README: setup, stack, Part 3 write-up
- Live demo URL for Part 1 (chat app)
- Live demo URL for Part 2 (landing page)

No working demo links → **not reviewed**.

**Where to spend polish:** the chat panel (message list, sending, real-time). Smaller + solid beats rushed + incomplete.

---

## 2. Identify the three parts

### Part 1 — API docs + chat app (core)

1. **Write your own API documentation first** (before UI). Markdown / Postman / OpenAPI. You may rename, add, or drop endpoints in *your* docs if you’d design them better — but the app must still talk to the **given live API**.
2. **Build the chat product** against the live mock API:
   - Login (phone + name; new phone auto-registers)
   - Search by name/number → start a 1:1 conversation
   - Create group conversations (3+ people)
   - Message list: sender vs receiver visually distinct, timestamps
   - Send messages; block empty sends
   - Real-time incoming messages (no refresh)
   - Loading / empty / error states everywhere
   - Auto-scroll to latest **unless** the user has scrolled up
3. Deploy Part 1 to Vercel/Netlify.

**Bonus (Part 1):** one *original* extra — not a generic add-on. Only counts if it’s genuinely one-step-ahead.

### Part 2 — Creative landing page

- Showcase the Part 1 product as if real users will see it
- No Figma — layout, color, type, motion are yours
- Responsive, clearly explains the product
- Deploy separately (own URL)
- **Bonus:** original interaction/detail — stock testimonials / FAQ accordion **do not count**

### Part 3 — Thought process write-up (README)

- Why this architecture / libraries / trade-offs (Part 1)
- Design reasoning (Part 2)
- How AI was used (tool, for what, what you kept vs rewrote)
- What you’d do with more time
- API quirks you hit (or “none”)
- Honest and short. Assumptions are OK if you write them down.

---

## 3. Constraints & facts from the API (don’t rediscover later)

| Fact | Detail |
|---|---|
| REST base | `https://frontend-task-chatapp.onrender.com/api` |
| Health | `GET /health` on **host root**, not `/api/health` |
| Auth | JWT from `POST /api/auth/login` `{ phone, name }` → `Authorization: Bearer <token>` |
| Socket | Socket.io on **host root**, not `/api`: `io(origin, { auth: { token } })` |
| Socket events | send: `message:send` `{ conversationId, text }` · recv: `message:new`, `conversation:updated` |
| Search | `GET /api/users/search?q=` |
| 1:1 | `POST /api/conversations` `{ userId }` |
| History | `GET /api/conversations/{id}/messages?limit=&before=` (cursor pagination) |
| Send | `POST /api/messages` `{ conversationId, text }` **or** socket |
| Groups | `POST /api/conversations/group` `{ name, participantIds[] }` — creator is admin |
| Spec gap | **Responses and status codes are intentionally undocumented** — capturing them is Part 1 of the assignment |

Quirk already seen: missing token on `/api/auth/me` and `/api/conversations` returned **400**, not 401.

---

## 4. Step-by-step plan (do in this order)

### Phase 0 — Setup (first 30–45 min)

- [ ] Next.js (App Router) + TypeScript + Tailwind
- [ ] Env: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`
- [ ] Folder structure (example):
  - `src/app` — routes (login, chat, landing)
  - `src/lib/api` — fetch client, typed endpoints
  - `src/lib/socket` — socket.io-client
  - `src/features/auth | conversations | messages | groups`
  - `src/components` — UI primitives
- [ ] Auth token in memory + `localStorage` (restore via `GET /auth/me`)
- [ ] Deploy a blank Next.js app to Vercel **now** so deploy isn’t last-minute

### Phase 1 — API documentation (before UI)

This is a **standalone deliverable**. Do it first.

- [ ] Log in with a test phone; save the JWT
- [ ] Hit every endpoint; record:
  - method, path, auth required
  - request body / query
  - **actual** status codes and response JSON
  - error shapes (empty text, bad id, not admin, etc.)
- [ ] Socket: connect, send, listen for `message:new` / `conversation:updated`
- [x] Write `docs/api-doc.md` + Postman collection (`docs/Chat-API.postman_collection.json`)
- [ ] Note quirks for Part 3 (400 vs 401, `/health` vs `/api`, pagination `before`, etc.)

### Phase 2 — Auth & shell

- [ ] Login page: phone + name, validation, loading/error
- [ ] Persist session; `/auth/me` on load; redirect guests away from chat
- [ ] App shell: conversation list + chat panel (empty state when none selected)

### Phase 3 — Conversations

- [ ] List conversations (`GET /conversations`)
- [ ] Search users → start 1:1
- [ ] Create group (name + multi-select from search)
- [ ] Select a conversation → load history
- [ ] Empty / loading / error for list and search

### Phase 4 — Chat panel (highest polish)

- [ ] Message list: mine vs theirs, timestamps, group sender names
- [ ] Pagination: load older on scroll-up (`before` cursor)
- [ ] Send: disable empty/whitespace; optimistic UI optional
- [ ] Socket `message:new` → append without refresh
- [ ] Auto-scroll to latest; **if user scrolled up, do not force-scroll**
- [ ] “New messages” hint when pinned up-scroll is a strong extra if you have time
- [ ] Loading / empty / error for history and send failures

### Phase 5 — Groups (complete, don’t overbuild)

Must-have: create group + chat in it.
If time: add/remove members, leave, rename, promote admin (admin-only).
Socket `conversation:updated` should refresh the header/list.

### Phase 6 — Hardening

- [ ] All required states covered
- [ ] Responsive chat layout (list + panel; mobile: one pane at a time)
- [ ] Token expiry / 401–400 handling → back to login
- [ ] Don’t send empty messages client-side **and** handle API rejection

### Phase 7 — Landing page (Part 2)

- [ ] Separate route e.g. `/` = landing, `/app` = chat (or `/login`)
- [ ] Custom visual direction — not a generic SaaS template
- [ ] Clear what the product does + CTA into the app
- [ ] Responsive
- [ ] One original interaction if time (skip FAQ/testimonials)

### Phase 8 — Write-up + ship

- [ ] README: setup, env vars, stack, Part 3
- [ ] Honest AI usage section
- [ ] Confirm both URLs work in incognito
- [ ] Push GitHub; send repo + both demo links

---

## 5. Suggested time budget (~23 hours)

| Block | Time | Goal |
|---|---|---|
| Setup + first deploy | 45 min | Repo live |
| Probe API + write docs | 2–3 h | `docs/api-doc.md` + Postman collection done |
| Auth + layout | 2 h | Login + shell |
| Conversations + search + groups create | 3 h | Can open a chat |
| Chat panel + socket + scroll | 4–5 h | Core experience |
| States, pagination, groups extras | 2–3 h | Production-feel |
| Landing page | 3–4 h | Distinct, responsive |
| README, polish, deploy check | 1–2 h | Submittable |
| Buffer | rest | Bugs, sleep, bonus |

If time slips: **cut group admin UI and landing animation first. Never cut chat panel, socket, or demos.**

---

## 6. Architecture (senior defaults — revisit if you disagree)

- **Next.js App Router + TypeScript** — required stack, SSR not critical for the chat itself; landing can be static.
- **Server state:** TanStack Query for REST (cache, retries, loading).
- **Realtime:** socket.io-client; on `message:new` update Query cache (don’t refetch the whole thread).
- **Auth:** cookie or `localStorage` JWT; a tiny auth context; fetch wrapper that attaches Bearer.
- **UI:** Tailwind + a small set of your own components. Skip a heavy UI kit unless it actually saves time.
- **Forms:** simple controlled inputs; phone format loosely (API example is `+15551234567`).
- **Landing vs app:** same repo, two routes. Assignment asks for a link for each part; `/` and `/app` on one host is fine.

Trade-off to mention in Part 3: REST send vs socket send — pick one as source of truth (REST + socket for receive is the safe default).

---

## 7. Original bonus ideas (pick at most one, only if core is done)

Good (specific to *this* product):

- Stick-to-bottom vs “new messages” pill when user is reading history
- Failed-send retry on a single bubble
- Connection status from socket connect/disconnect
- Group: show who is admin in the thread header without a settings dump

Skip (won’t count): dark mode toggle, FAQ, testimonials, generic emoji picker, “coming soon” sections.

---

## 8. Definition of done

- [x] `docs/api-doc.md` + Postman collection exist and match live responses
- [ ] Login works for new and existing phones
- [ ] Search → 1:1 chat works
- [ ] Group create + group messages work
- [ ] Messages distinguished, timestamped, empty send blocked
- [ ] Incoming messages appear live
- [ ] Auto-scroll respects “user is reading up”
- [ ] Loading / empty / error on main flows
- [ ] Landing is custom and responsive
- [ ] README includes Part 3 (incl. AI + API issues)
- [ ] GitHub + two working demo links

---

## 9. Do / don’t

- Do document API responses yourself — that’s scored.
- Do treat chat panel as production code.
- Do note assumptions in the write-up instead of blocking.
- Don’t paste AI summaries into Part 3 (the PDF plants an AI canary).
- Don’t start the landing page before a working chat thread.
- Don’t chase extra features until socket + scroll + states are solid.
