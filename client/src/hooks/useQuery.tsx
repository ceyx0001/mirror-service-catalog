import { useState, useEffect } from "react";
import { ShopType } from "../components/Shop";

export type Paging = {
  offset: number;
  limit: number;
};

type ERROR = { message: string; timeout: number };
type DATA = ERROR | ShopType[];

export function useQuery(
  paging: Paging,
  setTimeout: (duration: number) => void
) {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    let cleanup = false;
    const getShops = async () => {
      setLoading(true);
      const url = `http://localhost:3000/api/shops/range?offset=${paging.offset}&limit=${paging.limit}`; //import.meta.env.VITE_API_URL;

      try {
        const response = await fetch(url);
        const data: DATA = await response.json();
        if (data instanceof Array) {
          if (!cleanup) {
            setCatalog((old) => {
              return old.concat(data);
            });
            setHasMore(data.length > 0);
          }
        } else {
          if (response.status === 429) {
            setTimeout(data.timeout);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
      setLoading(false);
    };
    getShops();

    return () => {
      cleanup = true;
    };
  }, [paging, setTimeout]);

  return { catalog, loading, hasMore };
}
