# Resend — lead notification email

When a prospect submits the quote tool, contact form, or schedule form, Hunter receives a **minimal** email (name + timestamp + link to `/admin/leads`). Health details stay in the encrypted database.

## 1. Create a Resend account

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → **Create API Key** (Sending access)
3. Copy the key → `RESEND_API_KEY`

## 2. Choose FROM and TO addresses

### Option A — Quick test (no domain verification)

Resend’s sandbox sender only works for testing:

| Variable | Example |
|----------|---------|
| `LEAD_FROM_EMAIL` | `onboarding@resend.dev` |
| `LEAD_NOTIFICATION_EMAIL` | The **same email** you used to sign up for Resend |

`reply_to` on real leads will still be the prospect’s email so Hunter can reply from her inbox.

### Option B — Production (recommended before go-live)

1. Resend → **Domains** → **Add Domain** → `hunter-baruch.com` (or your live domain)
2. Add the DNS records Resend shows (SPF, DKIM, etc.)
3. Wait for **Verified**
4. Use a branded from address, e.g.:

```env
LEAD_FROM_EMAIL="Hunter Baruch Financial <leads@hunter-baruch.com>"
LEAD_NOTIFICATION_EMAIL="hunterbaruchfinancial@gmail.com"
```

## 3. Environment variables

Add to `.env` (local) and **Vercel → Settings → Environment Variables** (Preview + Production):

```env
RESEND_API_KEY="re_..."
LEAD_NOTIFICATION_EMAIL="hunterbaruchfinancial@gmail.com"
LEAD_FROM_EMAIL="onboarding@resend.dev"
```

Optional — force admin links in emails to your current host (useful on Vercel preview):

```env
SITE_URL="https://hunter-baruch.vercel.app"
```

If unset, emails use `VERCEL_URL` on Vercel, else `siteConfig.url`.

## 4. Verify

```bash
npm run test:resend          # check env only
npm run test:resend -- --send   # send a test email
```

Or submit a real test lead on the site and check Hunter’s inbox + Vercel logs for `[leads][ops]` email errors.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Lead saves but no email | Env vars missing on Vercel — redeploy after adding them |
| Resend 403 / domain error | Verify domain or use `onboarding@resend.dev` for testing |
| Admin link 404 in email | Set `SITE_URL` to your live or preview URL |
| Lead still saved | Email failure does not block the form — check Vercel logs |
