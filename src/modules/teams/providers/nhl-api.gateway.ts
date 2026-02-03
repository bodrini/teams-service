import axios, { AxiosInstance } from 'axios';
import { config } from '../../../config';
import { ExternalNhlResultsDto } from '../dto/external-nhl-results.dto';
import { HttpError } from '../../../common/errors/http-error';

export class NhlApiGateway {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.externalApi.nhlApiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  async getNhlResultsForDate(): Promise<ExternalNhlResultsDto> {
    const date = '2026-01-06';
    const url = `schedule/${date}`;
    try {
      const { data } = await this.client.get<ExternalNhlResultsDto>(url);
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

    if (axios.isAxiosError(error)) {
      console.error('[NHL API] Unexpected SYSTEM error:', error);
      throw new HttpError(500, `Internal Server Error in NHL Gateway: ${(error as Error).message}`);
    }
  }
}
