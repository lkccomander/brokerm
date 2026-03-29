web application/stitch/projects/8309550955846481106/screens/d19b8415fa6045ed9cbd2e3b40d9e397
# Documento de Diseño: Broker Mike - Inversión Urbana Estratégica

## 1. Visión General y "Norte Creativo"
**Norte Creativo: "El Arquitecto de Inversiones"**

Este sistema de diseño evoluciona la imagen de Broker Mike de un corredor tradicional a un consultor estratégico de alto nivel. La interfaz equilibra la calidez del mercado inmobiliario costarricense con la precisión de los datos analíticos, dirigida a un inversor sofisticado que busca rentabilidad y estilo de vida urbano (Escazú, Santa Ana).

## 2. Identidad Visual (Basada en Pura Vida Estate)

### Paleta de Colores
- **Primario (Azure Meridian):** `#0077BE` - Proyecta confianza, profesionalismo y estabilidad.
- **Acento de Lujo:** `#C26D4D` (Terracota) - Aporta calidez orgánica y conecta con la tierra y los materiales de construcción modernos.
- **Superficies:** Fondos limpios en blanco y grises suaves para maximizar la legibilidad de las métricas.
- **Estado/Métricas:** Verdes esmeralda para indicadores de ROI positivo y crecimiento.

### Tipografía
- **Titulares:** *Noto Serif* - Elegancia atemporal, autoridad y un aire editorial de alta gama.
- **Cuerpo y Datos:** *Plus Jakarta Sans* - Moderna, geométrica y extremadamente legible para tablas de datos y filtros.

### Estética de Componentes
- **Redondez:** `ROUND_EIGHT` (8px) - Un equilibrio entre lo orgánico y lo técnico.
- **Elevación:** Sombras sutiles y uso de *glassmorphism* en la navegación para crear profundidad y una sensación de tecnología moderna.

## 3. Arquitectura de Información (Estrategia Bilingüe)
- **Navegación:** Menú híbrido (EN/ES) con acceso directo a "Oportunidades de Inversión", "Inteligencia de Mercado" y "Sobre Mike".
- **Captación de Leads:** Ubicación estratégica de formularios de "Consulta Privada" después de secciones de alta prueba social o datos de valor.

## 4. Estrategia de Contenido Visual
- **Héroe:** Fotografía de arquitectura moderna en Escazú con iluminación crepuscular para evocar exclusividad.
- **Retratos:** Uso consistente de la imagen profesional de Mike (mike.png) para humanizar la marca y construir autoridad.
- **Propiedades:** Enfoque exclusivo en casas urbanas con piscina, enfatizando el ROI y el diseño contemporáneo.

## 5. Ecosistema de Pantallas
1. **Landing Page Principal:** El centro de conversión bilingüe.
2. **Catálogo de Oportunidades:** Herramienta analítica para filtrado avanzado.
3. **Mapa del Sitio:** Guía de la infraestructura digital.

## 6. Decisiones Confirmadas al 2026-03-28

### Alcance actual del producto
- El producto activo es una landing en Vite + React + TypeScript ubicada en `landingpage`.
- Las rutas públicas activas son `/`, `/catalogo` y `/mapa-del-sitio`.
- El dominio público actual es `https://www.brokermikecr.com`.

### Decisiones de contenido
- En la sección de catálogo se simplificó el copy para evitar mencionar zonas específicas cuando no sea necesario.
- El indicador de ventas totales de la sección "El Guia Estrategico" dejó de depender de `mockData` y ahora se edita desde un archivo dedicado:
  - `landingpage/src/content/editableContent.ts`
- La intención es separar contenido editable de datos mock estructurales.

### Decisiones de implementación
- `landingpage/src/data/mockData.ts` sigue siendo la fuente principal de mocks para propiedades, testimonios y otras piezas de UI.
- El contenido que el cliente puede necesitar cambiar con frecuencia debe moverse gradualmente a archivos dedicados dentro de `landingpage/src/content`.
- Se preserva el enfoque visual editorial/premium descrito arriba, pero la implementación real hoy usa Google Fonts cargadas desde `index.html`.

### Decisiones de deploy
- El despliegue objetivo actual es Railway.
- La app se despliega desde la subcarpeta `landingpage`.
- Para endurecer headers y evitar problemas de resolución del lockfile en Railway, se introdujo un deploy basado en Docker + Caddy en `landingpage`.

### Estado de seguridad web
- El sitio ya responde en producción con SSL válido y código HTTP 200.
- Los headers `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy` ya están saliendo desde producción.
- Sigue pendiente validar que `/.well-known/security.txt` esté siendo servido correctamente en producción.
- Sigue pendiente decidir si se quiere activar HSTS con `preload`.

## 7. Estado Actual del Proyecto al 2026-03-28

### Hecho
- Landing principal operativa.
- Catálogo operativo.
- Mapa del sitio operativo.
- Contenido editable inicial creado para `salesTotal`.
- Deploy en Railway funcionando.
- Dominio `www.brokermikecr.com` respondiendo correctamente.
- Headers de seguridad HTTP principales implementados.

### Pendiente
- Confirmar publicación efectiva de `/.well-known/security.txt`.
- Regenerar y subir `landingpage/package-lock.json` después del cambio de `eslint` a v9 compatible.
- Decidir si se desea activar HSTS `preload`.
- Evaluar mejoras secundarias de producción como DNSSEC, WAF y registros TXT si el negocio lo requiere.

### Restricciones y notas
- En este entorno local no fue posible validar `npm run build` porque Node falla bajo WSL 1.
- La verificación final de build/deploy debe hacerse desde una terminal local compatible del usuario.
