# Errores y Resoluciones

## Estado al 2026-03-28

### Railway deploy

#### Error observado
- Railway falló durante `npm ci`.
- El error principal fue `ERESOLVE could not resolve`.

#### Causa raíz
- `landingpage/package.json` tenía `eslint@^10.1.0`.
- `eslint-plugin-react-hooks@7.0.1` solo acepta `eslint` hasta la línea de v9.
- Railway estaba resolviendo dependencias en build y abortaba por conflicto de peer dependencies.

#### Acción tomada
- Se cambió `eslint` a `^9.39.4` en `landingpage/package.json`.
- Se introdujo deploy con `Dockerfile` en `landingpage` para controlar mejor build y headers.

#### Pendiente
- Regenerar `landingpage/package-lock.json` con `npm install`.
- Confirmar nuevo deploy con lockfile actualizado.

### Seguridad web

#### Problema detectado en chequeo inicial
- Faltaban headers clave:
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `X-Frame-Options`

#### Acción tomada
- Se agregó `landingpage/Caddyfile` con:
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`

#### Estado actual
- Los headers principales ya aparecen en producción según `web-check-results (6).json`.
- El warning restante sobre HSTS indica ausencia de `preload`, no ausencia del header.

### security.txt

#### Acción tomada
- Se agregó `landingpage/public/.well-known/security.txt`.

#### Estado actual
- Localmente el archivo sí existe en:
  - `landingpage/public/.well-known/security.txt`
  - `landingpage/dist/.well-known/security.txt`
- El `Dockerfile` y el `Caddyfile` locales sí deberían servir esa ruta correctamente.
- `https://www.brokermikecr.com/.well-known/security.txt` es la URL canónica correcta.

#### Causa raíz actual
- El problema restante no parece estar en el código local.
- El dominio apex `https://brokermikecr.com` no está resolviendo bien todas las rutas, incluyendo `/.well-known/security.txt` y `/en`.
- En Railway, `brokermikecr.com` sigue en estado `Waiting for DNS update`.
- Railway pide un `CNAME @`, pero ese punto choca con limitaciones típicas del apex `@` y con la operativa actual en GoDaddy.

#### Decisión actual
- Dejar el dominio apex como está por ahora.
- Mantener `www.brokermikecr.com` como dominio canónico operativo.
- No mover todavía DNS a Cloudflare ni rehacer la estrategia del apex.

#### Deuda técnica pendiente
- Resolver más adelante el dominio raíz `brokermikecr.com` para que redirija o sirva correctamente hacia `www`.
- Volver a correr el checker cuando el apex quede bien resuelto.

### Limitaciones del entorno local

- En este entorno no se pudo correr `npm run build` de forma confiable por error local de Node bajo WSL 1:
  - `WSL 1 is not supported. Please upgrade to WSL 2 or above.`
  - `Could not determine Node.js install directory`
- La validación final de build debe hacerse en una terminal local compatible del usuario.
