#!/usr/bin/env python3
"""Regenerate an improved segment signature visualization."""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch


# Reconstructed values from the existing portfolio chart.
SEGMENT_SIGNATURES = {
    "Segment 1": {"Service": -0.125, "Location": -0.103, "Room": -0.084},
    "Segment 2": {"Facilities": 0.210, "Location": 0.064, "Room": 0.055},
    "Segment 3": {"Service": 0.425, "Location": -0.098, "Food_Beverage": -0.056},
    "Segment 6": {"Cleanliness": 0.330, "Room": 0.132, "Service": 0.074},
    "Segment 7": {"Location": 0.423, "Service": 0.116, "Room": 0.058},
    "Segment 8": {"Facilities": 0.645, "Location": 0.312, "Service": -0.071},
}

POS_COLOR = "#1f9d8a"
NEG_COLOR = "#e76f51"
GRID_COLOR = "#cbd5e1"
TEXT_COLOR = "#111827"


def style_axis(ax: plt.Axes, x_limits: tuple[float, float]) -> None:
    """Apply consistent axis styling."""
    ax.set_facecolor("#ffffff")
    ax.set_xlim(*x_limits)
    ax.axvline(0, color="#374151", linewidth=1.4, zorder=0)
    ax.grid(axis="x", linestyle="--", linewidth=0.9, color=GRID_COLOR, alpha=0.55)
    ax.set_axisbelow(True)
    ax.tick_params(axis="x", labelsize=10, colors="#1f2937")
    ax.tick_params(axis="y", labelsize=11, colors=TEXT_COLOR)
    for spine in ax.spines.values():
        spine.set_color("#9ca3af")
        spine.set_linewidth(0.85)


def add_value_labels(ax: plt.Axes, bars, values: np.ndarray, x_span: float) -> None:
    """Label each bar with its signed value."""
    pad = x_span * 0.012
    for bar, value in zip(bars, values):
        if value >= 0:
            x = value + pad
            ha = "left"
        else:
            x = value + pad
            ha = "left"
        ax.text(
            x,
            bar.get_y() + bar.get_height() / 2,
            f"{value:+.3f}",
            va="center",
            ha=ha,
            fontsize=9.5,
            color="#0f172a",
            fontweight="semibold",
        )


def plot_signatures(output_png: Path, output_svg: Path) -> None:
    """Create enhanced segment signature figure."""
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "axes.titlesize": 16,
            "axes.titleweight": "bold",
        }
    )

    fig, axes = plt.subplots(2, 3, figsize=(16.5, 9), sharex=True)
    fig.patch.set_facecolor("#f8fafc")

    # Shared scale improves cross-panel comparability.
    all_values = [value for segment in SEGMENT_SIGNATURES.values() for value in segment.values()]
    x_min = -0.20
    x_max = 0.70
    x_limits = (x_min, x_max)
    x_span = x_max - x_min

    for idx, (ax, (segment, metrics)) in enumerate(zip(axes.flat, SEGMENT_SIGNATURES.items())):
        labels = np.array(list(metrics.keys()))
        values = np.array(list(metrics.values()), dtype=float)

        order = np.argsort(np.abs(values))[::-1]
        labels = labels[order]
        values = values[order]
        colors = np.where(values >= 0, POS_COLOR, NEG_COLOR)

        bars = ax.barh(labels, values, color=colors, height=0.75, edgecolor="none")
        ax.invert_yaxis()

        style_axis(ax, x_limits=x_limits)
        add_value_labels(ax, bars, values, x_span=x_span)
        ax.set_title(segment, color=TEXT_COLOR, pad=8)

        if idx >= 3:
            ax.set_xlabel("Δ Salience vs Market Baseline", fontsize=11, color="#1f2937")

    ticks = np.arange(-0.2, 0.71, 0.1)
    for ax in axes.flat:
        ax.set_xticks(ticks)

    fig.suptitle(
        "Segment Signatures (Contrast to Market Baseline)",
        fontsize=22,
        fontweight="bold",
        color=TEXT_COLOR,
        y=0.975,
    )
    fig.text(
        0.5,
        0.915,
        "Positive bars indicate over-indexed aspect salience; negative bars indicate under-indexed salience.",
        ha="center",
        fontsize=11,
        color="#334155",
    )

    legend_handles = [
        Patch(facecolor=POS_COLOR, label="Over-indexed vs baseline"),
        Patch(facecolor=NEG_COLOR, label="Under-indexed vs baseline"),
    ]
    fig.legend(
        handles=legend_handles,
        loc="upper center",
        bbox_to_anchor=(0.5, 0.885),
        ncol=2,
        frameon=False,
        fontsize=10.5,
    )

    plt.tight_layout(rect=(0, 0.02, 1, 0.84))
    output_png.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_png, dpi=300, facecolor=fig.get_facecolor())
    fig.savefig(output_svg, facecolor=fig.get_facecolor())
    plt.close(fig)


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    output_png = root / "assets" / "fig_segment_signatures.png"
    output_svg = root / "assets" / "fig_segment_signatures.svg"
    plot_signatures(output_png=output_png, output_svg=output_svg)
    print(f"Saved {output_png}")
    print(f"Saved {output_svg}")
