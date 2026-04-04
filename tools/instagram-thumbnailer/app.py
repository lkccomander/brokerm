from __future__ import annotations

import base64
import html
import json
import mimetypes
import os
import re
import time
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urljoin, urlparse
from urllib.request import Request, urlopen


APP_DIR = Path(__file__).resolve().parent
STATIC_DIR = APP_DIR / "static"
DEBUG_DIR = APP_DIR / "debug"
GENERATED_DIR = APP_DIR / "generated"
PROFILE_CACHE_DIR = APP_DIR / "cache"
BROWSER_PROFILE_DIR = APP_DIR / "browser-profile"
LANDINGPAGE_DIR = APP_DIR.parent.parent / "landingpage"
LANDINGPAGE_PUBLIC_ASSETS_DIR = LANDINGPAGE_DIR / "public" / "assets"
LANDINGPAGE_DIST_ASSETS_DIR = LANDINGPAGE_DIR / "dist" / "assets"
PROJECT_BRAIN_DIR = APP_DIR.parent.parent / "project-brain"
PRIORITY_LIST_PATH = PROJECT_BRAIN_DIR / "lista.md"
CATALOG_IMAGE_DIRNAME = "catalog"
CATALOG_JSON_FILENAME = "property-catalog.json"
CATALOG_STATUSES = {"disponible", "rentada", "vendida"}
CATALOG_CATEGORIES = {"alquiler", "venta", "bodegas"}
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765
PLAYWRIGHT_HEADLESS = os.environ.get("SOCIAL_THUMBNAILER_HEADED", "").strip() != "1"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/123.0.0.0 Safari/537.36"
)
SUPPORTED_PLATFORMS = {
    "instagram.com": "Instagram",
    "www.instagram.com": "Instagram",
    "tiktok.com": "TikTok",
    "www.tiktok.com": "TikTok",
}


class MetaTagParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.meta: dict[str, str] = {}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "meta":
            return

        attr_map = {name.lower(): (value or "") for name, value in attrs}
        key = attr_map.get("property") or attr_map.get("name")
        content = attr_map.get("content")
        if key and content:
            self.meta[key] = html.unescape(content)


def extract_meta_tags(document: str) -> dict[str, str]:
    parser = MetaTagParser()
    parser.feed(document)
    return parser.meta


def extract_script_json(document: str, script_id: str) -> dict | None:
    marker = f'<script id="{script_id}"'
    start = document.find(marker)
    if start == -1:
        return None

    content_start = document.find(">", start)
    if content_start == -1:
        return None

    content_end = document.find("</script>", content_start)
    if content_end == -1:
        return None

    raw_json = document[content_start + 1 : content_end].strip()
    if not raw_json:
        return None

    try:
        return json.loads(raw_json)
    except json.JSONDecodeError:
        return None


def find_first_value(payload, predicate):
    if predicate(payload):
        return payload

    if isinstance(payload, dict):
        for value in payload.values():
            found = find_first_value(value, predicate)
            if found is not None:
                return found
    elif isinstance(payload, list):
        for value in payload:
            found = find_first_value(value, predicate)
            if found is not None:
                return found

    return None


def first_non_empty_string(values: list[str | None]) -> str:
    for value in values:
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def first_url_from_candidates(candidates: list[str | None]) -> str:
    for candidate in candidates:
        if isinstance(candidate, str) and candidate.startswith("http"):
            return candidate
    return ""


def slugify_text(value: str) -> str:
    normalized = value.strip().lower()
    replacements = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ñ": "n",
    }
    for source, target in replacements.items():
        normalized = normalized.replace(source, target)
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-")
    return normalized or "property"


def split_details(value: str | list[str] | None) -> list[str]:
    if isinstance(value, list):
        raw_items = value
    elif isinstance(value, str):
        raw_items = re.split(r"[\n,;]+", value)
    else:
        raw_items = []

    items: list[str] = []
    seen: set[str] = set()
    for raw_item in raw_items:
        item = " ".join(str(raw_item).strip().split())
        if not item:
            continue
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        items.append(item)
        if len(items) >= 6:
            break
    return items


def as_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "si", "on"}
    return False


def normalize_catalog_category(value: str) -> str:
    normalized = value.strip().lower()
    if normalized in CATALOG_CATEGORIES:
        return normalized
    return "alquiler"


def normalize_catalog_status(value: str) -> str:
    normalized = value.strip().lower()
    if normalized in CATALOG_STATUSES:
        return normalized
    return "disponible"


def default_badge_for_category(category: str) -> tuple[str, str]:
    if category == "venta":
        return ("SE VENDE", "secondary")
    if category == "bodegas":
        return ("SE ALQUILAN", "tertiary")
    return ("SE ALQUILA", "primary")


def infer_price_label(price: float, category: str, currency: str) -> str:
    if currency == "CRC":
        formatted = f"₡{int(price):,}".replace(",", ",")
    else:
        formatted = f"${int(price):,} USD".replace(",", ",")

    if category == "venta":
        return formatted
    if category == "bodegas":
        return f"Desde {formatted} / mes"
    return f"{formatted} / mes"


def catalog_asset_dirs() -> list[Path]:
    directories = [
        LANDINGPAGE_PUBLIC_ASSETS_DIR / CATALOG_IMAGE_DIRNAME,
        LANDINGPAGE_DIST_ASSETS_DIR / CATALOG_IMAGE_DIRNAME,
    ]
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
    return directories


def catalog_json_paths() -> list[Path]:
    paths = [
        LANDINGPAGE_PUBLIC_ASSETS_DIR / CATALOG_JSON_FILENAME,
        LANDINGPAGE_DIST_ASSETS_DIR / CATALOG_JSON_FILENAME,
    ]
    for path in paths:
        path.parent.mkdir(parents=True, exist_ok=True)
    return paths


def load_catalog_bundle() -> dict:
    for path in catalog_json_paths():
        if path.is_file():
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                continue
            if isinstance(payload, dict):
                return payload

    return {
        "source": "social-thumbnailer",
        "generatedAt": "",
        "allProperties": [],
        "featuredProperties": [],
        "catalogProperties": [],
    }


def load_priority_post_urls() -> list[str]:
    if not PRIORITY_LIST_PATH.is_file():
        return []

    text = PRIORITY_LIST_PATH.read_text(encoding="utf-8")
    urls = re.findall(r"https://www\.instagram\.com/(?:reel|p)/[A-Za-z0-9_-]+/?", text)
    seen: set[str] = set()
    ordered: list[str] = []
    for url in urls:
        normalized = url.rstrip("/") + "/"
        if normalized in seen:
            continue
        seen.add(normalized)
        ordered.append(normalized)
    return ordered


def merge_priority_posts(posts: list[dict[str, str]]) -> list[dict[str, str]]:
    priority_urls = load_priority_post_urls()
    if not priority_urls:
        return posts

    by_url = {str(item.get("url", "")).rstrip("/") + "/": item for item in posts}
    prioritized: list[dict[str, str]] = []
    seen: set[str] = set()

    for url in priority_urls:
        post = by_url.get(url)
        if not post:
            continue
        prioritized.append(post)
        seen.add(url)

    for post in posts:
        url = str(post.get("url", "")).rstrip("/") + "/"
        if url in seen:
            continue
        prioritized.append(post)

    return prioritized


def normalize_instagram_url_for_order(value: str) -> str:
    return value.strip().rstrip("/") + "/"


def order_items_by_priority_list(items: list[dict]) -> list[dict]:
    priority_urls = load_priority_post_urls()
    if not priority_urls:
        return items

    priority_order = {
        normalize_instagram_url_for_order(url): index
        for index, url in enumerate(priority_urls)
    }

    indexed_items = list(enumerate(items))
    indexed_items.sort(
        key=lambda pair: (
            priority_order.get(
                normalize_instagram_url_for_order(str(pair[1].get("sourceUrl", "") or str(pair[1].get("url", "")))),
                10**9,
            ),
            pair[0],
        )
    )
    return [item for _, item in indexed_items]


