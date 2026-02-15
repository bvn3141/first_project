import Header from '../components/layout/Header';
import KPICard from '../components/ui/KPICard';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageTransition from '../components/ui/PageTransition';
import VolatilityHeatmap from '../components/charts/VolatilityHeatmap';
import DepreciationChart from '../components/charts/DepreciationChart';
import { useData } from '../hooks/useData';
import { colors, chartColors } from '../theme/colors';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RiskData {
  volatility_heatmap: { league: string; season: string; volatility: number }[];
  drawdown_by_position: { position: string; avg_max_drawdown: number; worst_drawdown: number; player_count: number }[];
  depreciation_rates: { position: string; age_bracket: string; avg_change_pct: number; depreciation_rate: number }[];
  sharpe_ratios: { league: string; sharpe_ratio: number; avg_return: number; volatility: number }[];
}

export default function RiskAnalysis() {
  const { data, loading } = useData<RiskData>('risk_metrics.json');

  if (loading || !data) return <LoadingSpinner />;

  const mostVolatile = [...data.sharpe_ratios].sort((a, b) => b.volatility - a.volatility)[0];
  const safestPosition = [...data.drawdown_by_position].sort(
    (a, b) => b.avg_max_drawdown - a.avg_max_drawdown
  )[0];

  return (
    <PageTransition>
      <Header
        title="Risk Analysis"
        subtitle="Market volatility, drawdown analysis, and depreciation risk -- financial metrics applied to football"
      />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            label="Avg Max Drawdown"
            value={data.drawdown_by_position.reduce((s, d) => s + d.avg_max_drawdown, 0) / data.drawdown_by_position.length}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <KPICard
            label="Most Volatile League"
            value={0}
            format={() => mostVolatile.league}
          />
          <KPICard
            label="Safest Position"
            value={0}
            format={() => safestPosition.position}
          />
          <KPICard
            label="Best Sharpe Ratio"
            value={Math.max(...data.sharpe_ratios.map((d) => d.sharpe_ratio))}
            format={(v) => v.toFixed(2)}
          />
        </div>

        {/* Heatmap + Depreciation */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Value Volatility Heatmap"
              subtitle="Market value volatility (%) by league and season"
            />
            <VolatilityHeatmap data={data.volatility_heatmap} />
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Depreciation by Age Bracket"
              subtitle="Average value change (%) by position and age group"
            />
            <DepreciationChart data={data.depreciation_rates} />
          </div>
        </div>

        {/* Drawdown + Sharpe */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Maximum Drawdown by Position"
              subtitle="Peak-to-trough value decline -- a key risk metric in portfolio management"
            />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.drawdown_by_position}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                <XAxis
                  dataKey="position"
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
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
                  formatter={(value) => [`${(value as number).toFixed(1)}%`, undefined]}
                />
                <Bar dataKey="avg_max_drawdown" fill={chartColors[3]} radius={[4, 4, 0, 0]} name="Avg Max Drawdown" />
                <Bar dataKey="worst_drawdown" fill={chartColors[3] + '55'} radius={[4, 4, 0, 0]} name="Worst Drawdown" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Risk-Adjusted Returns (Sharpe Ratio)"
              subtitle="Higher = better return per unit of risk"
            />
            <div className="space-y-3 mt-4">
              {data.sharpe_ratios
                .sort((a, b) => b.sharpe_ratio - a.sharpe_ratio)
                .map((sr, i) => {
                  const maxSharpe = Math.max(...data.sharpe_ratios.map((d) => d.sharpe_ratio));
                  const barWidth = (sr.sharpe_ratio / maxSharpe) * 100;
                  return (
                    <div key={sr.league} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#8888a0]">{sr.league}</span>
                        <span className="text-[#e8e8f0] font-bold">{sr.sharpe_ratio.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: chartColors[i],
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#555568]">
                        <span>Return: {sr.avg_return.toFixed(1)}%</span>
                        <span>Vol: {sr.volatility.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
