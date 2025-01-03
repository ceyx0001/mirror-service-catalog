import { ReactNode, useState } from "react";

// generic accordion that hides/shows child components
export const Accordion = ({
  children,
  title = "",
  renderAsOpen = true,
  handleClick = () => {},
  animate = false,
}: {
  title?: string;
  children: ReactNode;
  renderAsOpen?: boolean;
  handleClick?: (openState: boolean) => void;
  animate?: boolean;
}) => {
  const [open, setOpen] = useState(renderAsOpen);
  return (
    <div
      className="group cursor-pointer"
      onClick={() => {
        setOpen(!open);
        handleClick(open);
      }}
    >
      <button
        aria-label="Open-Accordion"
        className={`w-full top-0 border-b border-secondary pb-1 group-hover:border-accent transition-colors duration-150`}
      >
        {title !== "" ? (
          <div className="justify-center w-full relative">
            <span className="text-primary group-hover:text-text transition-colors duration-150">
              {title}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`h-5 w-5 text-primary absolute ml-auto right-0 top-0 transition-transform ${
                open && "rotate-180"
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
            className={`h-5 w-5 text-primary self-center transition-transform ${
              open && "rotate-180"
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
      {animate ? (
        <div
          className={`text-sm grid transition-all ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className={`overflow-hidden`}>{children}</div>
        </div>
      ) : (
        <div className={`text-sm ${!open && "hidden"}`}>{children}</div>
      )}
    </div>
  );
};
