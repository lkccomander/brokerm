# Native Umami Traffic Board Design

Date: 2026-07-12

## Summary

Create a native Umami Board named **Broker Mike Traffic Overview** for anonymous, aggregate website traffic. The Board will be shared through Umami's read-only public-link feature and will prioritize general traffic health rather than visitor identity or a real-estate conversion funnel.

This is the first, deliberately narrow release derived from `project-brain/UMAMI_UNIQUE_VISITOR_DASHBOARD_PLAN.md`. It postpones authenticated visitor identification, Distinct IDs, a protected application backend, and a custom React administration dashboard.

## Discovery Findings

- The application is a static Vite, React, and TypeScript landing page served by Caddy.
- `landingpage/src/utils/analytics.ts` already loads the self-hosted Umami tracker and forwards safe custom events through the existing analytics abstraction.
- `landingpage/src/main.tsx` initializes analytics.
- `landingpage/src/App.tsx` forwards route pageviews to Google Analytics; Umami's tracker handles its own pageview behavior.
- `landingpage/.env.example`, `landingpage/Dockerfile`, `landingpage/Caddyfile`, and `UMAMI_RAILWAY_RUNBOOK.md` contain the current Umami deployment configuration.
- The Umami service is self-hosted on Railway and its public heartbeat responds successfully.
- The repository contains no backend, visitor authentication flow, session restoration flow, administrator role model, or protected dashboard shell.
- The live Umami navigation exposes Boards, confirming that the installed deployment supports the selected workflow. Official Umami documentation states that Boards require Umami 3.1.0 or later.

## Goals

- Give Broker Mike and public-link recipients a concise view of general site traffic.
- Reuse native Umami components and the existing tracker integration.
- Provide a read-only public Board link without exposing Umami credentials.
- Show only anonymous aggregate data.
- Document creation, verification, sharing, revocation, and rollback.

## Non-Goals

- Identifying individual people or browsers across sessions or devices.
- Calling `umami.identify()` or introducing Distinct IDs.
- Adding visitor accounts, login, logout, roles, or permissions to the landing page.
- Adding an application backend or authenticated Umami API client.
- Building `/admin/analytics/visitors` or another custom application dashboard.
- Adding a database, cache, API token, migration, or new environment variable.
- Expanding the current event taxonomy in this release.
- Presenting Umami's Visitors metric as a guaranteed count of unique humans.

## Architecture

The existing runtime path remains unchanged:

```text
Anonymous browser
    |
    | Umami pageviews and existing safe events
    v
Self-hosted Umami on Railway
    |
    | native aggregate Board components
    v
Broker Mike Traffic Overview
    |
    | revocable read-only share link
    v
Public-link viewer
```

No intermediary application service stores, transforms, caches, or proxies analytics data. The Umami API token is not needed and must not be introduced into frontend configuration.

## Board Definition

### Identity

- Name: `Broker Mike Traffic Overview`
- Purpose: General anonymous traffic monitoring
- Scope: The existing Broker Mike website only
- Access: Umami public share link
- Data classification: Public aggregate analytics

### Row 1: Immediate Health

Use a native Website Metrics Bar or equivalent native metric components for:

- Visitors
- Visits
- Views
- Bounce rate

Metric labels must retain Umami's definitions. Visitors must be described as an anonymous estimate rather than a verified count of people.

### Row 2: Traffic Over Time

Use a Website Chart for the selected date range:

- Primary series: Visitors
- Secondary series: Views, when the installed Board component permits the comparison
- Previous-period comparison: Enable when supported by the native component

If the installed component cannot render both series or the comparison together, Visitors takes priority and Views remains available in Row 1.

### Row 3: Acquisition and Content

Use native Metrics Table and Events components for:

- Traffic sources
- Top pages
- Existing tracked events, including `whatsapp_click`

Do not add raw session records, full query-string tables, unrestricted event payloads, or arbitrary URL values to the public Board.

### Row 4: Audience Context

Use native components for:

- Countries or world map
- Devices
- Browsers

These widgets provide aggregate context only and must not be interpreted as persistent visitor identity.

## Visual Direction

The approved visual direction is a restrained dark analytics workspace:

