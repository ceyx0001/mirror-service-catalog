import { db } from "../app.js";
import catalog from "./models/schema.js";

export function log() {
    console.log(db.g);
}

export async function createShop(shop) {
    await db.insert(catalog).values(shop);
}

export async function getShop() {
    return db.select().from(catalog);
}