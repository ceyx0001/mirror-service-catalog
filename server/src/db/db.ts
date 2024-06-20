import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as catalogSchema from "./schemas/catalogSchema";
import * as itemsSchema from "./schemas/itemsSchema";
import * as modsSchema from "./schemas/modsSchema";
let db;
main().catch((err) => console.log(err));
async function main() {
  const connectionString = process.env.SUPABASE_URL;
  const client = postgres(connectionString, {
    username: `${process.env.SUPABASE_USER}`,
    prepare: false,
  });
  db = drizzle(client, {
    schema: { ...catalogSchema, ...itemsSchema, ...modsSchema },
  });
}

export default db;