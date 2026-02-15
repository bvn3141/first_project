export interface RoiDistribution {
  category: string;
  count: number;
  avg_roi: number;
}

export interface NetSpend {
  club: string;
  net_spend: number;
}

export interface ScatterPoint {
  fee: number;
  value_change: number;
  age: number;
  name: string;
}

export interface TransferAnalyticsData {
  roi_distribution: RoiDistribution[];
  net_spend: NetSpend[];
  scatter: ScatterPoint[];
  total_analyzed: number;
}

export interface AgeGroup {
  group: string;
  count: number;
  value: number;
}

export interface ClubData {
  name: string;
  league: string;
  squad_value: number;
  avg_age: number;
  star_dependency: number;
  invested_5yr: number;
  roi: number;
  positions: Record<string, number>;
  age_groups: AgeGroup[];
}

export interface TreemapItem {
  name: string;
  size: number;
  position: string;
  [key: string]: string | number;
}

export interface ValueBucket {
  range: string;
  count: number;
}

export interface PlayerPositionsData {
  treemap: TreemapItem[];
  value_distribution: ValueBucket[];
  total_players: number;
}
