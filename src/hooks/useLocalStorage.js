import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error(`Error reading focus storage key "${key}":`, e);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing focus storage key "${key}":`, e);
    }
  }, [key, value]);

  return [value, setValue];
}
