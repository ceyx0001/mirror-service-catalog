import { catalog } from "../schemas/catalogSchema";
import { items } from "../schemas/itemsSchema";
import { mods } from "../schemas/modsSchema";
import { db } from "../../app";
import { mapItemsToShop } from "./search";
import { sql, inArray } from "drizzle-orm";

async function applyFilters(
  filters,
  parentTable,
  key,
  parentTableName,
  column
) {
  try {
    let filteredTable = null;
    if (filters.length > 0) {
      const preparedQuery = (table) =>
        db
          .select()
          .from(table)
          .where(
            sql`${table[key]} IN (SELECT ${sql.raw(key)} FROM ${sql.raw(
              parentTableName
            )} WHERE ${sql.raw(column)} ILIKE ${sql.placeholder("filter")})`
          )
          .prepare();

      filteredTable = await preparedQuery(parentTable).execute({
        filter: `%${filters.pop()}%`,
      });

      while (filters.length > 0) {
        const next = await preparedQuery(filteredTable).execute({
          filter: `%${filters.pop()}%`,
        });

        if (!next) {
          throw new Error("Subsequent query returned no results.");
        }

        filteredTable = next;
      }
    }

    return filteredTable;
  } catch (error) {
    console.log(error);
  }
}

export async function getItems(filters) {
  try {
    let filtersArray = [
      {
        filter: filters.titleFilters,
        applyFilter: async (filter, table = catalog) => {
          return await applyFilters(
            filter,
            table,
            "thread_index",
            "catalog",
            "title"
          );
        },
      },
      {
        filter: filters.baseFilters,
        applyFilter: async (filter, table) => {
          let filteredTitle;
          if (table && table !== items) {
            const threadIndexes = table.map((shop) => shop.thread_index);
            filteredTitle = db
              .select()
              .from(items)
              .where(inArray(items.shop_id, threadIndexes))
              .as("filteredTitle");
          } else {
            filteredTitle = items;
          }

          return await applyFilters(
            filter,
            filteredTitle,
            "item_id",
            "items",
            "base_type"
          );
        },
      },
      {
        filter: filters.modFilters,
        applyFilter: async (filter, table) => {
          let filteredMods;
          if (table && table !== mods) {
            const itemIds = table.map((item) => item.item_id);
            filteredMods = db
              .select()
              .from(mods)
              .where(inArray(mods.item_id, itemIds))
              .as("filteredMods");
          } else {
            filteredMods = mods;
          }

          return await applyFilters(
            filter,
            filteredMods,
            "item_id",
            "mods",
            "mod"
          );
        },
      },
    ];

    let filteredTable;
    for (let filterObj of filtersArray) {
      if (filterObj.filter) {
        filteredTable = await filterObj.applyFilter(
          filterObj.filter,
          filteredTable
        );
      }
    }

    if (filteredTable) {
      const itemIdSet = new Set<string>();
      filteredTable.map((mod) => itemIdSet.add(mod.item_id));
      const itemIds: string[] = Array.from(itemIdSet);
      const result = await db.query.items.findMany({
        where: inArray(items.item_id, itemIds),
        columns: { shop_id: false },
        with: {
          mods: { columns: { item_id: false } },
          catalog: { columns: { views: false } },
        },
      });
      return Array.from(mapItemsToShop(result));
    }
    return "No items found";
  } catch (error) {
    console.log(error);
  }
}
