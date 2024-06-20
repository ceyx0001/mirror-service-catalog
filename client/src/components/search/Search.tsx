import { useState } from "react";
import { ShopType } from "../Shop";
import { Filter } from "./Filter";

export type Filters = {
  modFilters: string[];
  baseFilters: string[];
  titleFilters: string[];
};

type ERROR = { message: string; timeout: number };
type DATA = ERROR | ShopType[];

// refactors filter strings to URL query parameters
function addQuery(query: string, type: string, filters: string[]) {
  for (const filter of filters) {
    query = query + "&" + type + "=" + filter;
  }
  return query;
}

// search handler 
export function Search({
  setFilteredCatalog,
  setTimeout,
}: {
  setFilteredCatalog: (catalog: ShopType[]) => void;
  setTimeout: (duration: number) => void;
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
    try {
      if (JSON.stringify(filters) === JSON.stringify(prevFilters)) {
        return;
      }

      setFiltering(true);

      try {
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
          const data: DATA = await response.json();
          if (data instanceof Array) {
            setFilteredCatalog(data);
          } else {
            if (response.status === 429) {
              setTimeout(data.timeout);
            }
          }
        } else {
          setFilteredCatalog([]);
        }
        setprevFilters(filters);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
      setFiltering(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center lg:w-[16rem] h-[90vh]">
      {filtering ? (
        <button
          type="button"
          aria-label="Search-Loading"
          className=" text-text bg-secondary flex items-center justify-center w-32 lg:w-40 relative mb-8 p-1"
          disabled
        >
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-black" />
        </button>
      ) : (
        <button
          type="button"
          aria-label="Search"
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
