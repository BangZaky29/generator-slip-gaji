import { useState, useEffect } from 'react';

export function useStickyState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      
      if (stickyValue !== null) {
        return JSON.parse(stickyValue);
      }
    } catch (error) {
      console.warn('Error reading/parsing from localStorage', error);
    }
    
    return defaultValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Error saving to localStorage', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}