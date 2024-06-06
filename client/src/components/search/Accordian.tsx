import { ReactNode, useState } from "react";

export const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-accent py-3">
      <button className="w-full relative" onClick={() => setOpen(!open)}>
        <p className="">{title}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`w-6 h-6 absolute left-[70%] lg:left-[80%] top-0 text-primary ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`p-3 text-sm w-full flex justify-center ${
          open ? "" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
