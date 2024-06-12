import { useState } from "react";
import { Filter } from "./Filter";
import { ShopType } from "../Shop";

export type Filters = {
  modFilters: string[];
  baseFilters: string[];
  titleFilters: string[];
};

export function Search({
  setCatalog,
  setPaging,
}: {
  setCatalog: (catalog: ShopType[]) => void;
  setPaging: ({ offset, limit }: { offset: number; limit: number }) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    modFilters: [],
    baseFilters: [],
    titleFilters: [],
  });
  const [loading, setLoading] = useState(false);

  function setFilter(filterType: keyof Filters, newFilters: string[]) {
    setFilters((prevState: Filters) => ({
      ...prevState,
      [filterType]: newFilters,
    }));
  }

  async function filterShops() {
    setLoading(true);
    if (Object.keys(filters).length > 0) {
      const filtersString = filters.join("&");
      const url = `http://localhost:3000/api/items/filter?${filtersString}`;
      const response = await fetch(url);
      const shops: ShopType[] = await response.json();
      setCatalog(shops);
    } else {
      setPaging({ offset: 1, limit: 10 });
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center space-y-5 lg:w-[266px] h-[82vh]">
      {loading ? (
        <button
          className="py-1 text-text bg-accent flex items-center justify-center w-32 lg:w-40 relative"
          disabled
        >
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-black" />
        </button>
      ) : (
        <button
          className="py-1 text-text bg-accent flex items-center justify-center w-32 lg:w-40 hover:bg-secondary relative transition cursor-pointer"
          onClick={filterShops}
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
      <Filter
        filters={filters.baseFilters}
        setFilters={setFilter}
        title="Base"
        filterKey="baseFilters"
      />
      <Filter
        filters={filters.modFilters}
        setFilters={setFilter}
        title="Mods"
        filterKey="modFilters"
      />
      <Filter
        filters={filters.titleFilters}
        setFilters={setFilter}
        title="Title"
        filterKey="titleFilters"
      />
    </div>
  );
}
