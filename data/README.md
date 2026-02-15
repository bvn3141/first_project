# Data Sources

## Primary Dataset: Football Data from Transfermarkt

**Source**: [Kaggle - Football Data from Transfermarkt](https://www.kaggle.com/datasets/davidcariboo/player-scores)
**Author**: davidcariboo
**License**: CC BY-SA 4.0

### Download Instructions

#### Option A: Manual Download
1. Go to https://www.kaggle.com/datasets/davidcariboo/player-scores
2. Click "Download" (requires free Kaggle account)
3. Extract all CSV files into `data/raw/`

#### Option B: Kaggle CLI
```bash
pip install kaggle
kaggle datasets download -d davidcariboo/player-scores -p data/raw --unzip
```

### Expected Files in `data/raw/`

| File | Description | ~Rows |
|------|-------------|-------|
| `appearances.csv` | Player match appearances with goals, assists, minutes | 1,400,000+ |
| `clubs.csv` | Club information, squad size, market value | 400+ |
| `competitions.csv` | League and cup competition details | 40+ |
| `games.csv` | Match results, scores, attendance | 67,000+ |
| `players.csv` | Player profiles, nationality, position, market value | 30,000+ |
| `player_valuations.csv` | Historical market value snapshots | 430,000+ |
| `transfers.csv` | Transfer records with fees | varies |
| `club_games.csv` | Club-level match statistics | 136,000+ |
| `game_events.csv` | In-match events (goals, cards, subs) | 950,000+ |
| `game_lineups.csv` | Starting lineups and formations | varies |

### Data Dictionary

#### players
- `player_id` (INT): Unique identifier
- `name` (TEXT): Display name
- `position` (TEXT): Attack / Midfield / Defender / Goalkeeper
- `sub_position` (TEXT): Detailed position (e.g., Centre-Forward)
- `date_of_birth` (DATE): Birth date
- `country_of_citizenship` (TEXT): Nationality
- `current_club_id` (INT): FK to clubs
- `market_value_in_eur` (REAL): Current market value in EUR
- `highest_market_value_in_eur` (REAL): Peak market value
- `height_in_cm` (INT): Height
- `foot` (TEXT): Preferred foot

#### player_valuations
- `player_id` (INT): FK to players
- `date` (DATE): Valuation date
- `market_value_in_eur` (REAL): Market value at that date
- `current_club_id` (INT): Club at time of valuation
- `player_club_domestic_competition_id` (TEXT): League at time of valuation

#### transfers
- `player_id` (INT): FK to players
- `transfer_date` (DATE): Date of transfer
- `transfer_season` (TEXT): Season
- `from_club_id` / `to_club_id` (INT): Selling / buying club
- `transfer_fee` (REAL): Fee in EUR (0 = free, NULL = undisclosed)
- `market_value_in_eur` (REAL): Player value at time of transfer

#### appearances
- `player_id` (INT): FK to players
- `game_id` (INT): FK to games
- `goals` (INT): Goals scored
- `assists` (INT): Assists made
- `minutes_played` (INT): Minutes on pitch
- `yellow_cards` / `red_cards` (INT): Cards received

#### clubs
- `club_id` (INT): Unique identifier
- `name` (TEXT): Club name
- `domestic_competition_id` (TEXT): FK to competitions
- `total_market_value` (REAL): Total squad value
- `squad_size` (INT): Number of players
- `average_age` (REAL): Squad average age

#### competitions
- `competition_id` (TEXT): Unique identifier (e.g., "GB1" for Premier League)
- `name` (TEXT): Competition name
- `type` (TEXT): domestic_league / domestic_cup / international
- `country_name` (TEXT): Country

#### games
- `game_id` (INT): Unique identifier
- `competition_id` (TEXT): FK to competitions
- `season` (INT): Season year
- `date` (DATE): Match date
- `home_club_id` / `away_club_id` (INT): FK to clubs
- `home_club_goals` / `away_club_goals` (INT): Score
- `attendance` (INT): Crowd size
