# Hunter Baruch Financial Website

Marketing website for Hunter Baruch Financial — built with Next.js, TypeScript, and Tailwind CSS.

## Pages

- **Home** — Hero, services overview, patient advocacy highlight, testimonials preview
- **Services** — Financial planning, investments, insurance, estate planning
- **Patient Advocacy** — Medical bill review, insurance navigation, care support
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

## Customizing Content

Site content and branding live in [`src/lib/site.ts`](src/lib/site.ts). Update contact details, services, testimonials, and disclosure text there. Brand colors are defined in [`src/app/globals.css`](src/app/globals.css).

## Deploy to Vercel

1. Push this repo to GitHub
2. Sign in at [vercel.com](https://vercel.com) with your GitHub account
3. Click **Add New Project** and import the repository
4. Accept the defaults (Next.js is auto-detected)
5. Click **Deploy**

Vercel will assign a `*.vercel.app` URL. Add a custom domain later in project settings if needed.

No environment variables are required for the initial build. If you add a contact form backend (e.g. Resend, Formspree), configure secrets in Vercel **Environment Variables**.

## Git & GitHub

```bash
git init
git add .
git commit -m "Initial Next.js scaffold for Hunter Baruch Financial"
git remote add origin https://github.com/<your-username>/hunter-baruch-site.git
git branch -M main
git push -u origin main
```

Replace `<your-username>` with your GitHub username.
