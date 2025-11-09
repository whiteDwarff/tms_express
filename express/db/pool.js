import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    // Supabase SSL 연결용
    rejectUnauthorized: false,
  },
  max: 20, // 최대 커넥션 수
  idleTimeoutMillis: 30000, // 유휴 커넥션 타임아웃
});

export default pool;
