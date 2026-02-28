from __future__ import annotations

import re
import subprocess
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [
    ROOT / "index.html",
    ROOT / "projects.html",
    ROOT / "cv.html",
    *sorted(ROOT.glob("research-*.html")),
]

PAGE_TYPE = {
    "index.html": "home",
    "projects.html": "projects",
    "cv.html": "cv",
}

CSS_FILE = {
    "home": "styles/home.css",
    "projects": "styles/projects.css",
    "cv": "styles/cv.css",
    "research": "styles/research.css",
}

STYLE_DUP_RE = re.compile(r'(<[^>]*?)\sstyle="([^"]*)"([^>]*?)\sstyle="([^"]*)"([^>]*>)', re.IGNORECASE)


def combine_duplicate_style_attrs(html: str) -> str:
    while True:
        changed = False

        def repl(match: re.Match[str]) -> str:
            nonlocal changed
            changed = True
            p1, s1, mid, s2, p2 = match.groups()
            s1 = s1.strip().rstrip(";")
            s2 = s2.strip().rstrip(";")
            merged = "; ".join([v for v in (s1, s2) if v])
            if merged and not merged.endswith(";"):
                merged += ";"
            return f'{p1} style="{merged}"{mid}{p2}'

        html2 = STYLE_DUP_RE.sub(repl, html)
        if not changed:
            return html
        html = html2


def page_for_file(path: Path) -> str:
    return PAGE_TYPE.get(path.name, "research")


def relative_canonical(path: Path) -> str:
    return "./index.html" if path.name == "index.html" else f"./{path.name}"


def ensure_meta(soup, head, name=None, prop=None, content=""):
    if name:
        tag = head.find("meta", attrs={"name": name})
        if not tag:
            tag = soup.new_tag("meta")
            tag["name"] = name
            head.append(tag)
    else:
        tag = head.find("meta", attrs={"property": prop})
        if not tag:
            tag = soup.new_tag("meta")
            tag["property"] = prop
            head.append(tag)
    tag["content"] = content


def ensure_canonical(soup, head, href: str):
    tag = head.find("link", attrs={"rel": "canonical"})
    if not tag:
        tag = soup.new_tag("link")
        tag["rel"] = "canonical"
        head.append(tag)
    tag["href"] = href


def image_dims(path: Path, cache: dict[str, tuple[int, int] | None]):
    key = str(path)
    if key in cache:
        return cache[key]
    if not path.exists():
        cache[key] = None
        return None
    try:
        out = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)], text=True)
        width = None
        height = None
        for line in out.splitlines():
            if "pixelWidth:" in line:
                width = int(line.split(":", 1)[1].strip())
            if "pixelHeight:" in line:
                height = int(line.split(":", 1)[1].strip())
        if width and height:
            cache[key] = (width, height)
            return cache[key]
    except Exception:
        pass
    cache[key] = None
    return None


def optimized_srcsets() -> dict[str, dict[str, str]]:
    optimized_dir = ROOT / "assets" / "optimized"
    mapping: dict[str, dict[str, list[tuple[int, str]]]] = {}

    for file in optimized_dir.glob("*"):
        m = re.match(r"(.+)-(\d+)\.(avif|webp)$", file.name)
        if not m:
            continue
        base, width, ext = m.group(1), int(m.group(2)), m.group(3)
        mapping.setdefault(base, {"avif": [], "webp": []})
        mapping[base][ext].append((width, f"./assets/optimized/{file.name}"))

    compiled: dict[str, dict[str, str]] = {}
    for name, exts in mapping.items():
        avif = sorted(exts["avif"], key=lambda x: x[0])
        webp = sorted(exts["webp"], key=lambda x: x[0])
        if not avif or not webp:
            continue
        compiled[name] = {
            "avif": ", ".join(f"{src} {w}w" for w, src in avif),
            "webp": ", ".join(f"{src} {w}w" for w, src in webp),
            "fallback": f"./assets/optimized/{name}-optimized.webp",
        }
    return compiled


def image_sizes_hint(img) -> str:
    parent = img.parent
    parent_classes = " ".join(parent.get("class", [])) if parent and hasattr(parent, "get") else ""
    if "rc-image" in parent_classes or "impact-media" in parent_classes or "cert-img-wrapper" in parent_classes:
        return "(max-width: 900px) 92vw, 420px"
    if img.find_parent(class_=re.compile(r"research-detail-hero")):
        return "(max-width: 900px) 92vw, 760px"
    if img.find_parent(class_=re.compile(r"profile-image-container")):
        return "(max-width: 900px) 70vw, 320px"
    return "(max-width: 900px) 92vw, 560px"


def should_be_eager(img) -> bool:
    if img.find_parent(class_=re.compile(r"hero|research-detail-hero|cv-header")):
        return True
    parent = img.parent
    if parent and hasattr(parent, "get"):
        cls = " ".join(parent.get("class", []))
        if "profile-image-container" in cls:
            return True
    return False


srcset_map = optimized_srcsets()
dims_cache: dict[str, tuple[int, int] | None] = {}

