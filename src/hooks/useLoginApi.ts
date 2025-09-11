import { useCallback, useEffect, useState } from 'react';
import axios, { type AxiosError, type AxiosResponse, isAxiosError } from 'axios';
import cookies from 'js-cookie';
import helpers from '../helpers';
import { hasInitialAuthToken } from '../services/axiosConfig';

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

  const callbackSuccess = useCallback(() => {
    cookies.remove(`${process.env.REACT_APP_AUTH_COOKIE}`);
    document.location.replace('./');
    return;
  }, []);

  const callbackError = useCallback((error: AxiosError<ApiLoginErrorType>) => Promise.reject(error), []);

  const logout = useCallback(async () => {
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
    return callbackSuccess();
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
/**
 * Get initial token. Apply and set token for all Axios request interceptors, global authorization
 */
const useGetSetAuthApi = () => {
  const [isAuthorized] = useState<boolean>(hasInitialAuthToken());

  return {
    isAuthorized
  };
};

export { useLoginApi, useLogoutApi, useUserApi, useGetSetAuthApi };
