import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../../../config';
import { ExternalTeamStatisticsDto } from '../dto/external-team-statistics.dto';
import { GetTeamStatsDto } from '../dto/get-team-stats.dto';
import { HttpError } from '../../../common/errors/http-error'; 

export class SportsApiGateway {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.externalApi.url,
      timeout: 30000,
      headers: {
        'x-apisports-key': config.externalApi.key,
        'Content-Type': 'application/json',
      },
    });
  }

  async getTeamStatistics(dto: GetTeamStatsDto): Promise<ExternalTeamStatisticsDto> {
    // --- ДЕБАГ КОНФИГА ---
    console.log('--- DEBUG CONFIG ---');
    console.log('Full Request URL:', this.client.defaults.baseURL + '/teams/statistics');
    // Не показываем весь ключ, только первые 5 символов и длину
    const key = this.client.defaults.headers['x-apisports-key'] as string;
    console.log('API Key present:', !!key); 
    console.log('API Key preview:', key ? key.substring(0, 5) + '...' : 'MISSING');
    console.log('Params:', JSON.stringify(dto));
    console.log('--- END DEBUG CONFIG ---');
    // ---------------------
    try {
      const { data } = await this.client.get<ExternalTeamStatisticsDto>('/teams/statistics', {
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
    // -----------------------------------------------------------
    // ДЕБАГ БЛОК: Выводим в консоль вообще всё, что прилетело
    // -----------------------------------------------------------
    console.log('--- DEBUG ERROR START ---');
    console.log('Type of error:', typeof error);
    
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
        console.error(`[FootballApi] Upstream Error ${status}:`, JSON.stringify(upstreamData, null, 2)); // Красивый JSON

        if (status === 404) throw new HttpError(404, 'Team, League or Season not found in external API');
        if (status === 401 || status === 403) throw new HttpError(502, 'External API configuration error (Check API Key)');
        if (status === 429) throw new HttpError(503, 'External API rate limit exceeded');
        
        throw new HttpError(502, `External API Error: ${status}`);
      } 
      else if (axiosError.request) {
        console.error('[FootballApi] No response received');
        throw new HttpError(504, 'External API is unreachable (Timeout)');
      }
    }

    // Если мы дошли сюда, значит это НЕ сетевая ошибка Axios.
    // Это баг в коде: undefined, опечатка, ошибка в конфиге или в маппере.
    console.error('[FootballApi] Unexpected SYSTEM error:', error);
    throw new HttpError(500, `Internal Server Error in Football Gateway: ${(error as Error).message}`);
  }
}