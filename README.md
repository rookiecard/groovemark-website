# groovemark-website

This repo is the only copy of the web site. Edit the files here and push to main; GitHub Pages publishes it. There is no build step. The old build.py and the gm-src folder of readable sources were retired on 11/18/2026 and must not be run, because they would overwrite the live pages with an outdated copy. The HTML stays minified as committed; edit it in place.

## Intake form (groovemarkhq.com/intake)

The form itself is GHL form comv5R3sNv06ftsXJRRf ("Client Intake (all services)"). Two hand-written files here style and order it,:

- `intake/gm-intake.js` is loaded by the form's "Not sure which one you need?" HTML block. It adds the Step headings, puts fields in reading order (services first, trade services under the trade, photos with the service that uses them, city before state), and adds autocomplete and screen reader wiring.
- `intake/gm-form.css` is loaded by that script and holds all form styling. The GHL Custom CSS box is intentionally empty.

Edit either file and push; it goes live in about 10 minutes. Bump `CSS_V` in gm-intake.js after a CSS change.
