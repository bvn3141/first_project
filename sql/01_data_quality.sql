-- ============================================================
-- DATA QUALITY: Profiling & Completeness Checks
-- Skills demonstrated: CASE, Aggregation, UNION ALL, Subqueries
-- ============================================================

-- Completeness report across all key columns
SELECT
    'players' AS table_name,
    COUNT(*) AS total_rows,
    ROUND(SUM(CASE WHEN market_value_in_eur IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS market_value_pct,
    ROUND(SUM(CASE WHEN date_of_birth IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS dob_pct,
    ROUND(SUM(CASE WHEN position IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS position_pct,
    ROUND(SUM(CASE WHEN current_club_id IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS club_pct
FROM players

UNION ALL

SELECT
    'player_valuations',
    COUNT(*),
    ROUND(SUM(CASE WHEN market_value_in_eur IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1),
    NULL,
    NULL,
    ROUND(SUM(CASE WHEN current_club_id IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)
FROM player_valuations

UNION ALL

SELECT
    'transfers',
    COUNT(*),
    ROUND(SUM(CASE WHEN market_value_in_eur IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1),
    NULL,
    NULL,
    ROUND(SUM(CASE WHEN transfer_fee IS NOT NULL AND transfer_fee > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)
FROM transfers;
