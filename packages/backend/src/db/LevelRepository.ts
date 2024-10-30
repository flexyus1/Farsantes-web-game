import { Level } from '@farsantes/common';
import { Pool, QueryResult } from 'pg';

export class LevelRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getLevel(id: number): Promise<Level | null> {
    const query = 'SELECT * FROM levels WHERE id = $1';
    const result: QueryResult = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getLevelForDay(day: number): Promise<Level | null> {
    const query = 'SELECT * FROM levels WHERE order = $1';
    const result: QueryResult = await this.pool.query(query, [day]);
    return result.rows[0] || null;
  }
}
