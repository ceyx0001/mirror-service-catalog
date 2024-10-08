import { useRef, useCallback } from "react";
import { defaultLimit } from "../hooks/useQuery";
import { Shop, ShopType } from "./shopCard/Shop";
import { Virtuoso } from "react-virtuoso";

export default function Shops({
  url,
  catalog,
  showAll,
  setUrl,
  timeout,
  error,
  hasMore,
  loading,
}: {
  url: URL;
  catalog: ShopType[];
  showAll: boolean;
  setUrl: React.Dispatch<React.SetStateAction<URL>>;
  timeout: number;
  error: string | null;
  hasMore: boolean;
  loading: boolean;
}) {
  const observer = useRef<IntersectionObserver>();
  const states: boolean[] = [];
  catalog.forEach(() => {
    states.push(showAll);
  });

  const last = useCallback(
    (node: HTMLDivElement) => {
      if (loading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const lastEntry = catalog[catalog.length - 1];
          url.searchParams.set("threadIndex", lastEntry.threadIndex.toString());
          url.searchParams.set("limit", defaultLimit.toString());
          const newUrl = new URL(url);
          setUrl(newUrl);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, catalog, url, setUrl]
  );

  const stateCallback = (index: number, openState: boolean) => {
    states[index] = !openState;
  };

  return (
    <div className={`flex flex-col`}>
      {error ? (
        <span className="text-[1.5rem] text-center mt-40">{error}</span>
      ) : (
        <>
          <Virtuoso
            useWindowScroll
            key={showAll.toString()}
            totalCount={catalog.length}
            itemContent={(index: number) => {
              if (catalog.length - 1 === index) {
                return (
                  <div
                    ref={last}
                    key={catalog[index].profileName}
                    className="overflow-visible"
                  >
                    <Shop
                      shop={catalog[index]}
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
                    key={catalog[index].profileName}
                    className="overflow-visible mb-4"
                  >
                    <Shop
                      shop={catalog[index]}
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
            {(loading || timeout > 0) && (
              <div className="flex items-center">
                Loading
                <div className="ml-3 border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-black" />
              </div>
            )}
            {!hasMore && "End of results."}
          </span>
        </>
      )}
    </div>
  );
}
