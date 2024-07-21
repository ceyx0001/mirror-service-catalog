import { useRef, useCallback } from "react";
import { defaultLimit } from "../hooks/useQuery";
import { AccordionsContext } from "./Accordian";
import { Shop, ShopType } from "./shopCard/Shop";

export default function Shops({
  url,
  hasMore,
  loading,
  catalog,
  setUrl,
  timeout,
  error,
  showAll,
}: {
  url: URL;
  catalog: ShopType[];
  setUrl: React.Dispatch<React.SetStateAction<URL>>;
  timeout: number;
  error: string | null;
  hasMore: boolean;
  loading: boolean;
  showAll: boolean;
}) {
  const observer = useRef<IntersectionObserver>();

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

  return (
    <div className={`lg:mx-10 space-y-10 flex flex-col`}>
      {error ? (
        <span className="text-[1.5rem] text-center">{error}</span>
      ) : (
        <>
          <AccordionsContext.Provider value={showAll}>
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
          </AccordionsContext.Provider>

          <span className="w-fit self-center text-xl">
            {(loading || hasMore || timeout > 0) && (
              <div className="flex items-center">
                Loading
                <div className="ml-3 border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-black" />
              </div>
            )}
            {!loading &&
              !hasMore &&
              timeout === 0 &&
              catalog.length > 0 &&
              "End of results."}
            {!loading &&
              !hasMore &&
              timeout === 0 &&
              catalog.length === 0 &&
              "No items found."}
          </span>
        </>
      )}
    </div>
  );
}
