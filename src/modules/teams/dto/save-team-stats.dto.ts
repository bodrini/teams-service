export class SaveTeamStatsDto {
  external_team_id!: number;
  external_league_id!: number;
  season!: number;

  wins_total!: number;
  draws_total!: number;
  loses_total!: number;
}
