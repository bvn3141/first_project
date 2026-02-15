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

interface AgeCurveData {
  age: number;
  Attack: number;
  Midfield: number;
  Defender: number;
  Goalkeeper: number;
}

interface Props {
  data: AgeCurveData[];
}

const POSITIONS = [
  { key: 'Attack', color: chartColors[0] },
  { key: 'Midfield', color: chartColors[1] },
  { key: 'Defender', color: chartColors[2] },
  { key: 'Goalkeeper', color: chartColors[3] },
];

export default function AgeCurveChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          {POSITIONS.map((pos) => (
            <linearGradient key={pos.key} id={`grad-${pos.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={pos.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={pos.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
        <XAxis
          dataKey="age"
          stroke={colors.text.tertiary}
          tick={{ fontSize: 11, fontFamily: 'monospace' }}
          label={{
            value: 'Age',
            position: 'insideBottom',
            offset: -5,
            style: { fill: colors.text.tertiary, fontFamily: 'monospace', fontSize: 11 },
          }}
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
          labelFormatter={(label) => `Age: ${label}`}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
        {POSITIONS.map((pos) => (
          <Area
            key={pos.key}
            type="monotone"
            dataKey={pos.key}
            stroke={pos.color}
            fill={`url(#grad-${pos.key})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: pos.color }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
