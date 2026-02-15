"""
Helper script: creates all analysis notebooks.
Run from project root: python notebooks/build_notebooks.py
"""
import nbformat as nbf
from pathlib import Path

NB_DIR = Path(__file__).parent


def nb(cells):
    n = nbf.v4.new_notebook()
    n.cells = cells
    return n


def md(text):
    return nbf.v4.new_markdown_cell(text)


def code(text):
    return nbf.v4.new_code_cell(text)


SETUP = """
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import sqlite3
import warnings
warnings.filterwarnings('ignore')
from pathlib import Path

plt.rcParams.update({
    'figure.facecolor': '#0a0a0f', 'axes.facecolor': '#111118',
    'axes.edgecolor': '#1e1e2e', 'axes.labelcolor': '#8888a0',
    'text.color': '#e8e8f0', 'xtick.color': '#555568', 'ytick.color': '#555568',
    'grid.color': '#1e1e2e', 'grid.alpha': 0.5, 'font.family': 'monospace',
    'axes.titlecolor': '#fb8b1e', 'axes.titleweight': 'bold', 'axes.titlesize': 12,
})
ORANGE, CYAN, RED = '#fb8b1e', '#4af6c3', '#ff433d'
COLORS = [ORANGE, CYAN, '#3b82f6', '#a855f7', '#22d3ee']
LEAGUE_NAMES = {'GB1': 'Premier League', 'ES1': 'La Liga', 'IT1': 'Serie A',
                'L1': 'Bundesliga', 'FR1': 'Ligue 1'}
BIG5 = list(LEAGUE_NAMES.keys())

DB_PATH = Path('..') / 'data' / 'processed' / 'football.db'
conn = sqlite3.connect(DB_PATH)
print(f"Connected: {DB_PATH}")
"""

# ── 02 EDA ────────────────────────────────────────────────────────────────────
SQL_TRANSFERS = '''
    SELECT transfer_fee, market_value_in_eur, player_name,
           from_club_name, to_club_name, transfer_season
    FROM transfers
    WHERE transfer_fee > 1000000
'''

SQL_MV_TREND = '''
    SELECT
        CAST(strftime('%Y', date) AS INTEGER) as year,
        player_club_domestic_competition_id as league_id,
        COUNT(DISTINCT player_id) as player_count,
        SUM(market_value_in_eur) / 1e9 as total_value_bn,
        AVG(market_value_in_eur) / 1e6 as avg_value_m
    FROM player_valuations
    WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
      AND market_value_in_eur > 0
      AND date >= '2012-01-01'
    GROUP BY year, league_id
    ORDER BY year, league_id
'''

SQL_AGE_EDA = '''
    SELECT
        CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INTEGER) as age,
        p.position,
        pv.market_value_in_eur / 1e6 as value_m
    FROM player_valuations pv
    JOIN players p ON pv.player_id = p.player_id
    WHERE p.position IN ('Attack', 'Midfield', 'Defender', 'Goalkeeper')
      AND p.date_of_birth IS NOT NULL
      AND pv.market_value_in_eur > 0
      AND pv.date >= '2015-01-01'
'''

SQL_VALS_DIST = '''
    SELECT market_value_in_eur / 1e6 as value_m
    FROM player_valuations
    WHERE market_value_in_eur > 0
      AND date >= '2023-01-01'
'''

