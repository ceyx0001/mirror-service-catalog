import { useRef, useCallback } from "react";
import { Query } from "../hooks/useQuery";
import { Shop } from "./shopCard/Shop";
import { Virtuoso } from "react-virtuoso";

export default function Shops({
  showAll,
  query,
}: {
  showAll: boolean;
  query: Query;
}) {
  const observer = useRef<IntersectionObserver>();
  const states: boolean[] = [];
  query.catalog.forEach(() => {
    states.push(showAll);
  });

  const last = useCallback(
    (node: HTMLDivElement) => {
      if (query.loading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      const newUrl = new URL(query.url);
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && query.hasMore) {
          newUrl.searchParams.set("threadIndex", query.cursor.threadIndex);
          newUrl.searchParams.set("itemId", query.cursor.itemId);
          query.setQueryUrl(newUrl, true);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [query]
  );

  const stateCallback = (index: number, openState: boolean) => {
    states[index] = !openState;
  };

  return (
    <div className={`flex flex-col`}>
      {query.error ? (
        <span className="text-[1.5rem] text-center mt-40">{query.error}</span>
      ) : (
        <>
          <Virtuoso
            useWindowScroll
            key={showAll.toString()}
            totalCount={query.catalog.length}
            itemContent={(index: number) => {
              if (query.catalog.length - 1 === index) {
                return (
                  <div
                    ref={last}
                    key={query.catalog[index].profileName}
                    className="overflow-visible"
                  >
                    <Shop
                      shop={query.catalog[index]}
                      renderAsOpen={states[index]}
                      stateCallback={(openState) => {
                        stateCallback(index, openState);
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={query.catalog[index].profileName}
                    className="overflow-visible mb-4"
                  >
                    <Shop
                      shop={query.catalog[index]}
                      renderAsOpen={states[index]}
                      stateCallback={(openState) => {
                        stateCallback(index, openState);
                      }}
                    />
                  </div>
                );
              }
            }}
          />

          <span className="w-fit self-center text-xl mt-40">
            {(query.loading || query.timeout > 0) && (
              <div className="flex items-center">
                Loading
                <div className="ml-3 border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-black" />
              </div>
            )}
            {!query.hasMore && "End of results."}
          </span>
        </>
      )}
    </div>
  );
}
