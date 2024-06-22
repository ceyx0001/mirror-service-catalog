import db from "./db";
import { catalog } from "./schemas/catalogSchema";
import { items } from "./schemas/itemsSchema";
import { mods } from "./schemas/modsSchema";
import { desc, sql, inArray } from "drizzle-orm";
import { filterItems, groupMods, Filters} from "./searches/search";

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

export async function getThreadsInRange(offset, limit) {
  return await db
    .select({
      profileName: catalog.profile_name,
      threadIndex: catalog.thread_index,
      title: catalog.title,
    })
    .from(catalog)
    .orderBy(desc(catalog.views))
    .offset(offset)
    .limit(limit);
}

export async function getAllThreads() {
  return await db.select().from(catalog);
}

export async function getShopsInRange(offset, limit) {
  try {
    const result = await db.query.catalog.findMany({
      columns: { views: false },
      with: {
        items: {
          columns: { shop_id: false },
          with: {
            mods: { columns: { item_id: false } },
          },
        },
      },
      offset: offset,
      limit: limit,
    });

    for (const shop of result) {
      for (const item of shop.items) {
        item.mods = groupMods(item.mods);
      }
    }

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getFilteredItems(filters: Filters) {
  return filterItems(filters);
}
