# Instagram Thumbnail Refresh Runbook

Use this when Instagram CDN image URLs expire and the landing page catalog thumbnails need fresh URLs.

## What This Updates

The refresh uses each property's stable `sourceUrl` and replaces the expiring Instagram CDN URL in the `image` field.

Files updated by the refresh:

- `landingpage/public/assets/property-catalog.json`
- `landingpage/dist/assets/property-catalog.json`
- `tools/instagram-thumbnailer/generated/thumbnail-refresh-report.json`

The source URLs are the stable keys. Do not manually search and replace CDN URLs.

## Run The Refresh

Open Windows PowerShell:

```powershell
cd C:\Projects\brokermike
.\refresh-instagram-catalog.ps1
```

For machine-readable output:

```powershell
cd C:\Projects\brokermike
.\refresh-instagram-catalog.ps1 -Json
```

To refresh and rebuild the landing page:

```powershell
cd C:\Projects\brokermike
.\refresh-instagram-catalog.ps1 -Build
```

To refresh, rebuild Graphify, and keep the architecture report current:

```powershell
cd C:\Projects\brokermike
.\refresh-instagram-catalog.ps1 -Build -GraphifyUpdate
```

## Expected Result

The command prints a report like:

```text
Instagram catalog thumbnail refresh complete.
Source URLs: 50
Resolved: 50
Failed: 0
Updated allProperties: 50
Updated featuredProperties: 8
Updated catalogProperties: 50
```

If `Failed` is greater than `0`, inspect:

```text
tools/instagram-thumbnailer/generated/thumbnail-refresh-report.json
```

Failures usually mean Instagram blocked or delayed a post load. Re-run the command once. If the same property keeps failing, open the `sourceUrl` in the browser and confirm the post still exists.

## Verify The Change

Check the changed catalog files:

```powershell
git diff -- landingpage/public/assets/property-catalog.json landingpage/dist/assets/property-catalog.json
```

Build the landing page if you did not use `-Build`:

```powershell
cd C:\Projects\brokermike\landingpage
npm run build
```

Then review the catalog route locally or in the deployed environment:

- `/catalogo`
- `/en/catalog`
- `/assets/property-catalog.json`

## Deploy

After verifying the thumbnails, commit and push the changed catalog JSON files and any report or runbook updates you want to keep.

Railway deploys the `landingpage` service from the GitHub repo, so production will only update after the refreshed catalog is pushed.

## Important Notes

- The refresh requires internet access.
- Playwright must be installed in `tools/instagram-thumbnailer/.venv`.
- `sourceUrl` must remain present on each catalog property.
- Local image paths such as `/assets/catalog/...` do not need CDN refreshes.
- The long-term stable option is to save thumbnails locally instead of storing Instagram CDN URLs.
