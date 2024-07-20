import { useState, useEffect, useRef } from "react";
import { ShopType } from "../components/shopCard/Shop";

export type Cursor = {
  threadIndex: number;
  limit: number;
};

export const defaultLimit = 10;

// handling catalog queries without any search filters
export function useQuery({
  cursor,
  url,
  setCursor,
}: {
  cursor: Cursor | null;
  url: URL;
  setCursor: (cursor: Cursor) => void;
}) {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [timeoutDuration, setTimeoutDuration] = useState(0);
  const loadingRef = useRef(false);

  type ERROR = { message: string; timeout: number };
  type DATA = ERROR | ShopType[];

  useEffect(() => {
    let cleanup = false;
    let timeoutId: NodeJS.Timeout | undefined;

    const getShops = async () => {
      try {
        if (cursor) {
          (Object.keys(cursor) as Array<keyof Cursor>).forEach((key) =>
            url.searchParams.set(key, cursor[key].toString())
          );
        }
        loadingRef.current = true;
        const response = await fetch(url);
        const data: DATA = await response.json();
        if (data instanceof Array) {
          if (!cleanup && data.length > 0) {
            setCatalog((old) => {
              if (
                data.length === defaultLimit &&
                old[0] &&
                old[0].profileName === data[0].profileName
              ) {
                setHasMore(false);
              }
              return old.concat(data);
            });
          }
          if (data.length < defaultLimit || data.length > defaultLimit) {
            setHasMore(false);
          }
          loadingRef.current = false;
        } else if (response.status === 429) {
          setTimeoutDuration(data.timeout);
          setCatalog([]);
          setHasMore(true);
          setCursor({ threadIndex: 0, limit: defaultLimit });
          timeoutId = setTimeout(() => {
            setTimeoutDuration(0);
            clearTimeout(timeoutId);
          }, data.timeout);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          setError(error.message);
        }
      }
    };

    if (timeoutDuration === 0) {
      getShops();
    }

    return () => {
      cleanup = true;
    };
  }, [url, timeoutDuration, cursor, setCursor]);

  useEffect(() => {
    setCatalog([]);
    setHasMore(true);
    setCursor({ threadIndex: 0, limit: defaultLimit });
  }, [setCursor, url]);

  return {
    catalog,
    loading: loadingRef.current,
    hasMore: hasMore,
    timeout: timeoutDuration,
    error,
  };
}
