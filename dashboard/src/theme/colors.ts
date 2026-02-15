export const colors = {
  bg: {
    primary: '#0a0a0f',
    secondary: '#111118',
    tertiary: '#1a1a24',
    hover: '#22222e',
  },
  accent: {
    orange: '#fb8b1e',
    blue: '#0068ff',
    cyan: '#4af6c3',
    red: '#ff433d',
    amber: '#FFA028',
    purple: '#a855f7',
  },
  text: {
    primary: '#e8e8f0',
    secondary: '#8888a0',
    tertiary: '#555568',
    accent: '#fb8b1e',
  },
  chart: [
    '#fb8b1e',
    '#0068ff',
    '#4af6c3',
    '#ff433d',
    '#a855f7',
    '#fbbf24',
    '#34d399',
    '#f472b6',
  ],
  border: {
    subtle: '#1e1e2e',
    default: '#2a2a3a',
    strong: '#3a3a4a',
  },
} as const;

export const chartColors = colors.chart;
