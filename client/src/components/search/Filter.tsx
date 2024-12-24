import { Accordion } from "../Accordian";
import { Filters } from "./Search";
import { nanoid } from "nanoid";

// Filtering list used for searching text on items
export function Filter({
  filters,
  setFilters,
  title,
  filterKey,
}: {
  filters: Map<string, string>;
  setFilters: (
    filterType: keyof Filters,
    newFilters: Map<string, string>
  ) => void;
  title: string;
  filterKey: keyof Filters;
}) {
  function handleRemoveFilter(key: string) {
    filters.delete(key);
    setFilters(filterKey, filters);
  }

  return (
    <div className="text-text p-2 pb-2">
      <Accordion title={title} animate={true}>
        <div className="flex flex-col items-center pt-5 pb-5">
          {Array.from(filters).map(([key, filter]) => (
            <div
              key={key}
              className="flex mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                data-test="search-filter"
                aria-label={`Filter-${filter}`}
                type="text"
                className="bg-secondary outline-none hover:shadow-primary shadow-sm transition-shadow px-1 p-1"
                onChange={(e) => {
                  filters.set(key, e.target.value);
                  setFilters(filterKey, filters);
                }}
                value={filter}
                autoFocus
              />
              <button
                type="button"
                aria-label="Close-Filter"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFilter(key);
                }}
                className="bg-accent transition hover:bg-red-900"
              >
                <svg
                  className="w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            data-test="add-filter-button"
            type="button"
            aria-label="Add-Filter"
            onClick={(e) => {
              e.stopPropagation();
              filters.set(nanoid(), "");
              setFilters(filterKey, filters);
            }}
            className="text-base bg-secondary text-center p-1 px-3 hover:bg-accent transition-colors"
          >
            + Add Filter
          </button>
        </div>
      </Accordion>
    </div>
  );
}
