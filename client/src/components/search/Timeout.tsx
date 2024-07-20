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
  const [remainder, setRemainder] = useState(duration);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeoutExpired(true);
      handleTimeout();
    }, duration);
    return () => clearTimeout(timeoutId);
  }, [duration, handleTimeout]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainder((prevRemainder) => prevRemainder - 1000);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [duration]);

  return (
    <div className="flex flex-col items-center text-center bg-red-900 p-5 w-fit space-y-3">
      {!timeoutExpired && (
        <>
          <span>{message}</span>
          <progress className="progress-bar" value={remainder / duration} />
        </>
      )}
    </div>
  );
}
