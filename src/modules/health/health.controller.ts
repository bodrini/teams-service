import { Router, Request, Response, NextFunction } from 'express';
import { HealthService } from './health.service';
import { TeamStatsRepository } from '../../repositories/TeamStatsRepository';
import db from '../../common/db/database';

const teamStatsRepository = new TeamStatsRepository(db);
const healthService = new HealthService(teamStatsRepository);
const router = Router();

router.get(`/health`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const healthStatus = await healthService.checkHealth();
    res.json(healthStatus);
  } catch (error) {
    next(error);
  }
});

export default router;
