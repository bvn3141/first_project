"""Matplotlib and seaborn styling helpers for Bloomberg-style charts."""

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

# Bloomberg Terminal color palette
COLORS = {
    "bg_primary": "#0a0a0f",
    "bg_secondary": "#111118",
    "bg_tertiary": "#1a1a24",
    "text_primary": "#e8e8f0",
    "text_secondary": "#8888a0",
    "text_tertiary": "#555568",
    "orange": "#fb8b1e",
    "blue": "#0068ff",
    "cyan": "#4af6c3",
    "red": "#ff433d",
    "amber": "#FFA028",
    "purple": "#a855f7",
    "yellow": "#fbbf24",
    "emerald": "#34d399",
    "pink": "#f472b6",
    "grid": "#1e1e2e",
    "border": "#2a2a3a",
}

CHART_PALETTE = [
    COLORS["orange"],
    COLORS["blue"],
    COLORS["cyan"],
    COLORS["red"],
    COLORS["purple"],
    COLORS["yellow"],
    COLORS["emerald"],
    COLORS["pink"],
]


def apply_bloomberg_style():
    """Apply Bloomberg Terminal dark theme to matplotlib."""
    plt.rcParams.update({
        "figure.facecolor": COLORS["bg_primary"],
        "axes.facecolor": COLORS["bg_secondary"],
        "axes.edgecolor": COLORS["border"],
        "axes.labelcolor": COLORS["text_secondary"],
        "axes.grid": True,
        "grid.color": COLORS["grid"],
        "grid.alpha": 0.5,
        "grid.linewidth": 0.5,
        "text.color": COLORS["text_primary"],
        "xtick.color": COLORS["text_secondary"],
        "ytick.color": COLORS["text_secondary"],
        "legend.facecolor": COLORS["bg_tertiary"],
        "legend.edgecolor": COLORS["border"],
        "legend.fontsize": 9,
        "font.family": "monospace",
        "font.size": 10,
        "axes.titlesize": 14,
        "axes.titleweight": "bold",
        "figure.dpi": 120,
        "savefig.dpi": 150,
        "savefig.facecolor": COLORS["bg_primary"],
    })


def format_eur(value: float, pos=None) -> str:
    """Format a number as EUR with abbreviation (K, M, B)."""
    if abs(value) >= 1e9:
        return f"\u20ac{value / 1e9:.1f}B"
    elif abs(value) >= 1e6:
        return f"\u20ac{value / 1e6:.1f}M"
    elif abs(value) >= 1e3:
        return f"\u20ac{value / 1e3:.0f}K"
    return f"\u20ac{value:.0f}"


def eur_formatter():
    """Return a matplotlib FuncFormatter for EUR values."""
    return mticker.FuncFormatter(format_eur)


def add_watermark(ax, text="Football Transfer Market Analytics"):
    """Add a subtle watermark to the chart."""
    ax.text(
        0.99, 0.01, text,
        transform=ax.transAxes,
        fontsize=7,
        color=COLORS["text_tertiary"],
        ha="right", va="bottom",
        alpha=0.5,
    )
