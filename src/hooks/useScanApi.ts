import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertProps } from '@patternfly/react-core';
import axios, { AxiosError, type AxiosResponse, isAxiosError, type AxiosRequestConfig } from 'axios';
import helpers from '../helpers';
import apiHelpers from '../helpers/apiHelpers';
import {
  type Scan,
  type ScanJobType,
  type ScanJobsResponse,
  type SourceType,
  type Connections,
  type ReportsAggregateResponse
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

const useCreateScanApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiCall = useCallback(
    (payload: Scan): Promise<AxiosResponse<Scan>> => axios.post(`${process.env.REACT_APP_SCANS_SERVICE}`, payload),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<Scan>) => {
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
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'scan-report_created_error',
          name: name,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });
      return Promise.reject(error);
    },
    [onAddAlert, t]
  );

  const createScans = useCallback(
    async (payload: Scan) => {
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
  useCreateScan: typeof useCreateScanApi = useCreateScanApi
) => {
  const { t } = useTranslation();
  const { createScans } = useCreateScan(onAddAlert);

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
      onAddAlert({
        title: t('toast-notifications.description', {
          context: 'scan-report_play_error',
          name: name,
          message: apiHelpers.extractErrorMessage(error?.response?.data)
        }),
        variant: 'danger'
      });
      return Promise.reject(error);
    },
    [onAddAlert, t]
  );

  const runScans = useCallback(
    async (payload: Scan, isRescan = false) => {
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
    (ids: Scan['id'][]): Promise<AxiosResponse<ApiDeleteScanSuccessType>> =>
      axios.post(`${process.env.REACT_APP_SCANS_SERVICE_BULK_DELETE}`, { ids }),
    []
  );

  const callbackSuccess = useCallback(
    (response: AxiosResponse<ApiDeleteScanSuccessType>, updatedScans: Scan[]) => {
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
    ({ message, response }: AxiosError<ApiScanErrorType>, updatedScans: Scan[]) => {
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
    async (scan: Scan | Scan[]) => {
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
          context: 'report_download_error',
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
  const mergeReportsCall = useCallback((report_ids: number[]): Promise<AxiosResponse> => {
    return axios.post(`${process.env.REACT_APP_REPORTS_SERVICE_MERGE}`, { reports: report_ids });
  }, []);

  const jobStatusCall = useCallback((job_id: number): Promise<AxiosResponse> => {
    return axios.get(`/api/v2/jobs/${job_id}/`);
  }, []);

  // FIXME: on success return data / report_id, so we can request download
  const callbackSuccess = useCallback((_response: AxiosResponse): boolean => true, []);

  const callbackError = useCallback((error: AxiosError) => Promise.reject(error), []);

  const pollJobStatusCall = useCallback(async (job_id: number): Promise<AxiosResponse> => {
    // FIXME: recursive function with awaited timeout. Can we switch to setInterval?
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await jobStatusCall(job_id);
      const response_data = response?.data; // FIXME: can we static type this?

      // FIXME: other statuses?
      if (response_data.status === 'completed') {
        return response;
      }

      if (response_data.status === 'failed') {
        // FIXME: error handling
        const error = new Error('Job failed');
        Object.assign(error, { isAxiosError: true, response: { data: { message: 'Job failed' } } });
        throw error;
      }

      return pollJobStatusCall(job_id);
    } catch (error) {
      if (isAxiosError(error)) {
        return callbackError(error);
      }
      throw error;
    }
  }, []);

  const mergeReports = useCallback(
    async (report_ids: number[]) => {
      let response;
      try {
        response = await mergeReportsCall(report_ids);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return callbackError(error);
        }
      }
      const job_id = response.data.job_id;
      // FIXME: should we handle missing job_id?
      // if (!jobId) {}
      let pollResponse;
      try {
        pollResponse = await pollJobStatusCall(job_id);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return callbackError(error);
        }
      }
      return callbackSuccess(pollResponse);
    },
    [mergeReportsCall, callbackSuccess, callbackError]
  );

  return {
    mergeReportsCall,
    callbackError,
    callbackSuccess,
    mergeReports
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
  useMergeReportsApi
};
