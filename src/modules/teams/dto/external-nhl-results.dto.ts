// 1. Вспомогательные типы для локализации (default, fr, es...)
export interface NhlLocalizedName {
  default: string;
  fr?: string;
  es?: string;
  cs?: string;
  fi?: string;
  sk?: string;
  sv?: string;
}

// 2. Информация о трансляции
export interface NhlTvBroadcast {
  id: number;
  market: string; // "A" (Away), "H" (Home), "N" (National)
  countryCode: string;
  network: string;
  sequenceNumber: number;
}

// 3. Информация о месте проведения
export type NhlVenue = NhlLocalizedName;

// 4. Информация об игроке (вратарь/скорер)
export interface NhlPlayer {
  playerId: number;
  firstInitial: NhlLocalizedName;
  lastName: NhlLocalizedName;
}

// 5. Команда (Away/Home)
export interface NhlTeamInfo {
  id: number;
  commonName: NhlLocalizedName;
  placeName: NhlLocalizedName;
  placeNameWithPreposition: NhlLocalizedName;
  abbrev: string;
  logo: string;
  darkLogo: string;
  score?: number; // Опционально, т.к. игра может быть не начата
  radioLink?: string;
  // Специфичные поля для home/away
  awaySplitSquad?: boolean;
  homeSplitSquad?: boolean;
}

// 6. Описание периода
export interface NhlPeriodDescriptor {
  number: number;
  periodType: string; // "REG", "OT", "SO"
  maxRegulationPeriods: number;
}

// 7. Сама ИГРА 🏒
export interface NhlGame {
  id: number;
  season: number;
  gameType: number;
  venue: NhlVenue;
  neutralSite: boolean;
  startTimeUTC: string; // ISO Date "2026-01-07T00:00:00Z"
  easternUTCOffset: string;
  venueUTCOffset: string;
  venueTimezone: string;
  gameState: string; // "OFF" (Official/Final), "FUT" (Future), "LIVE"
  gameScheduleState: string; // "OK"
  tvBroadcasts: NhlTvBroadcast[];
  awayTeam: NhlTeamInfo;
  homeTeam: NhlTeamInfo;
  periodDescriptor: NhlPeriodDescriptor;

  // Поля, которые появляются после окончания игры
  gameOutcome?: {
    lastPeriodType: string;
  };
  winningGoalie?: NhlPlayer;
  winningGoalScorer?: NhlPlayer;

  // Ссылки на видео
  threeMinRecap?: string;
  threeMinRecapFr?: string;
  condensedGame?: string;
  condensedGameFr?: string;
  gameCenterLink: string;
}

// 8. День недели (Группировка игр по датам)
export interface NhlGameWeekDay {
  date: string; // "2026-01-06"
  dayAbbrev: string; // "TUE"
  numberOfGames: number;
  datePromo?: unknown[]; // Обычно пустой массив, можно оставить any[]
  games: NhlGame[];
}

// 9. 🚀 ГЛАВНЫЙ DTO ОТВЕТА
export interface ExternalNhlResultsDto {
  nextStartDate: string;
  previousStartDate: string;
  preSeasonStartDate: string;
  regularSeasonStartDate: string;
  regularSeasonEndDate: string;
  playoffEndDate: string;
  numberOfGames: number;
  gameWeek: NhlGameWeekDay[];
}
