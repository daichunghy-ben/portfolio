#!/usr/bin/env python3
"""Build influencer research figures (SVG + PNG fallback assets)."""

from __future__ import annotations

from pathlib import Path
from subprocess import run
import html
import shutil
import tempfile

WIDTH = 1600
HEIGHT = 980

COLORS = {
    "bg": "#f4f8fb",
    "panel": "#ffffff",
    "ink": "#0f172a",
    "muted": "#475569",
    "line": "#1f2937",
    "accent": "#0d9488",
    "accent_soft": "#ccfbf1",
    "warn": "#ea580c",
    "warn_soft": "#ffedd5",
    "info": "#0284c7",
    "info_soft": "#e0f2fe",
    "good": "#166534",
}


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def svg_header(title: str, desc: str) -> list[str]:
    return [
        (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" '
            f'viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-labelledby="title desc">'
        ),
        f"<title id=\"title\">{esc(title)}</title>",
        f"<desc id=\"desc\">{esc(desc)}</desc>",
        "<defs>",
        "<marker id=\"arrow\" markerWidth=\"14\" markerHeight=\"14\" refX=\"11\" refY=\"7\" orient=\"auto\" markerUnits=\"userSpaceOnUse\">",
        "<path d=\"M0,0 L14,7 L0,14 z\" fill=\"#334155\"/>",
        "</marker>",
        "</defs>",
    ]


def svg_footer() -> list[str]:
    return ["</svg>"]


def draw_node(lines: list[str], x: int, y: int, w: int, h: int, label: str, detail: str, fill: str) -> None:
    lines.append(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="22" fill="{fill}" stroke="#cbd5e1" stroke-width="2"/>'
    )
    lines.append(
        f'<text x="{x + w / 2:.1f}" y="{y + 48}" text-anchor="middle" fill="#0f172a" '
        'font-size="34" font-family="Manrope,Arial,sans-serif" font-weight="800">'
        f"{esc(label)}</text>"
    )
    lines.append(
        f'<text x="{x + w / 2:.1f}" y="{y + 84}" text-anchor="middle" fill="#475569" '
        'font-size="20" font-family="Manrope,Arial,sans-serif">'
        f"{esc(detail)}</text>"
    )


def draw_arrow(lines: list[str], x1: int, y1: int, x2: int, y2: int, width: int) -> None:
    lines.append(
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" '
        f'stroke-width="{width}" stroke-linecap="round" marker-end="url(#arrow)"/>'
    )


def draw_four_e_draft(path: Path) -> None:
    lines: list[str] = []
    lines += svg_header(
        "Four-E conceptual structure (reported draft)",
        "Draft framework with reported construct directions from CX CEX and BE to CE and from CE to CR.",
    )
    lines.append(f'<rect width="{WIDTH}" height="{HEIGHT}" fill="{COLORS["bg"]}"/>')
    lines.append('<rect x="26" y="24" width="1548" height="932" rx="28" fill="#ffffff" stroke="#d7e3ef"/>')

    lines.append(
        '<text x="72" y="94" fill="#0f172a" font-size="42" font-family="Manrope,Arial,sans-serif" font-weight="800">'
        'Four-E reported structure (draft)</text>'
    )
    lines.append(
        '<text x="72" y="130" fill="#475569" font-size="24" font-family="Manrope,Arial,sans-serif">'
        'Conceptual map from manuscript screenshots: direction only, without coefficient claims.</text>'
    )

    draw_node(lines, 180, 210, 280, 120, "CX", "Content experience", COLORS["info_soft"])
    draw_node(lines, 180, 420, 280, 120, "CEX", "Expectation alignment", COLORS["warn_soft"])
    draw_node(lines, 180, 630, 280, 120, "BE", "Brand equity transfer", COLORS["accent_soft"])
    draw_node(lines, 650, 420, 300, 140, "CE", "Consumer engagement", "#ecfeff")
    draw_node(lines, 1120, 420, 300, 140, "CR", "Customer retention", "#ecfccb")

    draw_arrow(lines, 460, 270, 650, 460, 6)
    draw_arrow(lines, 460, 480, 650, 480, 6)
    draw_arrow(lines, 460, 690, 650, 500, 6)
    draw_arrow(lines, 950, 490, 1120, 490, 8)

    lines.append('<rect x="72" y="810" width="1456" height="112" rx="18" fill="#f8fafc" stroke="#d7e3ef"/>')
    lines.append(
        '<text x="100" y="854" fill="#0f172a" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="700">'
        'Legend</text>'
    )
    lines.append(
        '<text x="100" y="890" fill="#475569" font-size="20" font-family="Manrope,Arial,sans-serif">'
        'Reported structure: directional pathways from antecedents to CE and from CE to CR.</text>'
    )

    lines.append(
        '<text x="800" y="948" text-anchor="middle" fill="#475569" font-size="17" '
        'font-family="Manrope,Arial,sans-serif">Source basis: local manuscript screenshots (FCBEM workflow materials).</text>'
    )
    lines += svg_footer()
    path.write_text("\n".join(lines), encoding="utf-8")


