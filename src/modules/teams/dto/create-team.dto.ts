import {IsString, IsNumber, IsNotEmpty} from 'class-validator';

export class CreateTeamDto {

  @IsString({message: 'Name must be a string'})
  @IsNotEmpty({message: 'Name should not be empty'})
  name!: string;
  
  @IsNumber({},{ message: 'Country ID must be an integer'})
  @IsNotEmpty({message: 'Country ID should not be empty'})
  country_id!: number;

  @IsNumber({}, {message: 'Sport ID must be an integer'})
  @IsNotEmpty({message: 'Sport ID should not be empty'})
  sport_id!: number;

  @IsNumber({},{ message: 'External Team ID must be an integer'})
  @IsNotEmpty({message: 'Country ID should not be empty'})
  external_team_id!: number;

  @IsNumber({},{ message: 'External League ID must be an integer'})
  @IsNotEmpty({message: 'Country ID should not be empty'})
  external_league_id!: number;
}