# Social Thumbnailer

App web local en Python para generar thumbnails de catálogo desde un link público de Instagram o TikTok.

## Qué hace

- Resuelve la portada de un post público de Instagram o TikTok desde su URL.
- Si el post es video, usa el video como fuente del thumbnail.
- Muestra un preview con recorte tipo `object-cover`.
- Mantiene la altura fija en `288px`, igual al thumbnail actual del catálogo.
- Permite ajustar ancho, zoom, posición y segundo exacto del video.
- Descarga el thumbnail final en `PNG` o `JPG`.
- Permite publicar una propiedad normalizada en un JSON de catálogo consumido por `landingpage`.
- Expone una vista de `Estado del Catálogo` para revisar propiedades publicadas y su estado.

## Requisitos

- Python 3.10 o superior.
- Acceso a internet cuando se use la app, porque debe leer el post público de Instagram o TikTok.
- Recomendado: Playwright para el fallback cuando alguna plataforma bloquee la metadata pública.

## Instalar Playwright

```bash
cd /mnt/c/Projects/brokermike/tools/instagram-thumbnailer
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium
```

## Cómo correrlo

```bash
cd /mnt/c/Projects/brokermike/tools/instagram-thumbnailer
python3 app.py
```

Luego abra:

```text
http://127.0.0.1:8765
```

## Notas

- Si Instagram o TikTok cambian el HTML público o bloquean el acceso, la resolución de portada puede fallar.
- Cuando una plataforma bloquee la metadata pública, la app intentará automáticamente un fallback con Playwright.
- El output se genera en el navegador con canvas, así que no requiere dependencias como Pillow.
- El ancho es configurable porque en el sitio el ancho real de la card depende del viewport; la altura sí queda fija en `288px`.
- Cuando se publica una propiedad, el tool guarda el thumbnail y el JSON tanto en `landingpage/public/assets` como en `landingpage/dist/assets`.
