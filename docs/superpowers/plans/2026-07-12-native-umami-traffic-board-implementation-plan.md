# Native Umami Traffic Board Implementation Plan

Date: 2026-07-12
Design: `docs/superpowers/specs/2026-07-12-native-umami-traffic-board-design.md`

## Objective

Create and publicly share a native Umami Board named `Broker Mike Traffic Overview`, using anonymous aggregate traffic only, and update the repository runbook with setup, privacy, verification, rollback, and native-theme limitations.

## Scope Boundary

This implementation does not change landing-page source code, authentication, environment variables, Caddy, Docker, databases, or the event taxonomy. If implementation reveals that a required metric cannot be represented by native Umami components, document the fallback instead of adding a custom backend.

## Files Involved

- Modify: `UMAMI_RAILWAY_RUNBOOK.md`
- Reference: `docs/superpowers/specs/2026-07-12-native-umami-traffic-board-design.md`
- Reference only: `landingpage/src/utils/analytics.ts`
- Reference only: `landingpage/src/vite-env.d.ts`
- Reference only: `landingpage/.env.example`
- Reference only: `landingpage/Caddyfile`

No other repository file should change unless verification identifies a defect in the existing tracker. Any such defect becomes a separate scoped task and is not repaired implicitly.

## Responsibility Split

### Codex can perform

- Update and review `UMAMI_RAILWAY_RUNBOOK.md`.
- Verify the public heartbeat and tracker script endpoints.
- Run repository searches for accidental credentials or unsupported claims.
- Run the landing-page build as a regression check.
- Review the final public link if the user supplies it.

### User must perform in authenticated Umami

- Create and configure the Board.
- Select the Broker Mike website as the data source.
- Review native dark-theme behavior.
- Generate, revoke, and regenerate the public share link.
- Provide screenshots or the final public link for verification if desired.

Credentials must not be pasted into source files, terminal commands, chat, or the runbook.

## Task 1: Establish a Clean Baseline

1. Inspect the working tree without altering existing user changes:

   ```powershell
   git status --short
   ```

2. Confirm the current Umami references remain limited to expected files:

   ```powershell
   rg -n -i -e "umami|VITE_UMAMI|data-website-id" landingpage UMAMI_RAILWAY_RUNBOOK.md
   ```

3. Verify the live self-hosted service heartbeat:

   ```powershell
   curl.exe -sS https://umami-production-56af.up.railway.app/api/heartbeat
   ```

   Expected result:

   ```json
   {"ok":true}
   ```

4. Verify the tracker endpoint returns successfully:

   ```powershell
   curl.exe -I https://umami-production-56af.up.railway.app/script.js
   ```

5. Record any outage as an external blocker. Do not modify the landing page to compensate for a temporarily unavailable Umami service.

## Task 2: Extend the Railway Runbook

Modify `UMAMI_RAILWAY_RUNBOOK.md` using the existing concise operational style.

Add a `Broker Mike Traffic Overview Board` section containing:

1. Board objective and scope.
2. Explicit statement that Visitors is an anonymous estimate, not a verified count of unique people.
3. Prerequisite: Boards navigation is visible and the deployment therefore supports the selected workflow.
4. Board creation steps:
   - Open Boards.
   - Choose Add board.
   - Name it `Broker Mike Traffic Overview`.
   - Select the single-website Board type or equivalent native option.
   - Select the existing Broker Mike website.
5. Component order:
   - Row 1: Visitors, Visits, Views, Bounce rate.
   - Row 2: Visitors trend, with Views and previous-period comparison when supported.
   - Row 3: Traffic sources, Top pages, Events.
   - Row 4: Countries/world map, Devices, Browsers.
6. Fallback rules when a native component lacks a requested series or comparison.
7. Native dark-theme guidance and the explicit no-custom-CSS limitation.
8. Privacy review before sharing.
9. Public-link creation, logged-out verification, revocation test, and final regeneration.
10. Rollback instructions.

Do not add the live public Board URL unless the user explicitly approves committing it.

## Task 3: Review the Runbook Before External Configuration

1. Scan for unfinished content:

   ```powershell
   rg -n -i -e "TBD|TODO|FIXME|placeholder" UMAMI_RAILWAY_RUNBOOK.md
   ```

   Expected result: no matches.

