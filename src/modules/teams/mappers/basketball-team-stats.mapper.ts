import { ExternalBasketballTeamStatisticsDto } from '../dto/external-basketball-team-dto';
import { SaveTeamStatsDto } from '../dto/save-team-stats.dto';

export class BasketballStatsMapper {
  static mapToDbDto(externalData: ExternalBasketballTeamStatisticsDto): SaveTeamStatsDto {
    const { response, parameters } = externalData; // <-- Достаем параметры!
    const { games } = response;

    const dto = new SaveTeamStatsDto();

    // 1. Идентификаторы
    dto.external_team_id = Number(parameters.team); // 100% надежно // Берем из team (тут ID есть), используем 0 если id undefined

    // ВАЖНО: В response.league пришел null, поэтому берем из parameters
    // Параметры всегда строки, поэтому приводим к числу
    dto.external_league_id = Number(parameters.league);
    dto.season = Number(parameters.season);

    // 2. Статистика (с учетом вложенности JSON)
    // Структура: games -> wins -> all -> total

    // Используем Optional Chaining (?.) на случай, если API вернет null где-то в глубине
    dto.wins_total = games.wins?.all?.total ?? 0;
    dto.draws_total = games.draws?.all?.total ?? 0;
    dto.loses_total = games.loses?.all?.total ?? 0;

    // Если нужно добавить забитые/пропущенные (в JSON это есть в points):
    // const { points } = response;
    // dto.points_for = points?.for?.total?.all ?? 0;
    // dto.points_against = points?.against?.total?.all ?? 0;

    return dto;
  }
}
