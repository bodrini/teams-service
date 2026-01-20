import mysql from 'mysql2/promise';
import { dbConfig } from './db.config';

export abstract class BaseService {
  protected async execute<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T> {
    const connection = await mysql.createConnection(dbConfig);

    try {
      const [result] = await connection.execute(query, params);
      return result as T;
    } finally {
      await connection.end();
    }
  }
}
