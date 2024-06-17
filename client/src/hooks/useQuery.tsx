import { useState, useEffect } from "react";
import { ShopType } from "../components/Shop";

export type Paging = {
  offset: number;
  limit: number;
};

export function useQuery(paging: Paging) {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    let cleanup = false;
    const getShops = async () => {
      setLoading(true);
      const url = `http://localhost:3000/api/shops/range?offset=${paging.offset}&limit=${paging.limit}`; //import.meta.env.VITE_API_URL;
      const response = await fetch(url);
      const shops: ShopType[] = await response.json();
      if (!cleanup) {
        setCatalog((old) => {
          return old.concat(shops);
        });
        setHasMore(shops.length > 0);
      }
      setLoading(false);
    };
    getShops();

    return () => {
      cleanup = true;
    };
  }, [paging]);

  return { catalog, loading, hasMore };
}
