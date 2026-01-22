import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // === 1. ПЕРЕНОСИМ ТО, ЧТО БЫЛО В init.sql ===

  // Таблица COUNTRIES
  await knex.schema.createTable('countries', (table) => {
    table.increments('id').primary();
    table.string('country_name', 100).notNullable();
  });

  // Таблица SPORTS
  await knex.schema.createTable('sports', (table) => {
    table.increments('id').primary();
    table.string('sport_name', 100).notNullable();
  });

  // === 2. ДОБАВЛЯЕМ НОВУЮ ТАБЛИЦУ LEAGUES ===
  // (Вставляем её до teams, чтобы teams могла на неё ссылаться)
  await knex.schema.createTable('leagues', (table) => {
    table.increments('id').primary();
    table.string('league_name', 100).notNullable();

    // Лига привязана к виду спорта (Football -> Premier League)
    table.integer('sport_id').unsigned().notNullable();
    table.foreign('sport_id').references('sports.id').onDelete('CASCADE');
  });

  // === 3. ПРОДОЛЖАЕМ ПЕРЕНОС init.sql (TEAMS) ===

  await knex.schema.createTable('teams', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();

    // Внешние ключи из твоего SQL
    table.integer('country_id').unsigned().notNullable();
    table.foreign('country_id').references('countries.id').onDelete('CASCADE');

    table.integer('sport_id').unsigned().notNullable();
    table.foreign('sport_id').references('sports.id').onDelete('CASCADE');

    // !!! НОВОЕ: Связь с новой таблицей LEAGUES !!!
    // Делаем nullable, так как вдруг команда не привязана к лиге
    table.integer('league_id').unsigned().nullable();
    table.foreign('league_id').references('leagues.id').onDelete('SET NULL');

    // Твои поля для внешних ID
    table.string('external_team_id', 100);
    table.string('external_league_id', 100);
  });

  // === 4. ПЕРЕНОС init.sql (STATISTICS) ===

  await knex.schema.createTable('team_statistics', (table) => {
    table.increments('id').primary();

    table.integer('external_team_id').notNullable();
    table.integer('external_league_id').notNullable();
    table.integer('season').notNullable();

    table.integer('wins_total').defaultTo(0);
    table.integer('draws_total').defaultTo(0);
    table.integer('loses_total').defaultTo(0);

    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Твой уникальный ключ
    table.unique(['external_team_id', 'external_league_id', 'season'], {
      indexName: 'unique_team_stats',
    });
  });

  // === 5. ЗАПОЛНЕНИЕ ДАННЫМИ (SEEDING) ===
  // Переносим твои INSERT INTO ...

  await knex('countries').insert([
    { id: 1, country_name: 'USA' },
    { id: 2, country_name: 'UK' },
  ]);

  await knex('sports').insert([
    { id: 1, sport_name: 'Football' },
    { id: 2, sport_name: 'Basketball' },
    { id: 3, sport_name: 'Hockey' },
  ]);

  // Добавим пример Лиги, раз уж создали таблицу
  await knex('leagues').insert([
    { id: 1, league_name: 'Premier League', sport_id: 1 }, // ID 1 = Football
  ]);

  await knex('teams').insert([
    { name: 'Arsenal', country_id: 2, sport_id: 1, league_id: 1 },
    { name: 'New York Islanders', country_id: 1, sport_id: 3, league_id: null },
    { name: 'Golden State Warriors', country_id: 1, sport_id: 2, league_id: null },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Удаляем в обратном порядке зависимости
  await knex.schema.dropTableIfExists('team_statistics');
  await knex.schema.dropTableIfExists('teams');
  await knex.schema.dropTableIfExists('leagues'); // <-- Удаляем новую таблицу
  await knex.schema.dropTableIfExists('sports');
  await knex.schema.dropTableIfExists('countries');
}