def resolve_priority_links() -> dict:
    priority_urls = load_priority_post_urls()
    opened: list[dict[str, str]] = []
    failed: list[dict[str, str]] = []

    for url in priority_urls:
        try:
            metadata = fetch_social_metadata(url)
            opened.append(
                {
                    "url": metadata.get("canonical_url") or url,
                    "thumbnailUrl": metadata.get("image_url") or "",
                    "label": metadata.get("title") or url,
                    "kind": "reel" if "/reel/" in url else "post",
                    "opened": True,
                }
            )
        except ValueError as error:
            failed.append(
                {
                    "url": url,
                    "label": url,
                    "kind": "reel" if "/reel/" in url else "post",
                    "opened": False,
                    "error": str(error),
                }
            )

    return {
        "links": priority_urls,
        "opened": opened,
        "failed": failed,
    }


def save_batch_import(payload: dict) -> Path:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    batch_file = GENERATED_DIR / "catalog-import-drafts.json"
    batch_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return batch_file


def load_existing_batch_import() -> dict:
    batch_file = GENERATED_DIR / "catalog-import-drafts.json"
    if not batch_file.is_file():
        return {"generatedAt": "", "count": 0, "drafts": []}

    try:
        payload = json.loads(batch_file.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"generatedAt": "", "count": 0, "drafts": []}

    drafts = payload.get("drafts", [])
    if not isinstance(drafts, list):
        drafts = []

    return {
        "generatedAt": str(payload.get("generatedAt", "")),
        "count": len(drafts),
        "drafts": [item for item in drafts if isinstance(item, dict)],
    }


def next_draft_number(existing_drafts: list[dict]) -> int:
    numbers: list[int] = []
    for item in existing_drafts:
        draft_id = str(item.get("draftId", ""))
        match = re.fullmatch(r"draft-(\d+)", draft_id)
        if match:
            numbers.append(int(match.group(1)))
    return (max(numbers) + 1) if numbers else 1


def compact_spaces(value: str) -> str:
    return " ".join(value.strip().split())


def extract_phone_from_text(text: str) -> str:
    match = re.search(r"(\d{4})\D?(\d{4})", text)
    if not match:
        return "7112 1318"
    return f"{match.group(1)} {match.group(2)}"


def infer_category_from_draft_text(text: str) -> str:
    lowered = text.casefold()
    if "bodega" in lowered:
        return "bodegas"
    if "se vende" in lowered or "venta" in lowered:
        return "venta"
    return "alquiler"


def extract_price_from_draft_text(text: str, category: str) -> tuple[float, str]:
    crc_match = re.search(r"(₡\s*[\d.,]+)", text, re.IGNORECASE)
    if crc_match:
        raw_label = compact_spaces(crc_match.group(1)).replace(" ", "")
        digits = re.sub(r"[^\d]", "", raw_label)
        price = float(digits) if digits else 0
        label = raw_label if category == "venta" else f"{raw_label} / mes"
        return price, label

    usd_match = re.search(r"(\$\s*[\d.,]+(?:\s*USD)?)|((?:USD\s*)?\$?\s*[\d.,]+\s*USD)", text, re.IGNORECASE)
    if usd_match:
        raw_label = compact_spaces(usd_match.group(0)).replace(" $", " $").strip()
        digits = re.sub(r"[^\d]", "", raw_label)
        price = float(digits) if digits else 0
        normalized_label = raw_label.upper().replace("US$", "$").replace("$ ", "$")
        if "USD" not in normalized_label:
            normalized_label = f"{normalized_label} USD"
        normalized_label = normalized_label.replace("  ", " ")
        label = normalized_label if category == "venta" else f"{normalized_label} / mes"
        return price, label

    return 0, ("Consultar precio" if category == "venta" else "Consultar precio / mes")


def extract_beds_baths_from_draft_text(text: str) -> tuple[int, int]:
    beds_match = re.search(r"(\d+)\s+habitaci(?:ó|o)?n(?:es)?", text, re.IGNORECASE)
    baths_match = re.search(r"(\d+)\s+ba(?:ñ|n)o(?:s)?", text, re.IGNORECASE)
    beds = int(beds_match.group(1)) if beds_match else 0
    baths = int(baths_match.group(1)) if baths_match else 0
    return beds, baths


def infer_location_from_draft_text(text: str) -> str:
    first_line = next((compact_spaces(line) for line in text.splitlines() if line.strip()), "")
    lowered = first_line.casefold()
    marker = " en "
    if marker not in lowered:
        return "Ubicación por confirmar"

    after = first_line[lowered.index(marker) + len(marker):]
    parts = [compact_spaces(part.strip(" ,")) for part in after.split(",")]
    accepted: list[str] = []

    stop_patterns = [
        r"\d+\s+habitaci(?:ó|o)?n",
        r"\d+\s+ba(?:ñ|n)o",
        r"\$\s*[\d.,]+",
        r"₡\s*[\d.,]+",
    ]
    stop_terms = [
        "full amobl",
        "amoblad",
        "linea blanca",
        "línea blanca",
        "telefono",
        "teléfono",
        "parqueo",
        "seguridad",
        "piscina",
        "ascensor",
    ]

    for part in parts:
        if not part:
            continue
        lowered_part = part.casefold()
        if any(re.search(pattern, lowered_part, re.IGNORECASE) for pattern in stop_patterns):
            break
        if any(term in lowered_part for term in stop_terms):
            break
        accepted.append(part)

    return ", ".join(accepted) if accepted else "Ubicación por confirmar"


def infer_title_from_draft_text(text: str, category: str, location: str, beds: int, baths: int) -> str:
    lowered = text.casefold()
    if "bodega" in lowered:
        noun = "Bodega"
    elif "casa" in lowered:
        noun = "Casa"
    elif "oficina" in lowered:
        noun = "Oficina"
    else:
        noun = "Apartamento"

    features: list[str] = []
    if beds > 0 and noun not in {"Bodega", "Oficina"}:
        features.append(f"{beds} Habitaciones" if beds != 1 else "1 Habitación")
    if baths > 0 and noun not in {"Bodega", "Oficina"} and baths > 1:
        features.append(f"{baths} Baños")
    if "amoblad" in lowered:
        features.append("Amoblado")
    elif "línea blanca" in lowered or "linea blanca" in lowered:
        features.append("con Línea Blanca")
    elif "balcón" in lowered or "balcon" in lowered:
        features.append("con Balcón")
    elif "esquinero" in lowered:
        features.append("Esquinero")

    if features:
        return f"{noun} {' · '.join(features)}"
    if location != "Ubicación por confirmar":
        return f"{noun} en {location}"
    if category == "bodegas":
        return "Bodega Disponible"
    if category == "venta":
        return "Propiedad en Venta"
    return "Propiedad en Alquiler"


def extract_details_from_draft_text(text: str, location: str) -> list[str]:
    details: list[str] = []
    seen: set[str] = set()
    skip_exact = {
        "apartamento",
        "casa",
        "amenidades",
        "amenidades:",
        "apartamento:",
        "bodega:",
    }

    for raw_line in text.splitlines()[1:]:
        line = compact_spaces(raw_line)
        if not line:
            continue
        lowered = line.casefold()
        if lowered in skip_exact:
            continue
        if lowered.startswith("#") or "teléfono" in lowered or "telefono" in lowered:
            continue
        if location != "Ubicación por confirmar" and line == location:
            continue
        if re.search(r"(\$\s*[\d.,]+|₡\s*[\d.,]+)", line):
            continue
        key = lowered
        if key in seen:
            continue
        seen.add(key)
        details.append(line)
        if len(details) >= 6:
            break

    return details


