export interface ExternalStatsParameters {
    league: string;
    season: string;
    team: string;
  }
  
  export interface ExternalPaging {
    current: number;
    total: number;
  }
  
  export interface ExternalStatsLeague {
    id?: number;
    name?: string;
    country?: string;
    logo?: string;
    flag?: string;
    season?: number;
  }
  
  export interface ExternalStatsTeam {
    id?: number;
    name?: string;
    logo?: string;
  }
  
  export interface ExternalStatsData {
    league: ExternalStatsLeague;
    team: ExternalStatsTeam;
    form: string; 
    fixtures: Record<string, any>; 
    goals: Record<string, any>;
    biggest: Record<string, any>;
    clean_sheet: Record<string, any>;
    failed_to_score: Record<string, any>;
    penalty: Record<string, any>;
    
    lineups: any[]; 
    cards: Record<string, any>;
  }
  
  export interface ExternalTeamStatisticsDto {
    get: string;
    parameters: ExternalStatsParameters;
    errors: any[];
    results: number;
    paging: ExternalPaging;
    response: ExternalStatsData; 
  }