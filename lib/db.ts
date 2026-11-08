import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://neondb_owner:npg_9oZGTKhqubV7@ep-empty-field-bex2d5rf-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(connectionString);
