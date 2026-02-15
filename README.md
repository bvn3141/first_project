# Football Transfer Market Analytics

> Financial analysis applied to European football transfer data — a portfolio showcase demonstrating SQL, Python, and interactive data visualization skills.

**Live Demo:** [GitHub Pages](https://bvenn.github.io/first_project/) *(coming soon)*

---

## Overview

This project applies financial analysis concepts — ROI, volatility, Sharpe ratio, drawdown, and depreciation — to Transfermarkt data covering the Big 5 European football leagues (2012–2023).

**Target audience:** Recruiters and hiring managers at banks, insurance companies, and health insurers who want to see data analytics skills demonstrated with financial rigor.

---

## Dashboard Pages

| Page | Description |
|------|-------------|
| **Market Overview** | Total market value trends, league comparisons, KPIs |
| **Transfer Analytics** | Transfer ROI distribution, club net spend, fee vs. value scatter |
| **Player Valuation** | Age-depreciation curves, position treemap, value distribution |
| **Risk Analysis** | Volatility heatmap, drawdown by position, Sharpe ratios |
| **Club Intelligence** | Squad portfolio composition, age structure analysis |
| **Methodology** | Data sources, SQL showcase, tech stack, financial concepts |

---

## Skills Demonstrated

### SQL
- Multi-table JOINs, CTEs (Common Table Expressions)
- Window functions: `LAG`, `LEAD`, `ROW_NUMBER`, `PERCENT_RANK`, running max
- Correlated subqueries for transfer ROI calculation
- Financial metrics in pure SQL: volatility, Sharpe ratio, drawdown

### Python
- `pandas` data cleaning and transformation pipeline
- Statistical analysis: regression, clustering (K-Means), time series
- Jupyter notebooks with documented analysis process
- Feature engineering for machine learning

### Frontend / Visualization
- React 19 + TypeScript (strict mode) with Vite 6
- Interactive charts with Recharts (AreaChart, BarChart, ScatterChart, Treemap)
- Bloomberg Terminal aesthetic — dark mode, monospace fonts, financial color palette
- Framer Motion page transitions, animated KPI counters
- Code-split lazy loading (6 separate page bundles)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Data Analysis | Python 3.12, pandas, numpy, scikit-learn |
| SQL | SQLite — CTEs, Window Functions, Correlated Subqueries |
| Frontend | React 19, TypeScript, Vite 6 |
| Charts | Recharts, Nivo |
| Styling | Tailwind CSS 4, Framer Motion |
| Deployment | GitHub Pages via GitHub Actions |

---

## Dataset

**Football Data from Transfermarkt** by [davidcariboo](https://www.kaggle.com/datasets/davidcariboo/player-scores) (Kaggle)

- License: CC BY-SA 4.0
- ~30,000 players | 400+ clubs | 60,000+ matches | 430,000+ market value snapshots
- Tables: `players`, `clubs`, `competitions`, `games`, `appearances`, `player_valuations`, `transfers`

### Setup (for local analysis)

1. Download dataset from Kaggle and place CSVs in `data/raw/`
2. Run `notebooks/01_data_ingestion.ipynb` to build the SQLite database
3. Run remaining notebooks in order for the full analysis pipeline

---

## Local Development

```bash
cd dashboard
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build
```

---

## Project Structure

```
first_project/
├── data/               # Raw CSVs (not committed) + processed data
├── sql/                # 8 SQL analysis files (DDL, quality checks, analytics)
├── notebooks/          # Jupyter notebooks (EDA, SQL analysis, ML models)
└── dashboard/          # React frontend
    ├── src/
    │   ├── components/ # Layout, UI primitives, chart components
    │   ├── pages/      # 6 dashboard pages
    │   ├── hooks/      # useData, useAnimatedValue
    │   └── theme/      # Bloomberg color palette
    └── public/data/    # Pre-processed JSON files for dashboard
```

---

## Analysis Notebooks

| Notebook | Content |
|----------|---------|
| `01_data_ingestion.ipynb` | CSV loading, cleaning, SQLite pipeline |
| `02_exploratory_analysis.ipynb` | EDA with statistical visualizations |
| `03_sql_analysis.ipynb` | Advanced SQL queries with commentary |
| `04_statistical_models.ipynb` | Regression, clustering, time series |
| `05_export_dashboard_data.ipynb` | JSON export for dashboard |

---

*Built with React + TypeScript + Vite. Deployed via GitHub Actions.*