nb02_cells = [
    md("# 02 - Exploratory Data Analysis\n\nDeep-dive into the Transfermarkt dataset: distributions, trends, correlations, and key patterns."),
    code(SETUP),
    md("## 1. Dataset Overview"),
    code("""
tables = pd.read_sql("SELECT name FROM sqlite_master WHERE type='table'", conn)['name'].tolist()
print(f"{'TABLE':<30} {'ROWS':>12}")
print('-' * 44)
for t in sorted(tables):
    n = pd.read_sql(f"SELECT COUNT(*) as n FROM [{t}]", conn)['n'].iloc[0]
    print(f"{t:<30} {n:>12,}")
"""),
    md("## 2. Transfer Fee Distribution"),
    code(f"""
SQL = '''{SQL_TRANSFERS}'''
df_transfers = pd.read_sql(SQL, conn)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].hist(df_transfers['transfer_fee'] / 1e6, bins=50, color=ORANGE, alpha=0.8, edgecolor='none')
axes[0].set_xlabel('Transfer Fee (M EUR)')
axes[0].set_ylabel('Count')
axes[0].set_title('Transfer Fee Distribution (>1M)')
axes[0].set_yscale('log')

top15 = df_transfers.nlargest(15, 'transfer_fee')
axes[1].barh(top15['player_name'].str[:20], top15['transfer_fee'] / 1e6, color=ORANGE, alpha=0.85)
axes[1].set_xlabel('Transfer Fee (M EUR)')
axes[1].set_title('Top 15 Transfer Fees (All Time)')
axes[1].invert_yaxis()

plt.tight_layout()
plt.savefig('../data/processed/fig_transfer_dist.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
print(f"Transfers >1M: {{len(df_transfers):,}} | Max: EUR {{df_transfers['transfer_fee'].max()/1e6:.0f}}M")
"""),
    md("## 3. Market Value Trends by League (Big 5)"),
    code(f"""
SQL = '''{SQL_MV_TREND}'''
df_mv = pd.read_sql(SQL, conn)
df_mv['league'] = df_mv['league_id'].map(LEAGUE_NAMES)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for i, (lid, grp) in enumerate(df_mv.groupby('league_id')):
    axes[0].plot(grp['year'], grp['total_value_bn'], label=LEAGUE_NAMES.get(lid, lid), color=COLORS[i], linewidth=2)
    axes[1].plot(grp['year'], grp['avg_value_m'], label=LEAGUE_NAMES.get(lid, lid), color=COLORS[i], linewidth=2)

for ax, title, ylabel in zip(axes,
    ['Total Market Value (Bn EUR) by League', 'Average Player Value (M EUR) by League'],
    ['Total Value (Bn EUR)', 'Avg Value (M EUR)']):
    ax.set_title(title); ax.set_xlabel('Year'); ax.set_ylabel(ylabel)
    ax.legend(fontsize=9); ax.grid(True)

plt.tight_layout()
plt.savefig('../data/processed/fig_market_trends.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
"""),
    md("## 4. Age-Value Depreciation Curves by Position"),
    code(f"""
SQL = '''{SQL_AGE_EDA}'''
df_ages = pd.read_sql(SQL, conn)
df_ages = df_ages[(df_ages['age'] >= 16) & (df_ages['age'] <= 40)]
age_curves = df_ages.groupby(['position', 'age'])['value_m'].median().reset_index()

pos_colors = {{'Attack': ORANGE, 'Midfield': CYAN, 'Defender': '#3b82f6', 'Goalkeeper': '#a855f7'}}
fig, ax = plt.subplots(figsize=(12, 6))
for pos, color in pos_colors.items():
    data = age_curves[age_curves['position'] == pos]
    ax.plot(data['age'], data['value_m'], label=pos, color=color, linewidth=2.5)

ax.set_title('Median Market Value by Age and Position (Actuarial Depreciation Curve)')
ax.set_xlabel('Age'); ax.set_ylabel('Median Market Value (M EUR)')
ax.legend(); ax.grid(True)
ax.axvline(x=26, color=ORANGE, linestyle='--', alpha=0.4)
plt.tight_layout()
plt.savefig('../data/processed/fig_age_curves.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
"""),
    md("## 5. Value Distribution (Log Scale)"),
    code(f"""
SQL = '''{SQL_VALS_DIST}'''
df_vals = pd.read_sql(SQL, conn)
fig, ax = plt.subplots(figsize=(10, 5))
ax.hist(df_vals['value_m'], bins=100, color=CYAN, alpha=0.8, edgecolor='none')
ax.set_xscale('log')
ax.set_title('Player Market Value Distribution (Log Scale, 2023+)')
ax.set_xlabel('Market Value (M EUR)'); ax.set_ylabel('Count'); ax.grid(True)
plt.tight_layout()
plt.savefig('../data/processed/fig_value_dist.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
pct = df_vals['value_m'].quantile([0.5, 0.75, 0.9, 0.95, 0.99])
[print(f"  {{int(p*100)}}th pct: {{v:.2f}}M") for p, v in pct.items()]
"""),
    code("conn.close()\nprint('EDA complete.')"),
]

# ── 03 SQL ───────────────────────────────────────────────────────────────────
SQL_YOY = '''
    WITH yearly AS (
        SELECT
            CAST(strftime('%Y', date) AS INTEGER) as year,
            player_club_domestic_competition_id as league_id,
            SUM(market_value_in_eur) / 1e9 as total_value_bn
        FROM player_valuations
        WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND market_value_in_eur > 0
          AND date >= '2012-01-01'
        GROUP BY year, league_id
    )
    SELECT year, league_id,
        ROUND(total_value_bn, 2) as total_value_bn,
        ROUND(
            (total_value_bn - LAG(total_value_bn) OVER (PARTITION BY league_id ORDER BY year))
            * 100.0
            / NULLIF(LAG(total_value_bn) OVER (PARTITION BY league_id ORDER BY year), 0),
        1) as yoy_growth_pct
    FROM yearly
    ORDER BY league_id, year DESC
    LIMIT 25
'''

