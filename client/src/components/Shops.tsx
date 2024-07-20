import { useRef, useState, useCallback } from "react";
import { Cursor, defaultLimit, useQuery } from "../hooks/useQuery";
import { Timeout } from "./search/Timeout";
import { AccordionsContext } from "./Accordian";
import { Shop } from "./shopCard/Shop";

export default function Shops({
  url,
  showAll,
}: {
  url: URL;
  showAll: boolean;
}) {
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const { catalog, loading, hasMore, timeout, error } = useQuery({
    cursor,
    url,
    setCursor,
  });
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
          setCursor({
            threadIndex: lastEntry.threadIndex,
            limit: defaultLimit,
          });
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, catalog]
  );

  return (
    <div className={`lg:mx-10 space-y-10 flex flex-col`}>
      {timeout > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 z-50">
          <Timeout duration={timeout} message={"Rate limit exceeded"} />
        </div>
      )}
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
            {!loading && !hasMore && timeout === 0 && "End of results."}
          </span>
        </>
      )}
    </div>
  );
}
