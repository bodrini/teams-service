import { Router, Request, Response, NextFunction } from 'express';
import {
  CreateTeamDto,
  UpdateTeamDto,
  PatchTeamDto,
  UpdateTeamResponseDto,
  PatchTeamResponseDto,
} from './dto';
import { GetTeamStatsDto } from './dto/get-team-stats.dto';
import { TeamsService } from './teams.service';
import { NhlApiGateway } from './providers/nhl-api.gateway';
import { SportsApiGateway } from './providers/sports-api.gateway';
import { TeamStatsRepository } from '../../repositories/TeamStatsRepository';
import { TeamRepository } from '../../repositories/TeamRepository';
import { HttpError } from '../../common/errors/http-error';
import { validateRequest } from '../../common/middleware/validation.middleware';
import db from '../../common/db/database';

const teamRepository = new TeamRepository(db);
const teamStatsRepository = new TeamStatsRepository(db);
const sportsApiGateway = new SportsApiGateway();
const nhlApiGateway = new NhlApiGateway();
const teamsService = new TeamsService(
  teamRepository,
  teamStatsRepository,
  sportsApiGateway,
  nhlApiGateway,
);
const router = Router();

router.get('/teams', async (req: Request, res: Response) => {
  try {
    const teams = await teamsService.getAggregatedTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера', detail: (error as Error).message });
  }
});

router.post(
  '/teams/sync-football-stats',
  validateRequest(GetTeamStatsDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as GetTeamStatsDto;

      const result = await teamsService.syncFootballTeamStatistics(dto);

      res.status(200).json({
        message: 'Статистика успешно синхронизирована',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/teams/sync-basketball-stats',
  validateRequest(GetTeamStatsDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as GetTeamStatsDto;

      const result = await teamsService.syncBasketballTeamStatistics(dto);

      res.status(200).json({
        message: 'Статистика успешно синхронизирована',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/teams/sync-all-stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teamsService.syncAllTeamStatistics();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
/**
 * POST /teams
 * Создает новую команду
 */
router.post(
  '/teams',
  validateRequest(CreateTeamDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const team: CreateTeamDto = req.body;
      const newTeam: CreateTeamDto = await teamsService.createTeam(team);

      res.status(201).json(newTeam);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * PUT /teams/:id
 * Полное обновление команды по ID
 */
router.put(
  '/teams/:id',
  validateRequest(UpdateTeamDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        throw new HttpError(400, 'Некорректный ID команды');
      }
      const team: UpdateTeamDto = req.body;

      const updatedTeam: UpdateTeamResponseDto = await teamsService.updateTeam(id, team);
      res.json(updatedTeam);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * PATCH /teams/:id
 * Частичное обновление команды по ID
 */
router.patch(
  '/teams/:id',
  validateRequest(PatchTeamDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        throw new HttpError(400, 'Некорректный ID команды');
      }
      const team: PatchTeamDto = req.body;
      const patchedTeam: PatchTeamResponseDto = await teamsService.patchTeam(id, team);

      res.json(patchedTeam);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/teams/nhl-stats-sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teamsService.getNhlTeamResult();
    res.status(200).json({
      message: 'NHL статистика успешно получена',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /teams?id=
 * Удаляет команду по ID, переданному как query-параметр
 */
router.delete('/teams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.query.id);
    if (!id) {
      throw new HttpError(400, 'Некорректный ID команды');
    }

    await teamsService.deleteTeam(id);
    res.status(200).json({ message: 'Команда успешно удалена' });
  } catch (error) {
    next(error);
  }
});

export default router;
