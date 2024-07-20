import { useState } from "react";
import { Nav } from "./components/nav/Nav";
import ErrorBoundary from "./components/ErrorBoundary";
import { Search } from "./components/search/Search";
import Shops from "./components/Shops";

export function App() {
  const defaultUrl = new URL(
    `${import.meta.env.VITE_API_URL}/shops/range?threadIndex=0&limit=10`
  );
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(true);
  const [showAll, setShowAll] = useState(true);
  const [url, setUrl] = useState(defaultUrl);

  function setSearchUrl(url: URL | null) {
    if (url) {
      setUrl(url);
    } else {
      setUrl(defaultUrl);
    }
  }

  return (
    <div className="bg-black">
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
            onClick={() => setUrl(defaultUrl)}
            aria-label="Load-Default-Shops"
          >
            <span className="text-primary hover:text-text transition-colors">
              Load Default Shops
            </span>
          </button>
        </div>
      </Nav>

      <aside
        className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 pt-20 transition-transform duration-150 ease-out ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Search setSearchUrl={setSearchUrl} />
      </aside>
      <div
        className={`space-y-12 transition-transform origin-top flex flex-col flex-grow h-0 mt-20 ${
          toggleSidebar ? "scale-[.866] translate-x-32" : "scale-100"
        }`}
      >
        <ErrorBoundary>
          <Shops url={url} setUrl={setUrl} showAll={showAll}/>
        </ErrorBoundary>
      </div>
    </div>
  );
}
