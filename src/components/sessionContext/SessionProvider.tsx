/**
 * Provides a React context for session data including authorization status, error information, locale, and username.
 * Utilizes `react-query` for fetching session information and manages session state across the application.
 * @module SessionProvider
 */
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { helpers } from '../../common';

const WHO_AM_I_QUERY = 'whoami';

export type SessionData = {
  authorized: boolean;
  error: boolean;
  errorMessage: string;
  locale?: string | null;
  username?: string | null;
};

const initialSessionData = {
  authorized: false,
  error: false,
  errorMessage: '',
  locale: null,
  username: null
};

export const SessionContext = React.createContext<SessionData>({
  ...initialSessionData
});
export const useLocale = () => React.useContext(SessionContext).locale;
export const useUsername = () => React.useContext(SessionContext).username;

const getLocale = () => {
  const locale = {
    value: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
    key: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC
  };
  return locale;
};

const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = React.useState<SessionData>({
    ...initialSessionData
  });

  React.useEffect(() => {
    const fetchedLocale = getLocale();
    setSessionData(prev => ({ ...prev, locale: fetchedLocale.key }));
  }, []);

  useQuery({
    queryKey: [WHO_AM_I_QUERY],
    refetchOnWindowFocus: !helpers.DEV_MODE,
    queryFn: () => {
      return axios.get(process.env.REACT_APP_USER_SERVICE_CURRENT || '').then(res => {
        if (res.data.username) {
          setSessionData(prev => ({
            ...prev,
            authorized: true,
            username: res.data.username
          }));
        }
      });
    }
  });

  return <SessionContext.Provider value={sessionData}>{children}</SessionContext.Provider>;
};

export default SessionProvider;
