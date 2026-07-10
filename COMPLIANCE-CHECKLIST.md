# Compliance Checklist — Hunter Baruch Financial

Structural checklist for legal content, disclosures, accessibility, and operational hardening.
**Not final legal advice** — items marked ⏳ need Hunter / compliance advisor input before launch.

Jurisdiction: Georgia-licensed insurance producer (OCI). Federal: GLBA, TCPA, ADA/WCAG.

---

## 1. Footer disclosures

- [x] Agency/producer name + Georgia license number and/or NPN
  - ⏳ Hunter must supply actual license / NPN values (`siteConfig.licensing` placeholders)
- [x] Non-affiliation with any government agency (Medicare/health marketing standard)
  - ⏳ Confirm wording applies to her product lines (`siteConfig.governmentDisclaimer`)
- [x] Links to Privacy Policy and Terms of Service

## 2. Legal pages

- [x] `/privacy-policy` — collection, use, sharing, retention, deletion, contact, CCPA-style clause
  - ⏳ Placeholder pending compliance review
- [x] `/terms-of-service` — usage, no rate/coverage guarantee, liability limit, Georgia governing law
  - ⏳ Placeholder pending compliance review

## 3. Quote estimator disclaimers

- [x] Visible estimate disclaimer (not a final quote / offer / guarantee of insurability)
- [x] TCPA consent present on every form that collects phone (Quote Wizard + Schedule)

## 4. Accessibility (WCAG 2.1 AA baseline)

- [x] All form inputs have associated `<label>`s
- [x] Keyboard navigation through estimator (tab order, visible `:focus-visible`, `aria-pressed` on option buttons)
- [x] Color contrast fixes (footer text, warning token, estimate panel); `npm run test:a11y`
- [x] Meaningful `alt` on informative images; empty `alt=""` on decorative hero media
- [x] Validation errors announced (`role="alert"` / `aria-live` via `FormFeedback`)
- [ ] Automated axe-core browser pass + full manual screen-reader pass on estimator
  - ⏳ Run axe DevTools / VoiceOver-NVDA against staging before launch

## 5. Analytics / tracking safety

- [x] No PII in analytics event params (`trackEvent` sanitizer; testimonial uses id not name)
- [x] Cookie consent banner (dismissible, links to privacy policy)

## 6. Operational hardening

- [x] Visible failure path on lead API (`[leads][ops]` structured logs; Sentry hook noted)
- [x] Graceful client error state on estimator/forms (retry or call phone)
- [x] Document DB backup strategy (Supabase) in README

## Out of scope

- Final legal copy sign-off
- WCAG AAA
- Custom monitoring dashboards
