import { useRef, useState, useCallback, LegacyRef } from "react";
import { Shop, ShopType } from "./components/Shop";
import { Search } from "./components/search/Search";
import { Nav } from "./components/nav/Nav";
import { Timeout } from "./components/search/Timeout";
import { useQuery, Paging } from "./hooks/useQuery";
import { useSearch } from "./hooks/useSearch";
import { AccordionContext } from "./components/Accordian";

const DEFAULT_PAGING: Paging = {
  offset: 1,
  limit: 10,
};

export function App() {
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(true);
  const [homePaging, setPaging] = useState<Paging>(DEFAULT_PAGING);
  const [searchPaging, setsearchPaging] = useState<Paging>({
    ...DEFAULT_PAGING,
    offset: 0,
  });
  const [filteredCatalog, setFilteredCatalog] = useState<ShopType[]>([]);
  const [timeout, setTimeout] = useState<number>(0);
  const [showAll, setShowAll] = useState(true);
  const {
    catalog: queryResults,
    loading: queryLoading,
    hasMore: queryHasMore,
  } = useQuery(homePaging, setTimeout);
  const {
    catalog: searchResults,
    loading: searchLoading,
    hasMore: searchHasMore,
  } = useSearch(searchPaging, filteredCatalog);
  const observer = useRef<IntersectionObserver>();

  const lastQuery = useCallback(
    (node: HTMLDivElement) => {
      if (queryLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && queryHasMore) {
          setPaging((old) => ({
            offset: old.offset + DEFAULT_PAGING.limit,
            limit: old.limit,
          }));
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [queryLoading, queryHasMore]
  );

  const lastSearch = useCallback(
    (node: HTMLDivElement) => {
      if (searchLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && searchHasMore) {
          setsearchPaging((old) => ({
            offset: old.offset + DEFAULT_PAGING.limit,
            limit: old.limit,
          }));
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [searchLoading, searchHasMore]
  );

  function handleTimeoutExpire() {
    setTimeout(0);
    if (queryResults.length === 0) {
      setPaging({ offset: 1, limit: 10 });
    }
  }

  function renderShops(
    catalog: ShopType[],
    loading: boolean,
    hasMore: boolean,
    last: LegacyRef<HTMLDivElement>
  ) {
    return (
      <>
        <AccordionContext.Provider value={showAll}>
          {catalog.map((shop, index) => {
            if (catalog.length === index + 1) {
              return (
                <div
                  ref={last}
                  key={shop.profileName}
                  className="overflow-visible"
                >
                  <Shop shop={shop} />
                </div>
              );
            } else {
              return (
                <div key={shop.profileName} className="overflow-visible">
                  <Shop shop={shop} />
                </div>
              );
            }
          })}
        </AccordionContext.Provider>

        <span className="w-full text-center text-xl">
          {(loading || hasMore) && "Site is down for maintenance"}
          {!loading && !hasMore && "End of results."}
        </span>
      </>
    );
  }

  const message = `Rate limit exceeded. Please wait ${timeout / 1000} seconds.`;

  return (
    <div className="relative bg-black">
      {timeout > 0 && (
        <Timeout
          duration={timeout}
          onTimeout={handleTimeoutExpire}
          message={message}
        />
      )}
      <Nav toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar}>
        <button onClick={() => setShowAll(!showAll)} aria-label="Expand-All-Shops">
          <span className="text-primary hover:text-text transition-colors">
            {showAll ? "Collapse All Shops" : "Expand All Shops"}
          </span>
        </button>
      </Nav>

      <aside
        className={`border-r-1 border-secondary/55 bg-background h-screen fixed top-0 z-10 pt-20 transition-transform duration-150 ease-out ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Search
          setFilteredCatalog={setFilteredCatalog}
          setTimeout={setTimeout}
        />
      </aside>
      <div
        className={`lg:mx-10 my-3 mt-[5.5rem] space-y-12 transition-transform origin-top flex flex-col max-h-screen ${
          toggleSidebar ? "scale-[.89] translate-x-32" : "scale-100"
        }`}
      >
        {filteredCatalog.length > 0
          ? renderShops(searchResults, searchLoading, searchHasMore, lastSearch)
          : renderShops(queryResults, queryLoading, queryHasMore, lastQuery)}
      </div>
    </div>
  );
}
