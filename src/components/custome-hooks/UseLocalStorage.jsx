import { useState, useEffect } from 'react';

const useLocalStorage = (storageKey, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    console.log('value',value);
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
};

export default useLocalStorage;
