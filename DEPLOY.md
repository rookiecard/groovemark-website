# Groovemark Site — Deploy Bundle

Full site contents ready for GitHub redeploy. Generated May 4, 2026.

## What's inside

42 files, ~2.6 MB total. Structure mirrors the production site at `groovemarkhq.com`:

```
.
├── index.html                              # Homepage
├── 404.html                                # Custom 404 page
├── services/
│   ├── ai-systems.html
│   ├── social-media.html
│   └── website-design.html
├── legal/
│   ├── privacy.html
│   └── terms.html
├── fonts/                                  # Self-hosted Inter (3 weights)
│   ├── Inter-Regular.woff2
│   ├── Inter-SemiBold.woff2
│   └── Inter-Bold.woff2
├── images/
│   ├── jonathan-kaufman.jpg/.webp
│   └── services/                           # 18 responsive image variants
├── apple-touch-icon.png
├── favicon.ico, favicon.svg
├── icon-192.png, icon-512.png
├── icon-maskable-192.png, icon-maskable-512.png
├── og-image.jpg                            # Social share card
├── manifest.json                           # PWA manifest
├── llms.txt                                # AI crawler info
├── robots.txt
└── sitemap.xml
```

## Changes vs prior production

This bundle includes three rounds of cumulative fixes from the May 4 working session:

**Round 1 — Mobile alignment & CTA sizing (4 main pages: index, 3 services)**
- Breadcrumb on service pages now properly indents (was hard against left edge)
- All CTA buttons site-wide are uniform size (280px min-width on desktop, full-width on mobile)

**Round 2 — Font loading on 3 secondary pages (privacy, terms, 404)**
- Removed broken `@font-face` reference to `Inter-Medium.woff2` (file never existed; was 404ing on every page load)
- Added missing `<link rel="preload">` for `Inter-Bold.woff2` (was preloading only Regular and SemiBold but using Bold above-the-fold for logo and primary CTA)
- All 7 pages now have identical font setup: 3 preloads (Regular, SemiBold, Bold), 3 @font-face declarations with `font-display: swap`, plus the metric-matched `Inter Fallback` for zero-CLS swap

**No changes to:** colors, layout, copy, schema markup, meta tags, Open Graph tags, font weights, sizes, line-heights, letter-spacing, design system tokens, or anything else outside the scope above.

## Deploy procedure

If your GitHub repo IS the site root (e.g., GitHub Pages):

1. Replace the entire repo contents with this bundle (or merge as a single commit).
2. Push to `main` (or your default branch).
3. Wait for GitHub Pages to rebuild (~1-2 minutes).
4. Purge any CDN cache (Cloudflare → Caching → Purge Everything if applicable).
5. Hard-reload the site in an incognito window to verify.

If your repo deploys via a build step or hosting provider:

1. Commit these files in their existing structure.
2. Trigger your deploy pipeline.
3. Verify production matches.

## Post-deploy verification checklist

Run these in order on the live site:

1. **Hard-reload `groovemarkhq.com`** in incognito → confirm it renders
2. **Open DevTools → Network → filter "Font"** → reload → confirm 3 woff2 files load with HTTP 200, no `Inter-Medium.woff2` request anywhere
3. **Open DevTools → Console** → reload → confirm zero "preload not used" warnings
4. **Visit `/legal/privacy.html`, `/legal/terms.html`, and a deliberately-broken URL (e.g. `/no-such-page`)** → verify all render with proper Inter typography
5. **Test on mobile (or DevTools device emulation at 390px width)** → verify breadcrumbs are properly indented on each service page, all CTA buttons are full-width and stacked
6. **Run https://pagespeed.web.dev/** on homepage and one service page (Mobile + Desktop) → record Performance, LCP, CLS scores. Compare to your prior baseline if you have one. Expected: same or better.

## Rollback

If anything breaks: `git revert` the deploy commit and force-push. All changes in this bundle are isolated to HTML files (no fonts changed, no images changed, no infra changed) so rollback is fully reversible.

## Files NOT included

- `HANDOFF.md` — internal documentation, not for production deploy

## Notes for next session

- All seven HTML pages are now consistent on font loading. If you ever add a new page (e.g., a blog index, case study, or new service tier), copy the `<head>` font block from any existing page verbatim — do not re-derive from scratch.
- If you need to add weight 500 (Medium) usage somewhere, you'll need to download `Inter-Medium.woff2` from https://github.com/rsms/inter/releases (matching the version of the existing 3 weights), drop it in `/fonts/`, then re-add the `@font-face` block on whichever pages need it. Right now the 3 pages that previously referenced Medium have been cleaned up; weight 500 in CSS will fall through to weight 400 (lighter) per browser font-matching defaults.
