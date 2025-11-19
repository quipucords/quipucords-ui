import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertProps } from '@patternfly/react-core';
import axios, { AxiosError, type AxiosResponse, isAxiosError, type AxiosRequestConfig } from 'axios';
import helpers from '../helpers';
import apiHelpers from '../helpers/apiHelpers';
import {
  type ScanRequest,
  type ScanResponse,
  type ScanJobType,
  type ScanJobsResponse,
  type SourceType,
  type Connections,
  type ReportsAggregateResponse,
  simpleScanJob
} from '../types/types';

type ApiDeleteScanSuccessType = {
  message: string;
  deleted?: number[];
  missing?: number[];
};

type ApiScanErrorType = {
  detail?: string;
  message: string;
};

interface InProgressState {
  state: 'InProgress';
}

interface SuccessfulState {
  state: 'Successful';
  mergedReportId: number;
}

interface ErroredState {
  state: 'Errored';
  errorMessage: string;
}

type MergeProcessState = InProgressState | SuccessfulState | ErroredState;

const useCreateScanApi = (
  onAddAlert: (alert: AlertProps) => void,
  onFieldErrors?: (errors: { [key: string]: string }) => void
) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (payload: ScanRequest): Promise<AxiosResponse<ScanResponse>> =>
      axios.post(`${process.env.REACT_APP_SCANS_SERVICE}`, payload),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ScanResponse>) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'scan-report_created',
          name: response?.data?.name
        }),
        variant: 'success'
      });
      return response.data;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiScanErrorType>, name: string) => {
      if (onFieldErrors && apiHelpers.hasFieldValidationErrors(error)) {
        const fieldErrors = apiHelpers.parseFieldErrors(error.response?.data);
        onFieldErrors(fieldErrors);
      } else {
        onAddAlert({
          title: t('toast-notifications.description', {
            context: 'scan-report_created_error',
            name: name,
            message: apiHelpers.extractErrorMessage(error?.response?.data)
          }),
          variant: 'danger'
        });
      }
      return Promise.reject(error);
    },
    [onAddAlert, onFieldErrors, t]
  );

  const createScans = useCallback(
    async (payload: ScanRequest) => {
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
    createScans
  };
};

const useRunScanApi = (
  onAddAlert: (alert: AlertProps) => void,
  onFieldErrors?: (errors: { [key: string]: string }) => void,
  useCreateScan: typeof useCreateScanApi = useCreateScanApi
) => {
  const { t } = useTranslation();
  const { createScans } = useCreateScan(onAddAlert, onFieldErrors);

  const apiCall = useCallback(
    (scanId: string): Promise<AxiosResponse<ScanJobType>> =>
      axios.post(`${process.env.REACT_APP_SCANS_SERVICE}${scanId}/jobs/`),
    []
  );

  const callbackSuccess = useCallback(
    (name: string) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'scan-report_play',
          name: name
        }),
        variant: 'success'
      });
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiScanErrorType>, name: string) => {
      if (onFieldErrors && apiHelpers.hasFieldValidationErrors(error)) {
        const fieldErrors = apiHelpers.parseFieldErrors(error.response?.data);
        onFieldErrors(fieldErrors);
      } else {
        onAddAlert({
          title: t('toast-notifications.description', {
            context: 'scan-report_play_error',
            name: name,
            message: apiHelpers.extractErrorMessage(error?.response?.data)
          }),
          variant: 'danger'
        });
      }
      return Promise.reject(error);
    },
    [onAddAlert, onFieldErrors, t]
  );

  const runScans = useCallback(
    async (payload: ScanRequest, isRescan = false) => {
      try {
        const scanId =
          (isRescan && payload?.id?.toString()) ||
          (await createScans(payload)
            .then(result => result?.id?.toString())
            .catch(() => {
              const customError = new Error('Failed to create scan');
              throw customError;
            }));

        if (!scanId) {
          const customError = new Error('No ID returned');
          Object.assign(customError, {
            isAxiosError: true,
            response: {
              data: {
                message: 'No ID returned',
                detail: 'The scan or rescan operation did not return an ID.'
              }
            }
          });
          throw customError;
        }
        await apiCall(scanId);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, payload.name);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
        return Promise.reject(error);
      }
      return callbackSuccess(payload.name);
    },
    [apiCall, callbackSuccess, callbackError, createScans]
  );

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    runScans
  };
};

const useDeleteScanApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (ids: ScanResponse['id'][]): Promise<AxiosResponse<ApiDeleteScanSuccessType>> =>
      axios.post(`${process.env.REACT_APP_SCANS_SERVICE_BULK_DELETE}`, { ids }),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ApiDeleteScanSuccessType>, updatedScans: ScanResponse[]) => {
      const { data } = response;

      const missingNames = data?.missing
        ?.map(id => updatedScans.find(scan => id === scan.id)?.name)
        .filter(Boolean)
        .join(', ');

      const missingScansMsg = `The following scans could not be found: ${missingNames}`;

      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'deleted-scan',
          count: updatedScans.length,
          name: updatedScans.map(({ name }) => name).join(', ')
        }),
        variant: 'success'
      });

      if (data?.missing?.length) {
        console.log(missingScansMsg);
      }
      return;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    ({ message, response }: AxiosError<ApiScanErrorType>, updatedScans: ScanResponse[]) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'deleted-scan_error',
          count: updatedScans.length,
          name: updatedScans.map(({ name }) => name).join(', '),
          message: response?.data?.detail || response?.data?.message || message || 'Unknown error'
        }),
        variant: 'danger'
      });
      return;
    },
    [onAddAlert, t]
  );

  const deleteScans = useCallback(
    async (scan: ScanResponse | ScanResponse[]) => {
      let response;
      const updatedScans = (Array.isArray(scan) && scan) || [scan];
      try {
        response = await apiCall(updatedScans.map(({ id }) => id));
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, updatedScans);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }
      return callbackSuccess(response, updatedScans);
    },
    [apiCall, callbackSuccess, callbackError]
  );

  return {
    apiCall,
    callbackError,
    callbackSuccess,
    deleteScans
  };
};

const useGetScanJobsApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (scanId: number): Promise<AxiosResponse<ScanJobsResponse>> =>
      axios.get(`${process.env.REACT_APP_SCANS_SERVICE}${scanId}/jobs/`, { params: { page_size: 1000 } }),
    []
  );

  const callbackSuccess = useCallback((response: AxiosResponse<ScanJobsResponse>) => {
    return response;
  }, []);

  const callbackError = useCallback(
    (error: AxiosError<ApiScanErrorType>, scanId: number) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'scan-jobs_fetch_error',
          id: scanId,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });
      return;
    },
    [onAddAlert, t]
  );

  const getScanJobs = useCallback(
    async (scanId: number) => {
      let response;
      try {
        response = await apiCall(scanId);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, scanId);
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
    getScanJobs
  };
};

const useGetAggregateReportApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (reportId: number): Promise<AxiosResponse<ReportsAggregateResponse>> =>
      axios.get(`${process.env.REACT_APP_REPORTS_SERVICE}${reportId}/aggregate/`),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ReportsAggregateResponse>, reportId: number) => ({
      id: reportId,
      report: response.data
    }),
    []
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiScanErrorType>, reportId: number) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'report_aggregate_error',
          name: reportId,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });

      return Promise.reject(error);
    },
    [onAddAlert, t]
  );

  const getAggregateReport = useCallback(
    async (reportId: number) => {
      let response;
      try {
        response = await apiCall(reportId);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, reportId);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }
      return callbackSuccess(response, reportId);
    },
    [apiCall, callbackSuccess, callbackError]
  );

  return {
    apiCall,
    callbackSuccess,
    callbackError,
    getAggregateReport
  };
};

const useDownloadReportApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (reportId: number, { responseType = 'blob' }: AxiosRequestConfig = {}): Promise<AxiosResponse<Blob>> =>
      axios.get(`${process.env.REACT_APP_REPORTS_SERVICE}${reportId}/`, { responseType }),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<Blob>, reportId: number) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'report_downloaded',
          name: reportId
        }),
        variant: 'success'
      });

      helpers.downloadData(
        response.data,
        `report_id_${reportId}_${new Date()
          .toISOString()
          .replace('T', '_')
          .replace(/[^\d_]/g, '')}.tar.gz`,
        'application/gzip'
      );
      return response;
    },
    [onAddAlert, t]
  );

  const callbackError = useCallback(
    (error: AxiosError<ApiScanErrorType>, reportId: number) => {
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'report_downloaded_error',
          name: reportId,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });
      return;
    },
    [onAddAlert, t]
  );

  const downloadReport = useCallback(
    async (reportId: number) => {
      let response;
      try {
        response = await apiCall(reportId);
      } catch (error) {
        if (isAxiosError(error)) {
          return callbackError(error, reportId);
        }
        if (!helpers.TEST_MODE) {
          console.error(error);
        }
      }
      return callbackSuccess(response, reportId);
    },
    [apiCall, callbackSuccess, callbackError]
  );

  return {
    apiCall,
    callbackSuccess,
    callbackError,
    downloadReport
  };
};

