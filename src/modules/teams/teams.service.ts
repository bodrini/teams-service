import { HttpError } from '../../common/errors/http-error';
import { TeamRepository } from '../../repositories/TeamRepository';
import { TeamStatsRepository } from '../../repositories/TeamStatsRepository';
import {
  CreateTeamDto,
  UpdateTeamDto,
  PatchTeamDto,
  CreateTeamResponseDto,
  UpdateTeamResponseDto,
  PatchTeamResponseDto,
} from './dto';
import { SportsApiGateway } from './providers/sports-api.gateway';
import { NhlApiGateway } from './providers/nhl-api.gateway';
import { TeamStatsMapper } from './mappers/football-team-stats.mapper';
import { BasketballStatsMapper } from './mappers/basketball-team-stats.mapper';
import { mapNhlResults } from './mappers/nhl-results-mapper';
import { GetTeamStatsDto } from './dto/get-team-stats.dto';
import { SaveTeamStatsDto } from './dto/save-team-stats.dto';
import { CURRENT_SEASON } from '../../common/constants/season';

export class TeamsService {
  constructor(
    private readonly teamsRepository: TeamRepository,
    private readonly teamsStatRepository: TeamStatsRepository,
    private readonly footballGateway: SportsApiGateway,
    private readonly NhlGateway: NhlApiGateway,
  ) {}

  async getAggregatedTeams() {
    return this.teamsRepository.findAll();
  }

  async syncFootballTeamStatistics(params: GetTeamStatsDto): Promise<SaveTeamStatsDto> {
    const externalData = await this.footballGateway.getFootballStatistics(params);
    const statsDto = TeamStatsMapper.mapToDbDto(externalData);

    await this.teamsStatRepository.saveTeamStatistics(statsDto);
    return statsDto;
  }

  async syncBasketballTeamStatistics(params: GetTeamStatsDto): Promise<SaveTeamStatsDto> {
    const externalData = await this.footballGateway.getBasketballStatistics(params);
    const statsDto = BasketballStatsMapper.mapToDbDto(externalData);

    await this.teamsStatRepository.saveTeamStatistics(statsDto);
    return statsDto;
  }

  /**
   * Создание новой команды
   */
  async createTeam(team: CreateTeamDto): Promise<CreateTeamResponseDto> {
    const insertId = await this.teamsRepository.create(team);

    return {
      id: insertId,
      name: team.name,
      country_id: team.country_id,
      sport_id: team.sport_id,
      external_team_id: team.external_team_id,
      external_league_id: team.external_league_id,
    };
  }

  /**
   * Полное обновление команды
   */
  async updateTeam(id: number, team: UpdateTeamDto): Promise<UpdateTeamResponseDto> {
    const isUpdated = await this.teamsRepository.update(id, team);

    if (!isUpdated) {
      throw new HttpError(404, 'Команда не найдена');
    }

    return {
      id,
      name: team.name,
      country_id: team.country_id,
      sport_id: team.sport_id,
      external_team_id: team.external_team_id,
      external_league_id: team.external_league_id,
    };
  }

  /**
   * Частичное обновление команды
   */
  async patchTeam(id: number, fields: PatchTeamDto): Promise<PatchTeamResponseDto> {
    const entries = Object.entries(fields);
    if (entries.length === 0) {
      throw new HttpError(400, 'Нет полей для обновления');
    }

    const isPatched = await this.teamsRepository.patch(id, fields);
    if (!isPatched) {
      throw new HttpError(404, 'Команда не найдена');
    }

    return {
      id,
      name: fields.name,
      country_id: fields.country_id,
      sport_id: fields.sport_id,
      external_team_id: fields.external_team_id,
      external_league_id: fields.external_league_id,
    };
  }

  /**
   * Удаление команды по ID
   */
  async deleteTeam(id: number) {
    const isDeleted = await this.teamsRepository.delete(id);

    if (!isDeleted) {
      throw new HttpError(404, 'Команда не найдена');
    }
    return { message: 'Команда успешно удалена' };
  }

  async getNhlTeamResult() {
    const TARGET_DATE = '2026-01-06';
    const externalData = await this.NhlGateway.getNhlResultsForDate();
    const statDto = mapNhlResults(externalData, TARGET_DATE);

    if (!statDto) {
      console.log(`[Service] Результат за ${TARGET_DATE} не найден.`);
      return null;
    }
    await this.teamsStatRepository.saveNhlStatistics(statDto);
    return statDto;
  }
  async syncAllTeamStatistics() {
    const findTeams = await this.teamsRepository.findAll();
    const syncableTeams = findTeams.filter(
      (team) => team.external_team_id && team.external_league_id && team.sport_id,
    );

    const results = await Promise.allSettled(
      syncableTeams.map(async (team) => {
        const params: GetTeamStatsDto = {
          leagueId: team.external_league_id!.toString(),
          teamId: team.external_team_id!.toString(),
          season: CURRENT_SEASON,
        };

        if (team.sport_id === 1) {
          return this.syncFootballTeamStatistics(params);
        } else if (team.sport_id === 2) {
          return this.syncBasketballTeamStatistics(params);
        } else {
          throw new HttpError(400, `Unsupported sport_id: ${team.sport_id}`);
        }
      }),
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failCount = results.filter((r) => r.status === 'rejected').length;

    return {
      total: syncableTeams.length,
      success: successCount,
      failed: failCount,
      message: `Синхронизация завершена. Успешно: ${successCount}, Ошибок: ${failCount}`,
    };
  }
}
