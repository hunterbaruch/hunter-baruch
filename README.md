# Hunter Baruch Financial Website

Marketing website for Hunter Baruch Financial — built with Next.js, TypeScript, and Tailwind CSS.

## Pages

- **Home** — Hero, services overview, patient advocacy highlight, testimonials preview
- **Services** — Financial planning, investments, insurance, estate planning
- **Patient Advocacy** — In-network specialists, RX cost programs, ancillary benefits, GLP-1 access, housing help
- **Testimonials** — Client stories
- **Contact** — Contact form and business details

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run admin:create-user` | Create/update an admin user for `/admin/login` |
| `npm run retention:cleanup` | Mark and purge expired lead records |
| `npm run test:security` | Smoke-test encryption + lead Zod schema |
| `npm run test:a11y` | Contrast smoke checks for key theme pairs |
| `npm run test:resend` | Check Resend env vars (`--send` to test email) |

## Operations & backups

Lead records are stored in PostgreSQL (currently Supabase when `DATABASE_URL` points there).

**Backup strategy (verify in the Supabase dashboard — do not rebuild):**
- Supabase projects include automated daily backups on paid plans; confirm the project plan and PITR settings for production.
- Before destructive schema changes, take a manual backup or snapshot.
- Retention cleanup (`npm run retention:cleanup` or `POST /api/admin/retention-cleanup`) permanently deletes expired leads — run only intentionally.

**Uptime monitoring:** Point an external monitor (UptimeRobot, Better Stack, Checkly, etc.) at:

```text
GET https://<your-domain>/api/health
```

Expect HTTP 200 and `{ "ok": true, "database": "up" }`. Alert on non-200. This probes app + DB connectivity without exposing PII.

**Bot protection:** Lead forms use honeypot + IP rate limiting (3 / 10 min) + Cloudflare Turnstile. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel. Production rejects submissions when Turnstile is not configured.

**Failure visibility:** Lead API failures log structured `[leads][ops]` errors (Vercel Logs). For paging/alerts beyond logs, add Sentry at the `reportLeadFailure` hook in `src/app/api/leads/route.ts`.

**Lead hand-off:** See the “Lead hand-off process” section in [`COMPLIANCE-CHECKLIST.md`](./COMPLIANCE-CHECKLIST.md). Default flow: Resend notify → `/admin/leads` → contact prospect → book consultation.

**Resend (new lead emails):** Full setup in [`docs/RESEND.md`](./docs/RESEND.md). Required env vars: `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `LEAD_FROM_EMAIL`.

**Compliance checklist:** [`COMPLIANCE-CHECKLIST.md`](./COMPLIANCE-CHECKLIST.md) is the full legal/content/tech/ops pre-launch list.

## Environment

Copy [`.env.example`](./.env.example) to `.env` and set database, `AUTH_SECRET`, `FIELD_ENCRYPTION_KEY`, admin credentials, and optional Resend variables. Never commit `.env`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Sign in at [vercel.com](https://vercel.com) with your GitHub account
3. Click **Add New Project** and import the repository
4. Accept the defaults (Next.js is auto-detected)
5. Add the same environment variables from `.env.example` in Vercel **Environment Variables**
6. Click **Deploy**

Vercel will assign a `*.vercel.app` URL. Add a custom domain later in project settings if needed.
