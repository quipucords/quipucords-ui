import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertProps } from '@patternfly/react-core';
import axios, { AxiosError, type AxiosResponse, isAxiosError } from 'axios';
import helpers from '../helpers';
import {
  ReportPublishStatusSuccessResponse,
  type ReportPublishResponse,
  type ReportPublishStatusResponse
} from '../types/types';

const useReportPublishApi = (onAddAlert: (alert: AlertProps) => void, onTokenExpired?: () => Promise<void>) => {
  const { t } = useTranslation();

  const publishCall = useCallback((id: number): Promise<AxiosResponse<ReportPublishResponse>> => {
    const url = process.env.REACT_APP_REPORTS_SERVICE_PUBLISH?.replace('{0}', String(id));
    return axios.post(`${url}`, {});
  }, []);

  const statusCall = useCallback((id: number): Promise<AxiosResponse<ReportPublishStatusResponse>> => {
    const url = process.env.REACT_APP_REPORTS_SERVICE_PUBLISH?.replace('{0}', String(id));
    return axios.get(`${url}`);
  }, []);

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ReportPublishStatusSuccessResponse>) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'report_published',
          id: response?.data?.report_id
        }),
        variant: 'success'
      });
      return response.data;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ReportPublishResponse | ReportPublishStatusResponse>, id: number) => {
      let message = error.message;
      const data = error.response?.data;
      if (data) {
        if ('message' in data) {
          message = data.message;
        } else if ('detail' in data) {
          message = data.detail;
        } else if ('error_message' in data) {
          message = data.error_message;
        }
      }
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'report_published_error',
          id: id,
          message: message
        }),
        variant: 'danger'
      });
      return Promise.reject(error);
    },
    [onAddAlert, t]
  );

  const requestPublish = useCallback(
    async (id: number) => {
      let response;
      try {
        response = await publishCall(id);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, id);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }

      while (true) {
        try {
          response = await statusCall(id);
        } catch (error) {
          if (isAxiosError(error)) {
            return callbackError(error, id);
          }
          if (!helpers.TEST_MODE) {
            console.error(error);
          }
        }

        if (response.data.status === 'failed') {
          if (response.data.error_code === 'expired_token' && onTokenExpired) {
            onTokenExpired();
          }
          return callbackError(new AxiosError('', undefined, undefined, undefined, response), id);
        }

        if (response.data.status === 'sent') {
          return callbackSuccess(response);
        }

        await new Promise<void>(resolve => {
          setTimeout(() => resolve(), 1000);
        });
      }
    },
    [publishCall, statusCall, callbackSuccess, callbackError, onTokenExpired]
  );

  return {
    callbackError,
    callbackSuccess,
    requestPublish
  };
};

export { useReportPublishApi };
