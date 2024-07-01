import { FocusEvent, KeyboardEvent } from "react";
import { Accordion } from "../Accordian";
import { Filters } from "./Search";

// Filtering list used for searching text on items
export function Filter({
  filters,
  setFilters,
  title,
  filterKey,
}: {
  filters: string[];
  setFilters: (filterType: keyof Filters, newFilters: string[]) => void;
  title: string;
  filterKey: keyof Filters;
}) {
  function handleBlur(index: number, e: FocusEvent<HTMLInputElement, Element>) {
    const newFilters = [...filters];
    if (e.currentTarget.value !== "") {
      newFilters[index] = e.currentTarget.value;
      setFilters(filterKey, newFilters);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  function handleNewAccordionFilter() {
    setFilters(filterKey, [...filters, ""]);
  }

  function handleRemoveFilter(index: number) {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(filterKey, newFilters);
  }

  function blockClick(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  return (
    <div className="text-text pl-2 pb-2">
      <Accordion title={title}>
        <div className="flex flex-col items-center">
          {filters.map((_filter, index) => (
            <div key={index} className="flex mb-3" onClick={blockClick}>
              <input
                aria-label={`Filter-${index}`}
                className="bg-secondary outline-none hover:shadow-primary shadow-sm transition-shadow px-1 p-1"
                onBlur={(e) => handleBlur(index, e)}
                onKeyDown={(e) => handleKeyDown(e)}
                autoFocus={index === filters.length - 1}
              />
              <button
                type="button"
                aria-label="Close-Filter"
                onClick={() => handleRemoveFilter(index)}
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
            type="button"
            aria-label="Add-Filter"
            onClick={(e) => {
              blockClick(e);
              handleNewAccordionFilter();
            }}
            className="text-base bg-secondary text-center px-3 hover:bg-accent transition-colors"
          >
            + Add Filter
          </button>
        </div>
      </Accordion>
    </div>
  );
}
