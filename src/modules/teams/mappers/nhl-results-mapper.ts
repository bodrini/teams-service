import { ExternalNhlResultsDto } from '../dto/external-nhl-results.dto';
import { NhlResultsDto } from '../dto/nhl-results.dto';

const TARGET_TEAM = 'Islanders';

export const mapNhlResults = (
  externalData: ExternalNhlResultsDto,
  targetDate: string,
): NhlResultsDto | null => {
  const dayStats = externalData.gameWeek.find((day) => day.date === targetDate);
  if (!dayStats) return null;

  const targetGame = dayStats.games.find(
    (game) =>
      game.homeTeam.commonName.default === TARGET_TEAM ||
      game.awayTeam.commonName.default === TARGET_TEAM,
  );

  if (!targetGame) return null;
  if (targetGame.gameState !== 'OFF' && targetGame.gameState !== 'FINAL') {
    return null;
  }

  let goalsIslanders = 0;
  let goalsEnemy = 0;

  if (targetGame.homeTeam.commonName.default === TARGET_TEAM) {
    goalsIslanders = targetGame.homeTeam.score ?? 0;
    goalsEnemy = targetGame.awayTeam.score ?? 0;
  } else {
    goalsIslanders = targetGame.awayTeam.score ?? 0;
    goalsEnemy = targetGame.homeTeam.score ?? 0;
  }

  return {
    goals_Islanders: goalsIslanders,
    goals_Enemy: goalsEnemy,
    are_we_happy: goalsIslanders > goalsEnemy,
    game_date: targetDate,
  };
};
