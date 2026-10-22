import { useState, useEffect } from "react";

export function useCountdown(expiresAt: number | null, onExpire?: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const calculateRemaining = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0 && onExpire) {
        onExpire();
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return { remainingSeconds, formatted, isExpired: remainingSeconds <= 0 && expiresAt !== null };
}
