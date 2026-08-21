"use client";

import { useEffect, useState } from "react";

/**
 * Return `value` after it has stayed unchanged for `delayMs`.
 * @param value - Latest value
 * @param delayMs - Wait time in milliseconds
 * @returns T
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}
