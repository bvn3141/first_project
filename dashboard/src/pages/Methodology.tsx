import Header from '../components/layout/Header';
import PageTransition from '../components/ui/PageTransition';

const SQL_EXAMPLE = `-- Transfer ROI: Correlated subquery to get value 1yr after transfer
WITH transfer_roi AS (
    SELECT
        t.player_name,
        t.transfer_fee,
        (
            SELECT pv.market_value_in_eur
            FROM player_valuations pv
            WHERE pv.player_id = t.player_id
              AND pv.date > t.transfer_date
              AND pv.date <= DATE(t.transfer_date, '+365 days')
            ORDER BY pv.date DESC
            LIMIT 1
        ) AS mv_after_1_year
    FROM transfers t
    WHERE t.transfer_fee > 0
)
SELECT
    CASE
        WHEN mv_after_1_year > transfer_fee * 1.5 THEN 'Excellent'
        WHEN mv_after_1_year > transfer_fee THEN 'Positive'
        ELSE 'Loss'
    END AS roi_category,
    COUNT(*) AS transfers,
    ROUND(AVG(
        (mv_after_1_year - transfer_fee) * 100.0 / transfer_fee
    ), 2) AS avg_roi_pct
FROM transfer_roi
WHERE mv_after_1_year IS NOT NULL
GROUP BY roi_category;`;

const TECH_STACK = [
  { category: 'Data Analysis', tools: 'Python 3.12, pandas, numpy, scikit-learn' },
  { category: 'SQL', tools: 'SQLite -- CTEs, Window Functions, Correlated Subqueries' },
  { category: 'Statistical Models', tools: 'Linear Regression, K-Means Clustering, Time Series' },
  { category: 'Frontend', tools: 'React 19, TypeScript, Vite 6' },
  { category: 'Visualization', tools: 'Recharts, Nivo (Heatmap, Treemap, Sankey)' },
  { category: 'Styling', tools: 'Tailwind CSS 4, Framer Motion' },
  { category: 'Deployment', tools: 'GitHub Pages via GitHub Actions' },
];

export default function Methodology() {
  return (
    <PageTransition>
      <Header
        title="Methodology"
        subtitle="Data sources, analysis approach, and technical implementation"
      />
      <div className="p-6 space-y-8 max-w-4xl">
        {/* About */}
        <section>
          <h2 className="text-sm font-bold font-mono text-[#fb8b1e] uppercase tracking-wider mb-3">
            About This Project
          </h2>
          <p className="text-sm font-mono text-[#8888a0] leading-relaxed">
            This dashboard applies financial analysis concepts -- ROI, volatility, Sharpe ratio,
            depreciation, and drawdown analysis -- to European football transfer market data.
            The goal is to demonstrate data analytics skills in a context that bridges sports
            and finance, showcasing proficiency in SQL, Python, and interactive visualization.
          </p>
        </section>

        {/* Data Source */}
        <section>
          <h2 className="text-sm font-bold font-mono text-[#fb8b1e] uppercase tracking-wider mb-3">
            Data Source
          </h2>
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-xs font-mono text-[#e8e8f0] font-bold">
              Football Data from Transfermarkt
            </div>
            <div className="text-[11px] font-mono text-[#8888a0] mt-1">
              Source: Kaggle (davidcariboo/player-scores) | License: CC BY-SA 4.0
            </div>
            <div className="text-[11px] font-mono text-[#555568] mt-2">
              9 interconnected tables | 30,000+ players | 400+ clubs | 60,000+ matches |
              430,000+ market value snapshots | Covers major European leagues
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-sm font-bold font-mono text-[#fb8b1e] uppercase tracking-wider mb-3">
            Tech Stack
          </h2>
          <div className="space-y-2">
            {TECH_STACK.map((item) => (
              <div
                key={item.category}
                className="flex items-start gap-4 py-2 border-b border-[#1e1e2e]/50 last:border-0"
              >
                <span className="text-[11px] font-mono text-[#555568] w-36 flex-shrink-0 uppercase">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-[#8888a0]">{item.tools}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SQL Showcase */}
        <section>
          <h2 className="text-sm font-bold font-mono text-[#fb8b1e] uppercase tracking-wider mb-3">
            SQL Showcase
          </h2>
          <p className="text-[11px] font-mono text-[#8888a0] mb-3">
            Example: Transfer ROI analysis using correlated subqueries, CTEs, and CASE expressions.
          </p>
          <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4 overflow-x-auto">
            <pre className="text-[11px] font-mono text-[#8888a0] whitespace-pre leading-relaxed">
              {SQL_EXAMPLE}
            </pre>
          </div>
        </section>

        {/* Analysis Notebooks */}
        <section>
          <h2 className="text-sm font-bold font-mono text-[#fb8b1e] uppercase tracking-wider mb-3">
            Analysis Notebooks
          </h2>
          <div className="space-y-2">
            {[
              { name: '01_data_ingestion.ipynb', desc: 'CSV loading, cleaning, SQLite pipeline' },
              { name: '02_exploratory_analysis.ipynb', desc: 'EDA with statistical visualizations' },
              { name: '03_sql_analysis.ipynb', desc: 'Advanced SQL queries with commentary' },
              { name: '04_statistical_models.ipynb', desc: 'Regression, clustering, time series' },
              { name: '05_export_dashboard_data.ipynb', desc: 'JSON export for dashboard' },
            ].map((nb) => (
              <div
                key={nb.name}
                className="flex items-center gap-3 py-2 border-b border-[#1e1e2e]/50 last:border-0"
              >
                <span className="text-xs font-mono text-[#4af6c3]">{nb.name}</span>
                <span className="text-[11px] font-mono text-[#555568]">{nb.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Key Insights */}
        <section>
          <h2 className="text-sm font-bold font-mono text-[#fb8b1e] uppercase tracking-wider mb-3">
            Key Financial Concepts Applied
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { term: 'ROI', desc: 'Transfer fee vs. subsequent market value change' },
              { term: 'Volatility', desc: 'Standard deviation of monthly market value changes' },
              { term: 'Sharpe Ratio', desc: 'Risk-adjusted returns per league' },
              { term: 'Max Drawdown', desc: 'Peak-to-trough value decline per player' },
              { term: 'Depreciation', desc: 'Value decline curves by age and position' },
              { term: 'Concentration Risk', desc: 'Star dependency as % of total squad value' },
            ].map((concept) => (
              <div
                key={concept.term}
                className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-3"
              >
                <div className="text-xs font-mono text-[#e8e8f0] font-bold">{concept.term}</div>
                <div className="text-[11px] font-mono text-[#555568] mt-1">{concept.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
