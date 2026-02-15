import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { colors, chartColors } from '../../theme/colors';
import { formatEur } from '../../utils/formatters';

interface LeagueData {
  league: string;
  total_value: number;
  avg_value: number;
  player_count: number;
}

interface Props {
  data: LeagueData[];
}

export default function LeagueComparisonBar({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
        <XAxis
          dataKey="league"
          stroke={colors.text.tertiary}
          tick={{ fontSize: 10, fontFamily: 'monospace' }}
          angle={-15}
          textAnchor="end"
          height={50}
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
          formatter={(value, name) => [
            formatEur(value as number),
            name === 'total_value' ? 'Total Value' : 'Avg Player Value',
          ]}
        />
        <Bar
          dataKey="total_value"
          fill={chartColors[0]}
          radius={[4, 4, 0, 0]}
          name="Total Value"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