SQL_ROI = '''
    WITH transfer_roi AS (
        SELECT
            t.player_name, t.transfer_fee, t.transfer_date,
            t.from_club_name, t.to_club_name,
            (SELECT pv.market_value_in_eur
             FROM player_valuations pv
             WHERE pv.player_id = t.player_id
               AND pv.date > t.transfer_date
               AND pv.date <= DATE(t.transfer_date, '+365 days')
             ORDER BY pv.date DESC LIMIT 1) AS mv_after_1yr
        FROM transfers t
        WHERE t.transfer_fee > 10000000
    )
    SELECT
        player_name,
        ROUND(transfer_fee / 1e6, 1) as fee_m,
        ROUND(mv_after_1yr / 1e6, 1) as value_1yr_m,
        ROUND((mv_after_1yr - transfer_fee) * 100.0 / transfer_fee, 1) as roi_pct,
        CASE
            WHEN mv_after_1yr > transfer_fee * 1.5 THEN 'Excellent (>50%)'
            WHEN mv_after_1yr > transfer_fee THEN 'Positive'
            WHEN mv_after_1yr > transfer_fee * 0.7 THEN 'Moderate Loss'
            ELSE 'Significant Loss'
        END as roi_category
    FROM transfer_roi
    WHERE mv_after_1yr IS NOT NULL
    ORDER BY fee_m DESC LIMIT 20
'''

SQL_PEAK_AGE = '''
    WITH age_values AS (
        SELECT
            p.position,
            CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INTEGER) as age,
            AVG(pv.market_value_in_eur) as avg_value
        FROM player_valuations pv
        JOIN players p ON pv.player_id = p.player_id
        WHERE p.position IN ('Attack', 'Midfield', 'Defender', 'Goalkeeper')
          AND p.date_of_birth IS NOT NULL
          AND pv.market_value_in_eur > 0
          AND pv.date >= '2015-01-01'
        GROUP BY p.position, age
        HAVING age BETWEEN 17 AND 38
    ),
    ranked AS (
        SELECT position, age,
            ROUND(avg_value / 1e6, 2) as avg_value_m,
            ROUND(PERCENT_RANK() OVER (PARTITION BY position ORDER BY avg_value) * 100, 1) as value_pct_rank,
            ROW_NUMBER() OVER (PARTITION BY position ORDER BY avg_value DESC) as value_rank
        FROM age_values
    )
    SELECT position, age, avg_value_m, value_pct_rank
    FROM ranked WHERE value_rank = 1
    ORDER BY avg_value_m DESC
'''

SQL_SHARPE = '''
    WITH monthly_values AS (
        SELECT
            player_club_domestic_competition_id as league_id,
            strftime('%Y-%m', date) as month,
            AVG(market_value_in_eur) as avg_value
        FROM player_valuations
        WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND market_value_in_eur > 0 AND date >= '2015-01-01'
        GROUP BY league_id, month
    ),
    monthly_returns AS (
        SELECT league_id, month,
            (avg_value - LAG(avg_value) OVER (PARTITION BY league_id ORDER BY month))
            * 100.0 / NULLIF(LAG(avg_value) OVER (PARTITION BY league_id ORDER BY month), 0)
            as monthly_return_pct
        FROM monthly_values
    )
    SELECT league_id,
        ROUND(AVG(monthly_return_pct), 3) as avg_monthly_return,
        ROUND(SQRT(
            (SUM(monthly_return_pct * monthly_return_pct) / COUNT(*))
            - (AVG(monthly_return_pct) * AVG(monthly_return_pct))
        ), 3) as volatility,
        ROUND(AVG(monthly_return_pct) / NULLIF(SQRT(
            (SUM(monthly_return_pct * monthly_return_pct) / COUNT(*))
            - (AVG(monthly_return_pct) * AVG(monthly_return_pct))
        ), 0), 3) as sharpe_ratio
    FROM monthly_returns
    WHERE monthly_return_pct IS NOT NULL
    GROUP BY league_id
    ORDER BY sharpe_ratio DESC
'''

SQL_NET_SPEND = '''
    WITH club_spend AS (
        SELECT to_club_name as club, SUM(transfer_fee) as total_spent
        FROM transfers WHERE transfer_fee > 0 AND transfer_date >= '2018-01-01'
        GROUP BY to_club_name
    ),
    club_receipts AS (
        SELECT from_club_name as club, SUM(transfer_fee) as total_received
        FROM transfers WHERE transfer_fee > 0 AND transfer_date >= '2018-01-01'
        GROUP BY from_club_name
    )
    SELECT COALESCE(s.club, r.club) as club,
        ROUND(COALESCE(s.total_spent, 0) / 1e6, 1) as spent_m,
        ROUND(COALESCE(r.total_received, 0) / 1e6, 1) as received_m,
        ROUND((COALESCE(r.total_received, 0) - COALESCE(s.total_spent, 0)) / 1e6, 1) as net_spend_m
    FROM club_spend s
    FULL OUTER JOIN club_receipts r ON s.club = r.club
    ORDER BY spent_m DESC LIMIT 20
'''

