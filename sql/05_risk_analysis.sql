-- ============================================================
-- RISK ANALYSIS: Volatility, Drawdown, Sharpe Ratio
-- Skills: Window Functions (Running Max, LAG), Statistical
--         calculations in pure SQL, Complex CTEs
-- ============================================================
-- These queries apply financial risk metrics to football market
-- data -- directly demonstrating fluency in financial analysis
-- concepts relevant to banking and insurance employers.
-- ============================================================

-- Query 1: Market value volatility by league
-- Calculates monthly returns and volatility (std dev) per league,
-- plus a Sharpe-like ratio (return / risk)
WITH monthly_avg_values AS (
    SELECT
        pv.player_club_domestic_competition_id AS league_id,
        strftime('%Y-%m', pv.date) AS month,
        AVG(pv.market_value_in_eur) AS avg_value,
        COUNT(DISTINCT pv.player_id) AS player_count
    FROM player_valuations pv
    WHERE pv.player_club_domestic_competition_id IN ('GB1', 'ES1', 'IT1', 'L1', 'FR1')
    GROUP BY 1, 2
    HAVING COUNT(DISTINCT pv.player_id) >= 50
),
monthly_returns AS (
    SELECT
        league_id,
        month,
        avg_value,
        LAG(avg_value) OVER (PARTITION BY league_id ORDER BY month) AS prev_value,
        (avg_value - LAG(avg_value) OVER (PARTITION BY league_id ORDER BY month))
            * 1.0 / NULLIF(LAG(avg_value) OVER (PARTITION BY league_id ORDER BY month), 0)
        AS monthly_return
    FROM monthly_avg_values
)
SELECT
    r.league_id,
    c.name AS league_name,
    COUNT(*) AS months_observed,
    ROUND(AVG(r.monthly_return) * 100, 4) AS avg_monthly_return_pct,
    -- Volatility = standard deviation of returns
    ROUND(
        SQRT(
            AVG(r.monthly_return * r.monthly_return)
            - AVG(r.monthly_return) * AVG(r.monthly_return)
        ) * 100, 4
    ) AS volatility_pct,
    -- Sharpe-like ratio = avg return / volatility
    ROUND(
        AVG(r.monthly_return)
        / NULLIF(
            SQRT(
                AVG(r.monthly_return * r.monthly_return)
                - AVG(r.monthly_return) * AVG(r.monthly_return)
            ), 0
        ), 4
    ) AS sharpe_ratio
FROM monthly_returns r
JOIN competitions c ON r.league_id = c.competition_id
WHERE r.monthly_return IS NOT NULL
GROUP BY r.league_id, c.name
ORDER BY volatility_pct DESC;
