import { db } from "../app.js";
import { catalog } from "./schemas/catalogSchema.js";
import { items } from "./schemas/itemsSchema.js";
import { mods } from "./schemas/modsSchema.js";
import { desc, sql, inArray, ilike, or } from "drizzle-orm";

function buildConflictUpdateSet(table) {
  const columns = Object.keys(table);
  return columns.reduce((acc, column) => {
    acc[column] = sql.raw(`excluded.${column}`);
    return acc;
  }, {});
}

function setMods(map, itemId, modType, mods) {
  if (mods) {
    for (const text of mods) {
      const key = itemId + modType + text;
      if (map.get(key)) {
        const oldMod = map.get(key);
        oldMod.dupes += 1;
        map.set(key, oldMod);
      } else {
        map.set(key, {
          item_id: itemId,
          mod: text,
          type: modType,
          dupes: null,
        });
      }
    }
  }
}

function aggregateMods(item, map) {
  for (const key in item) {
    if (item[key]) {
      switch (key) {
        case "enchantMods":
          setMods(map, item.id, "enchant", item[key]);
          break;
        case "implicitMods":
          setMods(map, item.id, "implicit", item[key]);
          break;
        case "explicitMods":
          setMods(map, item.id, "explicit", item[key]);
          break;
        case "fracturedMods":
          setMods(map, item.id, "fractured", item[key]);
          break;
        case "craftedMods":
          setMods(map, item.id, "crafted", item[key]);
          break;
        case "crucibleMods":
          setMods(map, item.id, "crucible", item[key]);
          break;
        default:
      }
    }
  }
}

export async function updateCatalog(shops) {
  const itemsToInsert = new Map();
  const modsToInsert = new Map();
  try {
    const shopsToInsert = shops.map((shop) => {
      shop.items.forEach((item) => {
        if (!itemsToInsert.has(item.id)) {
          const db_item = {
            name: item.name,
            base_type: item.baseType,
            icon: item.icon,
            quality: item.quality,
            item_id: item.id,
            shop_id: shop.thread_index,
          };
          itemsToInsert.set(item.id, db_item);
          aggregateMods(item, modsToInsert);
        }
      });
      return {
        profile_name: shop.profile_name,
        thread_index: shop.thread_index,
        views: shop.views,
        title: shop.title,
      };
    });

    const shopsPromise = db
      .insert(catalog)
      .values(shopsToInsert)
      .onConflictDoUpdate({
        target: catalog.profile_name,
        set: buildConflictUpdateSet(catalog),
      });

    const uniqueItemsToInsert = Array.from(itemsToInsert.values());
    const itemsPromise = db
      .insert(items)
      .values(uniqueItemsToInsert)
      .onConflictDoUpdate({
        target: items.item_id,
        set: buildConflictUpdateSet(items),
      });

    const uniqueModsToInsert = Array.from(modsToInsert.values());
    const itemIds = uniqueModsToInsert.map((mod) => mod.item_id);
    await db.delete(mods).where(inArray(mods.item_id, itemIds));

    const modsPromise = db
      .insert(mods)
      .values(uniqueModsToInsert)
      .onConflictDoNothing();

    await Promise.all([shopsPromise, itemsPromise, modsPromise]);
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

function shops(items) {
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

    return shops(shopItems);
  } catch (error) {
    console.log(error);
  }
}

export async function filterItems(filters) {
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
        mods: true,
        catalog: { columns: { views: false } },
      },
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}
