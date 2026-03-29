# Deploy a Railway

Para este proyecto, la forma más simple es desplegar solo la app de `landingpage` como un servicio estático en Railway.

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
8. Railway debería detectar el proyecto Node/Vite y correr el build automáticamente. Si te pide comandos manuales, usa:
   - Build command: `npm run build`
   - Start command: si Railway lo trata como static hosting, no necesitas uno; si te lo exige en un servicio web normal, mejor ajustarlo antes de seguir.
9. Cuando termine, abre el dominio generado por Railway y prueba:
   - `/`
   - `/catalogo`
   - `/mapa-del-sitio`

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

## Path importante

- Código a desplegar: `/mnt/c/Projects/brokermike/landingpage`

## Fuentes oficiales

- Static hosting en Railway: `https://docs.railway.com/guides/static-hosting`
- Monorepo / root directory: `https://docs.railway.com/guides/monorepo`
- Servicios y conexión de repo: `https://docs.railway.com/develop/services`
