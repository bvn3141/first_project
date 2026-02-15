-- ============================================================
-- MARKET OVERVIEW: Total market value trends by league
-- Skills: CTEs, Window Functions (LAG, PERCENT_RANK), Aggregation
-- ============================================================

-- Total market value by league over time with YoY growth
-- Used for: MarketTrendLine chart (stacked area)
WITH league_yearly_values AS (
    SELECT
        pv.player_club_domestic_competition_id AS league_id,
        c.name AS league_name,
        c.country_name,
        CAST(strftime('%Y', pv.date) AS INTEGER) AS year,
        SUM(pv.market_value_in_eur) AS total_market_value,
        COUNT(DISTINCT pv.player_id) AS player_count,
        ROUND(AVG(pv.market_value_in_eur), 0) AS avg_player_value
    FROM player_valuations pv
    JOIN competitions c ON pv.player_club_domestic_competition_id = c.competition_id
    WHERE c.type = 'domestic_league'
      AND pv.player_club_domestic_competition_id IN ('GB1', 'ES1', 'IT1', 'L1', 'FR1')
    GROUP BY 1, 2, 3, 4
),
with_growth AS (
    SELECT
        *,
        LAG(total_market_value) OVER (
            PARTITION BY league_id ORDER BY year
        ) AS prev_year_value,
        ROUND(
            (total_market_value - LAG(total_market_value) OVER (
                PARTITION BY league_id ORDER BY year
            )) * 100.0 / NULLIF(LAG(total_market_value) OVER (
                PARTITION BY league_id ORDER BY year
            ), 0), 2
        ) AS yoy_growth_pct,
        -- Cumulative growth from first year
        ROUND(
            (total_market_value - FIRST_VALUE(total_market_value) OVER (
                PARTITION BY league_id ORDER BY year
            )) * 100.0 / NULLIF(FIRST_VALUE(total_market_value) OVER (
                PARTITION BY league_id ORDER BY year
            ), 0), 2
        ) AS cumulative_growth_pct
    FROM league_yearly_values
)
SELECT
    league_id,
    league_name,
    year,
    total_market_value,
    player_count,
    avg_player_value,
    yoy_growth_pct,
    cumulative_growth_pct
FROM with_growth
ORDER BY year, league_name;
