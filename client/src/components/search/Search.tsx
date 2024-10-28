import { useEffect, useMemo, useState } from "react";
import { Filter } from "./Filter";
import { Cursor } from "../../hooks/useQuery";

export type Filters = {
  modFilters: Map<string, string>;
  baseFilters: Map<string, string>;
  titleFilters: Map<string, string>;
};

// search handler
export function Search({
  cursor,
  setQueryUrl,
}: {
  cursor: Cursor;
  setQueryUrl: (newUrl: URL, append: boolean) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    modFilters: new Map(),
    baseFilters: new Map(),
    titleFilters: new Map(),
  });

  // Initial URL
  const initialUrl = useMemo(
    () => new URL(`${import.meta.env.VITE_API_URL}/items/filter`),
    []
  );

  const [url, setUrl] = useState(() => initialUrl);

  useEffect(() => {
    url.searchParams.set("threadIndex", cursor.threadIndex);
    url.searchParams.set("limit", cursor.limit);
  }, [cursor, url]);

  function setFilter(
    filterType: keyof Filters,
    newFilters: Map<string, string>
  ) {
    setFilters((prevState: Filters) => ({
      ...prevState,
      [filterType]: newFilters,
    }));
  }

  function getFilteredCatalog() {
    // Reset the URL to the initial state
    setUrl(new URL(initialUrl.toString()));
    let search = false;

    function addQuery(url: URL, filterKey: string, urlFilters: string[]) {
      if (urlFilters.length === 0) {
        url.searchParams.delete(filterKey);
      } else {
        urlFilters.forEach((filter) => {
          if (filter) {
            if (
              !url.searchParams.has(filterKey) ||
              url.searchParams.get(filterKey) !== filter
            ) {
              url.searchParams.set(filterKey, filter);
            }
          }
        });
        search = true;
      }
    }

    addQuery(url, "mod", Array.from(filters.modFilters.values()));
    addQuery(url, "base", Array.from(filters.baseFilters.values()));
    addQuery(url, "title", Array.from(filters.titleFilters.values()));

    if (search) {
      url.searchParams.set("threadIndex", "");
      setQueryUrl(url, false);
    }
  }

  return (
    <div className="flex flex-col items-center w-[15rem] lg:w-[16rem] h-[90vh]">
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
