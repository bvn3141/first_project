import { useState } from 'react';
import Header from '../components/layout/Header';
import PageTransition from '../components/ui/PageTransition';
import KPICard from '../components/ui/KPICard';
import SectionHeader from '../components/ui/SectionHeader';
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

// Mock data -- will be replaced by club_financials.json
const CLUBS = [
  {
    name: 'Manchester City',
    league: 'Premier League',
    squad_value: 1230000000,
    avg_age: 26.3,
    star_dependency: 12.3,
    invested_5yr: 890000000,
    roi: 38.2,
    positions: { Attack: 340000000, Midfield: 420000000, Defender: 380000000, Goalkeeper: 90000000 },
    age_groups: [
      { group: 'U21', count: 3, value: 45000000 },
      { group: '21-24', count: 7, value: 280000000 },
      { group: '25-28', count: 9, value: 520000000 },
      { group: '29-32', count: 6, value: 320000000 },
      { group: '33+', count: 2, value: 65000000 },
    ],
  },
  {
    name: 'Real Madrid',
    league: 'La Liga',
    squad_value: 1120000000,
    avg_age: 27.1,
    star_dependency: 15.8,
    invested_5yr: 650000000,
    roi: 72.3,
    positions: { Attack: 380000000, Midfield: 350000000, Defender: 310000000, Goalkeeper: 80000000 },
    age_groups: [
      { group: 'U21', count: 2, value: 65000000 },
      { group: '21-24', count: 5, value: 320000000 },
      { group: '25-28', count: 8, value: 420000000 },
      { group: '29-32', count: 7, value: 250000000 },
      { group: '33+', count: 3, value: 65000000 },
    ],
  },
  {
    name: 'Bayern Munich',
    league: 'Bundesliga',
    squad_value: 890000000,
    avg_age: 25.8,
    star_dependency: 11.2,
    invested_5yr: 580000000,
    roi: 53.4,
    positions: { Attack: 280000000, Midfield: 290000000, Defender: 250000000, Goalkeeper: 70000000 },
    age_groups: [
      { group: 'U21', count: 4, value: 80000000 },
      { group: '21-24', count: 8, value: 310000000 },
      { group: '25-28', count: 7, value: 320000000 },
      { group: '29-32', count: 5, value: 150000000 },
      { group: '33+', count: 1, value: 30000000 },
    ],
  },
];

const POSITION_COLORS = [chartColors[0], chartColors[1], chartColors[2], chartColors[3]];

export default function ClubIntelligence() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const club = CLUBS[selectedIdx];
  const pieData = Object.entries(club.positions).map(([name, value]) => ({ name, value }));

  return (
    <PageTransition>
      <Header
        title="Club Intelligence"
        subtitle="Squad portfolio analysis -- treating clubs as investment portfolios"
      />
      <div className="p-6 space-y-6">
        {/* Club Selector */}
        <div className="flex gap-2">
          {CLUBS.map((c, i) => (
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
