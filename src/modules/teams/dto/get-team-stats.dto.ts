import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTeamStatsDto {
  @IsString({ message: 'teamId должен быть строкой' })
  @IsNotEmpty()
  teamId!: string;

  @IsString()
  @IsNotEmpty()
  leagueId!: string;

  @Type(() => Number)
  @IsInt({ message: 'season должен быть числом' })
  @Min(2000)
  season!: string;
}
