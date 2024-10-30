/**
 * Custom React hook for handling credential deletion operations.
 *
 * This hook manages the deletion of credentials via an API call and provides feedback to the user through alerts.
 *
 * @param {Function} onAddAlert - Callback function to add an alert to the UI.
 * @returns {object} An object containing functions:
 *   - `apiCall(ids)`: Function to make the API call for deleting credentials with the given IDs.
 *   - `deleteCredentials(credential)`: Function to handle the entire credential deletion process (API call,
 *       response handling, and alerts).
 */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertProps } from '@patternfly/react-core';
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, isAxiosError } from 'axios';
import { helpers } from '../helpers';
import apiHelpers from '../helpers/apiHelpers';
import { type CredentialType } from '../types/types';

type ApiDeleteCredentialSuccessType = {
  message: string;
  deleted?: number[];
  missing?: number[];
  skipped?: { credential: number; sources: number[] }[];
};

type ApiGetCredentialsSuccessType = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: CredentialType[];
};

type ApiCredentialErrorType = {
  detail?: string;
  message: string;
};

const useDeleteCredentialApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (ids: CredentialType['id'][]): Promise<AxiosResponse<ApiDeleteCredentialSuccessType>> =>
      axios.post(`${process.env.REACT_APP_CREDENTIALS_SERVICE_BULK_DELETE}`, { ids }),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ApiDeleteCredentialSuccessType>, updatedCredentials: CredentialType[]) => {
      const { data } = response;

      const deletedNames = data?.deleted
        ?.map(id => updatedCredentials.find(cred => id === cred.id)?.name)
        .filter(Boolean)
        .join(', ');

      const skippedNames = data?.skipped
        ?.map(({ credential }) => updatedCredentials.find(cred => credential === cred.id)?.name)
        .filter(Boolean)
        .join(', ');

      const missingNames = data?.missing
        ?.map(id => updatedCredentials.find(cred => id === cred.id)?.name)
        .filter(Boolean)
        .join(', ');

      const missingCredsMsg = `The following credentials could not be found: ${missingNames}`;

      // No credentials deleted, either all skipped or all missing
      if (data?.skipped?.length === updatedCredentials.length || data?.missing?.length === updatedCredentials.length) {
        onAddAlert({
          title: t('toast-notifications.description', {
            context: 'skipped-credential',
            name: skippedNames,
            count: data?.skipped?.length
          }),
          variant: 'danger'
        });

        if (data?.missing?.length) {
          console.log(missingCredsMsg);
        }
        return;
      }

      // Some credentials deleted, some skipped or missing
      if (data?.skipped?.length || data?.missing?.length) {
        onAddAlert({
          title: t('toast-notifications.description', {
            context: 'deleted-credentials-skipped-credentials',
            deleted_names: deletedNames,
            skipped_names: skippedNames,
            count: data?.skipped?.length
          }),
          variant: 'warning'
        });

        if (data?.missing?.length) {
          console.log(missingCredsMsg);
        }
        return;
      }

      // All credentials were deleted successfully
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'deleted-credential',
          count: updatedCredentials.length,
          name: updatedCredentials.map(({ name }) => name).join(', ')
        }),
        variant: 'success'
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    ({ message, response }: AxiosError<ApiCredentialErrorType>, updatedCredentials: CredentialType[]) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'deleted-credential_error',
          count: updatedCredentials.length,
          name: updatedCredentials.map(({ name }) => name).join(', '),
          message: response?.data?.detail || response?.data?.message || message || 'Unknown error'
        }),
        variant: 'danger'
      });
      return;
    },
    [onAddAlert, t]
  );

  const deleteCredentials = useCallback(
    async (credential: CredentialType | CredentialType[]) => {
      const updatedCredentials = (Array.isArray(credential) && credential) || [credential];
      let response;
      try {
        response = await apiCall(updatedCredentials.map(({ id }) => id));
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, updatedCredentials);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }
      return callbackSuccess(response, updatedCredentials);
    },
    [apiCall, callbackSuccess, callbackError]
  );

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    deleteCredentials
  };
};

const useAddCredentialApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (payload: CredentialType): Promise<AxiosResponse<CredentialType>> =>
      axios.post(`${process.env.REACT_APP_CREDENTIALS_SERVICE}`, payload),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<CredentialType>) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'add-credential',
          name: response?.data?.name
        }),
        variant: 'success'
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiCredentialErrorType>, name: string) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'add-credential_error',
          name: name,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });
      return Promise.reject(error);
    },
    [onAddAlert, t]
  );

  const addCredentials = useCallback(
    async (payload: CredentialType) => {
      let response;
      try {
        response = await apiCall(payload);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, payload.name);
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
    addCredentials
  };
};

const useEditCredentialApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (payload: CredentialType): Promise<AxiosResponse<CredentialType>> =>
      axios.patch(`${process.env.REACT_APP_CREDENTIALS_SERVICE}${payload.id}/`, payload),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<CredentialType>) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'credential_edit',
          name: response?.data?.name
        }),
        variant: 'success'
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiCredentialErrorType>, name: string) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'credential_edit_error',
          name: name,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });
      return Promise.reject(error);
    },
    [onAddAlert, t]
  );

  const editCredentials = useCallback(
    async (payload: CredentialType) => {
      let response;
      try {
        response = await apiCall(payload);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, payload.name);
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
    editCredentials
  };
};

const useGetCredentialsApi = () => {
  const apiCall = useCallback(
    (config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiGetCredentialsSuccessType>> =>
      axios.get(`${process.env.REACT_APP_CREDENTIALS_SERVICE}`, config),
    []
  );

  const callbackSuccess = useCallback((response: AxiosResponse<ApiGetCredentialsSuccessType>) => {
    return response;
  }, []);

  const callbackError = useCallback((error: AxiosError<ApiCredentialErrorType>) => Promise.reject(error), []);

  const getCredentials = useCallback(
    async (config: AxiosRequestConfig = {}) => {
      let response;
      try {
        response = await apiCall(config);
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
    getCredentials
  };
};

export { useDeleteCredentialApi, useAddCredentialApi, useEditCredentialApi, useGetCredentialsApi };
