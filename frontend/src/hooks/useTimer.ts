import { useEffect, useRef } from 'react';

interface UseTimerOptions {
  isPaused: boolean;
  isComplete: boolean;
  startTime: number;
  onTick: (elapsedTime: number) => void;
}

/**
 * Timer hook that updates elapsed time
 */
export function useTimer({ isPaused, isComplete, startTime, onTick }: UseTimerOptions) {
  const pausedTimeRef = useRef<number>(0);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    // Reset paused time when startTime changes (new game started)
    pausedTimeRef.current = 0;
    lastTickRef.current = Date.now();
  }, [startTime]);

  useEffect(() => {
    if (isComplete) return;

    if (isPaused) {
      // Accumulate paused time
      pausedTimeRef.current += Date.now() - lastTickRef.current;
      return;
    }

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime - pausedTimeRef.current;
      onTick(elapsed);
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [isPaused, isComplete, startTime, onTick]);

  /**
   * Format time as MM:SS
   */
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return { formatTime };
}
