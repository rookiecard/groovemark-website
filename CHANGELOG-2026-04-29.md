# Groovemark Site Changes — 2026-04-29

## 1. Favicon (fixes blurry favicon in Brave/Chrome)

**Files added:**
- `favicon.svg` — modern SVG favicon, scales perfectly at any size
- `favicon.ico` — replaced with proper multi-resolution version (16, 32, 48 px embedded)

**Files removed:**
- `mask-icon.svg` — Safari pinned-tab icon, no longer referenced

**HTML changes (all 7 pages):** Replaced this block:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/icon-192.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="mask-icon" href="/mask-icon.svg" color="#252830" />
<link rel="manifest" href="/manifest.json" />
```

With this clean set:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
```

**Why the original was blurry:** the old `favicon.ico` was single-resolution 16x16, and the
`<link rel="icon" sizes="32x32">` was misleadingly pointing at the 192x192 PNG. Browsers
either upscaled the 16x16 (blur) or downscaled a 192x192 file (wasteful, sometimes blurry).
The new ICO has proper 16/32/48 versions packed in, plus an SVG that handles any DPI.

## 2. Self-hosted Inter (fixes text-resize flash, speeds up first paint)

**Files added (Inter v4.66 from rsms.me):**
- `fonts/Inter-Regular.woff2` (109 KB)
- `fonts/Inter-Medium.woff2` (112 KB)
- `fonts/Inter-SemiBold.woff2` (112 KB)
- `fonts/Inter-Bold.woff2` (112 KB)

**HTML changes (all 7 pages):** Replaced this:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
```

With this:
```html
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-SemiBold.woff2" as="font" type="font/woff2" crossorigin />
```

**CSS changes (all 7 pages):** Added `@font-face` declarations for all 4 weights at the top
of the `<style>` block, plus a metric-matched 'Inter Fallback' that adjusts Arial to render
with Inter's exact dimensions. Updated `--font-body` to include 'Inter Fallback' as the
second font in the stack.

**Why this fixes the text-resize flash:**
1. Self-hosting cuts 2 DNS lookups + 2 TLS handshakes (Google Fonts uses fonts.googleapis.com
   for CSS and fonts.gstatic.com for the actual woff2 files). Faster first paint.
2. The 'Inter Fallback' rule means the system fallback (Arial) renders at the same effective
   dimensions as Inter — so when Inter loads and swaps in, every character occupies the same
   box. No reflow, no visible jump.

## 3. Title case fixes

- `index.html`: `<title>` and og:title and twitter:title changed from
  "Digital marketing agency for local businesses" to
  "Digital Marketing Agency for Local Businesses"
- `404.html`: `<title>` changed from "Page not found" to "Page Not Found"

The schema.org JSON-LD `description` field on the homepage was left in sentence case — it's
prose, not a title, and follows the rule from the handoff doc.

## 4. Audit results post-changes

All 7 pages pass:
- HTML tag balance (html, head, body, style, script all paired correctly)
- Em-dash count: 0
- All prices pass 8/28 rule
- No leftover Google Fonts references
- Self-hosted fonts referenced correctly
- New SVG favicon referenced correctly
- mask-icon references fully removed
