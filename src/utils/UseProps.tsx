import { useEffect, useState } from 'react';

export function useProps(defaultValue: any) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return [value, setValue];
}

export const getSession = () => {
  return JSON.parse(localStorage.getItem('usuario') ?? "")
}


