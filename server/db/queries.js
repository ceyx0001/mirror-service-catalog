import { db } from "../app.js";
import { catalog, items } from "./schema.js";

export function log() {
  console.log(db.g);
}

export async function updateCatalog(shops) {
  try {
    const itemsToInsert = [];
    const shopsToInsert = shops.map((shop) => {
      shop.items.forEach((item) => {
        itemsToInsert.push({
          id: item.id,
          icon: item.icon,
          name: item.name,
          base_type: item.baseType,
          enchant_mods: item.enchantMods,
          implicit_mods: item.implicitMods,
          explicit_mods: item.explicitMods,
          crafted_mods: item.craftedMods,
          crucible_mods: item.crucibleMods,
          shop_id: shop.thread_index,
        });
      });
      return {
        profile_name: shop.profile_name,
        thread_index: shop.thread_index,
      };
    });

    await db.transaction(async (trx) => {
      await trx.insert(catalog).values(shopsToInsert).onConflictDoNothing();
      await trx.insert(items).values(itemsToInsert).onConflictDoNothing();
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getShop() {
  return db.select().from(catalog);
}