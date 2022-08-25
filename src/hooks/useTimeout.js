import { useEffect, useRef, useState } from 'react';
import { helpers } from '../common';

/**
 * setTimeout hook
 *
 * @param {Function} callback
 * @param {number} pollInterval
 * @returns {Function}
 */
const useTimeout = (callback, pollInterval = 0) => {
  const timer = useRef();
  const [update, setUpdate] = useState();
  const result = callback();

  useEffect(() => {
    if (result !== false) {
      timer.current = window.setTimeout(() => setUpdate(helpers.getCurrentDate().getTime()), pollInterval);
    }

    return () => {
      window.clearTimeout(timer.current);
    };
  }, [pollInterval, update, result]);

  return { update, cancel: () => window.clearTimeout(timer.current) };
};

export { useTimeout as default, useTimeout };
