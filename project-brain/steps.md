# Deploy a Railway

Para este proyecto, la forma actual recomendada es desplegar solo la app de `landingpage` en Railway usando la configuración contenida en esa misma carpeta.

## Estado del deploy al 2026-03-28

- El deploy productivo ya está funcionando en `https://www.brokermikecr.com`.
- La carpeta correcta del servicio sigue siendo `landingpage`.
- Actualmente existe configuración de deploy en:
  - `landingpage/Dockerfile`
  - `landingpage/Caddyfile`
  - `landingpage/.dockerignore`
  - `landingpage/public/.well-known/security.txt`

Esta configuración se añadió para controlar headers HTTP de seguridad y evitar el fallo de `npm ci` que Railway estaba teniendo con el lockfile anterior.

## Pasos

1. Sube tu código a GitHub si todavía no está ahí. Railway despliega muy bien directo desde repos.
2. Entra a `https://railway.com/new`.
3. Elige `Deploy from GitHub repo`.
4. Conecta tu cuenta de GitHub y selecciona el repo `brokermike`.
5. Una vez creado el servicio, entra a `Settings`.
6. En `Root Directory`, pon exactamente:

```txt
/landingpage
```

Esto es importante porque tu app Vite vive dentro de esa subcarpeta, no en la raíz del repo.

7. Guarda los cambios y lanza el deploy.
8. Si Railway detecta el `Dockerfile` de `landingpage`, deja que construya desde ahí. Esa es la ruta preferida actual.
9. Si Railway te intenta forzar el flujo automático Node/Vite en vez del Dockerfile, revisa primero la configuración del servicio antes de continuar.
10. Cuando termine, abre el dominio generado por Railway y prueba:
   - `/`
   - `/catalogo`
   - `/mapa-del-sitio`
   - `/.well-known/security.txt`

## Para dominio propio

1. En tu servicio, ve a `Settings` > `Networking`.
2. Haz clic en `+ Custom Domain`.
3. Agrega tu dominio.
4. Railway te dirá qué registro DNS crear.
5. Espera la validación y el SSL automático.

## Antes de hacer el deploy

Asegúrate de que localmente compile con:

```bash
cd /mnt/c/Projects/brokermike/landingpage
npm install
npm run build
```

Si eso falla local, también va a fallar en Railway.

## Incidencia conocida

- Railway falló inicialmente con `npm ci` por un conflicto entre `eslint@^10.1.0` y `eslint-plugin-react-hooks@7.0.1`.
- Se cambió `eslint` a `^9.39.4` en `landingpage/package.json`.
- Todavía hace falta regenerar `landingpage/package-lock.json` desde una terminal local compatible y subirlo al repo.

## Path importante

- Código a desplegar: `/mnt/c/Projects/brokermike/landingpage`

## Fuentes oficiales

- Static hosting en Railway: `https://docs.railway.com/guides/static-hosting`
- Monorepo / root directory: `https://docs.railway.com/guides/monorepo`
- Servicios y conexión de repo: `https://docs.railway.com/develop/services`
