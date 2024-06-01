import { db } from "../app.js";
import shop from "../controllers/shopController.js";
import { catalog, items } from "./schema.js";
import { desc, sql, inArray, getTableColumns } from "drizzle-orm";

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
            shop_id: shop.thread_index,
          };
          itemsToInsert.set(item.id, db_item);
        }
      });
      return {
        profile_name: shop.profile_name,
        thread_index: shop.thread_index,
        views: shop.views,
        title: shop.title,
      };
    });

    await db
      .insert(catalog)
      .values(shopsToInsert)
      .onConflictDoUpdate({
        target: catalog.profile_name,
        set: {
          thread_index: sql`EXCLUDED.thread_index`,
          views: sql`EXCLUDED.views`,
          title: sql`EXCLUDED.title`,
        },
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
          shop_id: sql`EXCLUDED.shop_id`,
        },
      });
  } catch (error) {
    console.log(error);
  }
}

export async function someThreads(start, end) {
  return await db
    .select({
      profileName: catalog.profile_name,
      threadIndex: catalog.thread_index,
      title: catalog.title,
    })
    .from(catalog)
    .orderBy(desc(catalog.views))
    .offset(start)
    .limit(end);
}

export async function allThreads() {
  return await db.select().from(catalog);
}

export async function someShops(start, end) {
  try {
    const threads = await someThreads(start, end);
    const threadsMap = new Map();
    for (const thread of threads) {
      threadsMap.set(thread.threadIndex, thread);
    }
    const threadIndexes = [...threadsMap.keys()];
    const shopItems = await db
      .select()
      .from(items)
      .where(inArray(items.shop_id, threadIndexes));

    let shopsMap = new Map();
    for (const item of shopItems) {
      const shop = shopsMap.get(item.shop_id);
      const { shop_id, ...rest } = item;
      if (shop) {
        shop.items.push(rest);
      } else {
        const shopItems = [rest];
        shopsMap.set(item.shop_id, {
          profileName: threadsMap.get(item.shop_id).profileName,
          threadIndex: item.shop_id,
          title: threadsMap.get(item.shop_id).title,
          items: shopItems,
        });
      }
    }

    return [...shopsMap.values()];
  } catch (error) {
    console.log(error);
  }
}
