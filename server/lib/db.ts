import pg from "pg";
const { Pool } = pg;

const hasDbUrl = !!process.env.DATABASE_URL;

export const pool = hasDbUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : (null as unknown as pg.Pool);

if (pool) {
  pool.on("error", (err) => {
    console.error("Unexpected pool error:", err);
  });
}

export async function query(text: string, params?: any[]) {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured. Database queries are unavailable.");
  }
  return pool.query(text, params);
}
