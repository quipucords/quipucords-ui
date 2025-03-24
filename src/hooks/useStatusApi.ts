import { useCallback } from 'react';
import axios, { type AxiosError, type AxiosResponse, isAxiosError } from 'axios';
import helpers from '../helpers';

type ApiStatusPlatformType = {
  machine: string;
};

type ApiStatusSuccessType = {
  server_version: string;
  platform: ApiStatusPlatformType;
};

type ApiStatusErrorType = {
  detail?: string;
  message: string;
};

/**
 * A status API call
 */
const useStatusApi = () => {
  const apiCall = useCallback(
    (): Promise<AxiosResponse<ApiStatusSuccessType>> => axios.get(`${process.env.REACT_APP_STATUS_SERVICE}`),
    []
  );

  const callbackSuccess = useCallback((response: AxiosResponse<ApiStatusSuccessType>) => response?.data, []);

  const callbackError = useCallback((error: AxiosError<ApiStatusErrorType>) => {
    return Promise.reject(error);
  }, []);

  const getStatus = useCallback(async () => {
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
    getStatus
  };
};

export { useStatusApi, type ApiStatusSuccessType };
