-- ============================================================
-- Football Transfer Market Analytics
-- Schema Definition & Indexes
-- ============================================================
-- This DDL documents the database schema created by the
-- data ingestion notebook (01_data_ingestion.ipynb).
-- Tables are auto-created from CSVs; this file serves as
-- documentation and can recreate indexes if needed.
-- ============================================================

-- Core entity tables
-- competitions: League and tournament information
-- clubs: Club profiles with squad metrics
-- players: Player profiles with current market values
-- player_valuations: Historical market value snapshots (time series)
-- transfers: Transfer records with fees
-- games: Match results and metadata
-- appearances: Player-level match performance
-- club_games: Club-level match statistics
-- game_events: In-match events (goals, cards, substitutions)

-- ============================================================
-- INDEXES for query performance
-- ============================================================

-- Player valuations (most queried table for financial analysis)
CREATE INDEX IF NOT EXISTS idx_pv_player_id ON player_valuations(player_id);
CREATE INDEX IF NOT EXISTS idx_pv_date ON player_valuations(date);
CREATE INDEX IF NOT EXISTS idx_pv_club_comp ON player_valuations(player_club_domestic_competition_id);
CREATE INDEX IF NOT EXISTS idx_pv_composite ON player_valuations(player_id, date);

-- Appearances (performance metrics)
CREATE INDEX IF NOT EXISTS idx_app_player_id ON appearances(player_id);
CREATE INDEX IF NOT EXISTS idx_app_game_id ON appearances(game_id);
CREATE INDEX IF NOT EXISTS idx_app_date ON appearances(date);

-- Games
CREATE INDEX IF NOT EXISTS idx_games_season ON games(season);
CREATE INDEX IF NOT EXISTS idx_games_competition ON games(competition_id);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);

-- Transfers (financial analysis)
CREATE INDEX IF NOT EXISTS idx_transfers_player ON transfers(player_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(transfer_date);
CREATE INDEX IF NOT EXISTS idx_transfers_to_club ON transfers(to_club_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_club ON transfers(from_club_id);

-- Players
CREATE INDEX IF NOT EXISTS idx_players_club ON players(current_club_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_comp ON players(current_club_domestic_competition_id);

-- Clubs
CREATE INDEX IF NOT EXISTS idx_clubs_competition ON clubs(domestic_competition_id);

-- Club games
CREATE INDEX IF NOT EXISTS idx_cg_club ON club_games(club_id);
CREATE INDEX IF NOT EXISTS idx_cg_game ON club_games(game_id);

-- Game events
CREATE INDEX IF NOT EXISTS idx_ge_game ON game_events(game_id);
CREATE INDEX IF NOT EXISTS idx_ge_player ON game_events(player_id);
