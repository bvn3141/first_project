export function formatEur(value: number): string {
  if (Math.abs(value) >= 1e9) return `\u20AC${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `\u20AC${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `\u20AC${(value / 1e3).toFixed(0)}K`;
  return `\u20AC${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatPct(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
