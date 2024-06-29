import { useEffect, useState } from "react";

// rate limiter dialog
export function Timeout({
  duration,
  message,
  onTimeout,
}: {
  duration: number;
  message: string;
  onTimeout: () => void;
}) {
  const [remaining, setRemaining] = useState<number>(duration);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prevRemaining) => {
        const newRemaining = prevRemaining > 0 ? prevRemaining - 1000 : 0;
        if (newRemaining === 0) {
          onTimeout();
        }
        return newRemaining;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [onTimeout]);
  return (
    <div className="flex flex-col items-center text-center space-y-2 w-fit fixed top-[5%] left-[50%] transform -translate-x-[50%] bg-background p-5 rounded-2xl z-50">
      <span>{message}</span>
      <progress className="progress-bar" value={remaining / duration} />
    </div>
  );
}