def draw_four_e_enhanced(path: Path) -> None:
    lines: list[str] = []
    lines += svg_header(
        "Four-E reported plus inferred structure (enhanced)",
        "Enhanced framework with H1 to H5c labels, sample badges, R2 badges, and qualitative inferred strength bands by arrow thickness.",
    )
    lines.append(f'<rect width="{WIDTH}" height="{HEIGHT}" fill="#f3f8fb"/>')
    lines.append('<rect x="22" y="22" width="1556" height="936" rx="30" fill="#ffffff" stroke="#d7e3ef"/>')

    lines.append(
        '<text x="68" y="92" fill="#0f172a" font-size="40" font-family="Manrope,Arial,sans-serif" font-weight="800">'
        'Four-E reported plus inferred structure (enhanced)</text>'
    )
    lines.append(
        '<text x="68" y="126" fill="#475569" font-size="22" font-family="Manrope,Arial,sans-serif">'
        'Reported pathways and R2 are shown directly; thickness bands indicate qualitative inference only.</text>'
    )

    # Sample badges
    badges = [("Overall n = 565", 980), ("EFA n = 200", 1160), ("CFA/SEM n = 365", 1320)]
    for label, x in badges:
        lines.append(f'<rect x="{x}" y="62" width="170" height="34" rx="17" fill="#eef2ff" stroke="#c7d2fe"/>')
        lines.append(
            f'<text x="{x + 85}" y="84" text-anchor="middle" fill="#1e3a8a" font-size="15" '
            'font-family="Manrope,Arial,sans-serif" font-weight="700">'
            f"{esc(label)}</text>"
        )

    draw_node(lines, 170, 190, 280, 118, "CX", "Content experience", COLORS["info_soft"])
    draw_node(lines, 170, 402, 280, 118, "CEX", "Expectation alignment", COLORS["warn_soft"])
    draw_node(lines, 170, 614, 280, 118, "BE", "Brand equity transfer", COLORS["accent_soft"])
    draw_node(lines, 640, 390, 320, 150, "CE", "Consumer engagement", "#ecfeff")
    draw_node(lines, 1120, 390, 320, 150, "CR", "Customer retention", "#ecfccb")

    # Qualitative inferred bands by thickness
    draw_arrow(lines, 450, 250, 640, 450, 6)   # medium
    draw_arrow(lines, 450, 460, 640, 460, 8)   # high
    draw_arrow(lines, 450, 672, 640, 470, 4)   # low
    draw_arrow(lines, 960, 465, 1120, 465, 10)  # high

    # Hypothesis labels
    lines.append('<text x="536" y="320" fill="#1e293b" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">H2: CX -> CE</text>')
    lines.append('<text x="528" y="438" fill="#1e293b" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">H3: CEX -> CE</text>')
    lines.append('<text x="522" y="620" fill="#1e293b" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">H4: BE -> CE</text>')
    lines.append('<text x="1002" y="428" fill="#1e293b" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">H1: CE -> CR</text>')
    lines.append('<text x="648" y="596" fill="#334155" font-size="18" font-family="Manrope,Arial,sans-serif">H5a/H5b/H5c: mediation from CX, CEX, BE through CE to CR</text>')

    # R2 badges
    lines.append('<rect x="700" y="548" width="200" height="44" rx="20" fill="#e0f2fe" stroke="#bae6fd"/>')
    lines.append('<text x="800" y="577" text-anchor="middle" fill="#075985" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">CE model R2 = 55%</text>')
    lines.append('<rect x="1180" y="548" width="200" height="44" rx="20" fill="#dcfce7" stroke="#bbf7d0"/>')
    lines.append('<text x="1280" y="577" text-anchor="middle" fill="#166534" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">CR model R2 = 70%</text>')

    # Explicit legend with inferred wording
    lines.append('<rect x="62" y="780" width="1476" height="152" rx="20" fill="#f8fafc" stroke="#d7e3ef"/>')
    lines.append('<text x="92" y="824" fill="#0f172a" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="700">Legend</text>')
    lines.append('<text x="92" y="858" fill="#475569" font-size="19" font-family="Manrope,Arial,sans-serif">Reported structure: construct directions, sample splits, and R2 badges are transcribed from screenshots.</text>')
    lines.append('<text x="92" y="890" fill="#475569" font-size="19" font-family="Manrope,Arial,sans-serif">Inferred relative strength (qualitative, non-coefficient): high / medium / low shown by arrow thickness only.</text>')

    lines.append('<line x1="1050" y1="872" x2="1138" y2="872" stroke="#334155" stroke-width="10" stroke-linecap="round" marker-end="url(#arrow)"/>')
    lines.append('<text x="1150" y="878" fill="#334155" font-size="16" font-family="Manrope,Arial,sans-serif">High</text>')
    lines.append('<line x1="1230" y1="872" x2="1318" y2="872" stroke="#334155" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow)"/>')
    lines.append('<text x="1330" y="878" fill="#334155" font-size="16" font-family="Manrope,Arial,sans-serif">Medium</text>')
    lines.append('<line x1="1420" y1="872" x2="1508" y2="872" stroke="#334155" stroke-width="4" stroke-linecap="round" marker-end="url(#arrow)"/>')
    lines.append('<text x="1518" y="878" fill="#334155" font-size="16" font-family="Manrope,Arial,sans-serif">Low</text>')

    lines += svg_footer()
    path.write_text("\n".join(lines), encoding="utf-8")


