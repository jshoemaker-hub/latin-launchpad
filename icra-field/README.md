# ICRA Field

A field-first web app (installable on a phone) for documenting **ICRA** (infection control risk
assessment) and **ILSM** (interim life safety measures) compliance on healthcare construction jobs.

Built as a working prototype to get feedback from people who do this work. The research behind the
design is in [`docs/research-report.md`](docs/research-report.md). The look, the daily barrier
check, the hospital view, and utility shutdowns follow a field superintendent's clickable mockup
([`docs/field-mockup.html`](docs/field-mockup.html)).

## What it does

- **Projects → zones → permits.** Each work zone gets an ICRA permit. The class (I–V) comes from a
  per-project matrix (activity type × patient risk group, with sewage/mold overrides) that the team
  can edit to match the hospital's adopted permit.
- **Approvals.** Class III+ permits need Infection Preventionist and Facilities signatures; ILSM adds
  the Safety Officer. A signer can **request changes** instead; the superintendent resubmits. Daily
  checks can't start until the permit is approved.
- **Daily barrier check** per permit, built to be fast in the field: a pressure stepper (− / + with a
  live "in range / out of range" readout and a required gauge photo) at each opening, then
  tap-to-check rows for the containment items. Rows that need a photo open the camera. Anything
  left unchecked can be submitted as a deficiency with a note. Out-of-range readings go straight to
  infection prevention and facilities. Negative air and daily pressure readings start at Class III.
- **Sign and submit → co-sign.** The person who checked signs; a different person (foreman,
  superintendent, or hospital staff) co-signs. Supervisors can send items back for rework.
- **Hospital dashboard** (Today, when signed in as Infection Preventionist, Facilities, or Safety):
  active permits and contractors, checks logged vs due, out-of-range readings, a sign-off queue with
  Approve / Request changes, a table of every active permit, and a printable **weekly compliance
  report**.
- **Utility shutdowns** (medical gas, fire alarm, sprinkler, electrical, HVAC, water): request →
  hospital approval → out of service → restored, with a clock that flags when a fire watch is
  required (alarm out > 4 h, sprinklers > 10 h in 24 h).
- **Anyone can uncheck** an item that's no longer compliant. The earlier check stays in history, an
  issue opens, and the checklist goes back for rework. Issues close only after the fix is co-signed.
- **Missed days** are flagged on Today and on each permit.
- **Closeout** is a fixed, ordered sequence where each step is signed by the right role (contractor
  clean → IP inspection → EVS terminal clean → IP release → engineering release → HVAC restored →
  barriers removed → returned to service).
- **Audit trail.** Every action is an append-only event, fingerprinted (SHA-256) and chained per
  device. "Verify integrity" on the Log tab detects edited or removed entries. Photos are hashed at
  capture.
- **PDF packet** per permit (Permit → PDF → Print / Save as PDF) with signatures, readings, photos,
  issues, and the audit trail.
- **Offline.** Work recorded with no signal is queued on the phone and syncs when it reconnects.

## Two modes

| Mode | When | Data |
|---|---|---|
| **Demo** | No Supabase keys set, or "Try the demo" on the sign-in screen | Stays in that browser. Comes with a sample hospital project. Switch roles from the menu at top right. |
| **Live** | Supabase keys set | Shared by the team in real time. Email sign-in links. |

The demo is the fastest way to get feedback: send the Netlify link and ask the tester to switch
between Worker, Foreman, Infection Preventionist, and so on.

## Setup

### 1. Run locally (optional)

```bash
npm install
npm run dev      # http://localhost:5173 (demo mode)
npm test         # rules tests
```

### 2. Supabase (for live mode)

1. Create a project at [supabase.com](https://supabase.com) (the free tier is fine).
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Authentication → URL Configuration**: set **Site URL** to your Netlify address
   (e.g. `https://icra-field.netlify.app`) and add the same under **Redirect URLs**.
4. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

### 3. Netlify

1. **Add new site → Import an existing project →** pick this GitHub repo. Netlify reads
   `netlify.toml`, so the build settings fill in automatically.
2. **Site configuration → Environment variables**: add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` with the values from Supabase, then **Deploys → Trigger deploy**.

Skip step 2 to deploy in demo-only mode first.

### 4. Add people

Sign in, create a project (you become its superintendent), then **Team → Add someone** with their
email and role. They sign in with that email and see the project.

## Important limits of this prototype

- The ICRA matrix, checklist wording, and ILSM measures are **draft starting points** compiled from
  search excerpts of ASHE, CDC, Joint Commission, and hospital forms. Verify against the owner's
  current permit and policy before relying on them.
- Not yet built: fire watch round logging, hot work and above-ceiling permits, firestop
  penetration logs, worker training roster, voice notes, pressure-monitor data import.
- Photos taken in hospitals can capture patients. Keep cameras pointed at the work.

## Code map

- `src/domain/` — rules engine (pure TypeScript, unit tested): event types, templates, reducer, hashing
- `src/data/` — storage: demo (IndexedDB) and Supabase (with offline outbox), photo processing, demo seed
- `src/pages/`, `src/components/` — screens
- `supabase/schema.sql` — tables, row-level security, append-only trigger, storage bucket
