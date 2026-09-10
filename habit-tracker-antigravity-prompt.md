# Build Prompt: Habit Tracker (dontpad-style, no-login)

## Project overview
Build a full-stack habit tracker web app. No signup/login — users get a private "space" via a random access code in the URL (like dontpad.com), and revisit their data by returning to that same URL. Inside a space, the user defines their own habits and logs a daily rating (1-10, not just done/not-done) for each one on a calendar-style month grid. Only the current day's cell is ever editable — past and future days are locked. Progress is visualized per habit and overall via charts, so the user can watch their consistency build up over time.

## Tech stack
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js API routes (same repo)
- Database: PostgreSQL, accessed via Prisma ORM
- Charts: Recharts
- No auth library, no sessions, no passwords — access control is entirely via the space code in the URL

## Data model (Prisma schema)
```prisma
model Space {
  id        String   @id @default(cuid())
  code      String   @unique
  createdAt DateTime @default(now())
  habits    Habit[]
}

model Habit {
  id        String   @id @default(cuid())
  spaceId   String
  space     Space    @relation(fields: [spaceId], references: [id])
  name      String
  archived  Boolean  @default(false)
  createdAt DateTime @default(now())
  entries   Entry[]
}

model Entry {
  id        String   @id @default(cuid())
  habitId   String
  habit     Habit    @relation(fields: [habitId], references: [id])
  date      DateTime @db.Date
  value     Int      // 1-10
  createdAt DateTime @default(now())

  @@unique([habitId, date])
}
```

## Core behavior — non-negotiable rules
1. **Space creation & routing**: Visiting `/` with no stored space code generates a new random code (e.g. 6-8 char alphanumeric), creates a `Space` row, and redirects to `/space/[code]`. Visiting `/space/[code]` directly loads that space if it exists, or 404s if it doesn't (don't silently create — only `/` creates new spaces).
2. **No client-supplied dates on write**: `POST /api/spaces/[code]/entries` accepts `{ habitId, value }` only. The server sets `date` to the server's current date (server clock, not request body, not client timezone). This is what enforces "today only" — never trust a date from the client.
3. **Upsert semantics**: Submitting today's value again just updates today's entry (upsert on `[habitId, date]`), it doesn't create duplicates.
4. **Locked cells**: The UI must render past and future day-cells as non-interactive (show the stored value if one exists, or a blank/empty state if not). Only the cell matching the server's current date renders as an editable 1-10 dropdown. Enforce this both in the UI (disable/hide the input) and the API (reject writes for anything but today, even if someone hits the endpoint directly).
5. **Scoping**: Every habit/entry query and write must be scoped to the space resolved from the URL code — no cross-space data leakage.

## Pages / routes to build
- `/` — redirect logic described above
- `/space/[code]` — main dashboard:
  - List of habits with an "add habit" input (name only)
  - Month grid: rows = habits, columns = days of the current month (dynamically sized: 28-31 days depending on month), each cell shows the 1-10 value if logged, blank if not, and only today's column is interactive
  - Month navigation (prev/next) to view past months read-only; can't navigate into the future
  - A dropdown/selector on today's column per habit row (values 1-10)
- `/space/[code]/progress` (or a section on the same page) — charts:
  - Per-habit bar chart for the selected month, color intensity or color scale by value (e.g. red→yellow→green as value increases)
  - Per-habit stats: average rating this month, days logged, current streak (consecutive days with an entry, most recent day backward)
  - An overall line chart: daily average across all habits for the month

## API endpoints to implement
- `POST /api/spaces` — create a new space, return its code
- `GET /api/spaces/[code]` — fetch space + habits (404 if not found)
- `POST /api/spaces/[code]/habits` — add a habit `{ name }`
- `PATCH /api/spaces/[code]/habits/[habitId]` — archive/unarchive or rename
- `GET /api/spaces/[code]/entries?month=YYYY-MM` — fetch all entries for that space/month, grouped by habit, for rendering the grid and charts
- `POST /api/spaces/[code]/entries` — `{ habitId, value }`, writes/upserts today's entry only (see rule 2 above)

## Non-functional requirements
- Mobile-friendly: the month grid needs to scroll horizontally cleanly on small screens (this will primarily be used on a tablet/phone)
- Free-tier deployable: assume hosting on Vercel with a Neon or Supabase Postgres instance; use environment variables for the DB connection string, no hardcoded secrets
- Keep the schema and API exactly as specified above — don't introduce user accounts, JWTs, or cookie-based sessions; the space code in the URL is the only access control mechanism

## Build order
1. Scaffold Next.js + Prisma + Postgres connection; run initial migration for the schema above
2. Space creation/routing (`/`, `/space/[code]`) and habit CRUD (add/archive/list)
3. Month grid UI + entries API with the today-only write rule enforced server-side
4. Progress charts (per-habit bar chart, stats, overall line chart)
5. Month navigation for viewing past months
6. Mobile layout pass + polish (empty states, loading states)

Please confirm the plan or ask clarifying questions before generating code, then implement step by step in the order above, showing me each step's output before moving to the next.
