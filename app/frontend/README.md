# Frontend — React + Vite + TypeScript

This is the setup and structure guide for whoever builds the frontend. It assumes the backend
is the Spring Boot API in `app/backend/` (see that folder's entities/controllers for the source
of truth on what each endpoint returns).

## 1. Prerequisites

- Node.js (LTS) and npm
- The backend running locally on `http://localhost:8080` (see `app/backend/README` / ask David)

## 2. Scaffold the project

From `app/frontend/`:

```bash
npm create vite@latest . -- --template react-ts
npm install
```

TypeScript was chosen deliberately: the backend already returns typed, consistent JSON shapes
(`MembershipTypeResponse`, `SportResponse`, `AthleteResponse`, ...). Mirroring those as TS
interfaces means a mismatch between what the API actually sends and what a component expects
gets caught at compile time, not discovered live during the demo.

## 3. Core dependencies

```bash
npm install react-router-dom axios @tanstack/react-query
```

- **react-router-dom** — this app has ~10 distinct pages (below), so client-side routing is
  required from the start, not an afterthought.
- **axios** — HTTP client. Chosen over raw `fetch` because once login/auth exists (see §8), you
  need a single place to attach an auth header to every request — axios interceptors do this
  cleanly; wiring the same thing by hand on every `fetch` call does not scale to 13 entities'
  worth of API calls.
- **@tanstack/react-query** — handles loading/error state, caching, and refetching for you. Every
  page here is "fetch a list, fetch one record, create, update, delete" — react-query removes the
  need to hand-write `useState`/`useEffect` boilerplate for that thirteen times over.

## 4. Connecting to the Spring Boot backend (CORS)

The Vite dev server runs on `http://localhost:5173`; Spring Boot runs on `http://localhost:8080`.
Different ports means the browser treats these as different origins, so calling the API directly
will be blocked unless the backend explicitly allows it.

**For local development, don't fight CORS — proxy around it.** Add this to `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
```

With this, the frontend code always calls relative paths (`/api/athletes`), Vite forwards them to
Spring Boot behind the scenes, and the browser sees everything as same-origin. No backend changes
needed for local dev.

This only covers local development. If the app is ever deployed with the frontend and backend on
different hosts, the backend will need a real CORS configuration (a `CorsConfigurationSource`
bean) at that point — flag that to David when it becomes relevant, don't build it preemptively.

## 5. Environment variables

Create `app/frontend/.env.example` (commit this) and `app/frontend/.env` (never commit — already
covered by the repo's root `.gitignore` pattern on `*.env`):

```
VITE_API_BASE_URL=/api
```

Using `/api` (not `http://localhost:8080/api`) as the default keeps it working through the Vite
proxy above without hardcoding a host.

## 6. Folder structure

This structure is deliberately the same shape for every one of the 13 entities, so once one
entity is done, the rest are repetition, not new design decisions:

```
src/
  api/
    client.ts              # one shared axios instance (base URL, interceptors)
    membershipTypes.ts      # getAll, getById, create, update, remove for this entity
    sports.ts
    athletes.ts
    ...one file per entity
  types/
    membershipType.ts       # TS interfaces matching the backend's *Request/*Response DTOs
    sport.ts
    athlete.ts
    ...one file per entity
  pages/
    athletes/
      AthleteListPage.tsx
      AthleteDetailPage.tsx
      AthleteFormPage.tsx    # shared by create and edit
    membershipTypes/
      MembershipTypeListPage.tsx
      MembershipTypeFormPage.tsx
    ...one folder per entity that gets its own page (see §7 — not all 13 do)
  components/
    layout/                 # nav bar, page shell
    ui/                      # generic table, form field, button — shared across all entities
  routes.tsx                 # central route table
  App.tsx
```

### Example: types mirror the backend exactly

```ts
// src/types/membershipType.ts
export interface MembershipTypeResponse {
  typeId: number;
  typeName: string;
  fee: number;
  durationMonths: number;
  description: string | null;
}

export interface MembershipTypeRequest {
  typeName: string;
  fee: number;
  durationMonths: number;
  description?: string;
}
```

