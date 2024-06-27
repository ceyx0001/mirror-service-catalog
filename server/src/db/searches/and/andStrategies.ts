import db from "../../db";
import { PgTable } from "drizzle-orm/pg-core";
import { ilike, inArray, or, sql } from "drizzle-orm";
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
    let condition = or(
      ...columns.map((column) =>
        ilike(parentTable[column], `%${filters.pop()}%`)
      )
    );
    let sq = db.$with("sq").as(db.select().from(parentTable).where(condition));

    for (let i = 0; i < filters.length; i++) {
      sq = db.$with("sq").as(
        db
          .with(sq)
          .select()
          .from(sq)
          .where(
            inArray(
              sq[key],
              db
                .select({ [key]: parentTable[key] })
                .from(parentTable)
                .where(
                  or(
                    ...columns.map((column) =>
                      ilike(parentTable[column], `%${filters[i]}%`)
                    )
                  )
                )
            )
          )
      );
    }

    const prepared = db.with(sq).select().from(sq).prepare();
    return await prepared.execute();
  } catch (error) {
    console.error(error);
  }
}

export const andTitleFilter: Strategy = {
  apply: async (filter: string[], table = catalog) => {
    if (!filter) {
      return null;
    }
    return await applyFilters(filter, table, "threadIndex", "catalog", [
      "title",
    ]);
  },
};

export const andBaseFilter: Strategy = {
  apply: async (filter: string[], table: SelectCatalog[]) => {
    let filteredBase: PgTable;
    if (table && table.length > 0) {
      const threadIndexes = table.map((shop) => shop.threadIndex);
      filteredBase = await db
        .select()
        .from(items)
        .where(inArray(items.shopId, threadIndexes))
        .as("filteredBase");
    } else {
      filteredBase = items;
    }

    if (!filter) {
      return await db.select().from(filteredBase);
    }

    return await applyFilters(filter, filteredBase, "itemId", "items", [
      "baseType",
      "name",
      "quality",
    ]);
  },
};

export const andModFilter: Strategy = {
  apply: async (filter: string[], table: SelectItem[]) => {
    let filteredMods: PgTable;
    if (table && table.length > 0) {
      const itemIds = table.map((item) => item.itemId);
      filteredMods = await db
        .select()
        .from(mods)
        .where(inArray(mods.itemId, itemIds))
        .as("filteredMods");
    } else {
      filteredMods = mods;
    }

    if (!filter) {
      return await db.select().from(filteredMods);
    }
    return await applyFilters(filter, filteredMods, "itemId", "mods", ["mod"]);
  },
};
