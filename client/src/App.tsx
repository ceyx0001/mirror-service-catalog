import { useState } from "react";
import { Nav } from "./components/nav/Nav";
import ErrorBoundary from "./components/ErrorBoundary";
import { Search } from "./components/search/Search";
import Shops from "./components/Shops";
import { useQuery } from "./hooks/useQuery";
import { Timeout } from "./components/search/Timeout";

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
        <div className="space-x-12">
          <button
            onClick={() => setShowAll(!showAll)}
            aria-label="Expand-Or-Close-Shops"
          >
            <span className="text-primary hover:text-text transition-colors">
              {showAll ? "Collapse All Shops" : "Expand All Shops"}
            </span>
          </button>
          <button
            onClick={() => {
              if (!query.loading) {
                query.setQueryUrl(defaultUrl, false);
              }
            }}
            aria-label="Load-Default-Shops"
          >
            <span className="text-primary hover:text-text transition-colors">
              Load Default Shops
            </span>
          </button>
        </div>
        {query.timeout > 0 && (
          <div className="fixed left-1/2 -translate-x-1/2 z-50">
            <Timeout duration={query.timeout} message={"Rate limit exceeded"} />
          </div>
        )}
      </Nav>

      <aside
        className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 pt-20 transition-transform duration-150 ease-out ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Search cursor={query.cursor} setQueryUrl={query.setQueryUrl}/>
      </aside>
      <div
        className={`mt-[4rem] mx-[1rem] ${
          toggleSidebar ? "w-[101rem] translate-x-[16.35rem]" : ""
        }`}
      >
        <ErrorBoundary>
          <Shops showAll={showAll} query={query} />
        </ErrorBoundary>
      </div>
    </>
  );
}
