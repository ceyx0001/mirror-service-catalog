import { useState } from "react";
import { Filter } from "./Filter";
import { ShopType } from "../Shop";

export function Search({
  setCatalog,
}: {
  setCatalog: (catalog: ShopType[]) => void;
}) {
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function filterShops() {
    setLoading(true);
    const filtersString = filters.join("&");
    const url = `http://localhost:3000/api/items/filter?${filtersString}`;
    const response = await fetch(url);
    const shops: ShopType[] = await response.json();
    setCatalog(shops);
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
          disabled={filters.length === 0}
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
      <Filter filters={filters} setFilters={setFilters} />
    </div>
  );
}
