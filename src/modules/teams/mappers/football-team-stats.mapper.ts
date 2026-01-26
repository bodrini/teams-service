import { ExternalFootballTeamStatisticsDto } from '../dto/external-football-team-statistics.dto';
import { SaveTeamStatsDto } from '../dto/save-team-stats.dto';

export class TeamStatsMapper {
  static mapToDbDto(externalData: ExternalFootballTeamStatisticsDto): SaveTeamStatsDto {
    const { response } = externalData;
    const { team, league, fixtures } = response;

    const dto = new SaveTeamStatsDto();

    dto.external_team_id = team.id!;
    dto.external_league_id = league.id!;
    dto.season = league.season!;

    // 4. Перекладываем статистику с защитой от пустоты
    dto.wins_total = fixtures.wins?.total || 0;
    dto.draws_total = fixtures.draws?.total || 0;
    dto.loses_total = fixtures.loses?.total || 0;

    return dto;
  }
}
