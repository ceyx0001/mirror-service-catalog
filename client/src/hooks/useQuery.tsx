import { useState, useEffect, useRef, useCallback } from "react";
import { ShopType } from "../components/shopCard/Shop";

export type Cursor = {
  threadIndex: string;
  itemId: string;
  limit: string;
};

export type Query = {
  url: URL;
  setUrl: (newUrl: URL) => void;
  setQueryUrl: (newUrl: URL, append: boolean) => void;
  queryUrl: (append: boolean) => void;
  catalog: ShopType[];
  loading: boolean;
  hasMore: boolean;
  cursor: Cursor;
  timeout: number;
  error: string;
};

export const defaultLimit = 10;

export function useQuery(defaultUrl: URL) {
  const [catalog, setCatalog] = useState<{ array: ShopType[]; cursor: Cursor }>({
    array: [],
    cursor: { threadIndex: "", itemId: "", limit: `${defaultLimit}` },
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(0);

  const url = useRef<URL>(defaultUrl);
  const hasMore = useRef(true);
  const timeoutId = useRef<NodeJS.Timeout>();

  type ERROR = { message: string; timeout: number };
  type SEARCH = { array: ShopType[]; cursor: string };
  type DATA = ERROR | ShopType[] | SEARCH;

  // Helper function to handle the catalog state update
  const updateCatalog = useCallback(
    (newData: ShopType[], append: boolean, newCursor: Cursor) => {
      setCatalog((old) => ({
        array: append ? [...old.array, ...newData] : newData,
        cursor: newCursor,
      }));
    },
    []
  );

  const getShops = useCallback(async (append = false) => {
    try {
      setLoading(true);
      const response = await fetch(url.current);
      const data: DATA = await response.json();

      if (Array.isArray(data)) {
        hasMore.current = data.length > 0;
        if (hasMore.current) {
          const lastShop = data[data.length - 1];
          updateCatalog(data, append, {
            limit: catalog.cursor.limit,
            threadIndex: lastShop.threadIndex.toString(),
            itemId: lastShop.items[lastShop.items.length - 1].itemId,
          });
        }
      } else if ("array" in data) {
        hasMore.current = data.array.length > 0;
        if (hasMore.current) {
          const lastShop = data.array[data.array.length - 1];
          updateCatalog(data.array, append, {
            limit: catalog.cursor.limit,
            threadIndex: lastShop.threadIndex.toString(),
            itemId: data.cursor,
          });
        }
      } else if (response.status === 429) {
        console.error(429);
        setTimeoutDuration(data.timeout);
        timeoutId.current = setTimeout(() => {
          setTimeoutDuration(0);
          clearTimeout(timeoutId.current);
        }, data.timeout);
      }
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [catalog.cursor.limit, updateCatalog]);

  useEffect(() => {
    if (timeoutDuration === 0) {
      getShops();
    }
  }, [getShops, timeoutDuration]);

  return {
    url: url.current,
    setUrl: (newUrl: URL) => (url.current = newUrl),
    setQueryUrl: (newUrl: URL, append: boolean) => {
      url.current = newUrl;
      getShops(append);
    },
    queryUrl: (append: boolean) => getShops(append),
    catalog: catalog.array,
    loading,
    hasMore: hasMore.current,
    cursor: catalog.cursor,
    timeout: timeoutDuration,
    error,
  };
}
