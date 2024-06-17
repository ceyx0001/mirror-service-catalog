import { db } from "../../../app";
import { PgTable, PgTableWithColumns } from "drizzle-orm/pg-core";
import { TableConfig, inArray, sql } from "drizzle-orm";
import { catalog, SelectCatalog } from "../../schemas/catalogSchema";
import { items, SelectItem } from "../../schemas/itemsSchema";
import { mods } from "../../schemas/modsSchema";

type Strategy = {
  apply(filter: string[], table: any): Promise<[] | Error>;
};

async function applyFilters(
  filters: string[],
  parentTable: PgTable,
  key: string,
  parentTableName: string,
  columns: string[]
): Promise<[] | Error> {
  try {
    let result: [] | null = null;
    if (filters.length > 0) {
      const conditions = columns.map(
        (column) => sql`${sql.raw(column)} ILIKE ${sql.placeholder("filter")}`
      );
      const combinedConditions = sql.join(conditions, sql` OR `);
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

      let filteredTable = await preparedQuery(parentTable).execute({
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

      result = filteredTable;
    }

    return result;
  } catch (error) {
    return error;
  }
}

export const andTitleFilter: Strategy = {
  apply: async (filter: string[], table = catalog) => {
    if (!filter) {
      return null;
    }
    return await applyFilters(filter, table, "thread_index", "catalog", [
      "title",
    ]);
  },
};

export const andBaseFilter: Strategy = {
  apply: async (filter: string[], table: SelectCatalog[]) => {
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
};

export const andModFilter: Strategy = {
  apply: async (filter: string[], table: SelectItem[]) => {
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

    return await applyFilters(filter, filteredMods, "item_id", "mods", ["mod"]);
  },
};