def build_property_from_draft(draft: dict, existing_property: dict | None, next_id: str) -> dict:
    text = str(draft.get("title", "")).strip()
    category = infer_category_from_draft_text(text)
    price, price_label = extract_price_from_draft_text(text, category)
    beds, baths = extract_beds_baths_from_draft_text(text)
    location = infer_location_from_draft_text(text)
    title = infer_title_from_draft_text(text, category, location, beds, baths)
    details = extract_details_from_draft_text(text, location)
    badge_text, badge_variant = default_badge_for_category(category)
    status = normalize_catalog_status(str(draft.get("status", "disponible")))
    featured = (as_bool(draft.get("featured")) or as_bool((existing_property or {}).get("featured"))) and status == "disponible"
    existing_image = str((existing_property or {}).get("image", "")).strip()
    thumbnail_url = str(draft.get("thumbnailUrl", "")).strip()
    image = existing_image if existing_image.startswith("/") else (thumbnail_url or existing_image)

    property_item = {
        "id": str((existing_property or {}).get("id", "")).strip() or next_id,
        "category": category,
        "status": status,
        "title": title,
        "location": location,
        "price": price,
        "priceLabel": price_label,
        "beds": beds,
        "baths": baths,
        "image": image,
        "details": details,
        "badge": {
            "text": badge_text,
            "variant": badge_variant,
        },
        "contactPhone": extract_phone_from_text(text),
        "inquiryEnabled": True,
        "inquirySource": "catalogo",
        "featured": featured,
        "sourceUrl": str(draft.get("sourceUrl", "")).strip(),
    }

    translations = (existing_property or {}).get("translations")
    if isinstance(translations, dict):
        property_item["translations"] = translations

    return property_item


def publish_drafts_to_catalog() -> dict:
    drafts_payload = load_existing_batch_import()
    drafts = drafts_payload.get("drafts", [])
    if not drafts:
        raise ValueError("No hay borradores en catalog-import-drafts.json para publicar.")

    existing_bundle = load_catalog_bundle()
    existing_properties = existing_bundle.get("allProperties", [])
    existing_by_source = {
        normalize_instagram_url_for_order(str(item.get("sourceUrl", ""))): item
        for item in existing_properties
        if isinstance(item, dict) and str(item.get("sourceUrl", "")).strip()
    }

    published_properties: list[dict] = []
    next_number = max(
        [
            int(match.group(1))
            for item in existing_properties
            for match in [re.fullmatch(r"prop-(\d+)", str(item.get("id", "")))]
            if match
        ] or [0]
    ) + 1

    for draft in drafts:
        if not isinstance(draft, dict):
            continue
        source_url = normalize_instagram_url_for_order(str(draft.get("sourceUrl", "")))
        if not source_url:
            continue
        existing_property = existing_by_source.get(source_url)
        property_id = str(existing_property.get("id", "")).strip() if existing_property else f"prop-{next_number}"
        property_item = build_property_from_draft(draft, existing_property, property_id)
        published_properties.append(property_item)
        if not existing_property:
            next_number += 1

    if not any(as_bool(item.get("featured")) and item.get("status") == "disponible" for item in published_properties):
        featured_assigned = 0
        for item in published_properties:
            if item.get("status") != "disponible":
                item["featured"] = False
                continue
            item["featured"] = featured_assigned < 4
            if item["featured"]:
                featured_assigned += 1

    bundle = {
        "source": "social-thumbnailer-drafts",
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "allProperties": published_properties,
        "featuredProperties": [item for item in published_properties if as_bool(item.get("featured")) and item.get("status") == "disponible"],
        "catalogProperties": published_properties,
    }
    save_catalog_bundle(bundle)
    return bundle


def analyze_batch_import_duplicates() -> dict:
    batch_file = GENERATED_DIR / "catalog-import-drafts.json"
    if not batch_file.is_file():
        return {
            "file": str(batch_file),
            "exists": False,
            "totalDrafts": 0,
            "duplicateGroups": [],
            "duplicateEntries": 0,
        }

    try:
        payload = json.loads(batch_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {
            "file": str(batch_file),
            "exists": True,
            "invalid": True,
            "totalDrafts": 0,
            "duplicateGroups": [],
            "duplicateEntries": 0,
        }

    drafts = payload.get("drafts", [])
    if not isinstance(drafts, list):
        drafts = []

    by_url: dict[str, list[dict]] = {}
    for draft in drafts:
        if not isinstance(draft, dict):
            continue
        source_url = str(draft.get("sourceUrl", "")).strip()
        if not source_url:
            continue
        normalized_url = source_url.rstrip("/") + "/"
        by_url.setdefault(normalized_url, []).append(draft)

    duplicate_groups = []
    duplicate_entries = 0
    for source_url, items in by_url.items():
        if len(items) <= 1:
            continue
        duplicate_entries += len(items)
        duplicate_groups.append(
            {
                "sourceUrl": source_url,
                "count": len(items),
                "draftIds": [str(item.get("draftId", "")) for item in items],
                "titles": [str(item.get("title", "")) for item in items],
            }
        )

    return {
        "file": str(batch_file),
        "exists": True,
        "invalid": False,
        "totalDrafts": len(drafts),
        "duplicateGroups": duplicate_groups,
        "duplicateEntries": duplicate_entries,
    }


def sync_batch_import_order() -> dict:
    existing_payload = load_existing_batch_import()
    drafts = existing_payload.get("drafts", [])
    if not drafts:
        raise ValueError("Todavía no existe un catalog-import-drafts.json con borradores para sincronizar.")

    ordered_drafts = order_items_by_priority_list(drafts)
    synced_payload = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(ordered_drafts),
        "drafts": ordered_drafts,
    }
    batch_file = save_batch_import(synced_payload)

    return {
        "message": "Se sincronizó el orden de catalog-import-drafts.json con lista.md.",
        "count": len(ordered_drafts),
        "file": str(batch_file),
        "firstSourceUrl": str(ordered_drafts[0].get("sourceUrl", "")).strip() if ordered_drafts else "",
    }


def save_catalog_bundle(bundle: dict) -> None:
    content = json.dumps(bundle, ensure_ascii=False, indent=2)
    for path in catalog_json_paths():
        path.write_text(content, encoding="utf-8")


def next_property_id(existing_properties: list[dict]) -> str:
    numbers = []
    for property_item in existing_properties:
        property_id = str(property_item.get("id", ""))
        match = re.fullmatch(r"prop-(\d+)", property_id)
        if match:
            numbers.append(int(match.group(1)))
    return f"prop-{(max(numbers) + 1) if numbers else 1}"


def save_catalog_thumbnail(base64_data_url: str, slug: str) -> str:
    match = re.match(r"^data:(image\/(?:png|jpeg));base64,(.+)$", base64_data_url, re.DOTALL)
    if not match:
        raise ValueError("El thumbnail final no llego en un formato valido.")

    mime_type = match.group(1)
    raw_payload = match.group(2)
    extension = ".png" if mime_type == "image/png" else ".jpg"
    filename = f"{slug}-512x288{extension}"
    binary = base64.b64decode(raw_payload)

    for directory in catalog_asset_dirs():
        (directory / filename).write_bytes(binary)

    return f"/assets/{CATALOG_IMAGE_DIRNAME}/{filename}"


