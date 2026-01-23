import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    // 👇 ИСПРАВЛЕНИЕ: Читаем из переменной окружения!
    host: process.env.DB_HOST || 'localhost',

    // 👇 Совет: Порт тоже лучше читать из env, на всякий случай
    port: Number(process.env.DB_PORT) || 3306,

    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'sports',
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
};

export default config;
