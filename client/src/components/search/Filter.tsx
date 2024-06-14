import { FocusEvent, KeyboardEvent } from "react";
import { Accordion } from "../Accordian";
import { Filters } from "./Search";

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
    newFilters[index] = e.currentTarget.value;
    setFilters(filterKey, newFilters);
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

  return (
    <div className="text-text pl-2 pb-2">
      <Accordion title={title} defaultOpen={false}>
        <div className="flex flex-col items-center">
          <div className="space-y-3 mb-2">
            {filters.map((_filter, index) => (
              <div key={index} className="flex mt-4">
                <input
                  className="bg-secondary outline-none hover:shadow-primary shadow-sm transition-shadow px-1"
                  onBlur={(e) => handleBlur(index, e)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  autoFocus={index === filters.length - 1}
                />
                <button
                  type="button"
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
          </div>
          <button
            type="button"
            onClick={() => handleNewAccordionFilter()}
            className="text-base bg-secondary text-center px-3 hover:bg-accent transition-colors my-2 mb-4"
          >
            + Add Filter
          </button>
        </div>
      </Accordion>
    </div>
  );
}