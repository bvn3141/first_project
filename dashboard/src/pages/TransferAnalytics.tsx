import Header from '../components/layout/Header';
import KPICard from '../components/ui/KPICard';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageTransition from '../components/ui/PageTransition';
import TopTransfersTable from '../components/charts/TopTransfersTable';
import { useData } from '../hooks/useData';
import type { TransferAnalyticsData } from '../types/data';
import { formatEur, formatNumber } from '../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import { colors, chartColors } from '../theme/colors';

interface Transfer {
  player_name: string;
  from_club: string;
  to_club: string;
  fee: number;
}

export default function TransferAnalytics() {
  const { data: transfers, loading: loadingTransfers } = useData<Transfer[]>('top_transfers.json');
  const { data: analytics, loading: loadingAnalytics } = useData<TransferAnalyticsData>('transfer_analytics.json');

  if (loadingTransfers || loadingAnalytics) return <LoadingSpinner />;

  const totalFees = transfers?.reduce((s, t) => s + t.fee, 0) ?? 0;
  const maxFee = transfers ? Math.max(...transfers.map((t) => t.fee)) : 0;

  return (
    <PageTransition>
      <Header
        title="Transfer Analytics"
        subtitle="Transfer fees, ROI analysis, and spending patterns"
      />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard label="Top 10 Total Fees" value={totalFees} format={formatEur} />
          <KPICard label="Record Transfer" value={maxFee} format={formatEur} />
          <KPICard
            label="Avg Top-10 Fee"
            value={totalFees / (transfers?.length ?? 1)}
            format={formatEur}
          />
          <KPICard
            label="Transfers Analyzed"
            value={analytics?.total_analyzed ?? 0}
            format={(v) => formatNumber(Math.round(v))}
          />
        </div>

        {/* ROI Distribution + Net Spend */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Transfer ROI Distribution"
              subtitle="Market value change 1 year after transfer"
            />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.roi_distribution ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                <XAxis
                  type="number"
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={130}
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
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
                <Bar dataKey="count" fill={chartColors[0]} radius={[0, 4, 4, 0]} name="Transfers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Club Net Spend (5yr)"
              subtitle="Positive = net seller, Negative = net spender"
            />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.net_spend ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatEur(v)}
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  type="category"
                  dataKey="club"
                  width={80}
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bg.tertiary,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: 6,
                    fontFamily: 'monospace',
                    fontSize: 11,
                  }}
                  formatter={(value) => [formatEur(value as number), 'Net Spend']}
                />
                <ReferenceLine x={0} stroke={colors.text.tertiary} />
                <Bar
                  dataKey="net_spend"
                  fill={chartColors[0]}
                  radius={[0, 4, 4, 0]}
                  name="Net Spend"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter + Table */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Fee vs. Value Change"
              subtitle="Transfer fee plotted against 1-year market value change"
            />
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                <XAxis
                  dataKey="fee"
                  name="Fee"
                  tickFormatter={(v) => formatEur(v)}
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  dataKey="value_change"
                  name="Value Change"
                  tickFormatter={(v) => `${v}%`}
                  stroke={colors.text.tertiary}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <ZAxis dataKey="age" range={[30, 200]} name="Age" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bg.tertiary,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: 6,
                    fontFamily: 'monospace',
                    fontSize: 11,
                  }}
                />
                <ReferenceLine y={0} stroke={colors.accent.amber} strokeDasharray="3 3" />
                <Scatter data={analytics?.scatter ?? []} fill={chartColors[0]} fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Record Transfers"
              subtitle="All-time highest fees"
            />
            {transfers && <TopTransfersTable data={transfers} />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
