import { useState } from "react";
import { Filter } from "./Filter";

export type Filters = {
  modFilters: Map<string, string>;
  baseFilters: Map<string, string>;
  titleFilters: Map<string, string>;
};

// search handler
export function Search({
  setSearchUrl,
}: {
  setSearchUrl: (url: URL | null) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    modFilters: new Map(),
    baseFilters: new Map(),
    titleFilters: new Map(),
  });

  function setFilter(filterType: keyof Filters, newFilters: Map<string,string>) {
    setFilters((prevState: Filters) => ({
      ...prevState,
      [filterType]: newFilters,
    }));
  }

  function getFilteredCatalog() {
    // refactors filter strings to URL query parameters
    function addQuery(url: URL, filterKey: string, filters: string[]) {
      filters.forEach((filter) => {
        if (filter) {
          url.searchParams.append(filterKey, filter);
        }
      });
    }

    const url = new URL(`${import.meta.env.VITE_API_URL}/items/filter`);
    if (filters.modFilters.size > 0) {
      addQuery(url, "mod", Array.from(filters.modFilters.values()));
    }

    if (filters.baseFilters.size > 0) {
      addQuery(url, "base", Array.from(filters.baseFilters.values()));
    }

    if (filters.titleFilters.size > 0) {
      addQuery(url, "title", Array.from(filters.titleFilters.values()));
    }

    if (url.searchParams.toString() !== "") {
      setSearchUrl(url);
    } else {
      setSearchUrl(null);
    }
  }

  return (
    <div className="flex flex-col items-center lg:w-[16rem] h-[90vh]">
      <button
        type="button"
        aria-label="Search"
        className="text-text bg-secondary flex items-center justify-center w-40 hover:bg-accent relative transition mb-8 p-1"
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
