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

const query = sql`
    WITH mod_groups AS (
      SELECT item_id, array_agg(mod) AS mods
      FROM mods
      GROUP BY item_id
    )
    SELECT *
    FROM mod_groups
    WHERE mods @> ARRAY['Non-Aura Vaal Skills require 40% reduced Souls Per Use']
    `;
const result = await db.execute(query);
