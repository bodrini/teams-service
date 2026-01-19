import {ResultSetHeader} from 'mysql2';
import {BaseService} from '../../common/db/base.service';
import { HttpError } from '../../common/errors/http-error';
import { CreateTeamDto, UpdateTeamDto, PatchTeamDto, 
  CreateTeamResponseDto, UpdateTeamResponseDto, PatchTeamResponseDto  } from './dto';

export class TeamsService extends BaseService {

async getAggregatedTeams() {
  return this.execute<any[]>(`
    SELECT 
      t.id,
      t.name,
      c.country_name,
      s.sport_name
    FROM teams t
    JOIN countries c ON t.country_id = c.id
    JOIN sports s ON t.sport_id = s.id
  `);
}

/**
 * Создание новой команды
 */
async createTeam(team: CreateTeamDto) : Promise<CreateTeamResponseDto> {
  const result = await this.execute<ResultSetHeader>(
    'INSERT INTO teams (name, country_id, sport_id) VALUES (?, ?, ?)',
    [team.name, team.country_id, team.sport_id]
  );
  
  return { 
    id: result.insertId,
    name: team.name,
    country_id: team.country_id,
    sport_id: team.sport_id, };
}

/**
 * Полное обновление команды
 */
async updateTeam(id: number, team: UpdateTeamDto) : Promise<UpdateTeamResponseDto>
  {
  const result = await this.execute<ResultSetHeader>(
    'UPDATE teams SET name = ?, country_id = ?, sport_id = ? WHERE id = ?',
    [team.name, team.country_id, team.sport_id, id]
  );

  if (result.affectedRows === 0) {
    throw new HttpError(404, 'Команда не найдена');
  }
  return {  
    id,
    name: team.name,
    country_id: team.country_id,
    sport_id: team.sport_id,  };
}

/**
 * Частичное обновление команды
 */
async patchTeam(id: number, fields: PatchTeamDto): Promise<PatchTeamResponseDto> {
  const entries = Object.entries(fields);
  if (entries.length === 0) {
    throw new HttpError(400, 'Нет полей для обновления');
  }

  const sets = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = [...entries.map(([, value]) => value), id];

  const result = await this.execute<ResultSetHeader>(
    `UPDATE teams SET ${sets} WHERE id = ?`,
    values
  );

    if (result.affectedRows === 0) {
      throw new HttpError(404, 'Команда не найдена');
    }

  return { 
    id, 
    name: fields.name,
    country_id: fields.country_id,
    sport_id: fields.sport_id,  };
}

/**
 * Удаление команды по ID
 */
async deleteTeam(id: number) {

  const result = await this.execute<any>(
    'DELETE FROM teams WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      throw new HttpError(404, 'Команда не найдена');
    }
    return { message: 'Команда успешно удалена' };
  }
}