2. Scan for prohibited secrets or secret-shaped variable guidance:

   ```powershell
   rg -n -i -e "API_TOKEN|password|Authorization: Bearer|DATABASE_URL=.*postgres" UMAMI_RAILWAY_RUNBOOK.md
   ```

3. Review any matches in context. Existing variable names may be documented, but real passwords, tokens, or expanded database connection strings must not appear.

4. Confirm the runbook does not claim that:
   - Visitors are exact humans.
   - Dark styling can be forced with per-Board CSS.
   - The Board remains private after a public link is generated.
   - The public link requires an Umami login.

5. Review the diff:

   ```powershell
   git diff -- UMAMI_RAILWAY_RUNBOOK.md
   git diff --check
   ```

## Task 4: Create the Native Board in Umami

This task is performed by the user in the authenticated Umami interface.

1. Log into the deployed Umami service.
2. Open Boards and create `Broker Mike Traffic Overview`.
3. Scope the Board to the existing Broker Mike website only.
4. Add Row 1 metrics in this order:
   - Visitors
   - Visits
   - Views
   - Bounce rate
5. Add a Website Chart for Visitors in Row 2.
6. Add Views as a second series and previous-period comparison only if the native component supports both cleanly.
7. Add Row 3 components:
   - Traffic sources
   - Top pages
   - Events
8. Add Row 4 components:
   - Countries or world map
   - Devices
   - Browsers
9. Apply the native dark theme where available.
10. If public shared pages do not retain dark mode, keep the hierarchy and record the limitation; do not inject CSS or fork Umami.
11. Save the Board without sharing it yet.

## Task 5: Perform the Privacy Review

Before generating a public link:

1. Confirm the Board contains no Distinct ID or session-detail component.
2. Review Top pages for sensitive routes, query strings, or internal paths.
3. Review Events for sensitive event names or dimensions.
4. Confirm no email, phone, name, address, free-form message, token, or internal user identifier appears.
5. Remove any questionable widget or dimension before continuing.
6. Confirm every widget is aggregate and appropriate for anonymous public viewing.

The privacy review is a hard gate. Do not share the Board until it passes.

## Task 6: Verify Metrics and Layout

Use one fixed date range for all comparisons.

1. Compare Visitors, Visits, Views, and Bounce rate against the native website dashboard.
2. Confirm the trend chart changes when the date range changes.
3. Confirm Traffic sources, Top pages, Events, Countries, Devices, and Browsers populate or show a valid empty state.
4. Confirm `whatsapp_click` appears after triggering a WhatsApp CTA on the deployed site.
5. Visit these routes and confirm pageviews arrive:
   - `/`
   - `/catalogo`
   - `/en`
   - `/en/catalog`
6. Review the Board at desktop and mobile widths.
7. Record native limitations, including unavailable comparisons or public dark-theme behavior.

## Task 7: Test Public Sharing and Revocation

1. Generate a public share link from the Board's Share action.
2. Open it in a logged-out private browser window.
3. Confirm the Board loads without authentication.
4. Confirm the viewer cannot edit the Board or navigate into private administration screens.
5. Recheck that only aggregate anonymous data is visible.
6. Revoke or disable the link.
7. Confirm the old URL no longer provides access.
8. Generate the final public link after revocation succeeds.
9. Keep the link outside the repository unless the user explicitly approves publication.

## Task 8: Run Repository Regression Checks

Although no application source code should change, verify the existing application still builds:

```powershell
cd landingpage
npm run build
```

Expected result: TypeScript and Vite build successfully.

Then confirm the final change scope:

```powershell
git status --short
git diff --check
git diff -- UMAMI_RAILWAY_RUNBOOK.md
```

Expected result: only the intended runbook change is staged for implementation, excluding pre-existing user files and visual-companion artifacts.

## Task 9: Final Handoff

Report:

- Board name and final component hierarchy.
- Whether native public dark mode worked.
- Whether all metrics matched the website dashboard for the test range.
- Whether logged-out public access worked.
- Whether revocation invalidated the old link.
- Any omitted components and native limitations.
- The changed repository file.
- Build result.
- Rollback procedure.

Do not report the feature complete until the privacy review, metric comparison, public access test, and revocation test have all passed.

## Rollback

1. Revoke the Board's public share link.
2. Delete the Board if required.
3. Leave the existing tracker and analytics history intact.
4. Revert only the new `UMAMI_RAILWAY_RUNBOOK.md` section.

No database rollback, environment rollback, or landing-page deployment is expected.
