import { ReactNode, useState } from "react";

export const Accordion = ({
  children,
  defaultOpen,
  title,
}: {
  title: string;
  children: ReactNode;
  defaultOpen: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="group">
      <button
        className={`w-full top-0 border-b group-hover:brightness-200 border-secondary group transition duration-300 pb-2`}
        onClick={() => setOpen(!open)}
      >
        {title !== "" ? (
          <div className="justify-center w-full relative">
            <span className="text-primary">{title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`h-5 w-5 text-primary absolute ml-auto right-0 top-0 ${
                open ? "rotate-180" : ""
              } 
          `}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-5 w-5 text-primary self-center ${
              open ? "rotate-180" : ""
            } 
          `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>
      <div className={`text-sm py-5 ${open ? "" : "hidden"}`}>{children}</div>
      <button
        className={`border-secondary group-hover:brightness-200 border-t h-8 w-full transition duration-300 ${
          open ? "" : "hidden"
        }`}
        onClick={() => setOpen(!open)}
      />
    </div>
  );
};
