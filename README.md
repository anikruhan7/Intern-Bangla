# Intern Bangla — Frontend

Marketing site + student/staff portals for **Intern Bangla**, built with Next.js (App Router) and Tailwind CSS.

Backend API lives on the [`backend`](https://github.com/anikruhan7/Intern-Bangla/tree/backend) branch (NestJS).

## Structure

- `src/app/(site)` — public marketing pages (home, programs, student corner, company, legal, blog, contact)
- `src/app/student` — student login + dashboard
- `src/app/staff` — staff login + dashboard
- `src/components` — shared Navbar/Footer/ThemeToggle
- `src/lib` — API client, auth helpers, nav config

Most content pages are intentionally stubbed ("Coming soon") — this is a structural scaffold matching the full site map, to be filled in incrementally.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

## Deploy

Deploys to Vercel out of the box — set `NEXT_PUBLIC_API_URL` to the deployed backend URL in the Vercel project's environment variables.
