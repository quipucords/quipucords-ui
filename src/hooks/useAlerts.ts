/**
 * This custom React Hook provides functions to manage alerts in your application.
 * It allows you to add and remove alerts with specific titles, variants, and unique keys.
 *
 * @module useAlerts
 */
import React from 'react';
import { type AlertProps } from '@patternfly/react-core';

const useAlerts = () => {
  const [alert, setAlerts] = React.useState<Partial<AlertProps>[]>([]);

  /**
   * Add an Alert
   *
   * This function adds an alert to the list of alerts.
   *
   * @param {string} title - The title or content of the alert.
   * @param {AlertProps['variant']} variant - The variant or style of the alert (e.g., 'success', 'danger').
   * @param {React.Key} key - A unique key to identify the alert.
   */
  const addAlert = (title: string, variant: AlertProps['variant'], key: React.Key) => {
    setAlerts(prevAlerts => [...prevAlerts, { title, variant, key }]);
  };

  /**
   * Remove an Alert by Key
   *
   * This function removes an alert from the list of alerts based on its unique key.
   *
   * @param {React.Key} key - The unique key of the alert to be removed.
   */
  const removeAlert = (key: React.Key) => {
    setAlerts(prevAlerts => [...prevAlerts.filter(alert => alert.key !== key)]);
  };

  return {
    removeAlert,
    addAlert,
    alerts: alert
  };
};

export default useAlerts;
