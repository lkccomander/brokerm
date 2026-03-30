from __future__ import annotations

import html
import json
import mimetypes
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
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765
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


def capture_frame_with_playwright(media_url: str, platform_name: str) -> Path | None:
    PlaywrightTimeoutError, sync_playwright = playwright_imports()

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            page = browser.new_page(
                user_agent=USER_AGENT,
                viewport={"width": 1440, "height": 1200},
                locale="es-CR",
            )
            page.goto(media_url, wait_until="domcontentloaded", timeout=30000)
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

            browser.close()

            if not frame_bytes:
                return None

            return save_generated_bytes(frame_bytes, ".png")
    except PlaywrightTimeoutError:
        return None


def fetch_instagram_profile_posts(profile_url: str) -> list[dict[str, str]]:
    PlaywrightTimeoutError, sync_playwright = playwright_imports()

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            page = browser.new_page(
                user_agent=USER_AGENT,
                viewport={"width": 1440, "height": 1600},
                locale="es-CR",
            )
            page.goto(profile_url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(4000)
            rendered_html = page.content()
            save_debug_html(rendered_html, "latest-instagram-profile-rendered.html")
            browser.close()
    except PlaywrightTimeoutError as error:
        raise ValueError("Playwright no logro cargar el perfil de Instagram a tiempo.") from error

    posts = extract_instagram_profile_posts_from_html(profile_url, rendered_html)[:20]

    if not posts:
        raise ValueError("No se encontraron posts recientes en ese perfil de Instagram.")

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
        if parsed.path == "/api/source-asset":
            self.handle_proxy_asset(parsed.query)
            return
        if parsed.path == "/api/generated-asset":
            self.handle_generated_asset(parsed.query)
            return

        if parsed.path == "/":
            self.path = "/index.html"

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/profile-posts":
            self.handle_profile_posts()
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

        self.respond_json({"posts": posts}, HTTPStatus.OK)

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
