import { ChangeEvent, KeyboardEvent, useState } from "react";

export function Filter({
  filters,
  setFilters,
}: {
  filters: string[];
  setFilters: (filters: string[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const addFilter = () => setIsEditing(true);

  const handleInputBlur = () => {
    if (inputValue) {
      setFilters([...filters, inputValue]);
      setInputValue("");
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const handleFilterChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFilters = [...filters];
    newFilters[index] = e.target.value;
    setFilters(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    console.log(newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="p-3 w-full text-text text-sm text-left space-y-2 overflow-y-auto h-full pb-9">
      {filters.map((filter, index) => (
        <div className="flex hover:shadow-primary shadow-sm transition-shadow" key={index}>
          <input
            className="outline-none focus:ring-1 ring-primary bg-secondary border-l-4 border-primary py-1 px-3 w-20 lg:w-full"
            value={filter}
            onChange={(event) => handleFilterChange(index, event)}
          />
          <button
            className="bg-accent transition hover:bg-red-900"
            onClick={() => handleRemoveFilter(index)}
          >
            <svg
              className="h-5 w-5"
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
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          onBlur={() => handleInputBlur()}
          onKeyDown={(e) => handleKeyDown(e)}
          autoFocus
          className="outline-none bg-secondary py-1 px-3 w-full"
        />
      ) : (
        <button onClick={addFilter} className="w-full">
          <p className="text-center bg-accent hover:bg-secondary py-1 px-3 transition">
            + Add Filter
          </p>
        </button>
      )}
    </div>
  );
}
