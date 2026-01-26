export interface ExternalFootballStatsParameters {
  league: string;
  season: string;
  team: string;
}

export interface ExternalFootballPaging {
  current: number;
  total: number;
}

export interface ExternalFootballStatsLeague {
  id?: number;
  name?: string;
  country?: string;
  logo?: string;
  flag?: string;
  season?: number;
}

export interface ExternalFootballStatsTeam {
  id?: number;
  name?: string;
  logo?: string;
}

export interface ExternalFootballStatsData {
  league: ExternalFootballStatsLeague;
  team: ExternalFootballStatsTeam;
  form: string;
  fixtures: Record<string, unknown>;
  goals: Record<string, unknown>;
  biggest: Record<string, unknown>;
  clean_sheet: Record<string, unknown>;
  failed_to_score: Record<string, unknown>;
  penalty: Record<string, unknown>;

  lineups: unknown[];
  cards: Record<string, unknown>;
}

export interface ExternalFootballTeamStatisticsDto {
  get: string;
  parameters: ExternalFootballStatsParameters;
  errors: unknown[];
  results: number;
  paging: ExternalFootballPaging;
  response: ExternalFootballStatsData;
}