const useShowConnectionsApi = () => {
  const apiCall = useCallback((source: SourceType): Promise<AxiosResponse> => {
    return axios.get(`${process.env.REACT_APP_SCAN_JOBS_SERVICE}${source.connection.id}/connection/`, {
      params: { page: 1, page_size: 1000, ordering: 'name', source_type: source.id }
    });
  }, []);

  const callbackSuccess = useCallback(
    (response: AxiosResponse): Connections => ({
      successful: response?.data?.results?.filter((c: { status: string }) => c.status === 'success') || [],
      failed: response?.data?.results?.filter((c: { status: string }) => c.status === 'failed') || [],
      unreachable:
        response?.data?.results?.filter((c: { status: string }) => !['success', 'failed'].includes(c.status)) || []
    }),
    []
  );

  const callbackError = useCallback((error: AxiosError) => Promise.reject(error), []);

  const showConnections = useCallback(
    async (source: SourceType) => {
      let response;
      try {
        response = await apiCall(source);
      } catch (error) {
        if (axios.isAxiosError(error)) {
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
    showConnections
  };
};

const useMergeReportsApi = () => {
  const [mergeProcessState, setMergeProcessState] = useState<MergeProcessState>({ state: 'InProgress' });
  const { t } = useTranslation();
  const [mergeJobId, setMergeJobId] = useState<number | undefined>(undefined);
  const [mergePollAttempt, setMergePollAttempt] = useState<number>(0);

  const waitInterval = process.env.REACT_APP_MERGE_POLL_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_MERGE_POLL_INTERVAL, 10)
    : 1000;

  const requestReportsMerge = useCallback(
    async (report_ids: number[]) => {
      let response: AxiosResponse;
      try {
        response = await axios.post(`${process.env.REACT_APP_REPORTS_SERVICE_MERGE}`, { reports: report_ids });
        const jobId = response.data.job_id;
        if (!jobId) {
          throw new Error(t('merge.error', { context: 'no-jobid' }));
        }
        setMergeJobId(jobId);
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = [error.message, apiHelpers.extractErrorMessage(error.response?.data)].join(': ');
          setMergeProcessState({ state: 'Errored', errorMessage: errorMessage });
        } else if (error instanceof Error) {
          setMergeProcessState({ state: 'Errored', errorMessage: error.message });
        } else {
          setMergeProcessState({ state: 'Errored', errorMessage: t('merge.error', { context: 'unknown' }) });
        }
      }
    },
    [t]
  );

  const cancelReportsMerge = useCallback((): void => {
    setMergeProcessState({ state: 'InProgress' });
    setMergeJobId(undefined);
    setMergePollAttempt(0);
  }, []);

  useEffect(() => {
    if (mergeJobId === undefined) {
      return () => {};
    }

    let pollingTimer: NodeJS.Timeout;

    axios
      .get(`${process.env.REACT_APP_SCAN_JOBS_V2_SERVICE}${mergeJobId}/`)
      .then((response: AxiosResponse<simpleScanJob>) => {
        const status = response.data.status;

        if (status === 'completed') {
          setMergeProcessState({ state: 'Successful', mergedReportId: response.data.report_id });
          return;
        }

        if (['failed', 'canceled'].includes(status)) {
          setMergeProcessState({ state: 'Errored', errorMessage: response.data.status_message });
          return;
        }

        pollingTimer = setTimeout(() => setMergePollAttempt(mergePollAttempt + 1), waitInterval);
      })
      .catch(error => {
        if (isAxiosError(error)) {
          const errorMessage = [error.message, apiHelpers.extractErrorMessage(error.response?.data)].join(': ');
          setMergeProcessState({ state: 'Errored', errorMessage: errorMessage });
        } else {
          setMergeProcessState({ state: 'Errored', errorMessage: t('merge.error', { context: 'unknown' }) });
        }
      });

    return () => {
      clearTimeout(pollingTimer);
    };
  }, [mergeJobId, mergePollAttempt, waitInterval, t]);

  return {
    requestReportsMerge,
    cancelReportsMerge,
    mergeProcessState
  };
};

export {
  useCreateScanApi,
  useRunScanApi,
  useDeleteScanApi,
  useGetAggregateReportApi,
  useGetScanJobsApi,
  useDownloadReportApi,
  useShowConnectionsApi,
  useMergeReportsApi,
  MergeProcessState
};
