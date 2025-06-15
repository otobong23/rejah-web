import { useEffect, useState, useCallback } from 'react';

const TIMER_KEY = 'twentyFourHourTimerStart';

export const use24HourTimer = (DURATION = 24 * 60 * 60 * 1000) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [active, setActive] = useState(false);

  const startTimer = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(TIMER_KEY, now.toString());
    setActive(true);
  }, []);

  useEffect(() => {
    const startTime = localStorage.getItem(TIMER_KEY);

    if (startTime) {
      setActive(true);
      const interval = setInterval(() => {
        const now = Date.now();
        const endTime = parseInt(startTime) + DURATION;
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
          localStorage.removeItem(TIMER_KEY);
          setActive(false);
        } else {
          setTimeLeft(diff);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [active]);

  const formatTime = (ms: number | null) => {
    if (ms === null) return '--:--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  };

  return { timeLeft, formatted: formatTime(timeLeft), startTimer, isActive: active };
};
