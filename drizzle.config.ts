import "dotenv/config";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/drizzle/schema",
  out: "./migrations",
  driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    connectionString: process.env.DATABASE_ENDPOINT,
  },
} satisfies Config;
