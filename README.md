# Alpenglow Retreat

A public marketing website and a staff operations dashboard for a fifteen-cabin
retreat, sharing one Postgres database, one design language and one deploy.

**Live:** https://alpenglow-retreat.vercel.app
**Repository:** https://github.com/Ma7moud-Emad/Alpenglow-Retreat

| | |
|---|---|
| **Public site** | `/` rooms, the estate, and a reservation enquiry form |
| **Staff dashboard** | `/admin` enquiries, bookings, cabins, team, reporting |

The interesting part is not the React. It is that almost no authorization lives
in the React. The browser only ever holds a Supabase anon key; row level
security, column grants and database functions decide what anyone can read or
write. An anonymous visitor reads 15 published cabins and one settings row, and
sees 0 bookings, 0 guests and 0 enquiries.

---

## Contents

- [Quick start](#quick-start)
- [Environment](#environment)
- [Architecture](#architecture)
- [The public site](#the-public-site)
- [The staff dashboard](#the-staff-dashboard)
- [Security model](#security-model)
- [Database](#database)
- [Business rules](#business-rules)
- [Design system](#design-system)
- [SEO, accessibility and performance](#seo-accessibility-and-performance)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Known gaps](#known-gaps)
- [Open security items](#open-security-items)
- [Tech stack](#tech-stack)
- [Licence and attribution](#licence-and-attribution)

---

## Quick start

```bash
git clone https://github.com/Ma7moud-Emad/Alpenglow-Retreat.git
cd Alpenglow-Retreat
npm install
cp .env.example .env.local
npm run dev
```

Then fill in `.env.local` and open http://localhost:5173.

Verified on Node 24.18 and npm 11.16. `package-lock.json` is lockfileVersion 3,
so npm 7 or newer is required. There is no `engines` field and no `.nvmrc`;
Vite 6 and ESLint 9 set the real floor at Node 18.

> `npm install` pulls `sharp`, which resolves a platform-specific binary. Do not
> install with `--omit=optional`, or `npm run images` will fail.

### Seeing the dashboard

There is a chicken-and-egg problem worth knowing about before you try. Signup is
not exposed in the UI: accounts are created from **Team** by an existing admin.
To promote the first one by hand you need SQL access to the Supabase project:

```sql
update public.staff set role = 'admin' where email = 'you@example.com';
```

`src/lib/demoAccounts.js` exists to offer public demo logins on the home page,
but ships with an empty array, so the dialog does not render. Populate it only
with seed accounts. Whatever you put there is readable by anyone, because it
ends up in the JavaScript bundle.

---

## Environment

`.env.local` takes two required values and one optional one:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon / publishable key>
# VITE_SITE_URL=https://alpenglow-retreat.vercel.app
```

`VITE_SITE_URL` feeds canonical links, Open Graph URLs, JSON-LD and the
generated sitemap. Leave it unset and everything points at the production
deployment, which is wrong on any other domain.

The anon key is public by design and safe to ship. RLS is what protects the
data. **Never put the `service_role` key in an env file.** Vite inlines every
`VITE_` variable into a file any visitor can read.

Both variables are needed at **build** time as well as runtime, because
`npm run build` runs the sitemap generator first and it queries the REST API.

---

## Architecture

```
src/
├── lib/          supabase client, seo constants, image set, Intl formatting, toast
├── services/     one module per resource; every Supabase call lives here
├── hooks/        React Query hooks plus URL, theme, debounce and focus-trap helpers
├── context/      auth session and theme providers
├── ui/           dashboard primitives (Button, Table, Modal, PageMeta, …)
├── layout/       dashboard shell: sidebar, topbar, route guard
├── features/     dashboard feature composition, 13 files across 6 domains
├── pages/        one component per dashboard route
├── site/         the public marketing site
│   ├── ui/         its own primitives and design language
│   └── pages/      home, rooms, room detail, the retreat, contact
├── styles/       brand palette and global styles
└── assets/       photo masters, plus generated/ for the shipped image set
scripts/          image pipeline and sitemap generator
```

**Data flow:** page → hook → service → Supabase. Components never call Supabase
directly, and services never import React. 96 source files, about 11,700 lines.

Everything except `SiteLayout` and the home page is `React.lazy` code-split, so
a visitor on the marketing site never downloads Recharts.

---

## The public site

Five routes, all nested under a pathless layout route:

| Route | Page |
|---|---|
| `/` | Home |
| `/rooms` | Rooms index |
| `/rooms/:slug` | Room detail |
| `/experience` | The retreat |
| `/contact` | Contact and enquiry |

**Home** opens on a full-bleed hero, then the estate's story with three stat
figures, what makes it different, three featured rooms, a dark-sky section,
estate amenities, guest quotes and a closing call to action.

**Rooms** lists all fifteen with six filter chips (party size, hot tub,
fireplace) and four sort options. Filters are client-side over a single fetch.

**Room detail** carries the full description, specs, amenities and a sticky
enquiry panel that follows you down the page.

**The retreat** is the estate's history as a timeline, a season-by-season guide,
and the practical details.

**Contact** has the enquiry form, direct contact details, a hand-drawn SVG map
(no third-party embed, no cookie banner) and an FAQ.

The header is transparent over the home hero and turns into an opaque blurred
bar past 40px of scroll or on any other page. Its staff link reads "Staff login"
when signed out and "Dashboard" when signed in. Below 900px it collapses into a
full-screen drawer that traps focus and closes on Escape.

### The enquiry pipeline

```
visitor fills the form
   └─> reservation_requests  (anon INSERT only, no SELECT)
         └─> /admin/requests  (staff triage: contact, decline, or…)
               └─> hotel_convert_request()
                     ├─ checks availability and the hotel's settings
                     ├─ reuses the guest record if the email is known
                     ├─ prices the stay
                     └─> a real booking
```

The insert deliberately does not chain `.select()`, because the anon role has
insert-but-not-read on that table and asking for the row back would be rejected.

The form reads the minimum stay and party limits from the hotel's own settings
row, so changing them in the dashboard changes the public form.

---

## The staff dashboard

Nine routes behind `ProtectedRoute`, plus five legacy top-level URLs that
redirect into `/admin`.

### Dashboard `/admin/dashboard`
Four KPI tiles (Bookings, Sales, Check-ins, Occupancy) over 7, 30 or 90 days,
today's arrivals and departures with inline actions, a gap-filled sales area
chart with a totals and extras series, and a stay-length donut with five
buckets. Four Postgres RPCs do the aggregation; the client does no maths.

### Enquiries `/admin/requests`
Triage inbox with a live unread badge in the sidebar, polled every five minutes.
Four statuses. The review modal offers contact, decline, delete and convert;
converting calls `hotel_convert_request` and does the whole thing in one
transaction.

### Bookings `/admin/bookings`
Server-paginated at 12 rows per page, four status chips, seven whitelisted sort
options and a debounced guest search. Search swaps the guests join to
`guests!inner` so the parent can be filtered by guest columns without silently
dropping rows the rest of the time. Every filter lives in the URL, so any view
can be bookmarked or shared.

### Check-in `/admin/checkin/:bookingId`
Adds breakfast at `breakfastPrice × nights × guests` and requires an explicit
payment attestation before the button enables. Check-in and check-out are
database functions, not client-side status writes.

### Cabins `/admin/cabins`
Create, edit, duplicate and delete with photo upload. Uploads are stored under a
random UUID, roll back if the row insert fails, and duplicating copies the photo
to a new storage object so the two can be deleted independently. Deleting a
cabin with bookings is refused by a foreign key and translated into plain
English.

### Team `/admin/team` (admin only)
Add, remove and re-role staff. You cannot change or remove yourself, and the
last remaining admin cannot be demoted. Create, delete and setRole proxy to the
`staff-admin` edge function, because they need `service_role`.

### Settings `/admin/settings`
Booking length limits, party size and breakfast rate. Readable by all staff,
writable by admins only. A singleton row, and the public enquiry form reads it.

### Account `/admin/account`
Avatar upload (image only, under 2 MB), display name, and a password change that
re-authenticates first, because Supabase's `updateUser` does not verify the
current password. Reachable from the topbar menu only; there is no sidebar link.

### Roles

Two roles. Any signed-in user with a `public.staff` row is staff; `role = admin`
additionally unlocks the Team page, Settings writes and all four delete actions.
Seven places in the UI gate on `isAdmin`. Cabin edit and duplicate are open to
all staff, so a non-admin can change prices.

### Theming

Three-way light / dark / system, defaulting to system, persisted under
`hotel:theme`. System mode stays live: a `matchMedia` listener re-themes the
open dashboard without a reload. The public site is deliberately light-only, so
a marketing page never inherits a staff member's dark mode.

---

## Security model

| Layer | Enforcement |
|---|---|
| Browser | anon key only, from `VITE_` env vars |
| Public read | published cabins and the settings row, nothing else |
| Public write | enquiries only, insert-only, never readable back |
| Dashboard | every table requires a `public.staff` profile |
| Roles | `staff` for daily work, `admin` for settings, team, deletes |
| Privileged ops | `staff-admin` edge function holds `service_role` server-side |
| Money and state | check-in/out and booking creation are database functions |

### What was actually verified

The anonymous surface was probed live against the REST API with the anon key.
Reads only; no row was created, changed or deleted.

- Anon sees 15 cabins, 1 settings row, and 0 rows in `bookings`, `guests`,
  `staff` and `reservation_requests`.
- All 15 visible cabins have `is_published = true`; zero rows match `false`.
- Anon cannot update `cabins` or `settings` even though it can read them.
- Blocked tables return `200` with an empty array rather than `403`, which means
  table-level grants to `anon` are present and RLS row filtering, not privilege
  revocation, is what hides the data.

Nothing about authenticated staff was verified, because there are no working
credentials in this repository. Policy text is unreadable with the anon key.
Everything in the table above about the dashboard is taken from the service code
and the migration names, not from the database.

---

## Database

One hosted Supabase project. Six tables, eleven database functions (eight called
from the app), two storage buckets and one edge function.

| Table | Columns | Notes |
|---|---|---|
| `cabins` | 18 | Rooms plus their marketing content: slug, tagline, amenities, gallery, `is_published`, `sort_order`, rating |
| `bookings` | 16 | Stay dates, party size, prices, status, `hasBreakfast`, `isPaid` |
| `reservation_requests` | 15 | Public enquiries, with `handled_by` / `handled_at` stamped by a trigger |
| `guests` | 8 | Created as a side effect of booking creation |
| `staff` | 7 | The profile RLS keys off; `id` is the auth user uuid |
| `settings` | 7 | Singleton row, id 1 |

Four foreign-key embeds are live in PostgREST: bookings→cabins, bookings→guests,
requests→cabins, requests→staff.

### Database functions

| Function | Purpose |
|---|---|
| `hotel_dashboard_stats(from, to)` | bookings, total_sales, extras_sales, check_ins, occupancy_rate |
| `hotel_sales_series(from, to)` | one gap-filled row per calendar day |
| `hotel_stay_duration(from, to)` | five fixed stay-length buckets |
| `hotel_today_activity()` | today's arrivals and departures |
| `hotel_create_booking(…11 params)` | the only RPC with an explicit staff guard |
| `hotel_convert_request(request, cabin, breakfast)` | enquiry to booking, in one transaction |
| `hotel_check_in_booking(booking, add_breakfast)` | check-in |
| `hotel_check_out_booking(booking)` | check-out |
| `room_is_available(…)` | helper, not called from the app |
| `is_staff()`, `is_admin()` | policy helpers |

### Storage

`cabins-images` and `avatars`, both public. Cabin images use a random UUID
filename; avatars are namespaced `<userId>/<timestamp>.<ext>` to match storage
RLS.

### Migrations

| Migration | What it does |
|---|---|
| `hotel_schema_hardening` | Repairs corrupt stay dates, widens undersized numeric columns, adds NOT NULLs, CHECK constraints, FK indexes, `updated_at` triggers |
| `hotel_staff_profiles_and_roles` | `public.staff`, signup trigger, `is_staff()` / `is_admin()` |
| `hotel_row_level_security` | RLS and policies on every table and both storage buckets |
| `hotel_dashboard_functions` | Stats, sales series, stay-duration buckets, today's activity |
| `hotel_check_in_out_functions` | `hotel_check_in_booking`, `hotel_check_out_booking` |
| `hotel_staff_guard_service_role_bypass` | Lets server-side callers manage roles |
| `alpenglow_marketing_schema` | Slugs, taglines, amenities, bed types, sizes, publish flag, public read policy |
| `alpenglow_room_content` | Per-room marketing copy for all fifteen rooms |
| `alpenglow_reservation_requests` | Enquiry table, insert-only for the public |
| `alpenglow_booking_creation` | `room_is_available`, `hotel_create_booking`, `hotel_convert_request` |
| `alpenglow_resync_id_sequences` | Fixes identity sequences left behind by the seed data |
| `alpenglow_public_settings_read` | Lets the enquiry form read the stay rules |

> **These migrations are not in this repository.** They were applied directly to
> the hosted project and exist here only as names. There is no `supabase/`
> directory, no `.sql` files, no seed data and no source for the `staff-admin`
> edge function. Pointing this app at a *fresh* Supabase project is therefore not
> a supported path today: you would have to rebuild the schema, the eleven
> functions, every policy, both buckets, the edge function and the fifteen seeded
> cabins by hand.

### Naming quirks that are load-bearing

- `cabins`, `bookings`, `guests` and `settings` use quoted camelCase columns
  (`"startDate"`, `"maxCapacity"`, `"fullName"`). `staff` and
  `reservation_requests` use snake_case. The camelCase ones must be
  double-quoted in select strings.
- `settings.maxGuestsPreBookings` is a real typo in the schema. Do not fix it in
  the client alone.
- `bookings.startDate` is `timestamp without time zone`;
  `reservation_requests.start_date` is `date`. `hotel_convert_request` bridges
  the two.

---

## Business rules

**Pricing.** `cabin charge = (regularPrice − discount) × nights`, with breakfast
added at check-in as `breakfastPrice × nights × guests`. The seeded rows follow
no consistent formula; this establishes one going forward and leaves history
alone.

**Occupancy** is true occupancy: booked cabin-nights divided by available
cabin-nights, not a count of bookings.

**Reporting basis** is deliberately mixed, matching standard hotel reporting:

- Bookings and sales, by booking creation date
- Check-ins, by stay start date
- Occupancy, by stay overlap with the reporting window

---

## Design system

`styles/GlobalStyles.js` holds the palette (`--pine-*`, `--ember-*`, `--sand-*`)
once. Two independent semantic layers sit on top:

- **Dashboard** (`--surface`, `--text`, `--accent`) switches with `data-theme`
- **Site** (`--site-*`, declared in `site/ui/primitives.js`) is fixed and light

### The accent split

The brand ember is 3.31:1 on the sand background. That passes WCAG AA for a 48px
display italic (large text needs 3:1) and fails for an 11px eyebrow (small text
needs 4.5:1). Rather than dim the brand everywhere, the token is split by job:

| Token | Value | Job |
|---|---|---|
| `--site-accent` | ember-700 | Text at any size. 6.2:1 on sand |
| `--site-accent-bright` | ember-500 | Large display type and non-text marks |
| `--site-accent-solid` | ember-600 | Fills. White on top is 4.64:1 |

Dark sections rebind `--site-accent` to ember-300, because ember-700 drops to
2.8:1 on pine. The token name inside a component never changes; the value
changes with the surface.

The dashboard has the same idea in `--accent-contrast` and `--danger-contrast`:
what to write on top of a fill, rather than a hard-coded `#fff` that becomes
unreadable when the fill goes light in dark mode.

`siteTokens` is exported separately from `SiteRoot` so anything portalled to
`document.body` can still resolve `--site-*`.

---

## SEO, accessibility and performance

### SEO

`src/ui/PageMeta.jsx` sets 12 meta tags plus a canonical link per route, and
updates the tags already in the document rather than appending duplicates.
`index.html` carries a complete home-page set (9 `og:*`, 4 `twitter:*`) as the
static fallback.

JSON-LD: `Resort` on the home page, `HotelRoom` plus `Offer` with the nightly
price on each room, `BreadcrumbList` elsewhere. `/signin`, `/reset-password` and
the whole `/admin` subtree send `noindex`.

`public/sitemap.xml` is generated at build time from the live cabins table, 19
URLs of which 15 are rooms, so it cannot go stale when a cabin is unpublished.

> **Known limitation.** This is a client-rendered SPA. Google runs JavaScript and
> sees the per-route tags. Facebook, LinkedIn, WhatsApp and X do not, and fall
> back to whatever is in `index.html`. That is why `index.html` carries real
> home-page values rather than placeholders. The real fix is prerendering.

### Accessibility

Target is WCAG 2.1 AA. Measured with axe-core in a real browser across six
public routes: **12 violation groups over 173 elements, down to zero.**

What that pass changed:

- The accent split above, and `--text-muted` in both dashboard themes
- `--accent-contrast` / `--danger-contrast`, fixing a 2.33:1 primary button in
  dark mode in both `Button` and `SegmentedControl`
- Both navigation drawers claimed `aria-modal="true"` and enforced none of it.
  `useFocusTrap` now traps Tab, closes on Escape and returns focus to whatever
  opened the drawer
- Three pages had no `h1`, and headings jumped from `h1` to `h3`

Already in place: skip links in both layouts, a single `:focus-visible`
treatment, a `prefers-reduced-motion` block, an `.sr-only` utility,
`aria-pressed` filter chips and `role="alert"` form errors.

Not done: the dashboard routes were never audited with axe, because that needs a
login. There is no `eslint-plugin-jsx-a11y` and no axe or Lighthouse step in CI.

### Performance

The hero was a single 2560x1600 JPEG at 616 kB set as a CSS `background-image`,
which the preload scanner cannot see and which every device downloaded whole. It
is now a real `<picture>` with WebP and a responsive `srcset`:

| Viewport | Before | After |
|---|---|---|
| Mobile | 616 kB | 22 kB |
| Laptop | 616 kB | 90 kB |
| Large | 616 kB | 117 kB |

`npm run images` regenerates the whole set from the masters in `src/assets` with
sharp. The output in `src/assets/generated/` is committed, so a deploy does not
need to run sharp.

Bundles are split so the marketing site never loads the charting library:
`react`, `charts`, `supabase` and `forms` are separate chunks.

---

## Scripts

```bash
npm run dev       # vite dev server on :5173
npm run build     # regenerates the sitemap, then vite build
npm run preview   # serve the build
npm run lint      # eslint over **/*.{js,jsx}
npm run images    # regenerate src/assets/generated from the masters
npm run sitemap   # regenerate public/sitemap.xml from the live cabins table
```

`npm run images` only needs re-running when `src/assets/loginBg.jpg` or
`bg.jpg` change. Commit what it produces.

`npm run build` rewrites `public/sitemap.xml`, so a routine build dirties the
working tree. If Supabase cannot be reached the generator warns, keeps the
existing file and exits 0, so a stale sitemap can ship quietly.

`npm run lint` covers `js` and `jsx` only. `scripts/*.mjs` is unchecked.

---

## Deployment

Vercel, with `vercel.json` providing the SPA history fallback. Any other host
needs its own equivalent.

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Project Settings →
   Environment Variables. The build needs them, not just the runtime.
2. Set `VITE_SITE_URL` for any domain other than the default. `public/robots.txt`
   hardcodes the sitemap host, so edit it too.
3. Build command `npm run build`, output directory `dist`.
4. Add the repository secret `SUPABASE_ANON_KEY` for
   `.github/workflows/keep-alive.yml`, which pings the REST API every 15 minutes
   to stop the free-tier project pausing after about a week of inactivity.

Supabase Auth also needs configuring for password reset to work at all:
register the deployed origin under Authentication → URL Configuration →
Redirect URLs, and set up SMTP. The built-in SMTP is rate-limited and not for
production.

---

## Known gaps

- **No automated tests.** Zero test files, no runner, no CI that builds or
  lints. `npm run lint` is the only mechanical gate. Flows with no safety net:
  enquiry submit, sign-in, enquiry to booking conversion, check-in and
  check-out, cabin photo upload, duplicate and delete, and the admin gates.
- **Cabins created in the dashboard never reach the public site.** `CabinForm`
  writes six fields. Nothing in the UI writes `slug`, `tagline`, `amenities`,
  `bed_type`, `size_sqm`, `gallery`, `is_published`, `sort_order` or `rating`,
  so a new cabin has no slug, is not published, and is invisible to `/rooms` and
  to the sitemap. All marketing content is edited in Supabase directly.
- **Photography** is placeholder imagery from the original project and does not
  match the pine-and-meadow story the copy tells.
- **30 pairs of overlapping stays** exist in the seed data. New bookings are
  blocked from overlapping by `hotel_create_booking`, but a database-level
  `EXCLUDE` constraint cannot be added until the existing rows are cleaned up.
- **No captcha or rate limit** on the public enquiry form. Every field is
  range-checked in the database, but volume is not.
- **No payments.** The check-in checkbox is an attestation; payment is taken at
  the property.
- **No email to anyone.** Submitting an enquiry inserts a row. Nothing notifies
  the guest or staff beyond the sidebar badge.
- **No analytics, no error monitoring, no PWA.**
- **`guests` has no CRUD path.** `src/services/guests.js` is unused. Guest rows
  are created as a side effect of booking creation and cannot be corrected from
  the app. Likewise `bookings.isPaid` is displayed but never written, and
  `reservation_requests.staff_notes` is selected but never rendered.
- **Locale and currency are hardcoded** to `en-US` and USD in
  `src/lib/format.js`.
- **Browser floor is roughly Chrome 108, Safari 16.4, Firefox 121.** No
  browserslist, no polyfills. `crypto.randomUUID` and `navigator.clipboard` both
  need a secure context, so cabin photo upload and the demo dialog's copy button
  fail silently over plain `http://` on a LAN IP.
- **Chart colours are hardcoded** in `features/dashboard/chartTheme.js` and have
  no relationship to the brand tokens, because Recharts writes colours as SVG
  presentation attributes where `var(--token)` does not resolve.

---

## Open security items

Findings from probing the live project. None are exploited here, and the first
one is the one that matters.

1. **Signup may not actually be closed.** `GET /auth/v1/settings` reports
   `disable_signup: false` and `mailer_autoconfirm: true`. Combined with the
   signup trigger that creates a `public.staff` row, that could let a stranger
   self-register as staff. The trigger body could not be read with an anon key,
   so the impact is unverified. **Audit this before trusting the deployment.**
2. **An earlier revision shipped the `service_role` key in the browser bundle.**
   It is gone from the code, but treat it as compromised and roll it: Supabase →
   Project Settings → API → Legacy API keys, then redeploy the `staff-admin`
   edge function. Nothing in this app needs that key in the browser.
3. **The four dashboard RPCs are not role-gated.** Anyone may execute them; they
   return zeros only because RLS hides the rows they read, which means they run
   `SECURITY INVOKER`. If any of them were ever switched to `SECURITY DEFINER`,
   the numbers would leak publicly.
4. **`room_is_available` is anon-callable** and returns real answers, so the
   occupancy calendar is probeable.
5. **Both storage buckets are anonymously listable**, so staff avatar filenames
   are discoverable even though the paths are namespaced by user id.

---

## Tech stack

| Category | Tool |
|---|---|
| Build | Vite 6 |
| UI | React 19, styled-components 6 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Forms | React Hook Form |
| Charts | Recharts |
| Images | sharp (build time only) |
| Type | Fraunces (display) and Inter (body) |
| Backend | Supabase: Postgres, Auth, Storage, Edge Functions |

---

## Licence and attribution

No licence file is present, so default copyright applies and no reuse rights are
granted. Add a LICENSE before treating this as open source.

Third-party assets in use: Fraunces and Inter (SIL Open Font License, via Google
Fonts), Heroicons through `react-icons/hi2` (MIT). The two photo masters in
`src/assets` are placeholders carried over from the original project and their
provenance is not documented; replace them before any commercial use.