def draw_hypothesis_action_draft(path: Path) -> None:
    lines: list[str] = []
    lines += svg_header(
        "Hypothesis to priority matrix (draft)",
        "Draft matrix linking Four-E hypotheses to initial managerial priority lanes.",
    )
    lines.append(f'<rect width="{WIDTH}" height="{HEIGHT}" fill="#f5f9fc"/>')
    lines.append('<rect x="30" y="24" width="1540" height="932" rx="26" fill="#ffffff" stroke="#d7e3ef"/>')

    lines.append('<text x="74" y="92" fill="#0f172a" font-size="42" font-family="Manrope,Arial,sans-serif" font-weight="800">Hypothesis-to-priority matrix (draft)</text>')
    lines.append('<text x="74" y="126" fill="#475569" font-size="22" font-family="Manrope,Arial,sans-serif">Simple managerial translation from reported pathways.</text>')

    x0 = 90
    y0 = 176
    widths = [210, 310, 330, 500]
    headers = ["Hypothesis", "Pathway", "Reported signal anchor", "Priority lane (inferred)"]

    cx = x0
    for idx, header in enumerate(headers):
        w = widths[idx]
        lines.append(f'<rect x="{cx}" y="{y0}" width="{w}" height="62" fill="#e2e8f0" stroke="#cbd5e1"/>')
        lines.append(f'<text x="{cx + w / 2:.1f}" y="214" text-anchor="middle" fill="#0f172a" font-size="20" font-family="Manrope,Arial,sans-serif" font-weight="700">{esc(header)}</text>')
        cx += w

    rows = [
        ("H2", "CX -> CE", "Experience quality feeds engagement", "Do first"),
        ("H3", "CEX -> CE", "Expectation alignment feeds engagement", "Do first"),
        ("H4", "BE -> CE", "Brand equity transfer feeds engagement", "Do next"),
        ("H1", "CE -> CR", "Engagement bridges to retention", "Do next"),
        ("H5a/H5b/H5c", "(CX,CEX,BE) -> CE -> CR", "Mediation runs through CE", "Do later"),
    ]

    ry = y0 + 62
    for row in rows:
        cx = x0
        for idx, value in enumerate(row):
            w = widths[idx]
            fill = "#f8fafc" if idx != 3 else "#f1f5f9"
            lines.append(f'<rect x="{cx}" y="{ry}" width="{w}" height="98" fill="{fill}" stroke="#cbd5e1"/>')
            lines.append(
                f'<text x="{cx + 14}" y="{ry + 56}" fill="#1e293b" font-size="19" '
                'font-family="Manrope,Arial,sans-serif">'
                f"{esc(value)}</text>"
            )
            cx += w
        ry += 98

    lines.append('<rect x="90" y="770" width="1420" height="130" rx="18" fill="#f8fafc" stroke="#d7e3ef"/>')
    lines.append('<text x="120" y="814" fill="#0f172a" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="700">Interpretation note</text>')
    lines.append('<text x="120" y="850" fill="#475569" font-size="20" font-family="Manrope,Arial,sans-serif">Draft matrix provides translation logic only and does not estimate intervention ranking statistically.</text>')

    lines += svg_footer()
    path.write_text("\n".join(lines), encoding="utf-8")


