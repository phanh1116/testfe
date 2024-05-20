import { useEffect, useState } from "react";

export const useLocalStorage = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