def normalize_property_payload(payload: dict, existing_property: dict | None = None) -> dict:
    title = " ".join(str(payload.get("title", "")).strip().split())
    location = " ".join(str(payload.get("location", "")).strip().split())
    if not title or not location:
        raise ValueError("La propiedad necesita titulo y ubicacion.")

    category = normalize_catalog_category(str(payload.get("category", "alquiler")))
    status = normalize_catalog_status(str(payload.get("status", "disponible")))
    featured = as_bool(payload.get("featured")) and status == "disponible"
    price = float(payload.get("price") or 0)
    if price <= 0:
        raise ValueError("La propiedad necesita un precio numerico mayor que cero.")

    price_label = " ".join(str(payload.get("priceLabel", "")).strip().split())
    currency = "CRC" if "₡" in price_label or str(payload.get("currency", "")).strip().upper() == "CRC" else "USD"
    details = split_details(payload.get("details"))
    badge_text, badge_variant = default_badge_for_category(category)

    normalized = {
        "id": existing_property.get("id") if existing_property else payload.get("id", ""),
        "category": category,
        "status": status,
        "title": title,
        "location": location,
        "price": price,
        "priceLabel": price_label or infer_price_label(price, category, currency),
        "beds": int(payload.get("beds") or 0),
        "baths": int(payload.get("baths") or 0),
        "image": payload.get("image", ""),
        "details": details,
        "badge": {
            "text": badge_text,
            "variant": badge_variant,
        },
        "contactPhone": "7112 1318",
        "inquiryEnabled": True,
        "inquirySource": "catalogo",
        "featured": featured,
        "sourceUrl": str(payload.get("sourceUrl", "")).strip(),
    }

    if existing_property and isinstance(existing_property.get("translations"), dict):
        normalized["translations"] = existing_property["translations"]

    return normalized


def rebuild_catalog_bundle(properties: list[dict]) -> dict:
    featured = [
        item for item in properties
        if as_bool(item.get("featured")) and item.get("status") == "disponible"
    ]
    return {
        "source": "social-thumbnailer",
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "allProperties": properties,
        "featuredProperties": featured,
        "catalogProperties": properties,
    }


def normalize_badge_variant(value: str) -> str:
    normalized = value.strip().lower()
    if normalized in {"primary", "secondary", "tertiary"}:
        return normalized
    return "primary"


def normalize_catalog_property_editor_payload(payload: dict, existing_property: dict) -> dict:
    title = compact_spaces(str(payload.get("title", existing_property.get("title", ""))))
    location = compact_spaces(str(payload.get("location", existing_property.get("location", ""))))
    if not title or not location:
        raise ValueError("La propiedad necesita titulo y ubicacion.")

    category = normalize_catalog_category(str(payload.get("category", existing_property.get("category", "alquiler"))))
    status = normalize_catalog_status(str(payload.get("status", existing_property.get("status", "disponible"))))
    price = float(payload.get("price", existing_property.get("price", 0)) or 0)
    if price < 0:
        raise ValueError("El precio no puede ser negativo.")

    badge_payload = payload.get("badge", existing_property.get("badge", {}))
    badge_text = compact_spaces(str((badge_payload or {}).get("text", ""))) or default_badge_for_category(category)[0]
    badge_variant = normalize_badge_variant(str((badge_payload or {}).get("variant", "")) or default_badge_for_category(category)[1])
    featured = as_bool(payload.get("featured", existing_property.get("featured"))) and status == "disponible"

    normalized = {
        **existing_property,
        "id": str(existing_property.get("id", "")).strip(),
        "category": category,
        "status": status,
        "title": title,
        "location": location,
        "price": price,
        "priceLabel": compact_spaces(str(payload.get("priceLabel", existing_property.get("priceLabel", "")))),
        "beds": max(0, int(payload.get("beds", existing_property.get("beds", 0)) or 0)),
        "baths": max(0, int(payload.get("baths", existing_property.get("baths", 0)) or 0)),
        "image": compact_spaces(str(payload.get("image", existing_property.get("image", "")))),
        "details": split_details(payload.get("details", existing_property.get("details", []))),
        "badge": {
            "text": badge_text,
            "variant": badge_variant,
        },
        "contactPhone": compact_spaces(str(payload.get("contactPhone", existing_property.get("contactPhone", "7112 1318")))),
        "inquiryEnabled": as_bool(payload.get("inquiryEnabled", existing_property.get("inquiryEnabled", True))),
        "inquirySource": compact_spaces(str(payload.get("inquirySource", existing_property.get("inquirySource", "catalogo")))) or "catalogo",
        "featured": featured,
        "sourceUrl": compact_spaces(str(payload.get("sourceUrl", existing_property.get("sourceUrl", "")))),
    }

    return normalized


def metadata_from_tiktok_rehydration(document: str, fallback_url: str) -> dict[str, str] | None:
    payload = extract_script_json(document, "__UNIVERSAL_DATA_FOR_REHYDRATION__")
    if not payload:
        return None

    item_struct = find_first_value(
        payload,
        lambda value: isinstance(value, dict) and (
            "PlayAddrStruct" in value or "PlayAddr" in value or "video" in value
        ),
    )
    if not isinstance(item_struct, dict):
        return None

    play_addr_struct = item_struct.get("PlayAddrStruct") if isinstance(item_struct.get("PlayAddrStruct"), dict) else {}
    play_addr = item_struct.get("PlayAddr") if isinstance(item_struct.get("PlayAddr"), dict) else {}
    video_info = item_struct.get("video") if isinstance(item_struct.get("video"), dict) else {}

    video_url = first_url_from_candidates(
        [
            *(play_addr_struct.get("UrlList") or []),
            *(play_addr.get("UrlList") or []),
            *(video_info.get("downloadAddr") and [video_info.get("downloadAddr")] or []),
            *(video_info.get("playAddr") and [video_info.get("playAddr")] or []),
        ]
    )

    image_url = first_url_from_candidates(
        [
            item_struct.get("video", {}).get("cover"),
            item_struct.get("video", {}).get("originCover"),
            item_struct.get("video", {}).get("dynamicCover"),
            item_struct.get("video", {}).get("downloadCover"),
        ]
    )

    share_meta = find_first_value(payload, lambda value: isinstance(value, dict) and "shareMeta" in value)
    share_meta_dict = share_meta.get("shareMeta") if isinstance(share_meta, dict) else {}
    author = item_struct.get("author") if isinstance(item_struct.get("author"), dict) else {}

    description = first_non_empty_string(
        [
            share_meta_dict.get("desc"),
            item_struct.get("desc"),
            " ".join(
                entry.get("desc", "").strip()
                for entry in item_struct.get("contents", [])
                if isinstance(entry, dict) and entry.get("desc")
            ),
        ]
    )
    author_name = first_non_empty_string(
        [author.get("nickname"), author.get("uniqueId"), share_meta_dict.get("title")]
    )
    title = description or author_name or "Post de TikTok"

    if not image_url and not video_url:
        return None

    return {
        "title": title,
        "image_url": image_url,
        "video_url": video_url,
        "canonical_url": fallback_url,
    }


def platform_label_from_url(value: str) -> str:
    host = urlparse(value).netloc.lower()
    return SUPPORTED_PLATFORMS.get(host, "Post")


def is_instagram_profile_url(value: str) -> bool:
    parsed = urlparse(value)
    if "instagram.com" not in parsed.netloc.lower():
        return False

    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) != 1:
        return False

    return parts[0] not in {"p", "reel", "reels", "tv", "stories", "explore"}


def normalize_social_url(value: str) -> str:
    parsed = urlparse(value.strip())
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("El link debe usar http o https.")
    host = parsed.netloc.lower()
    if host not in SUPPORTED_PLATFORMS:
        raise ValueError("El link debe ser de Instagram o TikTok.")

    clean_path = parsed.path.rstrip("/")
    if not clean_path:
        raise ValueError("El link no contiene una ruta valida.")

    query = f"?{parsed.query}" if parsed.query else ""
    return f"https://{host}{clean_path}{query}"


def save_debug_html(html_text: str, filename: str) -> Path:
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    debug_file = DEBUG_DIR / filename
    debug_file.write_text(html_text, encoding="utf-8")
    return debug_file


def save_debug_text(text: str, filename: str) -> Path:
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    debug_file = DEBUG_DIR / filename
    debug_file.write_text(text, encoding="utf-8")
    return debug_file


