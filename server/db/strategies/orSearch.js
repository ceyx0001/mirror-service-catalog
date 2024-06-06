export async function getFilteredItems(filters) {
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
        mods: { columns: { item_id: false } },
        catalog: { columns: { views: false } },
      },
    });

    return Array.from(mapItemsToShop(result));
  } catch (error) {
    console.log(error);
  }
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
