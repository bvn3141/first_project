-- ============================================================
-- CLUB FINANCIALS: Squad as an asset portfolio
-- Skills: Multiple CTEs, Complex JOINs, Financial metrics,
--         Portfolio analysis concepts
-- ============================================================
-- Treats each club's squad like an investment portfolio:
-- - Total asset value (squad market value)
-- - Concentration risk (star dependency)
-- - Age risk (depreciation exposure)
-- - Investment efficiency (spend vs. current value)
-- ============================================================

WITH squad_analysis AS (
    SELECT
        cl.club_id,
        cl.name AS club_name,
        comp.name AS league_name,
        cl.squad_size,
        cl.average_age,
        COUNT(p.player_id) AS player_count,
        SUM(p.market_value_in_eur) AS total_squad_value,
        ROUND(AVG(p.market_value_in_eur), 0) AS avg_player_value,
        MAX(p.market_value_in_eur) AS max_player_value,

        -- Star dependency: most valuable player as % of total squad value
        ROUND(
            MAX(p.market_value_in_eur) * 100.0
            / NULLIF(SUM(p.market_value_in_eur), 0), 2
        ) AS star_dependency_pct,

        -- Age risk: % of squad value in players over 30
        ROUND(
            SUM(CASE
                WHEN CAST(
                    (julianday('now') - julianday(p.date_of_birth)) / 365.25
                AS INTEGER) >= 30
                THEN p.market_value_in_eur ELSE 0
            END) * 100.0
            / NULLIF(SUM(p.market_value_in_eur), 0), 2
        ) AS over_30_value_pct,

        -- Position diversification
        SUM(CASE WHEN p.position = 'Attack' THEN p.market_value_in_eur ELSE 0 END) AS attack_value,
        SUM(CASE WHEN p.position = 'Midfield' THEN p.market_value_in_eur ELSE 0 END) AS midfield_value,
        SUM(CASE WHEN p.position = 'Defender' THEN p.market_value_in_eur ELSE 0 END) AS defender_value,
        SUM(CASE WHEN p.position = 'Goalkeeper' THEN p.market_value_in_eur ELSE 0 END) AS goalkeeper_value

    FROM clubs cl
    JOIN competitions comp ON cl.domestic_competition_id = comp.competition_id
    LEFT JOIN players p ON p.current_club_id = cl.club_id
    WHERE comp.type = 'domestic_league'
      AND comp.competition_id IN ('GB1', 'ES1', 'IT1', 'L1', 'FR1')
    GROUP BY cl.club_id, cl.name, comp.name, cl.squad_size, cl.average_age
),
transfer_spend AS (
    -- Total spending in last 5 years
    SELECT
        to_club_id AS club_id,
        SUM(transfer_fee) AS total_invested_5yr,
        COUNT(*) AS transfers_in_5yr
    FROM transfers
    WHERE transfer_fee > 0
      AND transfer_date >= DATE('now', '-5 years')
    GROUP BY to_club_id
),
transfer_income AS (
    -- Total income from sales in last 5 years
    SELECT
        from_club_id AS club_id,
        SUM(transfer_fee) AS total_sales_5yr,
        COUNT(*) AS transfers_out_5yr
    FROM transfers
    WHERE transfer_fee > 0
      AND transfer_date >= DATE('now', '-5 years')
    GROUP BY from_club_id
)
SELECT
    sa.club_name,
    sa.league_name,
    sa.player_count,
    sa.total_squad_value,
    sa.avg_player_value,
    sa.max_player_value,
    sa.star_dependency_pct,
    sa.over_30_value_pct,
    sa.average_age,

    -- Position breakdown
    sa.attack_value,
    sa.midfield_value,
    sa.defender_value,
    sa.goalkeeper_value,

    -- Transfer activity
    COALESCE(ts.total_invested_5yr, 0) AS invested_5yr,
    COALESCE(ti.total_sales_5yr, 0) AS sales_5yr,
    COALESCE(ti.total_sales_5yr, 0) - COALESCE(ts.total_invested_5yr, 0) AS net_transfer_balance_5yr,

    -- Investment efficiency: current squad value vs. amount invested
    ROUND(
        (sa.total_squad_value - COALESCE(ts.total_invested_5yr, 0)) * 100.0
        / NULLIF(COALESCE(ts.total_invested_5yr, 0), 0), 2
    ) AS investment_roi_pct

FROM squad_analysis sa
LEFT JOIN transfer_spend ts ON sa.club_id = ts.club_id
LEFT JOIN transfer_income ti ON sa.club_id = ti.club_id
WHERE sa.total_squad_value > 0
ORDER BY sa.total_squad_value DESC
LIMIT 50;