nb03_cells = [
    md("# 03 - SQL Analysis\n\nDemonstrates CTEs, window functions, correlated subqueries, and financial metrics in pure SQL."),
    code("""
import pandas as pd
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path('..') / 'data' / 'processed' / 'football.db'
conn = sqlite3.connect(DB_PATH)
print("Connected.")

def show(title, sql, n=10):
    df = pd.read_sql(sql, conn)
    print(f"\\n{'='*60}\\n  {title}\\n{'='*60}")
    display(df.head(n))
    return df
"""),
    md("## 1. YoY Growth -- Window Function (LAG)"),
    code(f"show('Year-over-Year Market Value Growth (LAG + Window)', '''{SQL_YOY}''')"),
    md("## 2. Transfer ROI -- Correlated Subquery + CASE"),
    code(f"show('Transfer ROI: Market Value Change 1yr After Transfer', '''{SQL_ROI}''')"),
    md("## 3. Peak Age by Position -- PERCENT_RANK + ROW_NUMBER"),
    code(f"show('Peak Value Age by Position', '''{SQL_PEAK_AGE}''')"),
    md("## 4. Sharpe Ratio -- Financial SQL (Variance, Std Dev in pure SQL)"),
    code(f"show('Risk-Adjusted Returns (Sharpe Ratio) by League', '''{SQL_SHARPE}''')"),
    md("## 5. Club Net Spend -- FULL OUTER JOIN + Multi-CTE"),
    code(f"show('Club Net Transfer Spend (2018+)', '''{SQL_NET_SPEND}''')"),
    code("conn.close()\nprint('SQL analysis complete.')"),
]

# ── 04 Statistical Models ──────────────────────────────────────────────────
SQL_REG = '''
    SELECT
        p.position,
        CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INTEGER) as age,
        LOG(pv.market_value_in_eur) as log_value
    FROM player_valuations pv
    JOIN players p ON pv.player_id = p.player_id
    WHERE p.position IN ('Attack', 'Midfield', 'Defender', 'Goalkeeper')
      AND p.date_of_birth IS NOT NULL
      AND pv.market_value_in_eur > 100000
      AND pv.date >= '2015-01-01'
'''

SQL_CLUSTERS = '''
    WITH club_mv AS (
        SELECT
            pv.current_club_name as club,
            pv.player_club_domestic_competition_id as league,
            SUM(pv.market_value_in_eur) / 1e6 as squad_value_m,
            COUNT(DISTINCT pv.player_id) as squad_size
        FROM player_valuations pv
        WHERE pv.player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND pv.market_value_in_eur > 0
          AND substr(pv.date, 1, 7) = '2023-06'
        GROUP BY pv.current_club_name, pv.player_club_domestic_competition_id
        HAVING squad_size >= 10
    ),
    club_transfers AS (
        SELECT to_club_name as club, COUNT(DISTINCT player_id) as transfer_activity
        FROM transfers WHERE transfer_date >= '2020-01-01' GROUP BY to_club_name
    ),
    club_age AS (
        SELECT pv.current_club_name as club,
            AVG(CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INTEGER)) as avg_age
        FROM player_valuations pv
        JOIN players p ON pv.player_id = p.player_id
        WHERE pv.player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND p.date_of_birth IS NOT NULL
          AND substr(pv.date, 1, 7) = '2023-06'
        GROUP BY pv.current_club_name
    )
    SELECT m.club, m.league, m.squad_value_m, m.squad_size,
        COALESCE(a.avg_age, 26.0) as average_age,
        COALESCE(t.transfer_activity, 0) as transfer_activity
    FROM club_mv m
    LEFT JOIN club_transfers t ON m.club = t.club
    LEFT JOIN club_age a ON m.club = a.club
    WHERE m.squad_value_m > 0
    ORDER BY m.squad_value_m DESC
'''

SQL_TS = '''
    SELECT date, player_club_domestic_competition_id as league_id,
        AVG(market_value_in_eur) / 1e6 as avg_value_m
    FROM player_valuations
    WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
      AND market_value_in_eur > 0 AND date >= '2015-01-01'
    GROUP BY date, league_id
    ORDER BY date, league_id
'''

