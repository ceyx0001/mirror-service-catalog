import { items } from "../schemas/itemsSchema";
import { mods } from "../schemas/modsSchema";
import { db } from "../../app";
import { mapItemsToShop } from "./search";
import { or, inArray, ilike } from "drizzle-orm";

export async function getOrMods(filters) {
  try {
    const conditions = filters.map((filter) => ilike(mods.mod, `%${filter}%`));
    const subQuery = db
      .select({ item_id: mods.item_id })
      .from(mods)
      .where(or(...conditions));

    const result = await db.query.items.findMany({
      where: inArray(items.item_id, subQuery),
      columns: { shop_id: false },
      with: {
        mods: { columns: { item_id: false } },
        catalog: { columns: { views: false } },
      },
    });

    return Array.from(mapItemsToShop(result));
  } catch (error) {
    console.log(error);
  }
}
