#!/usr/bin/env python3
"""Build motorbike-ban figures from CIEMB tables without external Python deps."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from subprocess import run
import tempfile
import shutil
import html


@dataclass(frozen=True)
class CoefRow:
    name: str
    coef: float
    se: float
    group: str


TABLE3 = [
    CoefRow("Status quo ASC", 1.621, 0.154, "status"),
    CoefRow("Ban older motorcycles", -0.884, 0.091, "push"),
    CoefRow("Ban all motorcycles", -1.752, 0.123, "push"),
    CoefRow("Monthly cost increase", -0.215, 0.024, "push"),
    CoefRow("PT frequency/coverage", 0.735, 0.088, "pull"),
    CoefRow("PT fare reduction", 0.411, 0.069, "pull"),
    CoefRow("More green space", 0.588, 0.081, "pull"),
    CoefRow("Guarded park and ride", 0.359, 0.065, "pull"),
    CoefRow("Financial support", 0.956, 0.099, "support"),
    CoefRow("Revenue reinvestment", 0.315, 0.072, "support"),
]

TABLE4_INTERACTIONS = [
    ("Ban × dependency", -0.324, 0.078),
    ("Cost × income", 0.005, 0.002),
    ("Support × income", -0.018, 0.005),
    ("Green × env concern", 0.217, 0.088),
    ("ASC × trust", -0.281, 0.065),
]

TABLE5_WTP = [
    ("Restrict all FF motorcycles", -68450),
    ("Restrict all FF vehicles", -135220),
    ("PT improve +15%", 51780),
    ("PT improve +30%", 84150),
    ("PT fare -25%", 34260),
    ("PT fare -50%", 76920),
    ("Green +20%", 102550),
    ("Green +40%", 153830),
    ("P&R unguarded", 17110),
    ("P&R guarded", 59840),
    ("Support pass", 85470),
    ("E-motorcycle grant", 188120),
    ("Revenue reinvest", 68410),
    ("Reinvest + citizen oversight", 102550),
]

COLORS = {
    "bg": "#f5f9ff",
    "card": "#ffffff",
    "ink": "#0f172a",
    "muted": "#475569",
    "grid": "#cbd5e1",
    "push": "#dc6b5f",
    "pull": "#2a9d8f",
    "support": "#3a86c8",
    "status": "#6d597a",
    "pos": "#1d9a7d",
    "neg": "#cc4b5f",
}


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def svg_header(width: int = 1600, height: int = 980, title: str = "Figure", desc: str = "") -> list[str]:
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        f"<title id=\"title\">{esc(title)}</title>",
        f"<desc id=\"desc\">{esc(desc)}</desc>",
    ]


def svg_footer() -> list[str]:
    return ["</svg>"]


def draw_main_effects(path: Path, enhanced: bool) -> None:
    rows = sorted(TABLE3, key=lambda r: r.coef)
    width, height = 1600, 980
    left = 350
    top = 190
    chart_w = 900 if not enhanced else 840
    chart_h = 660
    row_h = chart_h / len(rows)
    domain_min, domain_max = -2.2, 2.2

    def sx(v: float) -> float:
        return left + ((v - domain_min) / (domain_max - domain_min)) * chart_w

    zero_x = sx(0)
    lines: list[str] = []
    lines += svg_header(
        width,
        height,
        "Mixed Logit Effects" + (" (Enhanced)" if enhanced else " (Draft)"),
        "Diverging coefficient chart from Table 3.",
    )
    lines.append(f'<rect width="{width}" height="{height}" fill="{COLORS["bg"]}"/>')
    lines.append(f'<rect x="28" y="24" width="1544" height="932" rx="24" fill="{COLORS["card"]}" stroke="#d7e3f4"/>')

    lines.append(f'<text x="72" y="90" fill="{COLORS["ink"]}" font-size="44" font-family="Manrope,Arial,sans-serif" font-weight="800">Mixed Logit Core Effects{" with 95% CI" if enhanced else ""}</text>')
    lines.append(f'<text x="72" y="128" fill="{COLORS["muted"]}" font-size="24" font-family="Manrope,Arial,sans-serif">CIEMB Table 3 coefficients for Hanoi phase-out package attributes.</text>')

    # Axes and grid
    for tick in [-2.0, -1.0, 0.0, 1.0, 2.0]:
        x = sx(tick)
        lines.append(f'<line x1="{x:.2f}" y1="{top}" x2="{x:.2f}" y2="{top + chart_h}" stroke="{COLORS["grid"]}" stroke-dasharray="4 6"/>')
        lines.append(f'<text x="{x:.2f}" y="{top + chart_h + 30}" text-anchor="middle" fill="{COLORS["muted"]}" font-size="16" font-family="Manrope,Arial,sans-serif">{tick:+.1f}</text>')

    lines.append(f'<line x1="{zero_x:.2f}" y1="{top}" x2="{zero_x:.2f}" y2="{top + chart_h}" stroke="#1e293b" stroke-width="2.4"/>')

    for idx, row in enumerate(rows):
        y = top + idx * row_h + row_h * 0.17
        bar_h = row_h * 0.66
        x0 = sx(min(0, row.coef))
        x1 = sx(max(0, row.coef))
        w = max(2.5, x1 - x0)
        color = COLORS[row.group]
        lines.append(f'<rect x="{x0:.2f}" y="{y:.2f}" width="{w:.2f}" height="{bar_h:.2f}" rx="8" fill="{color}" opacity="0.92"/>')

        if enhanced:
            ci = 1.96 * row.se
            lo = sx(row.coef - ci)
            hi = sx(row.coef + ci)
            cy = y + bar_h / 2
            lines.append(f'<line x1="{lo:.2f}" y1="{cy:.2f}" x2="{hi:.2f}" y2="{cy:.2f}" stroke="#0f172a" stroke-width="1.8"/>')
            lines.append(f'<line x1="{lo:.2f}" y1="{cy - 6:.2f}" x2="{lo:.2f}" y2="{cy + 6:.2f}" stroke="#0f172a" stroke-width="1.8"/>')
            lines.append(f'<line x1="{hi:.2f}" y1="{cy - 6:.2f}" x2="{hi:.2f}" y2="{cy + 6:.2f}" stroke="#0f172a" stroke-width="1.8"/>')

        lines.append(f'<text x="{left - 16}" y="{y + bar_h / 2 + 6:.2f}" text-anchor="end" fill="{COLORS["ink"]}" font-size="20" font-family="Manrope,Arial,sans-serif">{esc(row.name)}</text>')
        tx = x1 + 10 if row.coef >= 0 else x0 - 10
        anchor = "start" if row.coef >= 0 else "end"
        lines.append(f'<text x="{tx:.2f}" y="{y + bar_h / 2 + 6:.2f}" text-anchor="{anchor}" fill="{COLORS["ink"]}" font-size="18" font-family="Manrope,Arial,sans-serif" font-weight="700">{row.coef:+.3f}</text>')

    lines.append(f'<text x="{left + chart_w / 2:.2f}" y="{top + chart_h + 64}" text-anchor="middle" fill="{COLORS["muted"]}" font-size="20" font-family="Manrope,Arial,sans-serif">Coefficient β</text>')

    # Legend
    legend_y = 860
    legend = [("Push", COLORS["push"]), ("Pull", COLORS["pull"]), ("Support/process", COLORS["support"]), ("Status quo", COLORS["status"])]
    lx = 360
    for label, color in legend:
        lines.append(f'<rect x="{lx}" y="{legend_y}" width="24" height="24" rx="6" fill="{color}"/>')
        lines.append(f'<text x="{lx + 34}" y="{legend_y + 18}" fill="{COLORS["ink"]}" font-size="18" font-family="Manrope,Arial,sans-serif">{label}</text>')
        lx += 220

    if enhanced:
        px = 1220
        py = 210
        pw = 300
        ph = 600
        lines.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="18" fill="#f7fbff" stroke="#d6e6f6"/>')
        lines.append(f'<text x="{px + 20}" y="{py + 42}" fill="{COLORS["ink"]}" font-size="24" font-family="Manrope,Arial,sans-serif" font-weight="800">Model notes</text>')
        notes = [
            "n = 320",
            "Log-likelihood = -1582.45",
            "McFadden rho² = 0.28",
            "ASC = +1.621",
            "Strongest negative: ban all motorcycles",
            "Strongest positive: financial support",
        ]
        ny = py + 90
        for note in notes:
            lines.append(f'<text x="{px + 20}" y="{ny}" fill="{COLORS["muted"]}" font-size="18" font-family="Manrope,Arial,sans-serif">• {esc(note)}</text>')
            ny += 46

    lines.append(f'<text x="800" y="930" text-anchor="middle" fill="{COLORS["muted"]}" font-size="16" font-family="Manrope,Arial,sans-serif">Source: CIEMB revised manuscript Table 3{", CI shown as ±1.96×SE" if enhanced else ""}.</text>')
    lines += svg_footer()

    path.write_text("\n".join(lines), encoding="utf-8")


def draw_wtp_heterogeneity(path: Path, enhanced: bool) -> None:
    rows = sorted(TABLE5_WTP, key=lambda r: r[1])
    width, height = 1600, 980
    left = 350
    top = 170
    chart_w = 900 if not enhanced else 860
    chart_h = 700
    row_h = chart_h / len(rows)
    domain_min, domain_max = -150000.0, 200000.0

    def sx(v: float) -> float:
        return left + ((v - domain_min) / (domain_max - domain_min)) * chart_w

    zero_x = sx(0)
    lines: list[str] = []
    lines += svg_header(
        width,
        height,
        "WTP and Heterogeneity" + (" (Enhanced)" if enhanced else " (Draft)"),
        "WTP from Table 5 and interactions from Table 4.",
    )
    lines.append(f'<rect width="{width}" height="{height}" fill="#f5fbff"/>')
    lines.append(f'<rect x="28" y="24" width="1544" height="932" rx="24" fill="#ffffff" stroke="#d7e3f4"/>')
    lines.append(f'<text x="72" y="90" fill="{COLORS["ink"]}" font-size="42" font-family="Manrope,Arial,sans-serif" font-weight="800">WTP profile{" and heterogeneity signals" if enhanced else ""}</text>')
    lines.append(f'<text x="72" y="126" fill="{COLORS["muted"]}" font-size="24" font-family="Manrope,Arial,sans-serif">Monthly willingness-to-pay in VND for policy attribute levels.</text>')

    for tick in [-150000, -100000, -50000, 0, 50000, 100000, 150000, 200000]:
        x = sx(float(tick))
        lines.append(f'<line x1="{x:.2f}" y1="{top}" x2="{x:.2f}" y2="{top + chart_h}" stroke="{COLORS["grid"]}" stroke-dasharray="4 6"/>')
        label = f"{int(tick/1000):+d}k"
        lines.append(f'<text x="{x:.2f}" y="{top + chart_h + 28}" text-anchor="middle" fill="{COLORS["muted"]}" font-size="15" font-family="Manrope,Arial,sans-serif">{label}</text>')

    lines.append(f'<line x1="{zero_x:.2f}" y1="{top}" x2="{zero_x:.2f}" y2="{top + chart_h}" stroke="#1e293b" stroke-width="2.4"/>')

    for idx, (name, value) in enumerate(rows):
        y = top + idx * row_h + row_h * 0.17
        bar_h = row_h * 0.64
        x0 = sx(min(0, float(value)))
        x1 = sx(max(0, float(value)))
        w = max(2.5, x1 - x0)
        color = COLORS["pos"] if value >= 0 else COLORS["neg"]
        lines.append(f'<rect x="{x0:.2f}" y="{y:.2f}" width="{w:.2f}" height="{bar_h:.2f}" rx="8" fill="{color}" opacity="0.92"/>')
        lines.append(f'<text x="{left - 16}" y="{y + bar_h / 2 + 6:.2f}" text-anchor="end" fill="{COLORS["ink"]}" font-size="18" font-family="Manrope,Arial,sans-serif">{esc(name)}</text>')
        tx = x1 + 10 if value >= 0 else x0 - 10
        anchor = "start" if value >= 0 else "end"
        lines.append(f'<text x="{tx:.2f}" y="{y + bar_h / 2 + 6:.2f}" text-anchor="{anchor}" fill="{COLORS["ink"]}" font-size="16" font-family="Manrope,Arial,sans-serif" font-weight="700">{value:,.0f}</text>')

    lines.append(f'<text x="{left + chart_w / 2:.2f}" y="{top + chart_h + 58}" text-anchor="middle" fill="{COLORS["muted"]}" font-size="19" font-family="Manrope,Arial,sans-serif">WTP (VND per month)</text>')

    if enhanced:
        px = 1230
        py = 180
        pw = 290
        ph = 640
        lines.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="18" fill="#f7fbff" stroke="#d6e6f6"/>')
        lines.append(f'<text x="{px + 18}" y="{py + 38}" fill="{COLORS["ink"]}" font-size="23" font-family="Manrope,Arial,sans-serif" font-weight="800">Table 4 interactions</text>')
        y0 = py + 84
        for name, coef, se in TABLE4_INTERACTIONS:
            sign_color = COLORS["neg"] if coef < 0 else COLORS["pos"]
            lines.append(f'<text x="{px + 18}" y="{y0}" fill="{COLORS["muted"]}" font-size="15" font-family="Manrope,Arial,sans-serif">{esc(name)}</text>')
            lines.append(f'<text x="{px + pw - 18}" y="{y0 + 24}" text-anchor="end" fill="{sign_color}" font-size="16" font-family="Manrope,Arial,sans-serif" font-weight="700">{coef:+.3f} (SE {se:.3f})</text>')
            y0 += 94

        lines.append(f'<text x="{px + 18}" y="{py + ph - 94}" fill="{COLORS["ink"]}" font-size="18" font-family="Manrope,Arial,sans-serif" font-weight="700">Reading rule</text>')
        lines.append(f'<text x="{px + 18}" y="{py + ph - 62}" fill="{COLORS["muted"]}" font-size="14" font-family="Manrope,Arial,sans-serif">Negative WTP: compensation needed</text>')
        lines.append(f'<text x="{px + 18}" y="{py + ph - 38}" fill="{COLORS["muted"]}" font-size="14" font-family="Manrope,Arial,sans-serif">Positive WTP: acceptance support</text>')

    lines.append(f'<text x="800" y="930" text-anchor="middle" fill="{COLORS["muted"]}" font-size="16" font-family="Manrope,Arial,sans-serif">Source: CIEMB revised manuscript Tables 4 and 5.</text>')
    lines += svg_footer()
    path.write_text("\n".join(lines), encoding="utf-8")


def svg_to_png(svg_path: Path) -> None:
    png_path = svg_path.with_suffix(".png")
    with tempfile.TemporaryDirectory() as tmpdir:
        run([
            "qlmanage",
            "-t",
            "-s",
            "1600",
            "-o",
            tmpdir,
            str(svg_path),
        ], check=True, capture_output=True)
        rendered = Path(tmpdir) / f"{svg_path.name}.png"
        if not rendered.exists():
            raise FileNotFoundError(f"Quick Look render failed for {svg_path}")
        shutil.move(str(rendered), str(png_path))


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    assets = root / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    stems = [
        ("viz-motorbike-main-effects-draft.svg", True, False),
        ("viz-motorbike-main-effects-enhanced.svg", True, True),
        ("viz-motorbike-wtp-heterogeneity-draft.svg", False, False),
        ("viz-motorbike-wtp-heterogeneity-enhanced.svg", False, True),
    ]

    for name, is_main, is_enhanced in stems:
        path = assets / name
        if is_main:
            draw_main_effects(path, is_enhanced)
        else:
            draw_wtp_heterogeneity(path, is_enhanced)
        svg_to_png(path)
        print(f"saved {path}")
        print(f"saved {path.with_suffix('.png')}")


if __name__ == "__main__":
    main()
