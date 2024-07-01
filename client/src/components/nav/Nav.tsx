import { Contact } from "./Contact";
import { About } from "./About";
import icon from "../../assets/Mirror_of_Kalandra.png";
import { ReactNode } from "react";

// navigation bar
export function Nav({
  toggleSidebar,
  setToggleSidebar,
  children,
}: {
  toggleSidebar: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}) {
  return (
    <nav className="flex flex-row items-center fixed top-0 border-b-1 border-secondary/55 py-1 w-full bg-background z-20">
      <button
        type="button"
        aria-label="Navigation"
        className={`transition group outline-none mx-4 ${
          toggleSidebar ? "left-64" : "left-2"
        }`}
        onClick={() => setToggleSidebar((toggleSidebar) => !toggleSidebar)}
      >
        <div className="flex justify-end">
          <div className="inline-flex justify-center items-center rounded-full text-primary transition hover:bg-primary/20 p-1">
            <svg
              className="flex-shrink-0 size-8"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
            </svg>
          </div>
        </div>
      </button>
      <div className="flex flex-row items-center space-x-2 mr-5">
        <img className="w-7 h-7" src={icon} />
        <h1 className="font-bold inline w-52">Mirror Service Catalog</h1>
      </div>
      <div className="flex w-full ml-8">
        {children}
        <div className="flex ml-auto space-x-20 mr-14 place-items-center">
          <About />
          <Contact />
        </div>
      </div>
    </nav>
  );
}
