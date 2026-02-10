import { ExternalNhlResultsDto } from '../dto/external-nhl-results.dto';
import { NhlMappingResult } from '../dto/nhl-results.dto';
import { TARGET_TEAM_NHL } from '../../../common/constants/nhl-target-team';

export const mapNhlResults = (externalData: ExternalNhlResultsDto): NhlMappingResult => {
  const finishedGames = externalData.gameWeek.flatMap((day) => {
    const games = day.games.filter(
      (g) =>
        g.homeTeam.commonName.default === TARGET_TEAM_NHL ||
        g.awayTeam.commonName.default === TARGET_TEAM_NHL,
    );

    return games
      .filter((g) => g.gameState === 'OFF' || g.gameState === 'FINAL')
      .map((g) => ({ ...g, gameDate: day.date }));
  });

  if (finishedGames.length === 0) {
    if (!externalData.previousStartDate) {
      return { status: 'NOT_FOUND' };
    }

    return {
      status: 'RETRY',
      newTargetDate: externalData.previousStartDate,
    };
  }

  finishedGames.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
  const targetGame = finishedGames[0];

  let goalsIslanders = 0;
  let goalsEnemy = 0;

  if (targetGame.homeTeam.commonName.default === TARGET_TEAM_NHL) {
    goalsIslanders = targetGame.homeTeam.score ?? 0;
    goalsEnemy = targetGame.awayTeam.score ?? 0;
  } else {
    goalsIslanders = targetGame.awayTeam.score ?? 0;
    goalsEnemy = targetGame.homeTeam.score ?? 0;
  }

  return {
    status: 'SUCCESS',
    data: {
      goals_Islanders: goalsIslanders,
      goals_Enemy: goalsEnemy,
      are_we_happy: goalsIslanders > goalsEnemy,
      game_date: targetGame.gameDate,
    },
  };
};
