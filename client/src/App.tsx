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
  const [url, setUrl] = useState(defaultUrl);

  const { catalog, loading, hasMore, timeout, error } = useQuery({
    url,
  });

  function setSearchUrl(url: URL | null) {
    if (url) {
      setUrl(url);
    } else {
      setUrl(defaultUrl);
    }
  }

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
              if (!loading) {
                setUrl(defaultUrl);
              }
            }}
            aria-label="Load-Default-Shops"
          >
            <span className="text-primary hover:text-text transition-colors">
              Load Default Shops
            </span>
          </button>
        </div>
        {timeout > 0 && (
          <div className="fixed left-1/2 -translate-x-1/2 z-50">
            <Timeout duration={timeout} message={"Rate limit exceeded"} />
          </div>
        )}
      </Nav>

      <aside
        className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 pt-20 transition-transform duration-150 ease-out ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Search setSearchUrl={setSearchUrl} />
      </aside>
      <div
        className={`mt-[4rem] mx-[1rem] ${
          toggleSidebar ? "w-[101rem] translate-x-[16.35rem]" : ""
        }`}
      >
        <ErrorBoundary>
          <Shops
            url={url}
            setUrl={setUrl}
            showAll={showAll}
            catalog={catalog}
            timeout={timeout}
            error={error}
            hasMore={hasMore}
            loading={loading}
          />
        </ErrorBoundary>
      </div>
    </>
  );
}
