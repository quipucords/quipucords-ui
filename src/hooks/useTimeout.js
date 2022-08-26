import { useEffect, useRef, useState } from 'react';
import { helpers } from '../common';

/**
 * window.setTimeout hook polling hook with multiple cancel alternatives
 *
 * @param {function(): boolean} callback Callback can return a boolean, with false cancelling the timeout.
 * @param {number} pollInterval
 * @returns {{cancel: function(): void, update: number|undefined}} A cancel function is returned, calling it cancels the setTimeout. The returned "update" value is a time increment, always adding up, and purposefully causing a hook update.
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
