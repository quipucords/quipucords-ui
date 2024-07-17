/**
 * A custom hook for managing URL search parameters with React Router, allowing for getting and setting values with
 * ease. Supports default values, optional replacement of the history stack,
 * and automatic unsetting of parameters when set to their default value.
 *
 * @module useSearchParam
 */
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearchParam = (
  name: string,
  defaultValue: string | null = null,
  options?: {
    replace?: boolean;
    unsetWhenDefaultValue?: boolean;
  }
  // eslint-disable-next-line no-unused-vars
): [string | null, (newValue: string) => void, () => void] => {
  const defaultValueRef = React.useRef(defaultValue);
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.has(name) ? searchParams.get(name) : defaultValueRef.current;
  const unsetWhenDefaultValue = options?.unsetWhenDefaultValue ?? true;
  const replace = options?.replace ?? true;
  const set = React.useCallback(
    (newValue: string) => {
      const newSearchParams = new URLSearchParams(window.location.search);
      if (newSearchParams.get(name) !== newValue) {
        if (unsetWhenDefaultValue && newValue === defaultValueRef.current) {
          newSearchParams.delete(name);
        } else {
          newSearchParams.set(name, newValue);
        }
        setSearchParams(newSearchParams, { replace });
      }
    },
    [name, setSearchParams, unsetWhenDefaultValue, replace]
  );

  const unset = React.useCallback(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    if (newSearchParams.has(name)) {
      newSearchParams.delete(name);
      setSearchParams(newSearchParams);
    }
  }, [name, setSearchParams]);

  return [value, set, unset];
};

export default useSearchParam;
