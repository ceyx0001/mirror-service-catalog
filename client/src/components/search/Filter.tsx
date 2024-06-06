import { FocusEvent, KeyboardEvent } from "react";
import { Accordion } from "./Accordian";

export function Filter({
  filters,
  setFilters,
}: {
  filters: string[];
  setFilters: React.Dispatch<string[]>;
}) {
  function handleBlur(index: number, e: FocusEvent<HTMLInputElement, Element>) {
    const newFilters = [...filters];
    newFilters[index] = e.currentTarget.value;
    setFilters(newFilters);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  function handleNewAccordionFilter() {
    setFilters([...filters, ""]);
  }

  function handleRemoveFilter(index: number) {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  }

  return (
    <div className="text-text grid w-full">
      <Accordion title={"Mods"}>
        <div className="flex flex-col items-center">
          <div className="space-y-2">
            {filters.map((_filter, index) => (
              <div key={index} className="flex w-28 lg:w-full">
                <input
                  className="bg-secondary outline-none px-3 p-1 hover:shadow-primary shadow-sm transition-shadow"
                  onBlur={(e) => handleBlur(index, e)}
                  onKeyDown={(e) => handleKeyDown(e)}
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
            className="text-base bg-accent text-center p-1 px-3 hover:bg-secondary transition-colors mt-6"
          >
            + Add Filter
          </button>
        </div>
      </Accordion>
    </div>
  );
}
