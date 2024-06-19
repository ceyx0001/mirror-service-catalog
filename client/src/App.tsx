import { useRef, useState, useCallback, LegacyRef } from "react";
import { Shop, ShopType } from "./components/Shop";
import { Search } from "./components/search/Search";
import { Nav } from "./components/nav/Nav";
import { Timeout } from "./components/search/Timeout";
import { useQuery, Paging } from "./hooks/useQuery";
import { useSearch } from "./hooks/useSearch";

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

  return (
    <div className="relative bg-black">
      {timeout > 0 && (
        <Timeout duration={timeout} onTimeout={handleTimeoutExpire} />
      )}
      <Nav toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />

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
        className={` mx-10 my-3 mt-[3.8rem] space-y-12 transition-transform origin-top flex flex-col max-h-screen ${
          toggleSidebar ? "scale-[.89] translate-x-32" : "scale:100"
        }`}
      >
        {filteredCatalog.length > 0
          ? renderShops(searchResults, searchLoading, searchHasMore, lastSearch)
          : renderShops(queryResults, queryLoading, queryHasMore, lastQuery)}
      </div>
    </div>
  );
}

function renderShops(
  catalog: ShopType[],
  loading: boolean,
  hasMore: boolean,
  last: LegacyRef<HTMLDivElement>
) {
  return (
    <>
      {catalog.map((shop, index) => {
        if (catalog.length === index + 1) {
          return (
            <div
              ref={last}
              key={shop.profile_name}
              className="overflow-visible"
            >
              <Shop shop={shop} />
            </div>
          );
        } else {
          return (
            <div key={shop.profile_name} className="overflow-visible">
              <Shop shop={shop} />
            </div>
          );
        }
      })}

      <span className="w-full text-center text-xl">
        {(loading || hasMore) && "Loading..."}
        {!loading && !hasMore && "No items found."}
      </span>
    </>
  );
}
