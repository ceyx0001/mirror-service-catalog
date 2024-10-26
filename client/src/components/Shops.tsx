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
  const states: boolean[] = [];
  query.catalog.forEach(() => {
    states.push(showAll);
  });

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
            itemContent={(index: number) => (
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
            )}
            endReached={() => {
              if (query.hasMore && !query.loading) {
                const newUrl = new URL(query.url);
                newUrl.searchParams.set(
                  "threadIndex",
                  query.cursor.threadIndex
                );
                query.setQueryUrl(newUrl, true);
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
