# Umami Railway Runbook

Use this runbook to finish the Broker Mike Umami analytics setup on Railway and connect it to the Vite landing page.

## Umami Service

The Umami service is deployed separately from the Broker Mike landing page.

Current tracking script:

```html
<script defer src="https://umami-production-56af.up.railway.app/script.js" data-website-id="f9277d8a-8cc0-4277-be7c-d80dede0b1df"></script>
```

Umami values:

```env
VITE_UMAMI_SRC=https://umami-production-56af.up.railway.app/script.js
VITE_UMAMI_WEBSITE_ID=f9277d8a-8cc0-4277-be7c-d80dede0b1df
```

## Railway Variables For Umami

On the `umami` Railway service, use:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_TYPE=postgres
HOSTNAME=0.0.0.0
PORT=3000
```

After first login, change the default Umami password.

## Railway Variables For Landing Page

On the existing `landingpage` Railway service, add:

```env
VITE_UMAMI_SRC=https://umami-production-56af.up.railway.app/script.js
VITE_UMAMI_WEBSITE_ID=f9277d8a-8cc0-4277-be7c-d80dede0b1df
```

Keep the existing Google Analytics variable if you still want both providers:

```env
VITE_GA_MEASUREMENT_ID=G-P2PFYEWWM1
```

Redeploy the landing page after saving the variables. Vite reads `VITE_*` variables at build time, so the deployed bundle will not include Umami until Railway rebuilds the service.

## Verify

1. Open the deployed landing page.
2. Open browser DevTools.
3. Confirm this script loads:

```text
https://umami-production-56af.up.railway.app/script.js
```

4. Browse these routes:

```text
/
/catalogo
/en
/en/catalog
```

5. In Umami, check that pageviews appear for `www.brokermikecr.com`.
6. Click a WhatsApp CTA and confirm the `whatsapp_click` event appears in Umami events.

## Broker Mike Traffic Overview Board

Create a native Umami Board for general, anonymous traffic reporting.

Board settings:

```text
Name: Broker Mike Traffic Overview
Scope: Broker Mike website only
Access: Public read-only share link
```

Umami's `Visitors` metric is an anonymous estimate. It is not a verified count of unique people and does not identify the same person across browsers or devices.

### Prerequisite

Log into Umami and confirm `Boards` appears in the navigation. Boards require Umami 3.1.0 or later. If Boards is unavailable, upgrade Umami before continuing; do not add a custom application dashboard as a workaround for this runbook.

### Create The Board

1. Open `Boards`.
2. Select `Add board`.
3. Name the Board `Broker Mike Traffic Overview`.
4. Select the single-website Board type, or the equivalent option in the installed Umami version.
5. Select the existing Broker Mike website as the only data source.
6. Save the Board without sharing it yet.

### Add The Components

Use this order so the public Board shows general health first and supporting context afterward.

#### Row 1 - Immediate Health

- Visitors
- Visits
- Views
- Bounce rate

Use a Website Metrics Bar or equivalent native metric components.

#### Row 2 - Traffic Over Time

- Visitors trend
- Views as a second series when the native component supports it
- Previous-period comparison when the native component supports it

Use a Website Chart. If Views and the comparison cannot be shown cleanly in one component, keep Visitors as the primary trend; Views remains available in Row 1.

#### Row 3 - Acquisition And Content

- Traffic sources
- Top pages
- Events, including `whatsapp_click`

Use native Metrics Table and Events components. Do not add raw session records, unrestricted event payloads, or full query-string tables to the public Board.

#### Row 4 - Audience Context

- Countries or world map
- Devices
- Browsers

These are aggregate context metrics. They must not be described as persistent visitor identities.

### Dark Theme

Use Umami's native dark theme where the installed version provides it. The approved direction is charcoal panels, high-contrast neutral text, and restrained chart accents.

Native Boards do not document support for per-Board custom CSS or forced colors on public share pages. Do not inject CSS or fork Umami to force the theme. If the public link does not preserve dark mode, keep the approved component hierarchy and record native public theming as a limitation.

### Privacy Review Before Sharing

Complete this review before generating a public link:

1. Confirm the Board contains no Distinct ID, user-level, or session-detail component.
2. Review Top pages for sensitive routes, internal paths, or query-string values.
3. Review Events for sensitive names or dimensions.
4. Confirm no email, phone number, name, address, free-form message, access token, or internal user identifier appears.
5. Remove any questionable component or dimension.
6. Confirm every remaining component is aggregate and appropriate for anonymous public viewing.

Do not continue until this review passes.

### Verify The Board

Use one fixed date range for all comparisons.

1. Compare Visitors, Visits, Views, and Bounce rate with the native website dashboard.
2. Change the date range and confirm the trend updates.
3. Confirm Traffic sources, Top pages, Events, Countries, Devices, and Browsers populate or show a valid empty state.
4. Browse these routes and confirm pageviews appear:

```text
/
/catalogo
/en
/en/catalog
```

5. Click a WhatsApp CTA and confirm `whatsapp_click` appears.
6. Check the Board at desktop and mobile widths.
7. Verify native dark-theme behavior and record any limitation.

### Share And Test The Public Link

1. Use the Board's `Share` action to generate a public link.
2. Open the link in a logged-out private browser window.
3. Confirm it loads without an Umami login.
4. Confirm the viewer cannot edit the Board or access private Umami administration screens.
5. Confirm only aggregate anonymous data is visible.
6. Revoke or disable the link.
7. Confirm the old URL no longer provides access.
8. Generate the final public link only after the revocation test passes.

Anyone with the public link can view the Board. Do not commit the live link to this repository unless it is intentionally approved for permanent publication.

### Board Rollback

1. Revoke the public share link.
2. Delete the Board if it is no longer needed.
3. Leave the existing Umami tracker and analytics history intact.
4. Do not delete historical Umami data during rollback.

## Notes

- Umami auto-tracks SPA route changes through browser history events.
- The code also forwards custom events from the existing analytics abstraction to Umami.
- The Website ID is not a secret, but it should still be configured through Railway variables so environments stay clear.
