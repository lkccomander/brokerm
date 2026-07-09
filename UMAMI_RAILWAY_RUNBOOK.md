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

## Notes

- Umami auto-tracks SPA route changes through browser history events.
- The code also forwards custom events from the existing analytics abstraction to Umami.
- The Website ID is not a secret, but it should still be configured through Railway variables so environments stay clear.
