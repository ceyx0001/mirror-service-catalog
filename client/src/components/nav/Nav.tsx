import { Contact } from "./Contact";
import { About } from "./About";
import icon from "../../assets/Mirror_of_Kalandra.png";

export function Nav({
  toggleSidebar,
  setToggleSidebar,
}: {
  toggleSidebar: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <nav className="flex flex-row items-center sticky top-0 border-b-1 border-secondary/55 py-1 w-full bg-background z-50">
      <button
        type="button"
        className={`mx-4 transition group outline-none ${
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
      <div className="flex flex-row items-center space-x-2">
        <img className="w-8 h-8" src={icon} />
        <p className="font-bold text-lg">Mirror Service Catalog</p>
      </div>
      <div className="ml-auto space-x-20 mx-20 flex">
        <About />
        <Contact />
      </div>
    </nav>
  );
}
