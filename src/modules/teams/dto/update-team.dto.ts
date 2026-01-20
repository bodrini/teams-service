import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateTeamDto {

  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'ID should not be empty' })
  name!: string;

  @IsNumber({}, { message: 'Country ID must be a number' })
  @IsNotEmpty({ message: 'Country ID should not be empty' })
  country_id!: number;

  @IsNumber({}, { message: 'Sport ID must be a number' })
  @IsNotEmpty({ message: 'Sport ID should not be empty' })
  sport_id!: number;
}