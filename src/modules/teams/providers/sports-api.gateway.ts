import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../../../config';
import { ExternalFootballTeamStatisticsDto } from '../dto/external-football-team-statistics.dto';
import { ExternalBasketballTeamStatisticsDto } from '../dto/external-basketball-team-dto';
import { GetTeamStatsDto } from '../dto/get-team-stats.dto';
import { HttpError } from '../../../common/errors/http-error';

export class SportsApiGateway {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'x-apisports-key': config.externalApi.key,
        'Content-Type': 'application/json',
      },
    });
  }

  async getFootballStatistics(dto: GetTeamStatsDto): Promise<ExternalFootballTeamStatisticsDto> {
    const url = `${config.externalApi.url}/teams/statistics`;
    try {
      const { data } = await this.client.get<ExternalFootballTeamStatisticsDto>(url, {
        params: {
          league: dto.leagueId,
          season: dto.season.toString(),
          team: dto.teamId,
        },
      });
      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getBasketballStatistics(
    dto: GetTeamStatsDto,
  ): Promise<ExternalBasketballTeamStatisticsDto> {
    const url = `${config.externalApi.secondaryUrl}/statistics`;
    try {
      const { data } = await this.client.get<ExternalBasketballTeamStatisticsDto>(url, {
        params: {
          league: dto.leagueId,
          season: dto.season.toString(),
          team: dto.teamId,
        },
      });
      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
    } else {
      console.log('Raw Error:', error);
    }
    console.log('--- DEBUG ERROR END ---');
    // -----------------------------------------------------------

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const upstreamData = axiosError.response.data;
        console.error(
          `[FootballApi] Upstream Error ${status}:`,
          JSON.stringify(upstreamData, null, 2),
        ); // Красивый JSON

        if (status === 404)
          throw new HttpError(404, 'Team, League or Season not found in external API');
        if (status === 401 || status === 403)
          throw new HttpError(502, 'External API configuration error (Check API Key)');
        if (status === 429) throw new HttpError(503, 'External API rate limit exceeded');

        throw new HttpError(502, `External API Error: ${status}`);
      } else if (axiosError.request) {
        console.error('[FootballApi] No response received');
        throw new HttpError(504, 'External API is unreachable (Timeout)');
      }
    }

    console.error('[FootballApi] Unexpected SYSTEM error:', error);
    throw new HttpError(
      500,
      `Internal Server Error in Football Gateway: ${(error as Error).message}`,
    );
  }
}