- Charcoal background and panels
- High-contrast neutral text
- Violet chart accents
- Green and amber used sparingly for changes or status
- General health first, trends second, acquisition/content third, audience context last

The implementation must use native Umami Board presentation controls. The official Board documentation does not promise per-Board custom CSS, forced dark mode, or custom colors on public share pages. Therefore:

- Use Umami's native dark theme where the installed version exposes it and confirm the public share page behavior.
- Do not fork Umami or inject custom CSS solely to force the mockup styling.
- If the public share page does not preserve a dark theme, retain the approved component hierarchy and document native theming as a limitation of this release.

The visual companion mockup is directional and is not a pixel-perfect promise of Umami's native rendering.

## Public Sharing and Privacy

- Generate the public link through the Board's Share action.
- Treat the URL as public: anyone who receives it can view the Board without logging in.
- Do not place the Umami username, password, API token, database URL, or Railway credentials in the link or documentation.
- Do not add Distinct ID, session-detail, or user-level components.
- Review top-page output for sensitive paths or query values before enabling sharing.
- Review event names and payload dimensions before displaying the Events component.
- Record how to revoke or regenerate the public link.
- Do not commit the live public URL to the repository unless the owner explicitly decides it is safe to publish permanently.

## Failure Behavior

- If Umami is unavailable, the public Board is unavailable; the landing page remains functional.
- If the tracker is blocked by an ad blocker, disabled JavaScript, or network policy, those visits will be absent from analytics.
- If a native Board component is unavailable, omit that component and record the limitation rather than adding a custom backend.
- If the public link is disclosed beyond its intended audience, revoke it in Umami and generate a new link.
- If a widget reveals data that should not be public, remove the widget before re-enabling sharing.

## Verification

Manual verification is appropriate because this release configures a native Umami Board and updates documentation without changing application source code.

1. Confirm the Umami heartbeat responds and the tracker script loads on the deployed landing page.
2. Visit `/`, `/catalogo`, `/en`, and `/en/catalog` and confirm pageviews appear.
3. Trigger a WhatsApp CTA and confirm `whatsapp_click` appears.
4. Create the Board with the specified name and website scope.
5. Add each row and verify its date-range behavior.
6. Compare Visitors, Visits, Views, and Bounce rate with the website dashboard for the same period.
7. Confirm the trend and table components return plausible data.
8. Review pages and events for sensitive paths, query values, or payload dimensions.
9. Generate the public link and open it in a logged-out private browser window.
10. Confirm the public viewer cannot edit the Board or navigate to private Umami administration screens.
11. Check desktop and mobile layouts.
12. Verify native dark-theme behavior on the public link and record any limitation.
13. Revoke the share link and confirm the old URL no longer provides access.
14. Generate the final link only after the revocation test passes.

## Documentation Changes

Implementation will update `UMAMI_RAILWAY_RUNBOOK.md` with:

- Board name and objective
- Required components and row order
- Public-sharing instructions
- Dark-theme capability note
- Privacy review checklist
- Manual verification procedure
- Link-revocation procedure
- Rollback instructions

No landing-page source, environment, Docker, Caddy, or database file is expected to change.

## Rollback

1. Disable or revoke the Board's public share link.
2. Delete the Board if it is no longer useful.
3. Leave the existing Umami tracker and pageview/event history intact.
4. Revert only the new runbook documentation if necessary.

Rollback must not delete historical Umami analytics data or remove the current landing-page tracker.

## Acceptance Criteria

- `Broker Mike Traffic Overview` exists as a native Umami Board.
- The Board contains the approved four-row metric hierarchy or a documented native-component fallback.
- The Board uses native dark presentation where supported.
- A read-only public share link works in a logged-out browser.
- The Board exposes aggregate anonymous traffic only.
- Visitors are not described as exact unique people.
- No Umami secret or credential is present in frontend code, documentation, or the public link.
- Pageview and `whatsapp_click` tracking continue to work.
- Metrics are manually compared with the native website dashboard for the same date range.
- Public-link revocation is tested and documented.
- `UMAMI_RAILWAY_RUNBOOK.md` contains setup, verification, privacy, limitation, and rollback guidance.
