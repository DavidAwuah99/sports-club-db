# Phase 4: Data Definition Language — Progress Report
## Sports Club Management System — CS323 Database Systems

David Acheampong Awuah, Richard Yemoh, Samira Donkoh, Ronald Ocloo

---

## 1. Purpose of this document

This is a status report on Phase 4, not a final deliverable — it records what has been built, what was decided along the way, and what is still outstanding, so the team can present accurate progress tomorrow. Phase 4's job is to turn the Phase 3 logical design into executable MariaDB DDL. That work was carried out table by table, with every design choice explained and confirmed before being written, so that it can be defended individually rather than presented as a single unreviewed block.

## 2. What changed since the Phase 3 report

Phase 3 closed with eight open decisions (D1–D8) and a set of recommendations. Phase 4 began by resolving each one explicitly rather than assuming the recommendation stood:

| # | Decision | Resolution |
|---|---|---|
| D1 | Add `APP_USER`? | **Yes.** FR10 and NFR2 have nowhere else to live. |
| D2 | `TEAM.sport` representation | **SPORT lookup table.** NFR5 requires new sports without a redesign. |
| D3 | `FACILITY_BOOKING` time model | **Fixed time slots**, 2-hour blocks from 06:00 to 22:00, enforced by `UNIQUE(facility_id, booking_date, time_slot)`. |
| D4 | Junction table keys | **Composite primary keys** — `(team_id, athlete_id)` and `(team_id, competition_id)`. |
| D5 | Delete rules | RESTRICT on financial and historical links; CASCADE reserved for the two weak entities only. See §3 — this rule was tightened during Phase 4. |
| D6 | `PAYMENT.payment_date` type | **DATETIME**, not DATE — aggregating down is trivial, recovering a lost time is not. |
| D7 | `COMPETITION.venue` | **Free text `VARCHAR(100)`**, nullable — a venue can be TBD, matching how `registration_deadline` is already handled. |
| D8 | Primary key style | **Surrogate `INT AUTO_INCREMENT`** throughout. |

## 3. A correction found during Phase 4

Cross-checking the working design document against the Phase 3 report's own ER diagram surfaced two inconsistencies that needed resolving before DDL could be trusted:

**Table count.** Both the Phase 3 report's prose and the project's working instructions stated "12 tables." The report's own Figure 1 draws 13 entities — `SPORT` (C5) and `APP_USER` (C6) are both present. The 12-table figure was stale wherever it appeared; it has been corrected to 13 to match the diagram, which is the authoritative source.

**Delete behaviour on `FACILITY_BOOKING`.** The Phase 3 report states explicitly, in two places, that CASCADE is reserved for the schema's two *weak* entities — `TEAM_ROSTER` and `TEAM_COMPETITION` — because they have no identity independent of their parents. `FACILITY_BOOKING` was initially built with `FACILITY_BOOKING → TEAM` set to CASCADE, on the reasoning that a disbanded team's bookings become meaningless. That reasoning didn't survive contact with the report: `FACILITY_BOOKING` has its own surrogate key (`booking_id`), which makes it a *strong* entity by the report's own test, and CASCADE would have silently deleted booking history along with the team. The FK was corrected to RESTRICT, consistent with `FACILITY_BOOKING → FACILITY` and every other historical/financial link in the schema. A team with existing bookings must have them explicitly reassigned or removed before it can be deleted.

Both corrections are recorded in `docs/Phase3_Logical_Design.md`, which now reflects 13 tables and the corrected delete rule.

## 4. Tables built

All thirteen tables were written one at a time, in dependency order, each reviewed and confirmed individually before being committed to `schema/02_tables.sql`:

| Order | Table | Depends on |
|---|---|---|
| 1 | `membership_type` | — |
| 2 | `sport` | — |
| 3 | `athlete` | — |
| 4 | `coach` | — |
| 5 | `facility` | — |
| 6 | `competition` | — |
| 7 | `membership` | `athlete`, `membership_type` |
| 8 | `team` | `coach`, `sport` |
| 9 | `app_user` | `coach` |
| 10 | `payment` | `membership` |
| 11 | `facility_booking` | `facility`, `team` |
| 12 | `team_roster` | `team`, `athlete` |
| 13 | `team_competition` | `team`, `competition` |

Confirmed structural counts in `schema/02_tables.sql`: **13 tables, 12 foreign keys, 8 named CHECK constraints**, plus unique constraints on every natural-key-like column (`type_name`, `sport_name`, `team_name`, `facility_name`, `coach.email`, `app_user.username`, `payment.reference_no`) and the compound `uq_facility_slot` that enforces BR5. Every table declares `ENGINE=InnoDB` and `utf8mb4`/`utf8mb4_unicode_ci`, confirmed against the actual MariaDB version bundled with the team's XAMPP install (**10.4.28**, well past the 10.2.1 threshold both CHECK enforcement and `DEFAULT CURRENT_DATE` require).

`schema/01_create_database.sql` was also written — a re-runnable drop-and-recreate script for the `sports_club` database, matching the naming already established in `.env.example`.

## 5. Business rule coverage, current status

| Rule | Mechanism | Status |
|---|---|---|
| BR1 — membership required before joining a team | BEFORE INSERT trigger | **Deferred to Phase 6b** — not expressible as a foreign key |
| BR2 — membership status always one of three values | `ENUM` + `NOT NULL` on `membership.status` | **Done** |
| BR3 — payment linked to exactly one membership | `NOT NULL` FK, `payment.membership_id` | **Done** |
| BR4 — a team has exactly one coach | `NOT NULL` FK, `team.coach_id` | **Done** |
| BR5 — no facility double-booking | `UNIQUE(facility_id, booking_date, time_slot)` | **Done** — structurally unviolatable, no trigger needed |
| BR6 — teams and competitions, many-to-many | `team_competition` junction table | **Done** |
| BR7 — only staff/admin change payment or membership status | `app_user.role` + `GRANT` privileges | **Partially done** — table and role column exist; privilege enforcement is Phase 7 |

Three of seven rules were already structural by Phase 3; Phase 4 adds a fourth (BR5) as fully enforced by the database itself, with zero application code involved.

## 6. Repository state

- Branch: `feature/phase4-ddl`, pushed to origin
- Commit: `Database and Table Creation`
- Files added: `schema/01_create_database.sql`, `schema/02_tables.sql`
- File updated: `docs/Phase3_Logical_Design.md` (D1–D8 marked resolved, D5 correction recorded, table count corrected)
- Pull request opened against `main`, pending review — no direct pushes to `main` per team convention

## 7. What's outstanding

- `schema/03_indexes.sql` — the eight planned indexes (not yet written)
- Live execution and verification — XAMPP's MariaDB service was not running on the schema lead's machine as of this report; scripts have been checked for correctness but not yet executed and are still owed the verification standard the team agreed on (proving constraints reject bad data, not just that scripts run without error)
- Phase 6b triggers — BR1 (membership before team join) and the single-active-membership rule on `MEMBERSHIP`
- Phase 7 — `GRANT` privileges completing BR7
- ER diagram update reflecting the corrected 13-table count
- Tag `v1-schema-locked` once the above is merged
