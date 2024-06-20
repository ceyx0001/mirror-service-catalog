import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as catalogSchema from "./schemas/catalogSchema";
import * as itemsSchema from "./schemas/itemsSchema";
import * as modsSchema from "./schemas/modsSchema";
let db;
main().catch((err) => console.log(err));
async function main() {
  const connectionString = process.env.POSTGRES_URL;
  const client = postgres(connectionString, {
    prepare: false,
  });
  db = drizzle(client, {
    schema: { ...catalogSchema, ...itemsSchema, ...modsSchema },
  });
}

export default db;