# Broker Mike: mapa de fuentes y skills

## 1. Documentos del proyecto

### `project-brain/design.md`
- Documento rector del proyecto.
- Define posicionamiento de marca, dirección visual, tipografía, color, arquitectura de información y pantallas objetivo.
- Debe usarse como referencia principal para decisiones de UI en `landingpage`.

### `project-brain/sources.md`
- Inventario operativo del proyecto.
- Resume qué carpetas, skills y archivos sirven para diseñar, convertir y mantener la landing.

## 2. Aplicación actual

### `landingpage/index.html`
- Entrada HTML de Vite.
- Carga fuentes y monta la app React sobre `#root`.

### `landingpage/src/App.tsx`
- Router principal.
- Expone las rutas activas: `/`, `/catalogo`, `/mapa-del-sitio`.

### `landingpage/src/pages/Landing.tsx`
- Página principal de conversión.
- Reúne navegación, héroe, métricas, propiedades, perfil de Mike, testimonios y contacto.

### `landingpage/src/data/mockData.ts`
- Fuente central de contenido mock.
- Sigue una estructura útil para separar datos del UI.

### `landingpage/src/content/editableContent.ts`
- Archivo de contenido editable introducido para datos que deben poder cambiarse sin tocar componentes.
- Actualmente contiene `aboutMike.salesTotal`.

### `landingpage/Dockerfile`
- Configuración actual de deploy para Railway.
- Construye la app y sirve `dist` con Caddy.

### `landingpage/Caddyfile`
- Fuente de verdad actual para headers HTTP de seguridad en producción.
- También controla el fallback SPA y la respuesta de `/health`.

### `landingpage/public/.well-known/security.txt`
- Archivo destinado a publicar datos de contacto para seguridad.
- Está implementado en el repo, pero aún debe confirmarse su disponibilidad efectiva en producción.

## 3. Skills locales y para qué sirven

### `skills/stitch-design/SKILL.md`
- Skill principal para trabajo con Stitch.
- Orquesta generación, edición y síntesis de sistema visual.

### `skills/design-md/SKILL.md`
- Convierte un proyecto Stitch en un documento `DESIGN.md`.
- En Broker Mike, su equivalente práctico actual es `project-brain/design.md`.

### `skills/react-components/SKILL.md`
- Baja pantallas desde Stitch y las transforma en componentes React/Vite modulares.
- Muy relevante para `landingpage`.

### `skills/enhance-prompt/SKILL.md`
- Mejora prompts vagos para generación de pantallas.

### `skills/stitch-loop/SKILL.md`
- Workflow iterativo para construir sitios por páginas usando un baton file.

### `skills/shadcn-ui/SKILL.md`
- Guía para integrar componentes `shadcn/ui`.
- Útil si el proyecto crece en complejidad UI.

### `skills/remotion/SKILL.md`
- Genera walkthroughs en video desde pantallas Stitch.
- Complementario, no central para la landing actual.

## 4. Workflows y referencias secundarias

### `skills/stitch-design/workflows/text-to-design.md`
- Define cómo pasar de idea textual a pantalla.

### `skills/stitch-design/workflows/generate-design-md.md`
- Explica cómo sintetizar un `DESIGN.md`.

### `skills/stitch-design/workflows/edit-design.md`
- Describe edición incremental de pantallas existentes.

### `skills/stitch-design/references/design-mappings.md`
- Traduce ideas vagas a lenguaje visual más útil para Stitch.

### `skills/stitch-design/references/prompt-keywords.md`
- Banco de términos para escribir prompts más precisos.

## 5. Lectura operativa para Broker Mike

- Fuente de verdad visual actual: `project-brain/design.md`.
- Producto activo implementado: `landingpage`.
- Fuente de verdad operativa para incidencias recientes: `project-brain/error.md`.
- Guía de deploy vigente: `project-brain/steps.md`.
- Skills más útiles para seguir construyendo este proyecto: `stitch-design`, `design-md`, `react-components`, `enhance-prompt`.
- Skills auxiliares, no prioritarios hoy: `stitch-loop`, `shadcn-ui`, `remotion`.

## 6. Próximo uso recomendado

- Si vamos a diseñar nuevas páginas: usar `enhance-prompt` y luego `stitch-design`.
- Si vamos a convertir diseños a código: usar `react-components`.
- Si vamos a mantener consistencia visual: seguir `project-brain/design.md` y actualizarlo cuando cambie la dirección de marca.
- Si vamos a tocar contenido editable de negocio: revisar `landingpage/src/content/editableContent.ts` antes de cambiar componentes.
- Si vamos a tocar deploy o headers de seguridad: revisar `landingpage/Dockerfile`, `landingpage/Caddyfile` y `project-brain/error.md`.

## 7. Fuentes en FAcebook
https://www.facebook.com/loriambienesraices

threads:

https://www.threads.com/@brokermike.cr?xmt=AQF06qj1aBK5-rZoPmi4T0euYa9G1JtNBUIobhs7H-sO8dE&fbclid=IwY2xjawQ3er1leHRuA2FlbQIxMABicmlkETFNUE1ZUE9vaG96Skk0b2xRc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHj6wfQgMwjyPvpuaSDPmSpDyDaE7MmqupU_YEEu-QEwhsvoHyL4em1_Ki2Z4_aem_QNBE2gov5v4gm8t3bfS2Nw

instagram
https://www.instagram.com/brokermike.cr?fbclid=IwY2xjawQ3evBleHRuA2FlbQIxMABicmlkETFNUE1ZUE9vaG96Skk0b2xRc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHlcndXsQz7JdYljhy_3TUwaKNBes6KjRJDOMOri64lUP9iIq74lRdeRu2lRi_aem_MWKWIu6ipCig-8jAvevFoQ
post apartamento Torres de la Colina:
https://www.instagram.com/p/DWPMLXwkR4J/

Teléfono ☎️ 71121318 
mloria25@hotmail.com
