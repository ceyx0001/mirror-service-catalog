import { catalog, SelectCatalog } from "../schemas/catalogSchema";
import { items, SelectItem } from "../schemas/itemsSchema";
import { mods } from "../schemas/modsSchema";
import { db } from "../../app";
import { Filters, mapItemsToShop } from "./search";
import { sql, inArray, or } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

async function applyFilters(
  filters: string[],
  parentTable: PgTable,
  key: string,
  parentTableName: string,
  columns: string[]
) {
  try {
    let filteredTable = null;
    if (filters.length > 0) {
      const conditions = columns.map(
        (column) => sql`${sql.raw(column)} ILIKE ${sql.placeholder("filter")}`
      );
      const combinedConditions = sql.join(conditions, sql` OR `); // Combine with OR
      const preparedQuery = (table: PgTable) =>
        db
          .select()
          .from(table)
          .where(
            sql`${table[key]} IN (SELECT ${sql.raw(key)} FROM ${sql.raw(
              parentTableName
            )} WHERE ${combinedConditions})`
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

export async function getItems(filters: Filters) {
  try {
    let filtersArray = [
      {
        filter: filters.titleFilters,
        applyFilter: async (filter: string[], table = catalog) => {
          if (!filter) {
            return null;
          }
          return await applyFilters(filter, table, "thread_index", "catalog", [
            "title",
          ]);
        },
      },
      {
        filter: filters.baseFilters,
        applyFilter: async (filter: string[], table: SelectCatalog[]) => {
          let filteredBase: PgTable;
          if (table && table.length > 0) {
            const threadIndexes = table.map((shop) => shop.thread_index);
            filteredBase = await db
              .select()
              .from(items)
              .where(inArray(items.shop_id, threadIndexes))
              .as("filteredBase");
          } else {
            filteredBase = items;
          }

          if (!filter) {
            return await db.select().from(filteredBase);
          }

          return await applyFilters(filter, filteredBase, "item_id", "items", [
            "base_type",
            "name",
            "quality",
          ]);
        },
      },
      {
        filter: filters.modFilters,
        applyFilter: async (filter: string[], table: SelectItem[]) => {
          let filteredMods: PgTable;
          if (table && table.length > 0) {
            const itemIds = table.map((item) => item.item_id);
            filteredMods = await db
              .select()
              .from(mods)
              .where(inArray(mods.item_id, itemIds))
              .as("filteredMods");
          } else {
            filteredMods = mods;
          }

          if (!filter) {
            return await db.select().from(filteredMods);
          }

          return await applyFilters(filter, filteredMods, "item_id", "mods", [
            "mod",
          ]);
        },
      },
    ];

    let filteredTable;
    for (let filterObj of filtersArray) {
      filteredTable = await filterObj.applyFilter(
        filterObj.filter,
        filteredTable
      );
    }

    if (filteredTable) {
      const itemIdSet = new Set<string>();
      filteredTable.map((mod: { item_id: string }) =>
        itemIdSet.add(mod.item_id)
      );
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
