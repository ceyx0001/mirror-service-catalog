import { useEffect, useState } from "react";

// rate limiter dialog
export function Timeout({
  duration,
  message,
  handleTimeout = () => {},
}: {
  duration: number;
  message: string | null;
  handleTimeout?: () => void;
}) {
  const [timeoutExpired, setTimeoutExpired] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutExpired(true);
      handleTimeout();
    }, duration);
    return () => clearTimeout(timeoutId);
  }, [duration, handleTimeout]);

  return (
    <div className="flex flex-col items-center text-center bg-red-900 p-5 w-fit space-y-3">
      {!timeoutExpired && (
        <>
          <span>
            {message}: {duration / 1000}s
          </span>
        </>
      )}
    </div>
  );
}