nb04_cells = [
    md("# 04 - Statistical Models\n\nRegression, clustering, and time series analysis on football transfer market data."),
    code(SETUP + """
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
"""),
    md("## 1. Age-Value Regression (Quadratic Fit by Position)"),
    code(f"""
SQL = '''{SQL_REG}'''
df = pd.read_sql(SQL, conn)
df = df[(df['age'] >= 17) & (df['age'] <= 38)].dropna()

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
axes = axes.flatten()
pos_colors = {{'Attack': ORANGE, 'Midfield': CYAN, 'Defender': '#3b82f6', 'Goalkeeper': '#a855f7'}}

print(f"{{'Position':<15}} {{'R\u00b2':>8}} {{'Peak Age':>10}}")
print('-' * 35)

for i, (pos, color) in enumerate(pos_colors.items()):
    sub = df[df['position'] == pos]
    ages = np.arange(17, 39)
    X = np.column_stack([sub['age'], sub['age']**2])
    model = LinearRegression().fit(X, sub['log_value'])
    r2 = r2_score(sub['log_value'], model.predict(X))
    X_pred = np.column_stack([ages, ages**2])
    y_pred = model.predict(X_pred)
    peak_age = ages[np.argmax(y_pred)]
    print(f"{{pos:<15}} {{r2:>8.3f}} {{peak_age:>10}}")
    sub_sample = sub.sample(min(3000, len(sub)), random_state=42)
    axes[i].scatter(sub_sample['age'], sub_sample['log_value'], alpha=0.05, color=color, s=2)
    axes[i].plot(ages, y_pred, color='white', linewidth=2.5, label=f'R\u00b2={{r2:.3f}}')
    axes[i].axvline(x=peak_age, color=ORANGE, linestyle='--', alpha=0.6, label=f'Peak: {{peak_age}}')
    axes[i].set_title(pos); axes[i].set_xlabel('Age'); axes[i].set_ylabel('Log(Value)')
    axes[i].legend(fontsize=9)

plt.suptitle('Age-Value Regression by Position (Quadratic Fit)', color='#fb8b1e', fontsize=13)
plt.tight_layout()
plt.savefig('../data/processed/fig_regression.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
"""),
    md("## 2. Club Tier Segmentation -- K-Means (K=4)"),
    code(f"""
SQL = '''{SQL_CLUSTERS}'''
df_clubs = pd.read_sql(SQL, conn).dropna()
features = ['squad_value_m', 'average_age', 'squad_size', 'transfer_activity']
X_scaled = StandardScaler().fit_transform(df_clubs[features].fillna(0))
df_clubs['cluster'] = KMeans(n_clusters=4, random_state=42, n_init=10).fit_predict(X_scaled)

avg_vals = df_clubs.groupby('cluster')['squad_value_m'].mean().sort_values(ascending=False)
tier_map = {{cid: t for cid, t in zip(avg_vals.index, ['Elite','Top-Mid','Mid','Lower-Mid'])}}
df_clubs['tier'] = df_clubs['cluster'].map(tier_map)

print("Cluster Summary:")
display(df_clubs.groupby('tier')[features].mean().round(1))

tier_colors = {{'Elite': ORANGE, 'Top-Mid': CYAN, 'Mid': '#3b82f6', 'Lower-Mid': '#555568'}}
fig, ax = plt.subplots(figsize=(11, 6))
for tier, color in tier_colors.items():
    sub = df_clubs[df_clubs['tier'] == tier]
    ax.scatter(sub['average_age'], sub['squad_value_m'], c=color, label=f'{{tier}} ({{len(sub)}})', s=60, alpha=0.85)
    for _, row in sub.nlargest(2, 'squad_value_m').iterrows():
        ax.annotate(row['club'][:15], (row['average_age'], row['squad_value_m']),
                    fontsize=7, color='#aaaacc', xytext=(3,3), textcoords='offset points')
ax.set_xlabel('Average Age'); ax.set_ylabel('Squad Value (M EUR)')
ax.set_title('Club Tiers -- K-Means Clustering (K=4)'); ax.legend(); ax.grid(True)
plt.tight_layout()
plt.savefig('../data/processed/fig_clustering.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
"""),
    md("## 3. Rolling Volatility Time Series"),
    code(f"""
SQL = '''{SQL_TS}'''
df_ts = pd.read_sql(SQL, conn)
df_ts['date'] = pd.to_datetime(df_ts['date'])
pivot = df_ts.pivot(index='date', columns='league_id', values='avg_value_m').resample('Q').mean()
vol = pivot.pct_change().rolling(4).std() * 100

fig, axes = plt.subplots(2, 1, figsize=(13, 9))
for i, (lid, color) in enumerate(zip(['GB1','ES1','IT1','L1','FR1'], COLORS)):
    if lid in pivot.columns:
        axes[0].plot(pivot.index, pivot[lid], label=LEAGUE_NAMES[lid], color=color, linewidth=1.8)
        axes[1].plot(vol.index, vol[lid], label=LEAGUE_NAMES[lid], color=color, linewidth=1.8)

axes[0].set_title('Average Player Market Value (Quarterly, M EUR)'); axes[0].legend(fontsize=9); axes[0].grid(True)
axes[1].set_title('Rolling 4Q Volatility (%) -- Key Risk Metric'); axes[1].legend(fontsize=9); axes[1].grid(True)
plt.tight_layout()
plt.savefig('../data/processed/fig_volatility_ts.png', dpi=120, bbox_inches='tight', facecolor='#0a0a0f')
plt.show()
"""),
    code("conn.close()\nprint('Models complete.')"),
]

