import { db } from "../app.js";
import { sql } from "drizzle-orm";
import catalog from "./models/schema.js";

export function log() {
  console.log(db.g);
}

export async function updateShop(shops) {
  try {
    await db
      .insert(catalog)
      .values(shops)
      .onConflictDoUpdate({
        target: catalog.id,
        set: { items: sql`EXCLUDED.items` },
      });
  } catch (error) {
    console.log(error);
  }
}

export async function createShop(shop) {
  await db.insert(catalog).values(shop);
}

export async function getShop() {
  return db.select().from(catalog);
}
