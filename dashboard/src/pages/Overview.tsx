import Header from '../components/layout/Header';
import KPICard from '../components/ui/KPICard';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageTransition from '../components/ui/PageTransition';
import MarketTrendLine from '../components/charts/MarketTrendLine';
import LeagueComparisonBar from '../components/charts/LeagueComparisonBar';
import TopTransfersTable from '../components/charts/TopTransfersTable';
import { useData } from '../hooks/useData';
import { formatEur, formatNumber } from '../utils/formatters';

interface MarketData {
  year: number;
  league_name: string;
  league_id: string;
  total_market_value: number;
  player_count: number;
  avg_player_value: number;
  yoy_growth_pct: number | null;
}

interface LeagueData {
  league: string;
  league_id: string;
  total_value: number;
  avg_value: number;
  player_count: number;
  top_club: string;
  top_club_value: number;
}

interface Transfer {
  player_name: string;
  from_club: string;
  to_club: string;
  fee: number;
}

export default function Overview() {
  const { data: marketData, loading: l1 } = useData<MarketData[]>('market_overview.json');
  const { data: leagueData, loading: l2 } = useData<LeagueData[]>('league_comparison.json');
  const { data: transferData, loading: l3 } = useData<Transfer[]>('top_transfers.json');

  if (l1 || l2 || l3) return <LoadingSpinner />;

  // Calculate KPIs from latest year
  const latestYear = marketData ? Math.max(...marketData.map((d) => d.year)) : 0;
  const latestData = marketData?.filter((d) => d.year === latestYear) ?? [];
  const totalValue = latestData.reduce((sum, d) => sum + d.total_market_value, 0);
  const totalPlayers = latestData.reduce((sum, d) => sum + d.player_count, 0);
  const avgGrowth =
    latestData.filter((d) => d.yoy_growth_pct != null).reduce((sum, d) => sum + (d.yoy_growth_pct ?? 0), 0) /
    Math.max(latestData.filter((d) => d.yoy_growth_pct != null).length, 1);

  return (
    <PageTransition>
      <Header
        title="Market Overview"
        subtitle="European Football Transfer Market -- Big 5 Leagues"
      />
      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            label="Total Market Value"
            value={totalValue}
            format={formatEur}
            change={avgGrowth}
          />
          <KPICard
            label="Active Players"
            value={totalPlayers}
            format={(v) => formatNumber(Math.round(v))}
          />
          <KPICard
            label="Leagues Tracked"
            value={5}
            format={(v) => Math.round(v).toString()}
          />
          <KPICard
            label="Data Since"
            value={marketData ? Math.min(...marketData.map((d) => d.year)) : 2012}
            format={(v) => Math.round(v).toString()}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Market Value Trend"
              subtitle="Total market value by league over time"
            />
            {marketData && <MarketTrendLine data={marketData} />}
          </div>
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="League Comparison"
              subtitle="Current total market value by league"
            />
            {leagueData && <LeagueComparisonBar data={leagueData} />}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="Top Transfers -- All Time"
              subtitle="Highest transfer fees recorded"
            />
            {transferData && <TopTransfersTable data={transferData} />}
          </div>
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-5">
            <SectionHeader
              title="League Summary"
              subtitle="Key metrics per league"
            />
            {leagueData && (
              <div className="space-y-3">
                {leagueData.map((l) => (
                  <div
                    key={l.league_id}
                    className="flex items-center justify-between py-2 border-b border-[#1e1e2e]/50 last:border-0"
                  >
                    <div>
                      <div className="text-xs font-mono text-[#e8e8f0] font-medium">
                        {l.league}
                      </div>
                      <div className="text-[10px] font-mono text-[#555568]">
                        {l.player_count} players | Top: {l.top_club}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-[#fb8b1e] font-bold">
                        {formatEur(l.total_value)}
                      </div>
                      <div className="text-[10px] font-mono text-[#555568]">
                        avg {formatEur(l.avg_value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
