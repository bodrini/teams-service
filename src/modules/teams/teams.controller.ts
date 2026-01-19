import { Router, Request, Response, NextFunction } from 'express';
import { CreateTeamDto, UpdateTeamDto, PatchTeamDto, 
  CreateTeamResponseDto, UpdateTeamResponseDto, PatchTeamResponseDto  } from './dto';
import { TeamsService } from './teams.service';
import { HttpError } from '../../common/errors/http-error';
import { validateRequest } from '../../common/middleware/validation.middleware';

const teamsService = new TeamsService();
const router = Router();

router.get('/teams', async (req: Request, res: Response) => {
  try {
    const teams = await teamsService.getAggregatedTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера', detail: (error as Error).message });
  }
});
/**
 * POST /teams
 * Создает новую команду
 */
router.post('/teams', validateRequest(CreateTeamDto), 
async (req: Request, res: Response) => {

  try {
    const team: CreateTeamDto = req.body;
    const newTeam: CreateTeamDto = await teamsService.createTeam(team);

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании', detail: (error as Error).message });
  }
});

/**
 * PUT /teams/:id
 * Полное обновление команды по ID
 */
router.put('/teams/:id', validateRequest(UpdateTeamDto),
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
    next (error);}
});

/**
 * PATCH /teams/:id
 * Частичное обновление команды по ID
 */
router.patch('/teams/:id', validateRequest(PatchTeamDto),
async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      throw new HttpError(400, 'Некорректный ID команды');
    }
    const team: PatchTeamDto = req.body;
    const patchedTeam: PatchTeamResponseDto  = await teamsService.patchTeam(id,team);

    res.json(patchedTeam);

  } catch (error) {
    next (error);
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
    res.status(201).json({message: 'Команда успешно удалена'});
  } catch (error) {
    next (error);
  }
});

export default router;
