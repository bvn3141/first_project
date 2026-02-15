-- ============================================================
-- TRANSFER ANALYTICS: Fee analysis, ROI, net spending
-- Skills: Multi-table JOINs, Correlated Subqueries,
--         Window Functions, CASE expressions
-- ============================================================

-- Query 1: Transfer ROI -- fee paid vs. market value change after 1 year
-- This demonstrates correlated subqueries and financial ROI calculation
WITH transfer_roi AS (
    SELECT
        t.player_id,
        t.player_name,
        t.transfer_date,
        t.transfer_season,
        t.transfer_fee,
        t.market_value_in_eur AS mv_at_transfer,
        t.to_club_name,
        t.from_club_name,
        -- Correlated subquery: get market value ~1 year after transfer
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
      AND t.transfer_fee IS NOT NULL
),
roi_categorized AS (
    SELECT
        *,
        ROUND(
            (COALESCE(mv_after_1_year, 0) - transfer_fee) * 100.0
            / transfer_fee, 2
        ) AS roi_pct,
        CASE
            WHEN mv_after_1_year > transfer_fee * 1.5 THEN 'Excellent (>50%)'
            WHEN mv_after_1_year > transfer_fee THEN 'Positive (0-50%)'
            WHEN mv_after_1_year > transfer_fee * 0.5 THEN 'Moderate Loss (-50-0%)'
            ELSE 'Significant Loss (<-50%)'
        END AS roi_category
    FROM transfer_roi
    WHERE mv_after_1_year IS NOT NULL
)
SELECT
    roi_category,
    COUNT(*) AS transfer_count,
    ROUND(AVG(roi_pct), 2) AS avg_roi_pct,
    ROUND(AVG(transfer_fee), 0) AS avg_fee_eur,
    ROUND(SUM(mv_after_1_year - transfer_fee), 0) AS total_value_created_eur
FROM roi_categorized
GROUP BY roi_category
ORDER BY avg_roi_pct DESC;
