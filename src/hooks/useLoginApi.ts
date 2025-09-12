import { useCallback, useEffect, useState } from 'react';
import axios, { type AxiosError, type AxiosResponse, isAxiosError } from 'axios';
import cookies from 'js-cookie';
import helpers from '../helpers';

type ApiLoginPayloadType = {
  username: string;
  password: string;
};

type ApiLoginSuccessType = {
  token: string;
};

type ApiUserSuccessType = {
  username: string;
};

type ApiLoginErrorType = {
  detail?: string;
  message: string;
};

/**
 * A login API call
 */
const useLoginApi = () => {
  const apiCall = useCallback(
    (payload: ApiLoginPayloadType): Promise<AxiosResponse<ApiLoginSuccessType>> =>
      axios.post(`${process.env.REACT_APP_USER_SERVICE_AUTH_TOKEN}`, payload),
    []
  );

  const callbackSuccess = useCallback((response: AxiosResponse<ApiLoginSuccessType>) => {
    const loginToken = response?.data?.token;

    if (loginToken) {
      cookies.set(`${process.env.REACT_APP_AUTH_COOKIE}`, window.btoa(loginToken), {
        expires: Number.parseFloat(`${process.env.REACT_APP_AUTH_COOKIE_EXPIRES}`)
      });
    }

    return;
  }, []);

  const callbackError = useCallback((error: AxiosError<ApiLoginErrorType>) => Promise.reject(error), []);

  const login = useCallback(
    async (payload: ApiLoginPayloadType) => {
      let response;
      try {
        response = await apiCall(payload);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }
      return callbackSuccess(response);
    },
    [apiCall, callbackSuccess, callbackError]
  );

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    login
  };
};

/**
 * A logout API call
 */
const useLogoutApi = () => {
  const apiCall = useCallback(
    (): Promise<AxiosResponse> => axios.put(`${process.env.REACT_APP_USER_SERVICE_LOGOUT}`),
    []
  );

  const callbackSuccess = useCallback((localStorageTheme?: string | null) => {
    cookies.remove(`${process.env.REACT_APP_AUTH_COOKIE}`);
    document.location.replace('./');
    if (localStorageTheme) {
      try {
        localStorage.setItem(`${process.env.REACT_APP_THEME_KEY}`, localStorageTheme);
      } catch (error) {
        console.error('Failed to set theme in localStorage:', error);
      }
    }
    return;
  }, []);

  const callbackError = useCallback((error: AxiosError<ApiLoginErrorType>) => Promise.reject(error), []);

  const logout = useCallback(async () => {
    const localStorageTheme = localStorage?.getItem(`${process.env.REACT_APP_THEME_KEY}`);
    try {
      await apiCall();
    } catch (error) {
      if (isAxiosError(error)) {
        return callbackError(error);
      }
      if (!helpers.TEST_MODE) {
        console.error(error);
      }
    }
    return callbackSuccess(localStorageTheme);
  }, [apiCall, callbackSuccess, callbackError]);

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    logout
  };
};

/**
 * A user response API call
 */
const useUserApi = () => {
  const apiCall = useCallback(
    (): Promise<AxiosResponse<ApiUserSuccessType>> => axios.get(`${process.env.REACT_APP_USER_SERVICE_CURRENT}`),
    []
  );

  const callbackSuccess = useCallback((response: AxiosResponse<ApiUserSuccessType>) => response?.data?.username, []);

  const callbackError = useCallback((error: AxiosError<ApiLoginErrorType>) => {
    return Promise.reject(error);
  }, []);

  const getUser = useCallback(async () => {
    let response;
    try {
      response = await apiCall();
    } catch (error) {
      if (isAxiosError(error)) {
        return callbackError(error);
      }
      if (!helpers.TEST_MODE) {
        console.error(error);
      }
    }
    return callbackSuccess(response);
  }, [apiCall, callbackSuccess, callbackError]);

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    getUser
  };
};

/**
 * Get initial token. Apply and set token for all Axios request interceptors, global authorization
 */
const useGetSetAuthApi = ({ useLogout = useLogoutApi }: { useLogout?: typeof useLogoutApi } = {}) => {
  const { callbackSuccess: revokeToken } = useLogout();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const getToken = useCallback(() => {
    const token = cookies.get(`${process.env.REACT_APP_AUTH_COOKIE}`) || '';
    let parsedToken;

    try {
      parsedToken = window.atob(token);
    } catch (e) {
      if (!helpers.TEST_MODE) {
        console.error('Invalid token, unable to parse format');
      }
      parsedToken = '';
    }

    if (parsedToken) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    return parsedToken;
  }, []);

  const interceptorRequestSuccess = useCallback(
    config => {
      const headerToken = getToken();

      const isTokenServiceBeingCalled = new RegExp(config.url || '').test(
        `${process.env.REACT_APP_USER_SERVICE_AUTH_TOKEN}`
      );

      if (headerToken || isTokenServiceBeingCalled) {
        config.headers.Authorization = (headerToken && `Token ${headerToken}`) || '';
        return config;
      }

      return Promise.reject(new Error('Unauthorized, missing token'));
    },
    [getToken]
  );

  const interceptorRequestError = useCallback(error => Promise.reject(error), []);

  const interceptorResponseSuccess = useCallback(config => config, []);

  const interceptorResponseError = useCallback(
    error => {
      if (error?.response?.status === 401) {
        setIsAuthorized(false);
        return revokeToken();
      }

      return Promise.reject(error);
    },
    [revokeToken]
  );

  const setInterceptors = useCallback(() => {
    axios.interceptors.request.use(interceptorRequestSuccess, interceptorRequestError);
    axios.interceptors.response.use(interceptorResponseSuccess, interceptorResponseError);
  }, [interceptorResponseError, interceptorResponseSuccess, interceptorRequestError, interceptorRequestSuccess]);

  useEffect(() => {
    setInterceptors();
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    getToken,
    isAuthorized,
    interceptorResponseError,
    interceptorResponseSuccess,
    interceptorRequestError,
    interceptorRequestSuccess,
    setInterceptors
  };
};

export { useLoginApi, useLogoutApi, useUserApi, useGetSetAuthApi };
