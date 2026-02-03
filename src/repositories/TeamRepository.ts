import { Knex } from 'knex';
import { CreateTeamDto, UpdateTeamDto, PatchTeamDto } from '../modules/teams/dto';

export class TeamRepository {
  constructor(private readonly db: Knex = db) {}
  async findAll() {
    return this.db('teams as t')
      .join('countries as c', 't.country_id', 'c.id')
      .join('sports as s', 't.sport_id', 's.id')
      .select(
        't.id',
        't.name',
        'c.country_name',
        's.sport_name',
        's.id as sport_id',
        't.external_team_id',
        't.external_league_id',
      );
  }

  async create(dto: CreateTeamDto): Promise<number> {
    const [id] = await this.db('teams').insert(dto);
    return id;
  }

  async update(id: number, dto: UpdateTeamDto): Promise<boolean> {
    const affectedRows = await this.db('teams').where({ id }).update(dto);

    return affectedRows > 0;
  }

  async patch(id: number, dto: PatchTeamDto): Promise<boolean> {
    const affectedRows = await this.db('teams').where({ id }).update(dto);

    return affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const affectedRows = await this.db('teams').where({ id }).delete();

    return affectedRows > 0;
  }

  async findById(id: number) {
    return this.db('teams').where({ id }).first();
  }
}
