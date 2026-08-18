# Resend — lead emails

When a prospect submits the quote tool, contact form, or schedule form, two emails go out:

1. **Admin alert** to `LEAD_NOTIFICATION_EMAIL` (name, topic, reference, admin link). Health details stay in the encrypted database.
2. **Confirmation** to the prospect (reference ID, follow-up timing, phone). No health answers or premium estimates.

Email failure does not block the form. The lead is still saved.

## 1. Create a Resend account

1. Sign up at [resend.com](https://resend.com) with `rdhunter@hunter-baruch.com` (or add that inbox later)
2. Go to **API Keys** → **Create API Key** (Sending access)
3. Copy the key → `RESEND_API_KEY`

## 2. Choose FROM and TO addresses

### Option A — Quick test (no domain verification)

Resend’s sandbox sender only works for testing, and **can only send to the email on the Resend account**:

| Variable | Example |
|----------|---------|
| `LEAD_FROM_EMAIL` | `Hunter Baruch Financial <onboarding@resend.dev>` |
| `LEAD_NOTIFICATION_EMAIL` | `rdhunter@hunter-baruch.com` (must match the Resend login email for sandbox) |

Prospect confirmations will not deliver to arbitrary customer inboxes until the domain is verified.

### Option B — Production (required for real customer confirmations)

1. Resend → **Domains** → **Add Domain** → `hunter-baruch.com`
2. Add the DNS records Resend shows (SPF, DKIM, etc.)
3. Wait for **Verified**
4. Use a branded from address:

```env
LEAD_FROM_EMAIL="Hunter Baruch Financial <rdhunter@hunter-baruch.com>"
LEAD_NOTIFICATION_EMAIL="rdhunter@hunter-baruch.com"
```

`reply_to` on the admin alert is the prospect’s email. `reply_to` on the confirmation is `rdhunter@hunter-baruch.com`.

## 3. Environment variables

Add to `.env` / `.env.local` (local) and **Vercel → Settings → Environment Variables** (Preview + Production):

```env
RESEND_API_KEY="re_..."
LEAD_NOTIFICATION_EMAIL="rdhunter@hunter-baruch.com"
LEAD_FROM_EMAIL="Hunter Baruch Financial <onboarding@resend.dev>"
```

After the domain is verified, change `LEAD_FROM_EMAIL` to the branded address above and redeploy.

Optional — force admin links in emails to your current host (useful on Vercel preview):

```env
SITE_URL="https://hunter-baruch.vercel.app"
```

If unset, emails use `VERCEL_URL` on Vercel, else `siteConfig.url`.

## 4. Verify

```bash
npm run test:resend          # check env only
npm run test:resend -- --send   # send admin + confirmation test emails
```

Or submit a real test quote on the site and check:

- Hunter’s inbox for the admin alert
- The prospect inbox for the confirmation
- Vercel logs for `[leads][ops]` email errors

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Lead saves but no email | Env vars missing on Vercel — redeploy after adding them |
| Resend 403 / domain error | Verify `hunter-baruch.com` or use `onboarding@resend.dev` for testing |
| Confirmation never arrives | Domain not verified — sandbox can only send to the Resend account email |
| Admin link 404 in email | Set `SITE_URL` to your live or preview URL |
| Lead still saved | Email failure does not block the form — check Vercel logs |