# ── 05 Export ─────────────────────────────────────────────────────────────────
SQL_MKT_OVR = '''
    WITH yearly AS (
        SELECT
            CAST(strftime('%Y', date) AS INTEGER) as year,
            player_club_domestic_competition_id as league_id,
            SUM(market_value_in_eur) as total_market_value,
            COUNT(DISTINCT player_id) as player_count,
            AVG(market_value_in_eur) as avg_player_value
        FROM player_valuations
        WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND market_value_in_eur > 0
          AND strftime('%m', date) = '01'
        GROUP BY year, league_id
    )
    SELECT year, league_id, total_market_value, player_count, avg_player_value,
        ROUND(
            (total_market_value - LAG(total_market_value) OVER (PARTITION BY league_id ORDER BY year))
            * 100.0
            / NULLIF(LAG(total_market_value) OVER (PARTITION BY league_id ORDER BY year), 0),
        1) as yoy_growth_pct
    FROM yearly
    WHERE year BETWEEN 2012 AND 2025
    ORDER BY year, league_id
'''

SQL_LGC = '''
    WITH latest_year AS (
        SELECT MAX(CAST(strftime('%Y', date) AS INTEGER)) - 1 as yr
        FROM player_valuations
        WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
    ),
    league_totals AS (
        SELECT pv.player_club_domestic_competition_id as league_id,
            SUM(pv.market_value_in_eur) as total_value,
            AVG(pv.market_value_in_eur) as avg_value,
            COUNT(DISTINCT pv.player_id) as player_count
        FROM player_valuations pv, latest_year ly
        WHERE pv.player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND pv.market_value_in_eur > 0
          AND CAST(strftime('%Y', pv.date) AS INTEGER) = ly.yr
        GROUP BY pv.player_club_domestic_competition_id
    ),
    club_vals AS (
        SELECT c.domestic_competition_id as league_id, c.name as club_name,
            c.total_market_value,
            ROW_NUMBER() OVER (PARTITION BY c.domestic_competition_id ORDER BY c.total_market_value DESC) as rn
        FROM clubs c
        WHERE c.domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND c.total_market_value > 0
    )
    SELECT lt.league_id, lt.total_value, lt.avg_value, lt.player_count,
        cv.club_name as top_club, cv.total_market_value as top_club_value
    FROM league_totals lt
    LEFT JOIN club_vals cv ON lt.league_id = cv.league_id AND cv.rn = 1
    ORDER BY lt.total_value DESC
'''

SQL_TOPTRANS = '''
    SELECT player_name, from_club_name as from_club, to_club_name as to_club,
        ROUND(transfer_fee) as fee, transfer_season as season, transfer_date
    FROM transfers
    WHERE transfer_fee > 0
    ORDER BY transfer_fee DESC LIMIT 15
'''

SQL_AGECURVES = '''
    SELECT
        CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INTEGER) as age,
        p.position, pv.market_value_in_eur / 1e6 as value_m
    FROM player_valuations pv
    JOIN players p ON pv.player_id = p.player_id
    WHERE p.position IN ('Attack', 'Midfield', 'Defender', 'Goalkeeper')
      AND p.date_of_birth IS NOT NULL
      AND pv.market_value_in_eur > 0
      AND pv.date >= '2015-01-01'
'''

SQL_VOL_HEAT = '''
    WITH monthly AS (
        SELECT player_club_domestic_competition_id as league_id,
            strftime('%Y', date) as season, strftime('%m', date) as month,
            AVG(market_value_in_eur) as avg_val
        FROM player_valuations
        WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND market_value_in_eur > 0 AND date >= '2015-01-01'
        GROUP BY league_id, season, month
    ),
    returns AS (
        SELECT league_id, season,
            (avg_val - LAG(avg_val) OVER (PARTITION BY league_id ORDER BY season, month))
            * 100.0 / NULLIF(LAG(avg_val) OVER (PARTITION BY league_id ORDER BY season, month), 0)
            as monthly_ret
        FROM monthly
    )
    SELECT league_id, season,
        ROUND(SQRT(
            (SUM(monthly_ret*monthly_ret)/COUNT(*)) - (AVG(monthly_ret)*AVG(monthly_ret))
        ), 2) as volatility
    FROM returns
    WHERE monthly_ret IS NOT NULL
    GROUP BY league_id, season HAVING COUNT(*) >= 6
    ORDER BY season, league_id
'''

