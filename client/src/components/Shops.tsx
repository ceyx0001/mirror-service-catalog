import { useRef, useState, useCallback } from "react";
import { Paging, useQuery } from "../hooks/useQuery";
import { Timeout } from "./search/Timeout";
import { AccordionsContext } from "./Accordian";
import { Shop } from "./shopCard/Shop";

const DEFAULT_PAGING: Paging = {
  offset: 1,
  limit: 10,
};

export default function Shops({
  url,
  showAll,
}: {
  url: URL;
  showAll: boolean;
}) {
  const [paging, setPaging] = useState<Paging>(DEFAULT_PAGING);
  const { catalog, loading, hasMore, timeout, error } = useQuery({
    paging,
    url
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
          setPaging((old) => {
            return {
              ...old,
              offset: old.offset + DEFAULT_PAGING.limit,
            };
          });
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  function handleTimeoutExpire() {
    if (catalog.length === 0) {
      setPaging({ offset: 1, limit: 10 });
    }
  }

  return (
    <div className="relative bg-black">
      {timeout > 0 && (
        <Timeout
          duration={timeout}
          onTimeout={handleTimeoutExpire}
          message={error}
        />
      )}

      <div
        className={`lg:mx-10 my-3 mt-[5.5rem] space-y-10 transition-transform origin-top flex flex-col max-h-screen`}
      >
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

            <span className="w-full text-center text-xl">
              {(loading || hasMore) && "Loading..."}
              {(!loading && !hasMore) && "End of results."}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
