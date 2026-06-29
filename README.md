# ShieldDrive Insurance

A production-ready auto insurance lead generation landing page built as a take-home assignment for Big Drops Marketing Group.

**Live Demo:** https://shielddrive.vercel.app

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Deployment | Vercel |

---

## Features

- Cascading vehicle dropdowns — Year → Make → Model backed by real DB queries
- Client-side and server-side form validation
- Lead data stored in PostgreSQL
- Skeleton loaders on dropdowns (CLS = 0)
- Fully responsive, mobile-first layout
- SEO metadata, Open Graph tags, robots.txt, sitemap

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/shielddrive.git
cd shielddrive
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Add your Neon database URL to `.env`:

```env
DATABASE_URL="postgresql://user:password@ep-something.neon.tech/neondb?sslmode=require"
```

### 4. Set up the database

```bash
npx prisma db push
npx prisma generate
```

### 5. Seed vehicle data

```bash
npx prisma db seed
```

This loads 422 vehicle combinations (2011–2024) from `prisma/vehicles.json`.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Vehicle Seed Data

Seed data was generated using Claude AI with this prompt:

> "Give me a realistic JSON list of US vehicles from 2011–2024, covering 15–20 common makes with several models per make per year. Return as a JSON array with year, make, model fields."

Raw data is in `prisma/vehicles.json` — 422 combinations across 14 years and 18 makes.

To re-run:
```bash
npx prisma db seed
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/vehicles/years` | All available years |
| GET | `/api/vehicles/makes?year=2022` | Makes for a given year |
| GET | `/api/vehicles/models?year=2022&make=Toyota` | Models for year + make |
| POST | `/api/leads` | Validate and store a lead |

---

## Lighthouse Scores (Mobile, Production Build)

| Metric | Score |
|--------|-------|
| Performance | 98 |
| Accessibility | 92 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.9s |
| LCP | 1.3s |
| CLS | 0 |
| TBT | 140ms |

Tested on localhost production build (`npm run build && npm start`).

---

## Trade-offs & Decisions

**Prisma over raw SQL** — Type-safe queries and easy migrations made sense for this project size. Auto-complete on model fields catches errors at compile time, not runtime.

**Server-side vehicle validation** — The API re-checks that the submitted year/make/model combination actually exists in the database. Client-side validation can be bypassed with tools like Postman, so server validation is non-negotiable.

**Cascade via API, not frontend state** — Make and model options are fetched fresh from the DB on each selection rather than loading all 422 vehicles upfront. This keeps the initial bundle small and the dropdowns always in sync with the database.

**Skeleton loaders on dropdowns** — Prevents layout shift (CLS) when async data loads in. A fixed-height placeholder div reserves the space so the page doesn't jump when options appear. This is why CLS is 0.

**`createMany` + `skipDuplicates` in seed** — Makes the seed script idempotent. Safe to re-run without throwing duplicate key errors.

**What I'd improve with more time:**
- Expand vehicle data to the full NHTSA dataset (~50k+ combinations)
- Add email notifications via Resend when a new lead comes in
- Build a simple admin dashboard to view and export leads
- Add debouncing on vehicle API calls to avoid rapid re-fetches
- Write unit tests for the API validation layer

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |

See `.env.example` for the format.
