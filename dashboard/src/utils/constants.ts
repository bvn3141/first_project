export const LEAGUE_NAMES: Record<string, string> = {
  GB1: 'Premier League',
  ES1: 'La Liga',
  IT1: 'Serie A',
  L1: 'Bundesliga',
  FR1: 'Ligue 1',
};

export const LEAGUE_IDS = ['GB1', 'ES1', 'IT1', 'L1', 'FR1'] as const;

export const POSITIONS = ['Attack', 'Midfield', 'Defender', 'Goalkeeper'] as const;

export const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: 'chart-line' },
  { path: '/transfers', label: 'Transfer Analytics', icon: 'arrow-right-left' },
  { path: '/valuation', label: 'Player Valuation', icon: 'trending-up' },
  { path: '/risk', label: 'Risk Analysis', icon: 'shield-alert' },
  { path: '/clubs', label: 'Club Intelligence', icon: 'building' },
  { path: '/methodology', label: 'Methodology', icon: 'book-open' },
] as const;
