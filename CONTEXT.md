# Football Transfer Market Analytics -- Project Context

## Ziel

Showcase-Projekt fuer die Jobsuche als Datenanalyst. Potentielle Arbeitgeber aus dem Umfeld Banken, Versicherungen und Krankenkassen sollen das Endresultat sehen und denken: "Den wollen wir einstellen."

## Was wird gebaut?

Ein interaktives, visuell beeindruckendes Dashboard (Web App), das eine Analyse von Fussball-Transfermarktdaten praesentiert. Das Dashboard wird auf GitHub Pages gehostet und ist fuer jeden oeffentlich zugaenglich.

**Kernidee**: Finanzkonzepte (ROI, Volatilitaet, Depreciation, Sharpe Ratio, Drawdown) auf Fussball-Transfermarktdaten anwenden -- demonstriert analytisches Denken in der Sprache der Finanzbranche.

## Zielgruppe

- Recruiter und Hiring Manager bei Banken, Versicherungen, Krankenkassen (DACH-Raum)
- Sprache des Dashboards: Englisch
- Sollen Skills sehen in: SQL, Python, Datenvisualisierung, statistisches Denken

## Datensatz

**"Football Data from Transfermarkt"** (Kaggle, by davidcariboo)
- URL: https://www.kaggle.com/datasets/davidcariboo/player-scores
- Tabellen: players, clubs, competitions, games, appearances, player_valuations, transfers, club_games, game_events
- ~30K Spieler, 400+ Clubs, 60K+ Spiele, 430K+ Marktwert-Eintraege

## Tech Stack

| Bereich | Technologie |
|---------|------------|
| Datenanalyse | Python 3.12, pandas, numpy, scikit-learn |
| SQL | SQLite (in Jupyter Notebooks) |
| Frontend | React 19, TypeScript, Vite 6 |
| Charts | Recharts + Nivo (Sankey, Treemap, Heatmap) |
| Styling | Tailwind CSS 4 |
| Animationen | Framer Motion |
| Tabellen | TanStack Table |
| Design | Dark Mode, Bloomberg Terminal Aesthetic |
| Deployment | GitHub Pages via GitHub Actions |

## Dashboard-Seiten (6)

1. **Overview** -- Marktueberblick, KPIs, Trends
2. **Transfer Analytics** -- Transfer-ROI, Sankey-Flows, Net Spend
3. **Player Valuation** -- Age Curves, Position Premiums, Distributions
4. **Risk Analysis** -- Volatilitaet, Drawdown, Sharpe Ratio (Herzstuck fuer Finanz-Arbeitgeber)
5. **Club Intelligence** -- Club-Portfolio-Analyse, Squad Composition
6. **Methodology** -- Dokumentation, Links zu Notebooks, Tech Stack

## Design

- Bloomberg Terminal / Trading Platform Aesthetic
- Dark Mode: Near-black Background (#0a0a0f)
- Accent: Bloomberg Orange (#fb8b1e), Cyan (#4af6c3), Rot (#ff433d)
- Font: JetBrains Mono (monospace) + Inter (sans-serif)
- Animierte KPI-Counter, smooth Page Transitions, scrollender Ticker

## Zu demonstrierende Skills

### SQL
- JOINs ueber mehrere Tabellen
- CTEs (Common Table Expressions)
- Window Functions (LAG, LEAD, ROW_NUMBER, PERCENT_RANK, Running Max)
- Correlated Subqueries
- Aggregationen mit CASE, HAVING
- Finanz-Metriken in reinem SQL (Volatilitaet, Sharpe Ratio, Drawdown)

### Python
- pandas Datenverarbeitung und -bereinigung
- Statistische Modelle (Regression, Clustering, Zeitreihen)
- Datenvisualisierung (matplotlib, seaborn, plotly)
- Jupyter Notebooks mit dokumentiertem Analyseprozess
- Feature Engineering fuer ML

### Frontend / Visualisierung
- React mit TypeScript
- Interaktive Charts mit Filtern und Tooltips
- Responsive Design
- Professionelles UI/UX Design
