-- ============================================================
-- PREDICTIVE FEATURES: Feature engineering for ML models
-- Skills: Complex CTEs, LEFT JOINs, Derived metrics,
--         Correlated subqueries, CASE expressions
-- ============================================================
-- Builds a feature matrix combining player attributes,
-- career statistics, and contextual features for market
-- value prediction models in the Python notebooks.
-- ============================================================

WITH career_stats AS (
    -- Aggregate career statistics per player
    SELECT
        player_id,
        SUM(goals) AS career_goals,
        SUM(assists) AS career_assists,
        SUM(minutes_played) AS career_minutes,
        COUNT(*) AS career_appearances,
        SUM(yellow_cards) AS career_yellows,
        SUM(red_cards) AS career_reds,
        COUNT(DISTINCT competition_id) AS competitions_played,
        MIN(date) AS career_start,
        MAX(date) AS career_latest
    FROM appearances
    GROUP BY player_id
),
value_trajectory AS (
    -- Calculate value momentum: how fast is the player's value changing?
    SELECT
        player_id,
        -- Most recent valuation
        FIRST_VALUE(market_value_in_eur) OVER (
            PARTITION BY player_id ORDER BY date DESC
        ) AS latest_value,
        -- Value 6 months ago
        FIRST_VALUE(market_value_in_eur) OVER (
            PARTITION BY player_id
            ORDER BY ABS(julianday(date) - julianday('now') + 180)
        ) AS value_6m_ago,
        ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY date DESC) AS rn
    FROM player_valuations
)
SELECT
    p.player_id,
    p.name AS player_name,
    p.position,
    p.sub_position,
    p.height_in_cm,
    p.foot,
    p.country_of_citizenship,
    p.market_value_in_eur AS current_value,
    p.highest_market_value_in_eur AS peak_value,

    -- Age
    CAST(
        (julianday('now') - julianday(p.date_of_birth)) / 365.25
    AS INTEGER) AS age,

    -- Career stats
    COALESCE(cs.career_goals, 0) AS career_goals,
    COALESCE(cs.career_assists, 0) AS career_assists,
    COALESCE(cs.career_minutes, 0) AS career_minutes,
    COALESCE(cs.career_appearances, 0) AS career_appearances,

    -- Per-game efficiency metrics
    CASE WHEN COALESCE(cs.career_appearances, 0) > 0 THEN
        ROUND(cs.career_goals * 1.0 / cs.career_appearances, 3)
    END AS goals_per_game,
    CASE WHEN COALESCE(cs.career_minutes, 0) > 0 THEN
        ROUND(cs.career_goals * 90.0 / cs.career_minutes, 3)
    END AS goals_per_90,
    CASE WHEN COALESCE(cs.career_minutes, 0) > 0 THEN
        ROUND((cs.career_goals + cs.career_assists) * 90.0 / cs.career_minutes, 3)
    END AS goal_contributions_per_90,

    -- Discipline
    COALESCE(cs.career_yellows, 0) AS career_yellows,
    COALESCE(cs.career_reds, 0) AS career_reds,

    -- Contract situation
    CAST(
        julianday(p.contract_expiration_date) - julianday('now')
    AS INTEGER) AS contract_days_remaining,

    -- League tier (ordinal feature)
    CASE p.current_club_domestic_competition_id
        WHEN 'GB1' THEN 1
        WHEN 'ES1' THEN 2
        WHEN 'L1'  THEN 3
        WHEN 'IT1' THEN 4
        WHEN 'FR1' THEN 5
        ELSE 6
    END AS league_tier,

    -- Value momentum
    CASE WHEN vt.value_6m_ago > 0 THEN
        ROUND(
            (vt.latest_value - vt.value_6m_ago) * 100.0 / vt.value_6m_ago, 2
        )
    END AS value_momentum_6m_pct,

    -- Peak value ratio (how close to peak)
    CASE WHEN p.highest_market_value_in_eur > 0 THEN
        ROUND(
            p.market_value_in_eur * 1.0 / p.highest_market_value_in_eur, 3
        )
    END AS peak_value_ratio

FROM players p
LEFT JOIN career_stats cs ON p.player_id = cs.player_id
LEFT JOIN value_trajectory vt ON p.player_id = vt.player_id AND vt.rn = 1
WHERE p.market_value_in_eur IS NOT NULL
  AND p.market_value_in_eur > 0
  AND p.date_of_birth IS NOT NULL
ORDER BY p.market_value_in_eur DESC;
