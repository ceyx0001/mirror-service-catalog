import { items } from "../../schemas/itemsSchema";
import { db } from "../../../app";
import { Filters, mapItemsToShop } from "../search";
import { inArray } from "drizzle-orm";
import * as andStrategy from "./andStrategies";

export async function getItems(filters: Filters) {
  try {
    let filtersArray = [
      { filter: filters.titleFilters, strategy: andStrategy.andTitleFilter },
      { filter: filters.baseFilters, strategy: andStrategy.andBaseFilter },
      { filter: filters.modFilters, strategy: andStrategy.andModFilter },
    ];

    let filteredTable;
    for (let filterObj of filtersArray) {
      filteredTable = await filterObj.strategy.apply(
        filterObj.filter,
        filteredTable
      );
    }

    if (filteredTable && filteredTable.length > 0) {
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

    return [];
  } catch (error) {
    return error;
  }
}