SQL_DRAWDOWN = '''
    WITH player_peak AS (
        SELECT pv.player_id, p.position, pv.market_value_in_eur,
            MAX(pv.market_value_in_eur) OVER (
                PARTITION BY pv.player_id ORDER BY pv.date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) as running_max
        FROM player_valuations pv
        JOIN players p ON pv.player_id = p.player_id
        WHERE p.position IN ('Attack', 'Midfield', 'Defender', 'Goalkeeper')
          AND pv.market_value_in_eur > 0
    ),
    drawdown AS (
        SELECT player_id, position,
            ROUND((market_value_in_eur - running_max) * 100.0 / running_max, 2) as drawdown_pct
        FROM player_peak WHERE running_max > 0
    ),
    player_max_dd AS (
        SELECT player_id, position, MIN(drawdown_pct) as max_drawdown
        FROM drawdown GROUP BY player_id, position
    )
    SELECT position,
        ROUND(AVG(max_drawdown), 1) as avg_max_drawdown,
        ROUND(MIN(max_drawdown), 1) as worst_drawdown,
        COUNT(*) as player_count
    FROM player_max_dd GROUP BY position ORDER BY avg_max_drawdown
'''

SQL_DEPR = '''
    WITH age_brackets AS (
        SELECT p.position,
            CASE
                WHEN CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INT) < 21 THEN 'U21'
                WHEN CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INT) < 25 THEN '21-24'
                WHEN CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INT) < 28 THEN '25-27'
                WHEN CAST((julianday(pv.date) - julianday(p.date_of_birth)) / 365.25 AS INT) < 31 THEN '28-30'
                ELSE '31+'
            END as age_bracket,
            (pv.market_value_in_eur - LAG(pv.market_value_in_eur) OVER (PARTITION BY pv.player_id ORDER BY pv.date))
            * 100.0 / NULLIF(LAG(pv.market_value_in_eur) OVER (PARTITION BY pv.player_id ORDER BY pv.date), 0)
            as change_pct
        FROM player_valuations pv
        JOIN players p ON pv.player_id = p.player_id
        WHERE p.position IN ('Attack', 'Midfield', 'Defender', 'Goalkeeper')
          AND p.date_of_birth IS NOT NULL AND pv.market_value_in_eur > 0
    )
    SELECT position, age_bracket,
        ROUND(AVG(change_pct), 2) as avg_change_pct,
        ROUND(AVG(CASE WHEN change_pct < 0 THEN change_pct ELSE NULL END), 2) as depreciation_rate
    FROM age_brackets
    WHERE change_pct IS NOT NULL AND ABS(change_pct) < 200
    GROUP BY position, age_bracket ORDER BY position, age_bracket
'''

SQL_SHARPE2 = '''
    WITH monthly_vals AS (
        SELECT player_club_domestic_competition_id as league_id,
            strftime('%Y-%m', date) as month, AVG(market_value_in_eur) as avg_val
        FROM player_valuations
        WHERE player_club_domestic_competition_id IN ('GB1','ES1','IT1','L1','FR1')
          AND market_value_in_eur > 0 AND date >= '2015-01-01'
        GROUP BY league_id, month
    ),
    monthly_rets AS (
        SELECT league_id, month,
            (avg_val - LAG(avg_val) OVER (PARTITION BY league_id ORDER BY month))
            * 100.0 / NULLIF(LAG(avg_val) OVER (PARTITION BY league_id ORDER BY month), 0)
            as ret
        FROM monthly_vals
    )
    SELECT league_id,
        ROUND(AVG(ret) * 12, 2) as avg_return,
        ROUND(SQRT((SUM(ret*ret)/COUNT(*)) - (AVG(ret)*AVG(ret))) * SQRT(12), 2) as volatility,
        ROUND(AVG(ret) / NULLIF(SQRT((SUM(ret*ret)/COUNT(*)) - (AVG(ret)*AVG(ret))), 0), 3) as sharpe_ratio
    FROM monthly_rets
    WHERE ret IS NOT NULL GROUP BY league_id ORDER BY sharpe_ratio DESC
'''

