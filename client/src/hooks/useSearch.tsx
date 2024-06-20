import { useState, useEffect } from "react";
import { ShopType } from "../components/Shop";

export type Paging = {
  offset: number;
  limit: number;
};

// handling catalog queries with search filters
export function useSearch(paging: Paging, completeCatalog: ShopType[]) {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setCatalog([]);
  }, [completeCatalog]);

  useEffect(() => {
    if (completeCatalog.length > 0) {
      let cleanup = false;
      const getShops = () => {
        setLoading(true);
        if (!cleanup) {
          setCatalog((old) => {
            const joined = old.concat(
              completeCatalog.slice(paging.offset, paging.offset + paging.limit)
            );
            setHasMore(joined.length < completeCatalog.length);
            return joined;
          });
        }
        setLoading(false);
      };
      getShops();

      return () => {
        cleanup = true;
      };
    }
  }, [paging, completeCatalog]);

  return { catalog, loading, hasMore };
}
