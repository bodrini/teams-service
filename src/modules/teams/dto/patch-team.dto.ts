import { IsOptional, IsString, IsNumber } from 'class-validator';

export class PatchTeamDto {

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
  
  @IsOptional()
  @IsNumber({},{message: 'Country ID must be an integer' })
  country_id?: number;

  @IsOptional()
  @IsNumber({},{ message: 'Sport ID must be an integer' })
  sport_id?: number;

  @IsOptional()
  @IsNumber({},{ message: 'external_team_id must be an integer' })
  external_team_id!: number;
  
  @IsOptional()
  @IsNumber({},{ message: 'external_league_id must be an integer' })
  external_league_id!: number;
}