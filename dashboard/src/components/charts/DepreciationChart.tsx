import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { colors, chartColors } from '../../theme/colors';

interface DepreciationData {
  position: string;
  age_bracket: string;
  avg_change_pct: number;
}

interface Props {
  data: DepreciationData[];
}

const BRACKETS = ['U23', '23-26', '27-29', '30-32', '33+'];

export default function DepreciationChart({ data }: Props) {
  // Pivot: one row per age bracket, columns per position
  const pivoted = BRACKETS.map((bracket) => {
    const row: Record<string, string | number> = { age_bracket: bracket };
    ['Attack', 'Midfield', 'Defender', 'Goalkeeper'].forEach((pos) => {
      const match = data.find(
        (d) => d.position === pos && d.age_bracket === bracket
      );
      row[pos] = match?.avg_change_pct ?? 0;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={pivoted} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
        <XAxis
          dataKey="age_bracket"
          stroke={colors.text.tertiary}
          tick={{ fontSize: 11, fontFamily: 'monospace' }}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          stroke={colors.text.tertiary}
          tick={{ fontSize: 11, fontFamily: 'monospace' }}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.bg.tertiary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 11,
          }}
          formatter={(value) => [`${(value as number).toFixed(1)}%`, undefined]}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
        <ReferenceLine y={0} stroke={colors.text.tertiary} strokeDasharray="3 3" />
        <Bar dataKey="Attack" fill={chartColors[0]} radius={[3, 3, 0, 0]} />
        <Bar dataKey="Midfield" fill={chartColors[1]} radius={[3, 3, 0, 0]} />
        <Bar dataKey="Defender" fill={chartColors[2]} radius={[3, 3, 0, 0]} />
        <Bar dataKey="Goalkeeper" fill={chartColors[3]} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
