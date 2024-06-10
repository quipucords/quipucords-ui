import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertProps } from '@patternfly/react-core';
import axios, { type AxiosError, type AxiosResponse, isAxiosError } from 'axios';
import helpers from '../helpers';
import apiHelpers from '../helpers/apiHelpers';
import { SourceType } from '../types/types';

type ApiDeleteSourceSuccessType = {
  message: string;
  deleted?: number[];
  missing?: number[];
  skipped?: { source: number; scans: number[] }[];
};

type ApiSourceErrorType = {
  detail?: string;
  message: string;
};

const useDeleteSourceApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (ids: SourceType['id'][]): Promise<AxiosResponse<ApiDeleteSourceSuccessType>> =>
      axios.post(`${process.env.REACT_APP_SOURCES_SERVICE_BULK_DELETE}`, { ids }),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ApiDeleteSourceSuccessType>, updatedSources: SourceType[]) => {
      const { data } = response;

      const deletedNames = data?.deleted
        ?.map(id => updatedSources.find(source => id === source.id)?.name)
        .filter(Boolean)
        .join(', ');

      const skippedNames = data?.skipped
        ?.map(({ source }) => updatedSources.find(sourceObj => source === sourceObj.id)?.name)
        .filter(Boolean)
        .join(', ');

      const missingNames = data?.missing
        ?.map(id => updatedSources.find(source => id === source.id)?.name)
        .filter(Boolean)
        .join(', ');

      const missingSourcesMsg = `The following sources could not be found: ${missingNames}`;

      // No sources deleted, either all skipped or all missing
      if (data?.skipped?.length === updatedSources.length || data?.missing?.length === updatedSources.length) {
        onAddAlert({
          title: t('toast-notifications.description', {
            context: 'skipped-source',
            name: skippedNames,
            count: data?.skipped?.length
          }),
          variant: 'danger',
          id: helpers.generateId()
        });

        if (data?.missing?.length) {
          console.log(missingSourcesMsg);
        }
        return;
      }

      // Some sources deleted, some skipped or missing
      if (data?.skipped?.length || data?.missing?.length) {
        onAddAlert({
          title: t('toast-notifications.description', {
            context: 'deleted-sources-skipped-sources',
            deleted_names: deletedNames,
            skipped_names: skippedNames,
            count: data?.skipped?.length
          }),
          variant: 'warning',
          id: helpers.generateId()
        });

        if (data?.missing?.length) {
          console.log(missingSourcesMsg);
        }
        return;
      }

      // All sources were deleted successfully
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'deleted-source',
          count: updatedSources.length,
          name: updatedSources.map(({ name }) => name).join(', ')
        }),
        variant: 'success',
        id: helpers.generateId()
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    ({ message, response }: AxiosError<ApiSourceErrorType>, updatedSources: SourceType[]) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'deleted-source_error',
          count: updatedSources.length,
          name: updatedSources.map(({ name }) => name).join(', '),
          message: response?.data?.detail || response?.data?.message || message || 'Unknown error'
        }),
        variant: 'danger',
        id: helpers.generateId()
      });
      return;
    },
    [onAddAlert, t]
  );

  const deleteSources = useCallback(
    async (source: SourceType | SourceType[]) => {
      const updatedSources = (Array.isArray(source) && source) || [source];
      let response;
      try {
        response = await apiCall(updatedSources.map(({ id }) => id));
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, updatedSources);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }
      return callbackSuccess(response, updatedSources);
    },
    [apiCall, callbackSuccess, callbackError]
  );

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    deleteSources
  };
};

const useAddSourceApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (payload: SourceType): Promise<AxiosResponse<SourceType>> =>
      axios.post(`${process.env.REACT_APP_SOURCES_SERVICE}`, payload, { params: { scan: true } }),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<SourceType>) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'add-source_hidden',
          name: response?.data?.name
        }),
        variant: 'success',
        id: helpers.generateId()
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiSourceErrorType>, name: string) => {
      onAddAlert({
        title: t('toast-notifications.title', {
          context: 'add-source_hidden_error',
          name: name,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger',
        id: helpers.generateId()
      });
      return;
    },
    [onAddAlert, t]
  );

  const addSources = useCallback(
    async (payload: SourceType) => {
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
    addSources
  };
};

const useEditSourceApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (payload: SourceType): Promise<AxiosResponse<SourceType>> =>
      axios.put(`${process.env.REACT_APP_SOURCES_SERVICE}${payload.id}/`, payload),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<SourceType>) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'add-source_hidden_edit',
          name: response.data.name
        }),
        variant: 'success',
        id: helpers.generateId()
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiSourceErrorType>, name: string) => {
      onAddAlert({
        title: t('toast-notifications.title', {
          context: 'add-source_hidden_error_edit',
          name: name,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger',
        id: helpers.generateId()
      });
      return;
    },
    [onAddAlert, t]
  );

  const editSources = useCallback(
    async (payload: SourceType) => {
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
    editSources
  };
};

const useShowConnectionsApi = (setConnectionsData: (data: any) => void) => {
  const apiCall = useCallback(
    (source: SourceType): Promise<AxiosResponse> =>
      axios.get(
        `${process.env.REACT_APP_SCAN_JOBS_SERVICE}${source.connection.id}/connection/?page=1&page_size=1000&ordering=name&source_type=${source.id}`
      ),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse) => {
      setConnectionsData({
        successful: response.data.results.filter((c: { status: string }) => c.status === 'success'),
        failure: response.data.results.filter((c: { status: string }) => c.status === 'failure'),
        unreachable: response.data.results.filter((c: { status: string }) => !['success', 'failure'].includes(c.status))
      });
      return;
    },
    [setConnectionsData]
  );

  const callbackError = useCallback((error: AxiosError) => {
    if (!helpers.TEST_MODE) {
      console.error(error);
    }
    return;
  }, []);

  const showConnections = useCallback(
    async (source: SourceType) => {
      let response;
      try {
        response = await apiCall(source);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return callbackError(error);
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
    showConnections
  };
};

const useSourceApi = () => {
  const [scanSelected, setScanSelected] = React.useState<SourceType[]>();

  /**
   * Executes a POST request to initiate a scan using the provided payload.
   *
   * @param {SourceType} payload - The payload containing source-related information for the scan.
   * @returns {AxiosResponse} - The Axios response object representing the result of request.
   */
  const runScan = (payload: SourceType) => {
    return axios.post(`${process.env.REACT_APP_SCANS_SERVICE}`, payload);
  };

  /**
   * Sets the selected sources for scanning.
   *
   * @param {SourceType[]} items - An array of source items to be selected for scanning.
   */
  const onScanSources = items => {
    setScanSelected(items);
  };

  /**
   * Sets a single source for scanning as the selected source.
   *
   * @param {SourceType} source - The source to be selected for scanning.
   */
  const onScanSource = (source: SourceType) => {
    setScanSelected([source]);
  };

  return {
    runScan,
    onScanSources,
    scanSelected,
    setScanSelected,
    onScanSource
  };
};

export { useSourceApi, useDeleteSourceApi, useAddSourceApi, useEditSourceApi, useShowConnectionsApi };
