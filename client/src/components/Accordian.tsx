import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const AccordionsContext = createContext(true);

// generic accordion that hides/shows child components
export const Accordion = ({
  children,
  title = "",
}: {
  title?: string;
  children: ReactNode;
}) => {
  const context = useContext(AccordionsContext);
  const [open, setOpen] = useState(context);

  useEffect(() => {
    context === true ? setOpen(true) : setOpen(false);
  }, [context]);

  return (
    <div className="group" onClick={() => setOpen(!open)}>
      <button
        aria-label="Open-Accordion"
        className={`w-full top-0 border-b border-secondary pb-1 group-hover:border-accent transition duration-150`}
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
      <div className={`text-sm py-5 ${!open && "hidden"} `}>{children}</div>
    </div>
  );
};
