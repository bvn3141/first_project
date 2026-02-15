import { useState } from 'react';
import Header from '../components/layout/Header';
import PageTransition from '../components/ui/PageTransition';
import KPICard from '../components/ui/KPICard';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useData } from '../hooks/useData';
import type { ClubData } from '../types/data';
import { formatEur } from '../utils/formatters';
import { colors, chartColors } from '../theme/colors';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const POSITION_COLORS = [chartColors[0], chartColors[1], chartColors[2], chartColors[3]];

export default function ClubIntelligence() {
  const { data: clubs, loading } = useData<ClubData[]>('club_financials.json');
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (loading || !clubs) return <LoadingSpinner />;

  const club = clubs[selectedIdx];
  const pieData = Object.entries(club.positions).map(([name, value]) => ({ name, value }));

  return (
    <PageTransition>
      <Header
        title="Club Intelligence"
        subtitle="Squad portfolio analysis -- treating clubs as investment portfolios"
      />
      <div className="p-6 space-y-6">
        {/* Club Selector */}
        <div className="flex flex-wrap gap-2">
          {clubs.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setSelectedIdx(i)}
              className={`px-4 py-2 text-xs font-mono rounded border transition-colors ${
                i === selectedIdx
                  ? 'bg-[#fb8b1e]/10 border-[#fb8b1e] text-[#fb8b1e]'
                  : 'bg-[#111118] border-[#1e1e2e] text-[#8888a0] hover:border-[#2a2a3a] hover:text-[#e8e8f0]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard label="Squad Value" value={club.squad_value} format={formatEur} />
          <KPICard
            label="Star Dependency"
            value={club.star_dependency}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <KPICard label="Avg Age" value={club.avg_age} format={(v) => v.toFixed(1)} />
          <KPICard label="5yr Investment" value={club.invested_5yr} format={formatEur} change={club.roi} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Squad Composition"
              subtitle="Market value distribution by position"
            />
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={POSITION_COLORS[i]} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bg.tertiary,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: 6,
                    fontFamily: 'monospace',
                    fontSize: 11,
                  }}
                  formatter={(value) => [formatEur(value as number), undefined]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }}
                  formatter={(value) => <span style={{ color: colors.text.secondary }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Age Structure"
              subtitle="Player count and total value per age group"
            />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={club.age_groups}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                <XAxis
                  dataKey="group"
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) => formatEur(v)}
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                  width={60}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                  width={30}
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
                <Bar yAxisId="left" dataKey="value" fill={chartColors[0]} radius={[4, 4, 0, 0]} name="Total Value" />
                <Bar yAxisId="right" dataKey="count" fill={chartColors[1]} radius={[4, 4, 0, 0]} name="Players" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
