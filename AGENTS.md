# Prime Handyman Service LLC — Website Build

## Project Overview

Veteran-owned handyman business website for Prime Handyman Service LLC (Glendale, AZ / Greater West Valley).

- **Business:** Prime Handyman Service LLC
- **Tagline:** "Everyday Fixes. Prime Quality."
- **Phone:** 623-227-8884
- **Email:** bryan.lewis@prime-handyman-az.com
- **Website:** https://prime-handyman-az.com/
- **Owner:** Bryan Lewis (founder & field operations manager)
- **Hours:** Sun–Sat 7am–7pm
- **Colors:** Navy `#0a1830`, Gold `#c9a24a`
- **Fonts:** Barlow Condensed (headings), Inter (body)

## Build Location & Infrastructure

- Build folder: `C:\PrimeOpsDev\A_PHS_Website` (NO git yet — connect to a NEW GitHub repo when finished)
- Current live site: deployed from `PrimeHandymanRepo` **main** branch (keep as-is until we're done)
- Dev/testing: `PrimeHandymanRepo` **Website-Testing** branch (do not touch)
- Deployment target: Cloudflare Pages (new repo) — Dev branch tests, merge to Prod/main for live
- Backend: Supabase (free tier) + Cloudflare Turnstile for the estimate form

## The Plan (approved by user)

- **Phase 0:** Fix `new_site.html` (remove MiniMax badge, fix duplicate `</body></html>`, fix schema hours to Sun-Sat) → copy to `index.html`
- **Phase 1:** Build `assets/css/style.css` (design system: variables, buttons, header/nav, hero, cards, footer, responsive)
- **Phase 2:** Build `assets/js/main.js` (mobile menu, scroll reveal, year, form validation)
- **Phase 3:** Services content — `services.html` (combined), `services-b2c.html` (residential), `property-managers.html` (B2B). Include monsoon subscription plan, window efficiency, elderly safety (grab bars)
- **Phase 4:** Remaining pages: `pricing.html`, `how-it-works.html`, `service-areas.html`, `gallery.html`, `about.html`, `reviews.html`, `request-estimate.html`, `privacy.html`, `terms.html`
- **Phase 5:** Logo → `assets/img/logo-light.png` + `logo-glow.png`; job photos → `assets/img/webp-job-*.webp`; owner photo
- **Phase 6:** Estimate form + Supabase table + Turnstile
- **Phase 7:** QA, `git init`, `.gitignore`, GitHub + Cloudflare Pages deploy

## Key Decisions

- Keep hubby's `new_site.html` as the homepage (it's the one they want)
- Services: main page for all customers + separate B2C and B2B pages
- New services ARE included (monsoon subscription, elderly safety) — site goes live only when complete
- Phone number is **623-227-8884** everywhere
- Model CANNOT view images — user must visually verify logo/photos

## Learning Workflow

The user is learning HTML/CSS/JS. After each change, explain what was changed and why.
Encourage: Plan mode (Tab) for questions, `/undo` for safe experiments.
Build in learning-sized chunks; give mini-concept explanations at each phase.

## File Structure

```
C:\PrimeOpsDev\A_PHS_Website\
├── index.html            (homepage — from new_site.html)
├── services.html         (combined services)
├── services-b2c.html     (residential services)
├── property-managers.html (B2B)
├── pricing.html
├── how-it-works.html
├── service-areas.html
├── gallery.html
├── about.html
├── reviews.html
├── request-estimate.html (form + Supabase + Turnstile)
├── privacy.html
├── terms.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/  (logo-light.png, logo-glow.png, webp-job-*.webp, bryan-lewis-owner.jpg)
├── PHS_SEO/Notes.txt     (SEO notes)
└── AGENTS.md
```

## Pricing (for content)

- $139 Prime Handyman Service Call (first hour included)
- $99/hr after first hour, 15-min increments
- Materials at cost; 50% deposit on jobs over $400
- No surprise add-ons — written approval for changes
- 30-day labor workmanship warranty

## Form Backend (Phase 6 — wired)

- `request-estimate.html` posts to Cloudflare Pages Function `/api/submit` (`functions/api/submit.js`)
- Function verifies Turnstile server-side, then inserts into Supabase table `estimates` (RLS insert-only)
- **Turnstile site key (public, in HTML):** `0x4AAAAAAEHy9JbhiQ3vY6rE`
- **Supabase:** project `https://zrhvlcscpwqefqgnzxzn.supabase.co`, publishable key `sb_publishable_Jls6HnLMRBj-pz7Aaog0Bw_tA_iWRoX` (this is the renamed "anon" key — safe client-side, RLS-restricted)

### Env vars to set in Cloudflare Pages (NOT in code):

| Variable | Value |
|---|---|
| `TURNSTILE_SECRET_KEY` | *(store in Cloudflare Pages env — do NOT commit to git)* |
| `SUPABASE_URL` | `https://zrhvlcscpwqefqgnzxzn.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_Jls6HnLMRBj-pz7Aaog0Bw_tA_iWRoX` |

Deploy note: `functions/` must be included in the Pages build output. No build step needed (static site).
