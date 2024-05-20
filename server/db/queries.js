import { db } from "../app.js";
import { catalog, items } from "./schema.js";
import { sql } from "drizzle-orm";

export function log() {
  console.log(db.g);
}

export async function updateCatalog(shops) {
  const itemsToInsert = new Map();
  try {
    const shopsToInsert = shops.map((shop) => {
      shop.items.forEach((item) => {
        if (!itemsToInsert.has(item.id)) {
          const db_item = {
            id: item.id,
            icon: item.icon,
            name: item.name,
            base_type: item.baseType,
            quality: item.quality,
            enchant_mods: item.enchantMods,
            implicit_mods: item.implicitMods,
            explicit_mods: item.explicitMods,
            fractured_mods: item.fracturedMods,
            crafted_mods: item.craftedMods,
            crucible_mods: item.crucibleMods,
            owner: shop.profile_name,
          };
          itemsToInsert.set(item.id, db_item);
        }
      });
      return {
        profile_name: shop.profile_name,
        thread_index: shop.thread_index,
      };
    });

    await db
      .insert(catalog)
      .values(shopsToInsert)
      .onConflictDoUpdate({
        target: catalog.profile_name,
        set: { thread_index: sql`EXCLUDED.thread_index` },
      });

    const uniqueItemsToInsert = Array.from(itemsToInsert.values());
    await db
      .insert(items)
      .values(uniqueItemsToInsert)
      .onConflictDoUpdate({
        target: [items.id],
        set: {
          name: sql`EXCLUDED.name`,
          quality: sql`EXCLUDED.quality`,
          enchant_mods: sql`EXCLUDED.enchant_mods`,
          implicit_mods: sql`EXCLUDED.implicit_mods`,
          explicit_mods: sql`EXCLUDED.explicit_mods`,
          fractured_mods: sql`EXCLUDED.fractured_mods`,
          crafted_mods: sql`EXCLUDED.crafted_mods`,
          crucible_mods: sql`EXCLUDED.crucible_mods`,
          owner: sql`EXCLUDED.owner`,
        },
      });
  } catch (error) {
    console.log(error);
  }
}

export async function getShop() {
  return db.select().from(catalog);
}
