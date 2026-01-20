import { useState, useEffect } from 'react';
import { SalaryData } from '../types';

export const useStickyState = (key: string, defaultValue: SalaryData) => {
  const [value, setValue] = useState<SalaryData>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      
      if (stickyValue !== null) {
        const parsed = JSON.parse(stickyValue);
        
        // Merge parsed data with defaultValue (INITIAL_STATE)
        // This ensures that if the stored data is from an older version (missing fields like otherDeductions),
        // the app fills them in from defaultValue instead of leaving them undefined.
        return {
          ...defaultValue,
          ...parsed,
          // Explicitly ensure arrays are arrays, falling back to default if undefined in storage
          allowances: Array.isArray(parsed.allowances) ? parsed.allowances : defaultValue.allowances,
          otherDeductions: Array.isArray(parsed.otherDeductions) ? parsed.otherDeductions : defaultValue.otherDeductions,
        };
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
};