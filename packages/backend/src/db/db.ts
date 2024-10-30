import { Pool } from 'pg';

const pool = new Pool({
  user: 'derenash',
  host: 'localhost',
  database: 'farsantes_001',
  password: 'dere',
  port: 5432,
});

export default pool;
