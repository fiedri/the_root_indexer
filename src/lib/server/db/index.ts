import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as env from "$env/static/private";
import * as schema from "./schema";

const DATABASE_URL = env.DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida. ¡Ponete las pilas con el .env!");
}

const client = postgres(DATABASE_URL, { prepare: false });
export const db = drizzle({ client, schema, 
  // logger: true
 });
