import { useState, useEffect, useRef } from "react";
import { ShopType } from "../components/shopCard/Shop";

export type Cursor = {
  threadIndex: number;
  limit: number;
};

export const defaultLimit = 10;

// handling catalog queries without any search filters
export function useQuery({ url }: { url: URL }) {
  const [catalog, setCatalog] = useState<ShopType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [timeoutDuration, setTimeoutDuration] = useState(0);
  const loadingRef = useRef(false);
  const prevUrlRef = useRef<URL | null>(null);

  type ERROR = { message: string; timeout: number };
  type DATA = ERROR | ShopType[];

  useEffect(() => {
    let cleanup = false;
    let timeoutId: NodeJS.Timeout | undefined;
    const getShops = async () => {
      if (timeoutDuration > 0) {
        return;
      }
      try {
        loadingRef.current = true;
        const response = await fetch(url);
        loadingRef.current = false;
        const data: DATA = await response.json();
        if (data instanceof Array) {
          if (!cleanup && data.length > 0) {
            if (data.length < defaultLimit || data.length > defaultLimit) {
              setHasMore(false);
            }
            setCatalog((old) => {
              if (
                data.length === defaultLimit &&
                old[0] &&
                old[0].profileName === data[0].profileName
              ) {
                setHasMore(false);
              }
              return [...old, ...data];
            });
          } else if (data.length === 0) {
            setHasMore(false);
          }
        } else if (response.status === 429) {
          setTimeoutDuration(data.timeout);
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
  }, [url, timeoutDuration]);

  useEffect(() => {
    if (
      (prevUrlRef.current !== null &&
        prevUrlRef.current.search !== url.search &&
        !url.pathname.includes("range")) ||
      (url.pathname.includes("range") &&
        url.pathname !== prevUrlRef.current?.pathname)
    ) {
      setCatalog([]);
      setHasMore(true);
      prevUrlRef.current = url;
    }
  }, [url]);

  return {
    catalog,
    loading: loadingRef.current,
    hasMore,
    timeout: timeoutDuration,
    error,
  };
}
