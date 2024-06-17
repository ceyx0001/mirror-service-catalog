import { useState } from "react";
import { ShopType } from "../Shop";
import { Filter } from "./Filter";

export type Filters = {
  modFilters: string[];
  baseFilters: string[];
  titleFilters: string[];
};

function addQuery(query: string, type: string, filters: string[]) {
  for (const filter of filters) {
    query = query + "&" + type + "=" + filter;
  }
  return query;
}

export function Search({
  setFilteredCatalog,
}: {
  setFilteredCatalog: (catalog: ShopType[]) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    modFilters: [],
    baseFilters: [],
    titleFilters: [],
  });
  const [prevFilters, setprevFilters] = useState<Filters>({
    modFilters: [],
    baseFilters: [],
    titleFilters: [],
  });
  const [filtering, setFiltering] = useState(false);

  function setFilter(filterType: keyof Filters, newFilters: string[]) {
    setFilters((prevState: Filters) => ({
      ...prevState,
      [filterType]: newFilters,
    }));
  }

  async function getFilteredCatalog() {
    if (JSON.stringify(filters) === JSON.stringify(prevFilters)) {
      return;
    }

    setFiltering(true);
    console.log(filters);
    if (
      filters.modFilters.length > 0 ||
      filters.baseFilters.length > 0 ||
      filters.titleFilters.length > 0
    ) {
      let url = `http://localhost:3000/api/items/filter?`;
      url = addQuery(url, "title", filters.titleFilters);
      url = addQuery(url, "base", filters.baseFilters);
      url = addQuery(url, "mod", filters.modFilters);
      const response = await fetch(url);
      const shops: ShopType[] = await response.json();
      setFilteredCatalog(shops);
    } else {
      setFilteredCatalog([]);
    }
    setprevFilters(filters);
    setFiltering(false);
  }

  return (
    <div className="flex flex-col items-center lg:w-[16rem] h-[90vh]">
      {filtering ? (
        <button
          className=" text-text bg-secondary flex items-center justify-center w-32 lg:w-40 relative mb-8 p-1"
          disabled
        >
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-black" />
        </button>
      ) : (
        <button
          className="text-text bg-secondary flex items-center justify-center w-40 hover:bg-accent relative transition cursor-pointer mb-8 p-1"
          onClick={getFilteredCatalog}
        >
          Search
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5 text-text absolute right-4 hidden lg:block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      )}

      <div className="w-full overflow-y-auto gutter">
        <Filter
          filters={filters.baseFilters}
          setFilters={setFilter}
          title="Base"
          filterKey="baseFilters"
        />
      </div>
      <div className="w-full overflow-y-auto gutter">
        <Filter
          filters={filters.modFilters}
          setFilters={setFilter}
          title="Mods"
          filterKey="modFilters"
        />
      </div>
      <div className="w-full overflow-y-auto gutter">
        <Filter
          filters={filters.titleFilters}
          setFilters={setFilter}
          title="Title"
          filterKey="titleFilters"
        />
      </div>
    </div>
  );
}
