import type { Knex } from 'knex';

const tableName = 'nhl_stats';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('goals_Islanders').notNullable();
    table.integer('goals_Enemy').notNullable();
    table.boolean('are_we_happy').notNullable();
    table.string('game_date').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName);
}
