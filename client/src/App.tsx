import { useState } from "react";
import { Nav } from "./components/nav/Nav";
import ErrorBoundary from "./components/ErrorBoundary";
import { Search } from "./components/search/Search";
import Shops from "./components/Shops";
import { useQuery } from "./hooks/useQuery";
import { Timeout } from "./components/search/Timeout";
import { About } from "./components/nav/About";
import { Contact } from "./components/nav/Contact";

export function App() {
  const defaultUrl = new URL(
    `${import.meta.env.VITE_API_URL}/shops/range?threadIndex=0&limit=10`
  );
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(true);
  const [showAll, setShowAll] = useState(true);
  const query = useQuery(defaultUrl);

  return (
    <>
      <Nav toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar}>
        <div className="md:space-x-12">
          <button
            onClick={() => setShowAll(!showAll)}
            aria-label="Expand-Or-Close-Shops"
          >
            <span className="text-primary hover:text-text transition-colors">
              {showAll ? "Collapse All" : "Expand All"}
            </span>
          </button>
          <button
            onClick={() => {
              if (!query.loading) {
                query.setQueryUrl(defaultUrl, false);
              }
            }}
            aria-label="Load-Home-Shops"
          >
            <span className="text-primary hover:text-text transition-colors">
              Home
            </span>
          </button>
        </div>
        <div className="ml-auto flex flex-col md:flex-row md:space-x-12 mr-14 place-items-start">
          <About />
          <Contact />
        </div>
        {query.timeout > 0 && (
          <div className="fixed left-1/2 -translate-x-1/2 z-50">
            <Timeout duration={query.timeout} message={"Rate limit exceeded"} />
          </div>
        )}
      </Nav>
      <div className="flex relative">
        <aside
          className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 pt-20 transition-transform duration-150 ease-out z-10 ${
            toggleSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Search cursor={query.cursor} setQueryUrl={query.setQueryUrl} />
        </aside>
        <div
          className={`mt-[4rem] mx-[1rem] flex-grow transition-transform duration-150 ${
            toggleSidebar
              ? "sm:translate-x-[15rem] lg:translate-x-[16.35rem] lg:max-w-[101rem] md:max-w-[44.5rem] sm:max-w-[28rem]"
              : ""
          }`}
        >
          <ErrorBoundary>
            <Shops showAll={showAll} query={query} />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