nb05_cells = [
    md("# 05 - Export Dashboard Data\n\nGenerates pre-processed JSON files for the React dashboard. Replaces mock data with real Transfermarkt results."),
    code("""
import pandas as pd
import numpy as np
import sqlite3
import json
from pathlib import Path

DB_PATH = Path('..') / 'data' / 'processed' / 'football.db'
OUT_DIR = Path('..') / 'dashboard' / 'public' / 'data'

conn = sqlite3.connect(DB_PATH)
LEAGUE_NAMES = {'GB1': 'Premier League', 'ES1': 'La Liga', 'IT1': 'Serie A', 'L1': 'Bundesliga', 'FR1': 'Ligue 1'}

def save(name, data):
    path = OUT_DIR / name
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    n = len(data) if isinstance(data, list) else sum(len(v) if isinstance(v, list) else 1 for v in data.values())
    print(f"  {name} -> {path.stat().st_size/1024:.1f} KB ({n} records)")

print(f"Output: {OUT_DIR}")
"""),
    md("## 1. market_overview.json"),
    code(f"""
df = pd.read_sql('''{SQL_MKT_OVR}''', conn)
df['league_name'] = df['league_id'].map(LEAGUE_NAMES)
df['total_market_value'] = df['total_market_value'].round(0)
df['avg_player_value'] = df['avg_player_value'].round(0)
df['yoy_growth_pct'] = df['yoy_growth_pct'].where(df['yoy_growth_pct'].notna(), other=None)
save('market_overview.json', df.to_dict('records'))
display(df[df['league_id']=='GB1'][['year','total_market_value','player_count','yoy_growth_pct']].tail(5))
"""),
    md("## 2. league_comparison.json"),
    code(f"""
df = pd.read_sql('''{SQL_LGC}''', conn)
df['league'] = df['league_id'].map(LEAGUE_NAMES)
df[['total_value','avg_value','top_club_value']] = df[['total_value','avg_value','top_club_value']].round(0)
save('league_comparison.json', df.to_dict('records'))
display(df[['league','player_count','top_club']].round(0))
"""),
    md("## 3. top_transfers.json"),
    code(f"""
df = pd.read_sql('''{SQL_TOPTRANS}''', conn)
save('top_transfers.json', df.to_dict('records'))
display(df[['player_name','from_club','to_club','fee']].head(10))
"""),
    md("## 4. age_curves.json"),
    code(f"""
df = pd.read_sql('''{SQL_AGECURVES}''', conn)
df = df[(df['age'] >= 17) & (df['age'] <= 38)]
pivot = df.groupby(['age','position'])['value_m'].median().unstack('position').reset_index()
for col in ['Attack','Midfield','Defender','Goalkeeper']:
    if col in pivot.columns:
        pivot[col] = pivot[col].round(3)
save('age_curves.json', pivot.to_dict('records'))
display(pivot.head(5))
"""),
    md("## 5. risk_metrics.json"),
    code(f"""
df_vol = pd.read_sql('''{SQL_VOL_HEAT}''', conn)
df_vol['league'] = df_vol['league_id'].map(LEAGUE_NAMES)
df_vol = df_vol[['league','season','volatility']].dropna()

df_dd = pd.read_sql('''{SQL_DRAWDOWN}''', conn)

df_dep = pd.read_sql('''{SQL_DEPR}''', conn)

df_sharpe = pd.read_sql('''{SQL_SHARPE2}''', conn)
df_sharpe['league'] = df_sharpe['league_id'].map(LEAGUE_NAMES)

risk = {{
    'volatility_heatmap': df_vol.to_dict('records'),
    'drawdown_by_position': df_dd.to_dict('records'),
    'depreciation_rates': df_dep.to_dict('records'),
    'sharpe_ratios': df_sharpe[['league','sharpe_ratio','avg_return','volatility']].to_dict('records'),
}}
save('risk_metrics.json', risk)
print("\\nDrawdown:")
display(df_dd)
print("\\nSharpe:")
display(df_sharpe[['league','sharpe_ratio','avg_return','volatility']])
"""),
    code("""
conn.close()
print()
print('All 5 JSON files exported. Dashboard now uses real Transfermarkt data.')
"""),
]

# ── Write notebooks ────────────────────────────────────────────────────────────
notebooks = {
    '02_exploratory_analysis.ipynb': nb(nb02_cells),
    '03_sql_analysis.ipynb': nb(nb03_cells),
    '04_statistical_models.ipynb': nb(nb04_cells),
    '05_export_dashboard_data.ipynb': nb(nb05_cells),
}

for filename, notebook in notebooks.items():
    path = NB_DIR / filename
    nbf.write(notebook, str(path))
    print(f"Created: {filename}")

print("\nDone.")
