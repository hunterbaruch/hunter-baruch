# Compliance Checklist — Hunter Baruch Financial

Single source of truth for legal, content, technical, accessibility, analytics, and operational readiness.

**Legend**
- `[x]` = implemented in code / docs
- `[ ]` = not done yet
- ⏳ = needs Hunter, carrier, counsel, or manual verification before go-live

Jurisdiction: Georgia-licensed insurance producer (OCI). Federal: GLBA, TCPA, ADA/WCAG. Online forms may reach out-of-state visitors (CCPA-style rights).

---

## Legal & regulatory

- [x] GLBA / NAIC Insurance Data Security Model Law (#668) — technical controls in app (encryption, access control, retention, audit)
  - ⏳ Formal written information security program remains a business/policy exercise
- [x] TCPA consent for phone/text (checkbox + stored timestamp/text version)
- [x] Producer license / NPN disclosure in footer (`siteConfig.licensing`)
  - [x] Georgia License No. **3288180** and NPN **19685355** live in footer + About
  - ⏳ Confirm carrier appointment contracts require specific display format
  - ⏳ Re-verify active status in Sircon / NIPR / GA OCI lookup before launch and annually
- [x] E&O carrier disclosure in footer (`siteConfig.eoDisclaimer` + `licensing.eo`)
  - Markel American Insurance Co., Policy MKLM7PLCA00129
  - ⏳ Confirm with Markel / appointed carriers whether policy number must (or must not) appear publicly and any required lead-handling language
- [x] CCPA-style privacy rights clause in Privacy Policy
- [x] Dedicated “Do Not Sell or Share My Personal Information” page + footer link (`/do-not-sell`)
  - ⏳ Confirm with counsel whether additional CA-specific notices are needed
- [x] “Not affiliated with any government agency” disclaimer in footer
  - ⏳ Confirm wording for Hunter’s product lines (Medicare/health-adjacent)
- [x] Accurate advertising / estimate language near quote output (`siteConfig.estimateDisclaimer`)
  - ⏳ Confirm with compliance if carriers require different wording

## Content & legal pages

- [x] Privacy Policy (`/privacy-policy`) — structural placeholder
  - ⏳ Compliance advisor review before launch
- [x] Terms of Service (`/terms-of-service`) — structural placeholder
  - ⏳ Counsel review (Georgia governing law/venue)
- [x] Cookie disclosure banner + privacy cookies section
- [x] Clear “estimate only” disclaimer near quote tool output
- [x] Contact / licensing info in footer (agency name, GA license, NPN, E&O)
- [x] “About our licenses” block on homepage About section

## Technical / security

- [x] Server-side Zod validation, honeypot, IP rate limiting on `/api/leads`
- [x] Cloudflare Turnstile bot check on quote / contact / schedule forms (server-verified)
  - ⏳ Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` in Vercel (required in production)
- [x] TCPA consent checkbox + logged consent record on Lead
- [x] Field-level encryption for health-related fields (`healthClass`, `quoteSummary`, related messages)
- [x] Auth-gated lead dashboard (`/admin/leads`), audit logging, retention/purge
- [x] No health/full PII in Resend notification bodies (name + timestamp + admin link)
  - ⏳ Set `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `LEAD_FROM_EMAIL` on Vercel — see `docs/RESEND.md`
  - ⏳ Verify sending domain in Resend before go-live (or use `onboarding@resend.dev` for testing)

## Accessibility (WCAG 2.1 AA baseline)

- [x] Form labels, keyboard focus, contrast fixes, alt text, `aria-live` errors
- [x] Contrast smoke script (`npm run test:a11y`)
- [ ] Automated axe DevTools / browser pass on staging
- [ ] Manual keyboard + screen-reader pass on quote estimator
  - ⏳ Complete before launch (insurance sites are frequent ADA targets)

## Analytics & tracking

- [x] `trackEvent` sanitizer blocks name/email/phone/health keys
- [x] Cookie consent banner (dismissible, links to Privacy Policy)
  - ⏳ If GA4/Meta Pixel is added later, re-audit events and URL params for PII

## Operational

- [x] Structured `[leads][ops]` failure logging on lead API
- [x] `/api/health` endpoint for external uptime monitors (UptimeRobot, Better Stack, etc.)
  - ⏳ Wire a monitor to `GET https://<domain>/api/health` (and optionally POST smoke to leads in staging only)
- [x] Graceful client error state on forms (retry or call phone)
- [x] DB backup strategy documented (Supabase) in README
  - ⏳ Verify plan/PITR in Supabase dashboard for production
- [x] Defined lead hand-off process documented below
  - ⏳ Hunter confirms/customizes the process before launch

### Lead hand-off process (default — confirm with Hunter)

1. Prospect submits form → Lead saved in Postgres → Hunter gets Resend email (minimal PII).
2. Hunter signs in at `/admin/leads`, opens the record (audit log written), contacts prospect.
3. Consultation booked via existing schedule flow / calendar (outside this app unless CRM is added).
4. Update lead `status` in admin/DB when handled (field exists; UI status edits ⏳ optional).
5. Expired leads purged per retention policy (`npm run retention:cleanup`).

## Pre-launch checklist

- [ ] End-to-end form test: required TCPA checkbox, honeypot empty, success + failure paths
- [ ] Mobile test of quote estimator + schedule + contact forms
- [ ] Confirm SSL/HTTPS on final production domain (not only `*.vercel.app`)
- [ ] Set all production env vars on Vercel (`AUTH_SECRET`, `FIELD_ENCRYPTION_KEY`, DB, Resend, etc.)
- [x] Replace license/NPN placeholders with real values (3288180 / 19685355)
- [ ] Hunter (or compliance contact) reads Privacy Policy, Terms, TCPA consent, estimate disclaimer, gov disclaimer, E&O line
- [ ] E&O / carrier disclaimer check completed (Markel + appointed carriers)
- [ ] Confirm no product-specific annuity suitability page is required for lines currently marketed on site
- [ ] Uptime monitor pointed at `/api/health`
- [ ] Supabase backup/PITR confirmed
- [ ] Axe + manual accessibility pass on estimator

## Out of scope (by design)

- Final legal copy sign-off (counsel)
- Full SOC 2 / formal ISP document
- HIPAA covered-entity controls
- WCAG AAA
- Custom monitoring dashboards (use Vercel Logs + external uptime + optional Sentry)
