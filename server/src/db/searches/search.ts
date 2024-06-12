import * as andSearch from "./andSearch";

function addDupes(str, count) {
  const val = parseInt(str.split("%")[0].split().pop());
  const newVal = val * (count + 1);
  return str.replace(val, newVal);
}

export function groupMods(mods) {
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

export function mapItemsToShop(items) {
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

export async function filterItems(filters) {
  try {
    let table = null;
    table = andSearch.getItems(filters);
    return table;
  } catch (error) {
    console.log(error);
  }
}