These field names must match the JSON the backend actually sends — copy them from the
`*Response`/`*Request` Java classes in `app/backend/.../dto/`, don't guess.

### Example: one API module per entity

```ts
// src/api/membershipTypes.ts
import { client } from "./client";
import type { MembershipTypeRequest, MembershipTypeResponse } from "../types/membershipType";

const BASE = "/membership-types";

export const membershipTypeApi = {
  getAll: () => client.get<MembershipTypeResponse[]>(BASE).then((r) => r.data),
  getById: (id: number) => client.get<MembershipTypeResponse>(`${BASE}/${id}`).then((r) => r.data),
  create: (data: MembershipTypeRequest) => client.post<MembershipTypeResponse>(BASE, data).then((r) => r.data),
  update: (id: number, data: MembershipTypeRequest) => client.put<MembershipTypeResponse>(`${BASE}/${id}`, data).then((r) => r.data),
  remove: (id: number) => client.delete(`${BASE}/${id}`),
};
```

Every entity's API module follows this exact shape — same five functions, same naming. Copy this
file, rename it, change the base path and types.

## 7. Required pages

Not every one of the 13 tables gets its own top-level page. `team_roster` and `team_competition`
are junction/weak entities in the schema — they represent relationships, not independent things a
user browses on their own. Give those a nested view inside the page they belong to instead of a
standalone page nobody would navigate to directly.

| Page | Backed by | Notes |
|---|---|---|
| Login | `app_user` | Required before anything else — routes/actions differ by role (Admin/Coach/FrontDesk per BR7). Backend auth endpoint doesn't exist yet — coordinate with whoever builds it. |
| Dashboard | reporting views (`queries/03_views.sql`) | Summary stats landing page. Lowest priority — build last. |
| Athletes (list/detail/create/edit) | `athlete` | Detail view should show the athlete's teams (via `team_roster`) and membership history. |
| Membership Types (list/create/edit) | `membership_type` | Simple admin config CRUD — already built on the backend, use as the template. |
| Memberships (list/detail/create/edit) | `membership` | Needs an athlete picker and a membership-type picker on the form. |
| Coaches (list/detail/create/edit) | `coach` | |
| Sports (list/create/edit) | `sport` | Simple admin config CRUD, same shape as Membership Types. |
| Teams (list/detail/create/edit) | `team` | Detail view nests the roster (`team_roster`) and competitions entered (`team_competition`) — this is where those two junction tables actually surface in the UI. |
| Facilities (list/create/edit) | `facility` | |
| Facility Bookings (list/create) | `facility_booking` | Needs facility + team + date/time-slot picker; this is the one FR7/NFR1 conflict-checking flow cares about, per the design doc. |
| Competitions (list/detail/create/edit) | `competition` | Detail view can also show registered teams/results (`team_competition`) as an alternate place to manage that junction data. |
| Payments (list/detail/create) | `payment` | Tied to a membership; per BR7, this is one of the screens role-gating actually matters for. |
| Users (Admin only) | `app_user` | Manage accounts/roles — gate this route behind the Admin role once auth exists. |

## 8. Build order recommendation

1. `Login` can be stubbed/deferred until the backend has an auth endpoint — don't block on it.
2. Start with **Membership Types** and **Sports** — both already fully built on the backend, both
   simple two-field forms, good for nailing the list/create/edit pattern once before repeating it.
3. Then **Athletes** — the entity everything else references.
4. Then **Memberships**, **Coaches**, **Teams**, **Facilities**, **Competitions**.
5. **Facility Bookings** and **Payments** last — both depend on multiple other entities already
   existing to pick from in their forms.
6. **Dashboard** and **Users** last — dashboard needs data to summarize, Users needs auth to gate.

Check with David before starting a page whose backend controller doesn't exist yet — right now
only `MembershipType`, `Sport`, and `Athlete` have working endpoints.
