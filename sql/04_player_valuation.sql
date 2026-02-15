-- ============================================================
-- PLAYER VALUATION: Age curves, position premiums, depreciation
-- Skills: Window Functions (NTILE, LAG, FIRST_VALUE),
--         CTEs, HAVING, Complex Aggregation
-- ============================================================

-- Query 1: Age-Value curve by position
-- This mirrors actuarial depreciation curves -- directly relevant
-- for insurance/banking employers
WITH player_age_values AS (
    SELECT
        p.player_id,
        p.name,
        p.position,
        p.sub_position,
        pv.date AS valuation_date,
        pv.market_value_in_eur,
        CAST(
            (julianday(pv.date) - julianday(p.date_of_birth)) / 365.25
        AS INTEGER) AS age_at_valuation
    FROM player_valuations pv
    JOIN players p ON pv.player_id = p.player_id
    WHERE p.date_of_birth IS NOT NULL
      AND pv.market_value_in_eur > 0
      AND p.position IS NOT NULL
)
SELECT
    position,
    age_at_valuation AS age,
    COUNT(*) AS observations,
    ROUND(AVG(market_value_in_eur), 0) AS avg_market_value,
    -- Relative to peak: shows the depreciation curve shape
    ROUND(
        AVG(market_value_in_eur) * 1.0 /
        MAX(AVG(market_value_in_eur)) OVER (PARTITION BY position),
    4) AS relative_to_peak
FROM player_age_values
WHERE age_at_valuation BETWEEN 16 AND 40
GROUP BY position, age_at_valuation
HAVING COUNT(*) >= 50
ORDER BY position, age_at_valuation;
