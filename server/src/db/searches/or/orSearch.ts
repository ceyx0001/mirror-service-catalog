import { items } from "../../schemas/itemsSchema";
import { mods } from "../../schemas/modsSchema";
import db from "../../db";
import { mapItemsToShop } from "../search";
import { or, inArray, ilike } from "drizzle-orm";

export async function getOrMods(filters) {
  try {
    const conditions = filters.map((filter) => ilike(mods.mod, `%${filter}%`));
    const subQuery = db
      .select({ itemId: mods.itemId })
      .from(mods)
      .where(or(...conditions));

    const result = await db.query.items.findMany({
      where: inArray(items.itemId, subQuery),
      columns: { shopId: false },
      with: {
        mods: { columns: { itemId: false } },
        catalog: { columns: { views: false } },
      },
    });

    return Array.from(mapItemsToShop(result));
  } catch (error) {
    return error;
  }
}
