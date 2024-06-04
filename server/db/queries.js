import { db } from "../app.js";
import { catalog } from "./schemas/catalogSchema.js";
import { items } from "./schemas/itemsSchema.js";
import { mods } from "./schemas/modsSchema.js";
import {
  desc,
  sql,
  inArray,
  ilike,
  arrayContains,
  or,
  and,
  eq,
  count,
  countDistinct,
  gte,
  arrayOverlaps,
} from "drizzle-orm";

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

function addDupes(str, count) {
  const val = parseInt(str.split("%")[0].split().pop());
  const newVal = val * (count + 1);
  return str.replace(val, newVal);
}

function groupMods(mods) {
  const modsMap = new Map();
  for (const mod of mods) {
    const key = mod.type;
    if (mod.dupes) {
      mod.mod = addDupes(mod.mod, mod.dupes);
    }
    if (modsMap.get(key)) {
      modsMap.get(key).push(mod.mod);
    } else {
      modsMap.set(key, [mod.mod]);
    }
  }
  return Object.fromEntries(modsMap);
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
    console.log(error);
  }
}

function mapItemsToShop(items) {
  let shopsMap = new Map();
  for (const item of items) {
    const key = item.catalog.profile_name;
    const { catalog, ...itemDetails } = item;
    const modsGroup = groupMods(itemDetails.mods);
    if (shopsMap.get(key)) {
      shopsMap.get(key).items.push({ ...itemDetails, mods: modsGroup });
    } else {
      shopsMap.set(key, {
        ...catalog,
        items: [{ ...itemDetails, mods: modsGroup }],
      });
    }
  }
  return shopsMap.values();
}

export async function getFilteredItems(filters) {
  try {
    let table = null;

    if (filters.length > 1) {
      table = db.$with("table").as(
        db
          .select()
          .from(mods)
          .where(
            sql`${mods.item_id} IN (SELECT item_id FROM mods WHERE mod ILIKE ${
              "%" + filters.pop() + "%"
            })`
          )
      );

      while (filters.length > 1) {
        table = db.$with("table").as(
          db
            .with(table)
            .select()
            .from(table)
            .where(
              sql`${
                table.item_id
              } IN (SELECT item_id FROM mods WHERE mod ILIKE ${
                "%" + filters.pop() + "%"
              })`
            )
        );
      }

      table = db
        .with(table)
        .select({ item_id: table.item_id })
        .from(table)
        .where(
          sql`${table.item_id} IN (SELECT item_id FROM mods WHERE mod ILIKE ${
            "%" + filters.pop() + "%"
          })`
        );
    } else {
      table = db
        .select({ item_id: mods.item_id })
        .from(mods)
        .where(ilike(mods.mod, `%${filters[0]}%`));
    }

    const result = await db.query.items.findMany({
      where: inArray(items.item_id, table),
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
