import db from '../common/db/database';
import { SaveTeamStatsDto } from '../modules/teams/dto';

export class TeamStatsRepository {
  async saveTeamStatistics(stats: SaveTeamStatsDto): Promise<void> {
    const sql = `
      INSERT INTO team_statistics 
        (external_team_id, external_league_id, season, wins_total, draws_total, loses_total)
      VALUES 
        (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        wins_total = VALUES(wins_total),
        draws_total = VALUES(draws_total),
        loses_total = VALUES(loses_total),
        created_at = CURRENT_TIMESTAMP
    `;

    await db.raw(sql, [
      stats.external_team_id,
      stats.external_league_id,
      stats.season,
      stats.wins_total,
      stats.draws_total,
      stats.loses_total,
    ]);
  }
  async healthCheck(): Promise<boolean> {
    try {
      await db.raw('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