def draw_hypothesis_action_enhanced(path: Path) -> None:
    lines: list[str] = []
    lines += svg_header(
        "Hypothesis to action lanes (enhanced)",
        "Enhanced translation separating reported signal anchors from inferred execution priorities across do-first, do-next, and do-later lanes.",
    )
    lines.append(f'<rect width="{WIDTH}" height="{HEIGHT}" fill="#f4f8fb"/>')
    lines.append('<rect x="24" y="22" width="1552" height="936" rx="30" fill="#ffffff" stroke="#d7e3ef"/>')

    lines.append('<text x="70" y="92" fill="#0f172a" font-size="40" font-family="Manrope,Arial,sans-serif" font-weight="800">Hypothesis-to-action translation (enhanced)</text>')
    lines.append('<text x="70" y="126" fill="#475569" font-size="22" font-family="Manrope,Arial,sans-serif">Reported signal anchors are separated from inferred execution priority lanes.</text>')

    # Left panel: reported anchors
    lines.append('<rect x="70" y="178" width="500" height="714" rx="22" fill="#f8fafc" stroke="#d7e3ef"/>')
    lines.append('<text x="100" y="226" fill="#0f172a" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="700">Reported signal anchor</text>')

    anchors = [
        "H2: CX -> CE",
        "H3: CEX -> CE",
        "H4: BE -> CE",
        "H1: CE -> CR",
        "H5a/H5b/H5c: antecedents mediate through CE",
    ]
    ay = 270
    for anchor in anchors:
        lines.append(f'<rect x="96" y="{ay - 28}" width="448" height="74" rx="14" fill="#ffffff" stroke="#cbd5e1"/>')
        lines.append(
            f'<text x="118" y="{ay + 16}" fill="#1e293b" font-size="20" '
            'font-family="Manrope,Arial,sans-serif" font-weight="700">'
            f"{esc(anchor)}</text>"
        )
        ay += 114

    # Right panel: inferred priority lanes
    lines.append('<rect x="610" y="178" width="900" height="714" rx="22" fill="#f8fafc" stroke="#d7e3ef"/>')
    lines.append('<text x="642" y="226" fill="#0f172a" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="700">Inferred execution priority (non-estimated)</text>')

    lanes = [
        (
            "Do first",
            "Fit and authenticity foundations",
            "Use CX and CEX anchors: creator fit checks, disclosure clarity, expectation-aligned messaging.",
            "#dcfce7",
            "#22c55e",
        ),
        (
            "Do next",
            "Engagement loop design",
            "Use BE and CE anchors: moderated discussion loops, response cadence, trust safeguard checkpoints.",
            "#e0f2fe",
            "#0ea5e9",
        ),
        (
            "Do later",
            "Conversion optimization",
            "Use mediated logic after stability: CTA timing, incentive tuning, conversion burst governance.",
            "#ffedd5",
            "#f97316",
        ),
    ]

    ly = 268
    for lane, subtitle, detail, fill, accent in lanes:
        lines.append(f'<rect x="642" y="{ly}" width="836" height="176" rx="20" fill="{fill}" stroke="#cbd5e1"/>')
        lines.append(f'<rect x="662" y="{ly + 20}" width="124" height="34" rx="17" fill="#ffffff" stroke="#cbd5e1"/>')
        lines.append(
            f'<text x="724" y="{ly + 43}" text-anchor="middle" fill="#1e293b" font-size="18" '
            'font-family="Manrope,Arial,sans-serif" font-weight="700">'
            f"{esc(lane)}</text>"
        )
        lines.append(
            f'<text x="808" y="{ly + 44}" fill="#0f172a" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="700">{esc(subtitle)}</text>'
        )
        lines.append(
            f'<text x="662" y="{ly + 90}" fill="#334155" font-size="20" font-family="Manrope,Arial,sans-serif">{esc(detail)}</text>'
        )
        lines.append(f'<line x1="662" y1="{ly + 124}" x2="1452" y2="{ly + 124}" stroke="{accent}" stroke-width="5" stroke-linecap="round"/>')
        ly += 208

    lines.append('<rect x="70" y="908" width="1440" height="30" rx="14" fill="#fff7ed" stroke="#fed7aa"/>')
    lines.append('<text x="790" y="929" text-anchor="middle" fill="#9a3412" font-size="16" font-family="Manrope,Arial,sans-serif" font-weight="700">No claim of statistical estimation for intervention ranking; lanes are managerial inference from model logic.</text>')

    lines += svg_footer()
    path.write_text("\n".join(lines), encoding="utf-8")


def svg_to_png(svg_path: Path) -> None:
    png_path = svg_path.with_suffix(".png")
    with tempfile.TemporaryDirectory() as tmpdir:
        run(["qlmanage", "-t", "-s", "1600", "-o", tmpdir, str(svg_path)], check=True, capture_output=True)
        rendered = Path(tmpdir) / f"{svg_path.name}.png"
        if not rendered.exists():
            raise FileNotFoundError(f"PNG render not produced for {svg_path}")
        shutil.move(str(rendered), str(png_path))


def main() -> None:
    root = Path(__file__).resolve().parent
    assets = root / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    builders = [
        ("viz-influencer-four-e-reported-draft.svg", draw_four_e_draft),
        ("viz-influencer-four-e-reported-enhanced.svg", draw_four_e_enhanced),
        ("viz-influencer-hypothesis-action-draft.svg", draw_hypothesis_action_draft),
        ("viz-influencer-hypothesis-action-enhanced.svg", draw_hypothesis_action_enhanced),
    ]

    for name, builder in builders:
        out = assets / name
        builder(out)
        svg_to_png(out)
        print(f"saved {out}")
        print(f"saved {out.with_suffix('.png')}")


if __name__ == "__main__":
    main()
