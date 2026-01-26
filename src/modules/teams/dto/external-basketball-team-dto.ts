// 1. Параметры запроса
export interface ExternalBasketballStatsParameters {
  league: string;
  season: string;
  team: string;
}

// 2. Вспомогательные интерфейсы
export interface ExternalBasketballResponseLeague {
  id?: number | null; // В JSON пришел null, поэтому добавляем | null
  name?: string | null;
  type?: string | null;
  logo?: string | null;
  season?: number | string | null;
}

export interface ExternalBasketballResponseCountry {
  name?: string;
  code?: string;
  flag?: string;
}

export interface ExternalBasketballResponseTeam {
  id?: number;
  name?: string;
  logo?: string;
}

// 3. Исправленный интерфейс статистики (ВТОРОЙ ВАРИАНТ - ПРАВИЛЬНЫЙ)
// Отражает структуру: games -> wins -> all -> total
export interface ExternalBasketballStatsDetail {
  home: { total: number; percentage?: string | null };
  away: { total: number; percentage?: string | null };
  all: { total: number; percentage?: string | null };
}

export interface ExternalBasketballResponseGames {
  played: { home: number; away: number; all: number };
  wins: ExternalBasketballStatsDetail;
  draws: ExternalBasketballStatsDetail;
  loses: ExternalBasketballStatsDetail;
}

export interface ExternalBasketballResponsePoints {
  for: Record<string, unknown>;
  against: Record<string, unknown>;
}

export interface ExternalBasketballResponseData {
  league: ExternalBasketballResponseLeague;
  country: ExternalBasketballResponseCountry;
  team: ExternalBasketballResponseTeam;
  games: ExternalBasketballResponseGames;
  points: ExternalBasketballResponsePoints;
}

// 4. Главный DTO
export interface ExternalBasketballTeamStatisticsDto {
  get: string;
  parameters: ExternalBasketballStatsParameters;
  errors: unknown[];
  results: number;
  response: ExternalBasketballResponseData; // Ссылка на структуру выше
}
