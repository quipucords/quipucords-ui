/**
 * This Hook provides functions to manage alerts.
 * It allows you to add and remove alerts using PatternFly's AlertProps and unique IDs.
 *
 * @module useAlerts
 */
import React from 'react';
import { type AlertProps } from '@patternfly/react-core';
import { helpers } from '../helpers';

const useAlerts = () => {
  const [alerts, setAlerts] = React.useState<AlertProps[]>([]);

  /**
   * Adds a new alert or multiple alerts to the list.
   *
   * @param {AlertProps | AlertProps[]} options - The alert object or array of alert objects containing properties
   *     like `id`, `title`, `variant`, etc.
   */
  const addAlert = (options: AlertProps | AlertProps[]) => {
    const updatedOptions = ((Array.isArray(options) && options) || [options]).map(options => ({
      ...options,
      id: options.id || helpers.generateId()
    }));

    setAlerts(prevAlerts => [...prevAlerts, ...updatedOptions]);
  };

  /**
   * Removes the first alert whose properties include the given value.
   *
   * This function removes the first alert matching the provided value in any property.
   *
   * @param {unknown} value - The value to match in the alert's properties.
   */
  const removeAlert = (value: unknown) => {
    setAlerts(prevAlerts => [...prevAlerts.filter(alert => !Object.values(alert).includes(value))]);
  };

  return {
    removeAlert,
    addAlert,
    alerts
  };
};

export { useAlerts as default, useAlerts };
