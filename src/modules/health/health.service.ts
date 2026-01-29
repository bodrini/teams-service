import { HttpError } from '../../common/errors/http-error';
import { TeamStatsRepository } from '../../repositories/TeamStatsRepository';

export class HealthService {
  constructor(private readonly teamsStatsRepository: TeamStatsRepository) {}
  async checkHealth(): Promise<{ status: string }> {
    const isHealthy = await this.teamsStatsRepository.healthCheck();

    if (isHealthy == true) {
      return { status: 'OK' };
    } else {
      throw new HttpError(503, 'Service Unavailable');
    }
  }
}