for html_file in HTML_FILES:
    raw = html_file.read_text(encoding="utf-8")
    raw = combine_duplicate_style_attrs(raw)

    soup = BeautifulSoup(raw, "lxml")

    page = page_for_file(html_file)

    # Body attributes
    if soup.body:
        soup.body["data-page"] = page

    # Ensure secure rel on new-tab links
    for a in soup.select('a[target="_blank"]'):
        rel_tokens = set(a.get("rel", []))
        rel_tokens.update({"noopener", "noreferrer"})
        a["rel"] = sorted(rel_tokens)

    # Replace inline print handlers
    for button in soup.select("[onclick]"):
        onclick = button.get("onclick", "")
        if "window.print" in onclick:
            del button["onclick"]
            classes = set(button.get("class", []))
            classes.add("js-print")
            button["class"] = sorted(classes)

    # Head adjustments
    head = soup.head
    if head:
        # Remove old stylesheet references and duplicated icon variant stylesheets.
        for link in list(head.find_all("link", href=True)):
            href = link["href"]
            if "style.css" in href and not href.startswith("styles/"):
                link.decompose()
                continue
            if "cdn.jsdelivr.net/npm/@phosphor-icons/web" in href:
                link.decompose()
                continue
            if href.startswith("styles/"):
                link.decompose()

        # Ensure one phosphor script and defer it.
        phosphor_scripts = head.find_all("script", src=re.compile(r"@phosphor-icons/web"))
        if phosphor_scripts:
            primary = phosphor_scripts[0]
            primary["defer"] = ""
            for extra in phosphor_scripts[1:]:
                extra.decompose()
        else:
            tag = soup.new_tag("script", src="https://unpkg.com/@phosphor-icons/web")
            tag["defer"] = ""
            head.append(tag)

        # Inject new CSS stack.
        first_script = head.find("script")
        links = [
            soup.new_tag("link", rel="stylesheet", href="styles/base.css"),
            soup.new_tag("link", rel="stylesheet", href=CSS_FILE[page]),
        ]
        for tag in links:
            if first_script:
                first_script.insert_before(tag)
            else:
                head.append(tag)

        # Canonical + OG metadata.
        title = head.title.get_text(strip=True) if head.title else html_file.stem
        desc_tag = head.find("meta", attrs={"name": "description"})
        desc = desc_tag.get("content", "").strip() if desc_tag else title
        canonical = relative_canonical(html_file)

        ensure_canonical(soup, head, canonical)
        ensure_meta(soup, head, prop="og:type", content="website")
        ensure_meta(soup, head, prop="og:title", content=title)
        ensure_meta(soup, head, prop="og:description", content=desc)
        ensure_meta(soup, head, prop="og:url", content=canonical)

    # Convert legacy script include.
    for script in soup.find_all("script", src=True):
        src = script.get("src", "")
        if src.endswith("script.js"):
            script["src"] = "js/main.js"
            script["type"] = "module"
            script["defer"] = ""

    # Ensure projects page has a single H1.
    if html_file.name == "projects.html" and not soup.find("h1"):
        target = soup.select_one(".research-header .section-heading")
        if target:
            target.name = "h1"

    # Light content edits.
    if html_file.name == "index.html":
        hero_desc = soup.select_one(".hero-desc")
        if hero_desc:
            hero_desc.string = (
                "Delivered 9 applied research projects and 6 conference publications at Swinburne University. "
                "I turn consumer and review data into practical business decisions."
            )

    if html_file.name == "research-ev.html":
        hero_h1 = soup.select_one(".research-detail-header h1")
        if hero_h1:
            hero_h1.string = (
                "Public acceptance of Hanoi's fossil-fuel phase-out: a Discrete Choice Experiment for fair, "
                "pull-first policy design."
            )

    # Image cleanup, sizing and responsive picture conversion.
    for img in list(soup.find_all("img")):
        if img.has_attr("onerror"):
            del img["onerror"]

        src = (img.get("src") or "").strip()
        if not src:
            continue

        if html_file.name == "research-ev.html" and "ev-choice-experiment" in src:
            classes = set(img.get("class", []))
            classes.add("js-ev-fallback")
            img["class"] = sorted(classes)

        if "profile-avatar-img" in img.get("class", []):
            img["data-fallback-selector"] = ".profile-avatar-placeholder"

        if not img.get("decoding"):
            img["decoding"] = "async"

        if not img.get("loading"):
            img["loading"] = "eager" if should_be_eager(img) else "lazy"

        if src.startswith("http") or src.startswith("data:"):
            continue

        normalized = src.lstrip("./")
        abs_path = ROOT / normalized
        dims = image_dims(abs_path, dims_cache)
        if dims:
            if not img.get("width"):
                img["width"] = str(dims[0])
            if not img.get("height"):
                img["height"] = str(dims[1])

        name = Path(normalized).stem
        if name not in srcset_map:
            continue

        if img.parent and img.parent.name == "picture":
            continue

        picture = soup.new_tag("picture")

        avif = soup.new_tag("source")
        avif["type"] = "image/avif"
        avif["srcset"] = srcset_map[name]["avif"]
        avif["sizes"] = image_sizes_hint(img)

        webp = soup.new_tag("source")
        webp["type"] = "image/webp"
        webp["srcset"] = srcset_map[name]["webp"]
        webp["sizes"] = image_sizes_hint(img)

        replacement = img
        replacement["src"] = srcset_map[name]["fallback"]

        replacement.replace_with(picture)
        picture.append(avif)
        picture.append(webp)
        picture.append(replacement)

    out = str(soup)
    out = re.sub(r"^\s*<!DOCTYPE[^>]*>\s*", "", out, flags=re.IGNORECASE)
    out = "<!DOCTYPE html>\n" + out + "\n"

    html_file.write_text(out, encoding="utf-8")

print(f"Updated {len(HTML_FILES)} HTML files")