def save_generated_bytes(data: bytes, suffix: str = ".png") -> Path:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    generated_file = GENERATED_DIR / f"frame-{time.time_ns()}{suffix}"
    generated_file.write_bytes(data)
    return generated_file


def profile_cache_path(profile_url: str) -> Path:
    PROFILE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    username = [part for part in urlparse(profile_url).path.split("/") if part]
    slug = username[0] if username else "instagram-profile"
    return PROFILE_CACHE_DIR / f"{slug}-posts.json"


def save_profile_posts_cache(profile_url: str, posts: list[dict[str, str]]) -> None:
    profile_cache_path(profile_url).write_text(
        json.dumps(posts, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_profile_posts_cache(profile_url: str) -> list[dict[str, str]]:
    cache_file = profile_cache_path(profile_url)
    if not cache_file.is_file():
        return []

    try:
        payload = json.loads(cache_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []

    return payload if isinstance(payload, list) else []


def extract_instagram_profile_posts_from_html(profile_url: str, html_text: str) -> list[dict[str, str]]:
    matches = re.finditer(
        r'<a [^>]*href="([^"]*(?:/reel/|/p/)[^"]*)"[^>]*>(.*?)</a>',
        html_text,
        re.DOTALL,
    )

    posts: list[dict[str, str]] = []
    seen: set[str] = set()

    for match in matches:
        href = html.unescape(match.group(1))
        content = match.group(2)
        if href in seen:
            continue

        image_match = re.search(r'<img [^>]*src="([^"]+)"[^>]*alt="([^"]*)"', content, re.DOTALL)
        if not image_match:
            image_match = re.search(r'<img [^>]*alt="([^"]*)"[^>]*src="([^"]+)"', content, re.DOTALL)

        if not image_match:
            continue

        if 'src="' in image_match.group(0) and 'alt="' in image_match.group(0):
            if image_match.group(0).find('src="') < image_match.group(0).find('alt="'):
                thumbnail_url = html.unescape(image_match.group(1))
                label = html.unescape(image_match.group(2))
            else:
                label = html.unescape(image_match.group(1))
                thumbnail_url = html.unescape(image_match.group(2))
        else:
            continue

        absolute_url = urljoin(profile_url, href)
        posts.append(
            {
                "url": absolute_url,
                "thumbnailUrl": thumbnail_url,
                "label": label or absolute_url,
                "kind": "reel" if "/reel/" in href else "post",
            }
        )
        seen.add(href)

    return posts


def extract_instagram_profile_posts_with_playwright(page, profile_url: str) -> list[dict[str, str]]:
    raw_posts = page.evaluate(
        """
        () => {
          const anchors = Array.from(document.querySelectorAll('a[href]'));
          const items = [];
          const seen = new Set();

          for (const anchor of anchors) {
            const href = anchor.getAttribute('href') || '';
            if (!href.includes('/reel/') && !href.includes('/p/')) {
              continue;
            }

            const absoluteUrl = new URL(href, window.location.origin).toString();
            if (seen.has(absoluteUrl)) {
              continue;
            }

            const image =
              anchor.querySelector('img') ||
              anchor.closest('article')?.querySelector('img') ||
              anchor.parentElement?.querySelector('img');

            const thumbnailUrl =
              image?.getAttribute('src') ||
              image?.getAttribute('data-src') ||
              image?.currentSrc ||
              '';

            const label =
              image?.getAttribute('alt') ||
              anchor.getAttribute('aria-label') ||
              anchor.textContent ||
              absoluteUrl;

            const rect = anchor.getBoundingClientRect();

            items.push({
              url: absoluteUrl,
              thumbnailUrl,
              label: (label || absoluteUrl).trim(),
              kind: href.includes('/reel/') ? 'reel' : 'post',
              top: Number.isFinite(rect.top) ? rect.top + window.scrollY : 0,
              left: Number.isFinite(rect.left) ? rect.left + window.scrollX : 0,
            });
            seen.add(absoluteUrl);
          }

          return items;
        }
        """
    )

    posts: list[dict[str, str]] = []
    for item in raw_posts:
        if not isinstance(item, dict):
            continue
        absolute_url = item.get("url", "").strip()
        if not absolute_url:
            continue
        thumbnail_url = item.get("thumbnailUrl", "").strip()
        label = item.get("label", "").strip() or absolute_url
        kind = item.get("kind", "").strip() or ("reel" if "/reel/" in absolute_url else "post")
        posts.append(
            {
                "url": absolute_url,
                "thumbnailUrl": thumbnail_url,
                "label": label,
                "kind": kind,
                "_top": float(item.get("top", 0) or 0),
                "_left": float(item.get("left", 0) or 0),
            }
        )

    posts.sort(key=lambda item: (round(item.get("_top", 0) / 8), item.get("_left", 0)))

    for item in posts:
        item.pop("_top", None)
        item.pop("_left", None)

    return posts


def looks_like_instagram_login_page(html_text: str) -> bool:
    markers = [
        'name="email"',
        "Número de celular, nombre de usuario o correo",
        "Inicia sesión",
        "Log in",
        "password",
    ]
    return sum(1 for marker in markers if marker in html_text) >= 2


def metadata_from_rendered_html(
    html_text: str,
    fallback_url: str,
    default_title: str,
) -> dict[str, str] | None:
    if "tiktok.com" in fallback_url:
        tiktok_metadata = metadata_from_tiktok_rehydration(html_text, fallback_url)
        if tiktok_metadata:
            return tiktok_metadata

    meta = extract_meta_tags(html_text)
    image_url = (
        meta.get("og:image:secure_url")
        or meta.get("og:image")
        or meta.get("twitter:image")
    )
    video_url = (
        meta.get("og:video:secure_url")
        or meta.get("og:video")
        or meta.get("twitter:player:stream")
        or meta.get("og:video:url")
    )
    canonical_url = meta.get("og:url", fallback_url)
    title = meta.get("og:title") or meta.get("twitter:title") or default_title

    if image_url or video_url:
        return {
            "title": title,
            "image_url": image_url or "",
            "video_url": video_url or "",
            "canonical_url": canonical_url,
        }

    return None


def playwright_imports():
    try:
        from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
        from playwright.sync_api import sync_playwright
    except ImportError as error:
        raise ValueError(
            "La plataforma bloqueo la metadata publica y Playwright no esta instalado. "
            "Instale Playwright para habilitar el fallback con navegador real."
        ) from error

    return PlaywrightTimeoutError, sync_playwright


def create_stealth_context(playwright, viewport: dict[str, int]):
    BROWSER_PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    context = playwright.chromium.launch_persistent_context(
        user_data_dir=str(BROWSER_PROFILE_DIR),
        headless=PLAYWRIGHT_HEADLESS,
        locale="es-CR",
        timezone_id="America/Costa_Rica",
        viewport=viewport,
        user_agent=USER_AGENT,
        color_scheme="dark",
        extra_http_headers={
            "Accept-Language": "es-CR,es;q=0.9,en;q=0.8",
            "DNT": "1",
        },
        args=[
            "--disable-blink-features=AutomationControlled",
            "--lang=es-CR",
            f"--window-size={viewport['width']},{viewport['height']}",
        ],
    )
    context.add_init_script(
        """
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'languages', { get: () => ['es-CR', 'es', 'en-US', 'en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4] });
        window.chrome = window.chrome || { runtime: {} };
        const originalQuery = window.navigator.permissions && window.navigator.permissions.query;
        if (originalQuery) {
          window.navigator.permissions.query = (parameters) => (
            parameters && parameters.name === 'notifications'
              ? Promise.resolve({ state: Notification.permission })
              : originalQuery(parameters)
          );
        }
        """
    )
    return context


def prepare_social_page(context, warmup_url: str, target_url: str):
    page = context.pages[0] if context.pages else context.new_page()
    page.goto(warmup_url, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(2200)
    page.goto(target_url, wait_until="domcontentloaded", timeout=30000)
    return page


def capture_frame_with_playwright(media_url: str, platform_name: str) -> Path | None:
    PlaywrightTimeoutError, sync_playwright = playwright_imports()

    try:
        with sync_playwright() as playwright:
            context = create_stealth_context(playwright, {"width": 1440, "height": 1200})
            warmup_url = "https://www.tiktok.com/" if "tiktok.com" in media_url else "https://www.instagram.com/"
            page = prepare_social_page(context, warmup_url, media_url)
            page.wait_for_timeout(4500)

            selectors = ["video", "[data-e2e='feed-video'] video", "#main-content-video_detail video"]
            frame_bytes = None
            for selector in selectors:
                locator = page.locator(selector).first
                try:
                    if locator.count() < 1:
                        continue
                    locator.scroll_into_view_if_needed(timeout=3000)
                    page.wait_for_timeout(800)
                    frame_bytes = locator.screenshot(type="png")
                    if frame_bytes:
                        break
                except Exception:
                    continue

            context.close()

            if not frame_bytes:
                return None

            return save_generated_bytes(frame_bytes, ".png")
    except PlaywrightTimeoutError:
        return None


def fetch_instagram_profile_posts(profile_url: str) -> list[dict[str, str]]:
    PlaywrightTimeoutError, sync_playwright = playwright_imports()
    debug_lines = [f"Profile URL: {profile_url}"]

    try:
        with sync_playwright() as playwright:
            context = create_stealth_context(playwright, {"width": 1440, "height": 1600})
            debug_lines.append(f"persistent_context=1 headless={int(PLAYWRIGHT_HEADLESS)}")
            page = prepare_social_page(context, "https://www.instagram.com/", profile_url)
            page.wait_for_timeout(4000)
            last_height = 0
            stable_rounds = 0
            best_posts: list[dict[str, str]] = []

            for step in range(14):
                current_posts = extract_instagram_profile_posts_with_playwright(page, profile_url)
                if len(current_posts) > len(best_posts):
                    best_posts = current_posts

                current_height = page.evaluate("() => document.body.scrollHeight")
                if current_height == last_height:
                    stable_rounds += 1
                else:
                    stable_rounds = 0
                last_height = current_height
                debug_lines.append(
                    " | ".join(
                        [
                            f"step={step + 1}",
                            f"current_posts={len(current_posts)}",
                            f"best_posts={len(best_posts)}",
                            f"scroll_height={current_height}",
                            f"stable_rounds={stable_rounds}",
                        ]
                    )
                )

                page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1200)

                if stable_rounds >= 3 and len(best_posts) >= 24:
                    debug_lines.append(
                        f"break_condition=stable_rounds>=3_and_best_posts>=24 at step {step + 1}"
                    )
                    break

            current_posts = extract_instagram_profile_posts_with_playwright(page, profile_url)
            if len(current_posts) > len(best_posts):
                best_posts = current_posts
            debug_lines.append(
                " | ".join(
                    [
                        "final_dom_scan=1",
                        f"current_posts={len(current_posts)}",
                        f"best_posts={len(best_posts)}",
                    ]
                )
            )

            page.evaluate("() => window.scrollTo(0, 0)")
            page.wait_for_timeout(400)
            rendered_html = page.content()
            save_debug_html(rendered_html, "latest-instagram-profile-rendered.html")
            context.close()
    except PlaywrightTimeoutError as error:
        raise ValueError("Playwright no logro cargar el perfil de Instagram a tiempo.") from error

    if looks_like_instagram_login_page(rendered_html):
        cached_posts = load_profile_posts_cache(profile_url)
        debug_lines.append("rendered_html_detected=login_page")
        if cached_posts:
            debug_lines.append(f"result_source=cache_on_login_page count={len(cached_posts)}")
            save_debug_text("\n".join(debug_lines), "latest-instagram-profile-scan.txt")
            return cached_posts
        debug_lines.append("result_source=error_on_login_page count=0")
        save_debug_text("\n".join(debug_lines), "latest-instagram-profile-scan.txt")
        raise ValueError(
            "Instagram mostro una pantalla de inicio de sesion en vez del perfil publico. "
            "Pruebe de nuevo en unos segundos."
        )

    html_posts = extract_instagram_profile_posts_from_html(profile_url, rendered_html)
    debug_lines.append(f"html_fallback_posts={len(html_posts)}")
    posts = merge_priority_posts(best_posts or html_posts)

    if not posts:
        cached_posts = load_profile_posts_cache(profile_url)
        if cached_posts:
            debug_lines.append(f"result_source=cache_after_empty_extraction count={len(cached_posts)}")
            save_debug_text("\n".join(debug_lines), "latest-instagram-profile-scan.txt")
            return cached_posts
        debug_lines.append("result_source=error_empty_extraction count=0")
        save_debug_text("\n".join(debug_lines), "latest-instagram-profile-scan.txt")
        raise ValueError("No se encontraron posts recientes en ese perfil de Instagram.")

    debug_lines.append(
        f"result_source={'playwright_dom' if best_posts else 'rendered_html'} count={len(posts)}"
    )
    save_profile_posts_cache(profile_url, posts)
    save_debug_text("\n".join(debug_lines), "latest-instagram-profile-scan.txt")

    return posts


def remote_asset_accessible(src: str) -> bool:
    request = Request(
        src,
        headers={
            "User-Agent": USER_AGENT,
            "Referer": referer_for_asset(src),
            "Range": "bytes=0-1",
        },
    )

    try:
        with urlopen(request, timeout=12) as response:
            return 200 <= getattr(response, "status", 200) < 400
    except Exception:
        return False


def fetch_metadata_with_playwright(media_url: str, platform_name: str) -> dict[str, str]:
    try:
        PlaywrightTimeoutError, sync_playwright = playwright_imports()
    except ValueError as error:
        raise ValueError(
            f"{platform_name} bloqueo la metadata publica y Playwright no esta instalado. "
            "Instale Playwright para habilitar el fallback con navegador real."
        ) from error

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            page = browser.new_page(
                user_agent=USER_AGENT,
                viewport={"width": 1440, "height": 1200},
                locale="es-CR",
            )
            page.goto(media_url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(3500)

            rendered_html = page.content()
            debug_filename = f"latest-{platform_name.lower()}-rendered.html"
            save_debug_html(rendered_html, debug_filename)
            rendered_metadata = metadata_from_rendered_html(
                rendered_html,
                media_url,
                f"Post de {platform_name}",
            )

            if rendered_metadata:
                browser.close()
                return rendered_metadata

            video_url = page.evaluate(
                """
                () => {
                  const video = document.querySelector('video');
                  if (!video) return '';
                  return video.currentSrc || video.src || video.getAttribute('src') || '';
                }
                """
            )
            image_url = page.evaluate(
                """
                () => {
                  const candidates = Array.from(document.images)
                    .map((img) => ({
                      src: img.currentSrc || img.src || '',
                      area: (img.naturalWidth || 0) * (img.naturalHeight || 0),
                    }))
                    .filter((item) => item.src);
                  candidates.sort((a, b) => b.area - a.area);
                  return candidates[0]?.src || '';
                }
                """
            )

            browser.close()

            if not image_url and not video_url:
                rendered_file = save_debug_html(rendered_html, debug_filename)
                raise ValueError(
                    "Playwright abrio la pagina, pero no encontro media util en el DOM. "
                    f"Revise el HTML renderizado en {rendered_file}."
                )

            return {
                "title": f"Post de {platform_name}",
                "image_url": image_url,
                "video_url": video_url,
                "canonical_url": media_url,
            }
    except PlaywrightTimeoutError as error:
        raise ValueError(f"Playwright no logro cargar {platform_name} a tiempo.") from error


def fetch_social_metadata(media_url: str) -> dict[str, str]:
    platform_name = platform_label_from_url(media_url)
    request = Request(
        media_url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept-Language": "es-CR,es;q=0.9,en;q=0.8",
        },
    )

    try:
        with urlopen(request, timeout=20) as response:
            charset = response.headers.get_content_charset() or "utf-8"
            html_text = response.read().decode(charset, errors="replace")
    except HTTPError as error:
        raise ValueError(f"{platform_name} devolvio un error {error.code}.") from error
    except URLError as error:
        raise ValueError(f"No se pudo conectar con {platform_name}.") from error

    meta = extract_meta_tags(html_text)
    response_debug_file = f"latest-{platform_name.lower()}-response.html"
    if '"ssr_disabled_reason","fail_ssr_disabled"' in html_text or '"disabled_reason":"fail_ssr_disabled"' in html_text:
        save_debug_html(html_text, response_debug_file)
        return fetch_metadata_with_playwright(media_url, platform_name)

    image_url = (
        meta.get("og:image:secure_url")
        or meta.get("og:image")
        or meta.get("twitter:image")
    )
    video_url = (
        meta.get("og:video:secure_url")
        or meta.get("og:video")
        or meta.get("twitter:player:stream")
        or meta.get("og:video:url")
    )
    if not image_url:
        save_debug_html(html_text, response_debug_file)
        return fetch_metadata_with_playwright(media_url, platform_name)

    return {
        "title": meta.get("og:title") or meta.get("twitter:title") or f"Post de {platform_name}",
        "image_url": image_url,
        "video_url": video_url or "",
        "canonical_url": meta.get("og:url", media_url),
    }


def referer_for_asset(src: str) -> str:
    host = urlparse(src).netloc.lower()
    if "tiktok.com" in host:
        return "https://www.tiktok.com/"
    return "https://www.instagram.com/"


def asset_debug_filename(src: str, suffix: str) -> str:
    host = urlparse(src).netloc.lower()
    platform = "tiktok" if "tiktok" in host else "instagram" if "instagram" in host else "asset"
    return f"latest-{platform}-asset-{suffix}.txt"


class ThumbnailHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/assets/"):
            self.handle_catalog_asset(parsed.path)
            return
        if parsed.path == "/api/source-asset":
            self.handle_proxy_asset(parsed.query)
            return
        if parsed.path == "/api/generated-asset":
            self.handle_generated_asset(parsed.query)
            return
        if parsed.path == "/api/catalog-state":
            self.handle_catalog_state()
            return
        if parsed.path == "/api/priority-links":
            self.handle_priority_links()
            return
        if parsed.path == "/api/import-drafts-analysis":
            self.handle_import_drafts_analysis()
            return

        if parsed.path == "/":
            self.path = "/index.html"

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/profile-posts":
            self.handle_profile_posts()
            return
        if parsed.path == "/api/prepare-batch-import":
            self.handle_prepare_batch_import()
            return
        if parsed.path == "/api/sync-draft-order":
            self.handle_sync_draft_order()
            return
        if parsed.path == "/api/publish-drafts-catalog":
            self.handle_publish_drafts_catalog()
            return
        if parsed.path == "/api/update-catalog-property":
            self.handle_update_catalog_property()
            return
        if parsed.path == "/api/publish-property":
            self.handle_publish_property()
            return

        if parsed.path != "/api/resolve":
            self.send_error(HTTPStatus.NOT_FOUND, "Ruta no encontrada.")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            media_url = normalize_social_url(payload.get("instagram_url", ""))
            metadata = fetch_social_metadata(media_url)
        except json.JSONDecodeError:
            self.respond_json({"error": "El body debe ser JSON valido."}, HTTPStatus.BAD_REQUEST)
            return
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        image_url = metadata["image_url"]
        video_url = metadata["video_url"]
        local_image_name = ""
        media_kind = "video" if video_url else "image"
        note = ""

        if platform_label_from_url(media_url) == "TikTok" and video_url and not remote_asset_accessible(video_url):
            generated_frame = capture_frame_with_playwright(media_url, "TikTok")
            if generated_frame:
                local_image_name = generated_frame.name
                image_url = ""
                video_url = ""
                media_kind = "image"
                note = "TikTok bloqueo la descarga directa del video. Se uso un frame capturado en el navegador."

        self.respond_json(
            {
                "title": metadata["title"],
                "canonicalUrl": metadata["canonical_url"],
                "proxyImageUrl": (
                    f"/api/generated-asset?name={quote(local_image_name, safe='')}"
                    if local_image_name
                    else f"/api/source-asset?src={quote(image_url, safe='')}"
                ),
                "proxyVideoUrl": f"/api/source-asset?src={quote(video_url, safe='')}" if video_url else "",
                "mediaKind": media_kind,
                "note": note,
            }
        )

    def handle_profile_posts(self) -> None:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            profile_url = normalize_social_url(payload.get("instagram_url", ""))
            if not is_instagram_profile_url(profile_url):
                raise ValueError("Ese link no parece ser un perfil de Instagram.")
            posts = fetch_instagram_profile_posts(profile_url)
        except json.JSONDecodeError:
            self.respond_json({"error": "El body debe ser JSON valido."}, HTTPStatus.BAD_REQUEST)
            return
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json({"posts": posts, "count": len(posts)}, HTTPStatus.OK)

    def handle_catalog_state(self) -> None:
        bundle = load_catalog_bundle()
        properties = bundle.get("allProperties", [])
        summary = {
            "total": len(properties),
            "disponible": sum(1 for item in properties if item.get("status") == "disponible"),
            "rentada": sum(1 for item in properties if item.get("status") == "rentada"),
            "vendida": sum(1 for item in properties if item.get("status") == "vendida"),
            "featured": len(bundle.get("featuredProperties", [])),
        }
        bundle["summary"] = summary
        self.respond_json(bundle, HTTPStatus.OK)

    def handle_priority_links(self) -> None:
        payload = resolve_priority_links()
        self.respond_json(payload, HTTPStatus.OK)

    def handle_import_drafts_analysis(self) -> None:
        payload = analyze_batch_import_duplicates()
        self.respond_json(payload, HTTPStatus.OK)

    def handle_sync_draft_order(self) -> None:
        try:
            payload = sync_batch_import_order()
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json(payload, HTTPStatus.OK)

    def handle_publish_drafts_catalog(self) -> None:
        try:
            bundle = publish_drafts_to_catalog()
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json(
            {
                "message": "Se publicó el catálogo desde catalog-import-drafts.json.",
                "summary": {
                    "total": len(bundle.get("allProperties", [])),
                    "featured": len(bundle.get("featuredProperties", [])),
                    "catalog": len(bundle.get("catalogProperties", [])),
                },
                "generatedAt": bundle.get("generatedAt", ""),
            },
            HTTPStatus.OK,
        )

    def handle_update_catalog_property(self) -> None:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            property_id = compact_spaces(str(payload.get("id", "")))
            if not property_id:
                raise ValueError("La propiedad necesita un id para guardar cambios.")

            bundle = load_catalog_bundle()
            existing_properties = bundle.get("allProperties", [])
            updated_properties = []
            updated_property = None

            for property_item in existing_properties:
                if str(property_item.get("id", "")).strip() != property_id:
                    updated_properties.append(property_item)
                    continue

                normalized = normalize_catalog_property_editor_payload(payload, property_item)
                updated_properties.append(normalized)
                updated_property = normalized

            if not updated_property:
                raise ValueError("No se encontró la propiedad en el catálogo publicado.")

            next_bundle = rebuild_catalog_bundle(updated_properties)
            next_bundle["source"] = bundle.get("source", "social-thumbnailer-drafts")
            save_catalog_bundle(next_bundle)
        except json.JSONDecodeError:
            self.respond_json({"error": "El body debe ser JSON valido."}, HTTPStatus.BAD_REQUEST)
            return
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json(
            {
                "message": "Propiedad actualizada en el catálogo publicado.",
                "property": updated_property,
                "summary": {
                    "total": len(next_bundle["allProperties"]),
                    "featured": len(next_bundle["featuredProperties"]),
                },
            },
            HTTPStatus.OK,
        )

    def handle_publish_property(self) -> None:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            bundle = load_catalog_bundle()
            existing_properties = bundle.get("allProperties", [])
            existing_property = None

            requested_id = str(payload.get("id", "")).strip()
            if requested_id:
                existing_property = next(
                    (item for item in existing_properties if str(item.get("id")) == requested_id),
                    None,
                )

            normalized = normalize_property_payload(payload, existing_property)
            slug = slugify_text(normalized["title"])
            normalized["image"] = save_catalog_thumbnail(str(payload.get("thumbnailDataUrl", "")), slug)
            normalized["id"] = normalized["id"] or next_property_id(existing_properties)

            updated_properties = []
            replaced = False
            for property_item in existing_properties:
                if str(property_item.get("id")) == normalized["id"]:
                    updated_properties.append(normalized)
                    replaced = True
                else:
                    updated_properties.append(property_item)

            if not replaced:
                updated_properties.append(normalized)

            next_bundle = rebuild_catalog_bundle(updated_properties)
            save_catalog_bundle(next_bundle)
        except json.JSONDecodeError:
            self.respond_json({"error": "El body debe ser JSON valido."}, HTTPStatus.BAD_REQUEST)
            return
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json(
            {
                "message": "Propiedad publicada en el catalogo JSON.",
                "property": normalized,
                "summary": {
                    "total": len(next_bundle["allProperties"]),
                    "featured": len(next_bundle["featuredProperties"]),
                },
            },
            HTTPStatus.OK,
        )

    def handle_prepare_batch_import(self) -> None:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
            items = payload.get("items", [])
            if not isinstance(items, list) or not items:
                raise ValueError("No hay resultados para preparar.")

            existing_payload = load_existing_batch_import()
            existing_drafts = existing_payload.get("drafts", [])
            existing_urls = {
                normalize_instagram_url_for_order(str(item.get("sourceUrl", "")))
                for item in existing_drafts
                if str(item.get("sourceUrl", "")).strip()
            }

            drafts = list(existing_drafts)
            next_number = next_draft_number(existing_drafts)
            added_count = 0
            skipped_duplicates = 0

            for item in items:
                if not isinstance(item, dict):
                    continue
                url = str(item.get("url", "")).strip()
                if not url:
                    continue
                normalized_url = normalize_instagram_url_for_order(url)
                if normalized_url in existing_urls:
                    skipped_duplicates += 1
                    continue
                drafts.append(
                    {
                        "draftId": f"draft-{next_number}",
                        "sourceUrl": url,
                        "title": str(item.get("label", "")).strip() or url,
                        "thumbnailUrl": str(item.get("thumbnailUrl", "")).strip(),
                        "kind": str(item.get("kind", "post")).strip() or "post",
                        "status": "disponible",
                        "featured": False,
                        "needsNormalization": True,
                        "needsPricing": True,
                        "needsLocation": True,
                    }
                )
                existing_urls.add(normalized_url)
                next_number += 1
                added_count += 1

            if not drafts:
                raise ValueError("No se pudieron construir borradores de importacion.")

            drafts = order_items_by_priority_list(drafts)

            batch_payload = {
                "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "count": len(drafts),
                "drafts": drafts,
            }
            batch_file = save_batch_import(batch_payload)
        except json.JSONDecodeError:
            self.respond_json({"error": "El body debe ser JSON valido."}, HTTPStatus.BAD_REQUEST)
            return
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json(
            {
                "message": "Borradores preparados para catalogo.",
                "count": len(drafts),
                "added": added_count,
                "skippedDuplicates": skipped_duplicates,
                "file": str(batch_file),
            },
            HTTPStatus.OK,
        )

    def handle_generated_asset(self, query_string: str) -> None:
        query = parse_qs(query_string)
        name = Path(query.get("name", [""])[0]).name
        if not name:
            self.send_error(HTTPStatus.BAD_REQUEST, "El asset generado no es valido.")
            return

        asset_path = GENERATED_DIR / name
        if not asset_path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "El asset generado no existe.")
            return

        body = asset_path.read_bytes()
        content_type = mimetypes.guess_type(asset_path.name)[0] or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def handle_catalog_asset(self, asset_path: str) -> None:
        relative_path = asset_path.removeprefix("/assets/")
        candidates = [
            LANDINGPAGE_PUBLIC_ASSETS_DIR / relative_path,
            LANDINGPAGE_DIST_ASSETS_DIR / relative_path,
        ]

        for candidate in candidates:
            if candidate.is_file():
                body = candidate.read_bytes()
                content_type = mimetypes.guess_type(candidate.name)[0] or "application/octet-stream"
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
                return

        self.send_error(HTTPStatus.NOT_FOUND, "El asset del catalogo no existe.")

    def handle_proxy_asset(self, query_string: str) -> None:
        query = parse_qs(query_string)
        src = query.get("src", [""])[0]
        parsed = urlparse(src)

        if parsed.scheme != "https" or not parsed.netloc:
            self.send_error(HTTPStatus.BAD_REQUEST, "La imagen remota no es valida.")
            return

        request = Request(
            src,
            headers={
                "User-Agent": USER_AGENT,
                "Referer": referer_for_asset(src),
            },
        )

        try:
            with urlopen(request, timeout=20) as response:
                content_type = response.headers.get_content_type() or "application/octet-stream"
                body = response.read()
                debug_headers = "\n".join(f"{key}: {value}" for key, value in response.headers.items())
                save_debug_text(
                    "\n".join(
                        [
                            f"Source URL: {src}",
                            f"HTTP Status: {response.status}",
                            f"Content-Type: {content_type}",
                            f"Content-Length: {len(body)}",
                            "Response Headers:",
                            debug_headers,
                        ]
                    ),
                    asset_debug_filename(src, "success"),
                )
        except HTTPError as error:
            response_body = ""
            try:
                response_body = error.read().decode("utf-8", errors="replace")
            except Exception:
                response_body = ""

            debug_headers = "\n".join(f"{key}: {value}" for key, value in error.headers.items())
            debug_file = save_debug_text(
                "\n".join(
                    [
                        f"Source URL: {src}",
                        f"HTTP Status: {error.code}",
                        f"Reason: {error.reason}",
                        "Response Headers:",
                        debug_headers or "(none)",
                        "",
                        "Response Body:",
                        response_body or "(empty)",
                    ]
                ),
                asset_debug_filename(src, "error"),
            )
            self.send_error(
                error.code,
                f"No se pudo descargar el recurso remoto. Revise el log en {debug_file}.",
            )
            return
        except URLError as error:
            debug_file = save_debug_text(
                "\n".join(
                    [
                        f"Source URL: {src}",
                        f"Reason: {error.reason}",
                    ]
                ),
                asset_debug_filename(src, "network-error"),
            )
            self.send_error(
                HTTPStatus.BAD_GATEWAY,
                f"No se pudo conectar con el recurso remoto. Revise el log en {debug_file}.",
            )
            return

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def respond_json(self, payload: dict[str, str], status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            return

    def log_message(self, format: str, *args) -> None:
        return

    def guess_type(self, path: str) -> str:
        guessed = mimetypes.guess_type(path)[0]
        return guessed or "application/octet-stream"


def main() -> None:
    server = ThreadingHTTPServer((DEFAULT_HOST, DEFAULT_PORT), ThumbnailHandler)
    print(f"Social Thumbnailer listo en http://{DEFAULT_HOST}:{DEFAULT_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
