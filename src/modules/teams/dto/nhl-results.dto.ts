export class NhlResultsDto {
  goals_Islanders!: number;
  goals_Enemy!: number;
  are_we_happy!: boolean;
  game_date!: string;
}

export type NhlMappingResult =
  | { status: 'SUCCESS'; data: NhlResultsDto }
  | { status: 'RETRY'; newTargetDate: string }
  | { status: 'NOT_FOUND' };
