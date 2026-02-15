import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { colors, chartColors } from '../../theme/colors';
import { formatEur } from '../../utils/formatters';

interface MarketData {
  year: number;
  league_name: string;
  league_id: string;
  total_market_value: number;
}

interface Props {
  data: MarketData[];
}

const LEAGUES = [
  { id: 'GB1', name: 'Premier League' },
  { id: 'ES1', name: 'La Liga' },
  { id: 'L1', name: 'Bundesliga' },
  { id: 'IT1', name: 'Serie A' },
  { id: 'FR1', name: 'Ligue 1' },
];

export default function MarketTrendLine({ data }: Props) {
  // Pivot data: one row per year, with a column per league
  const years = [...new Set(data.map((d) => d.year))].sort();
  const pivoted = years.map((year) => {
    const row: Record<string, number> = { year };
    LEAGUES.forEach((league) => {
      const match = data.find(
        (d) => d.year === year && d.league_id === league.id
      );
      row[league.name] = match ? match.total_market_value : 0;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={pivoted} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          {LEAGUES.map((league, i) => (
            <linearGradient key={league.id} id={`grad-${league.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors[i]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColors[i]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
        <XAxis
          dataKey="year"
          stroke={colors.text.tertiary}
          tick={{ fontSize: 11, fontFamily: 'monospace' }}
        />
        <YAxis
          tickFormatter={(v) => formatEur(v)}
          stroke={colors.text.tertiary}
          tick={{ fontSize: 11, fontFamily: 'monospace' }}
          width={70}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.bg.tertiary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 11,
          }}
          formatter={(value) => [formatEur(value as number), undefined]}
          labelStyle={{ color: colors.text.primary, fontWeight: 'bold' }}
          itemStyle={{ color: colors.text.secondary }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }}
        />
        {LEAGUES.map((league, i) => (
          <Area
            key={league.id}
            type="monotone"
            dataKey={league.name}
            stroke={chartColors[i]}
            fill={`url(#grad-${league.id})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: chartColors[i] }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
