import Header from '../components/layout/Header';
import KPICard from '../components/ui/KPICard';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageTransition from '../components/ui/PageTransition';
import AgeCurveChart from '../components/charts/AgeCurveChart';
import { useData } from '../hooks/useData';
import { formatEur } from '../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Treemap,
} from 'recharts';
import { colors, chartColors } from '../theme/colors';

interface AgeCurveData {
  age: number;
  Attack: number;
  Midfield: number;
  Defender: number;
  Goalkeeper: number;
}

// Mock position data for treemap
const POSITION_DATA = [
  { name: 'Centre-Forward', size: 8500000000, position: 'Attack' },
  { name: 'Left Winger', size: 6200000000, position: 'Attack' },
  { name: 'Right Winger', size: 5800000000, position: 'Attack' },
  { name: 'Central Midfield', size: 5500000000, position: 'Midfield' },
  { name: 'Attacking Midfield', size: 4800000000, position: 'Midfield' },
  { name: 'Defensive Midfield', size: 4200000000, position: 'Midfield' },
  { name: 'Centre-Back', size: 7200000000, position: 'Defender' },
  { name: 'Left-Back', size: 3800000000, position: 'Defender' },
  { name: 'Right-Back', size: 3500000000, position: 'Defender' },
  { name: 'Goalkeeper', size: 2800000000, position: 'Goalkeeper' },
];

const POSITION_COLORS: Record<string, string> = {
  Attack: chartColors[0],
  Midfield: chartColors[1],
  Defender: chartColors[2],
  Goalkeeper: chartColors[3],
};

// Mock value distribution (histogram bins)
const VALUE_DISTRIBUTION = [
  { range: '<1M', count: 12500 },
  { range: '1-5M', count: 8200 },
  { range: '5-10M', count: 4100 },
  { range: '10-20M', count: 2300 },
  { range: '20-50M', count: 1200 },
  { range: '50-100M', count: 380 },
  { range: '>100M', count: 45 },
];

interface TreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  position: string;
}

function CustomTreemapContent({ x, y, width, height, name, position }: TreemapContentProps) {
  const fill = POSITION_COLORS[position] || chartColors[0];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={0.2}
        stroke={fill}
        strokeWidth={1}
        strokeOpacity={0.5}
        rx={3}
      />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={fill}
          fontSize={width > 100 ? 11 : 9}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {name}
        </text>
      )}
    </g>
  );
}

export default function PlayerValuation() {
  const { data: ageCurves, loading } = useData<AgeCurveData[]>('age_curves.json');

  if (loading) return <LoadingSpinner />;

  return (
    <PageTransition>
      <Header
        title="Player Valuation"
        subtitle="Market value drivers, age depreciation curves, and position analysis"
      />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard label="Peak Age (Attackers)" value={26} format={(v) => Math.round(v).toString()} />
          <KPICard label="Peak Age (Goalkeepers)" value={29} format={(v) => Math.round(v).toString()} />
          <KPICard
            label="Avg Depreciation 30+"
            value={-15.8}
            format={(v) => `${v.toFixed(1)}%/yr`}
          />
          <KPICard
            label="Highest Valued Position"
            value={23000000}
            format={(v) => `${formatEur(v)} (CF)`}
          />
        </div>

        {/* Age Curve -- Full Width */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
          <SectionHeader
            title="Age-Value Depreciation Curves"
            subtitle="Average market value by age and position -- analogous to actuarial depreciation tables"
          />
          {ageCurves && <AgeCurveChart data={ageCurves} />}
        </div>

        {/* Treemap + Distribution */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Market Value by Position"
              subtitle="Total market value distribution across positions"
            />
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={POSITION_DATA}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<CustomTreemapContent x={0} y={0} width={0} height={0} name="" position="" />}
              />
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {Object.entries(POSITION_COLORS).map(([pos, color]) => (
                <div key={pos} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono text-[#8888a0]">{pos}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Value Distribution"
              subtitle="Number of players per value bracket"
            />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={VALUE_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                <XAxis
                  dataKey="range"
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bg.tertiary,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: 6,
                    fontFamily: 'monospace',
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="count" fill={chartColors[0]} radius={[4, 4, 0, 0]} name="Players" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
