import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import {
  MergeProcessState,
  useCreateScanApi,
  useDeleteScanApi,
  useDownloadReportApi,
  useGetAggregateReportApi,
  useGetScanJobsApi,
  useMergeReportsApi,
  useRunScanApi,
  useShowConnectionsApi
} from '../useScanApi';

describe('useShowConnectionsApi', () => {
  let hookResult;

  beforeEach(() => {
    const hook = renderHook(() => useShowConnectionsApi());
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to show connections', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get').mockResolvedValueOnce({});

    apiCall({ id: 123, connection: { id: 456 } });
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while fetching connections', async () => {
    const { showConnections } = hookResult;
    jest.spyOn(axios, 'get').mockResolvedValue({});

    const response = await showConnections({ id: 123, connection: { id: 456 } });
    expect(response).toMatchSnapshot('showConnections success');
  });

  it('should handle errors while fetching connections', async () => {
    const { showConnections } = hookResult;
    jest.spyOn(axios, 'get').mockRejectedValue({ isAxiosError: true, message: 'Mock error' });

    await expect(showConnections({ id: 123, connection: { id: 456 } })).rejects.toMatchSnapshot(
      'showConnections error'
    );
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    expect(
      callbackSuccess({
        data: {
          results: [
            { status: 'success', name: 'Connection 1' },
            { status: 'failed', name: 'Connection 2' },
            { status: 'unreachable', name: 'Connection 3' }
          ]
        }
      })
    ).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', async () => {
    const { callbackError } = hookResult;

    await expect(
      callbackError({
        response: {
          data: {
            message: 'Dolor sit'
          }
        }
      })
    ).rejects.toMatchSnapshot('callbackError');
  });
});

describe('useDeleteScanApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useDeleteScanApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to delete scans', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post').mockResolvedValueOnce({});

    apiCall([456, 789]).catch(Function.prototype);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to delete single and multiple scans', async () => {
    const { deleteScans } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));

    await deleteScans({ id: 123, name: 'lorem ipsum dolor sit' });
    await deleteScans([
      { id: 456, name: 'lorem ipsum' },
      { id: 789, name: 'dolor sit' }
    ]);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('deleteScans, success');
  });

  it('should handle errors while attempting to delete single and multiple scans', async () => {
    const { deleteScans } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await deleteScans({ id: 123, name: 'lorem ipsum dolor sit' });
    await deleteScans([
      { id: 456, name: 'lorem ipsum' },
      { id: 789, name: 'dolor sit' }
    ]);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('deleteScans, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess(
      {
        data: {
          deleted: [123, 456]
        }
      },
      [
        { id: 123, name: 'Lorem' },
        { id: 456, name: 'Ipsum' }
      ]
    );

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', () => {
    const { callbackError } = hookResult;

    callbackError(
      {
        response: {
          data: {
            detail: 'Lorem ipsum'
          }
        }
      },
      [
        { id: 123, name: 'Lorem' },
        { id: 456, name: 'Ipsum' }
      ]
    );

    callbackError(
      {
        response: {
          data: {
            message: 'Dolor sit'
          }
        }
      },
      [
        { id: 123, name: 'Lorem' },
        { id: 456, name: 'Ipsum' }
      ]
    );

    callbackError(
      {
        message: 'Amet'
      },
      [
        { id: 123, name: 'Lorem' },
        { id: 456, name: 'Ipsum' }
      ]
    );

    callbackError({}, [
      { id: 123, name: 'Lorem' },
      { id: 456, name: 'Ipsum' }
    ]);

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError');
  });
});

describe('useCreateScanApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useCreateScanApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to create a scan', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post').mockResolvedValueOnce({});

    apiCall({ name: 'Lorem' });
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to create a scan', async () => {
    const { createScans } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));

    await createScans({ name: 'Lorem' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('createScans, success');
  });

  it('should handle errors while attempting to create a scan', async () => {
    const { createScans } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(createScans({ name: 'Lorem' })).rejects.toMatchSnapshot('createScans, error');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('createScans, alert error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess({
      data: { name: 'Lorem' }
    });

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', async () => {
    const { callbackError } = hookResult;

    await expect(
      callbackError(
        {
          response: {
            data: {
              message: 'Dolor sit'
            }
          }
        },
        'Lorem Ipsum'
      )
    ).rejects.toMatchSnapshot('callbackError');

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError, alert');
  });
});

describe('useGetScanJobsApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useGetScanJobsApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to retrieve a scanJob', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get').mockResolvedValueOnce({});

    apiCall(1);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to retrieve a scanJob', async () => {
    const { getScanJobs } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    await getScanJobs(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('getScanJobs, success');
  });

  it('should handle errors while attempting to retrieve a scanJob', async () => {
    const { getScanJobs } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await getScanJobs(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('getScanJobs, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    expect(
      callbackSuccess({
        response: {
          data: {
            message: 'Dolor sit'
          }
        }
      })
    ).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', () => {
    const { callbackError } = hookResult;

    callbackError(
      {
        response: {
          data: {
            message: 'Dolor sit'
          }
        }
      },
      1
    );

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError');
  });
});

describe('useRunScanApi', () => {
  let mockOnAddAlert;
  let hookResult;
  let mockCreateScan;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    mockCreateScan = jest.fn();
    const mockUseCreateScanApi = jest.fn().mockReturnValue({
      createScans: mockCreateScan
    });
    const hook = renderHook(() => useRunScanApi(mockOnAddAlert, undefined, mockUseCreateScanApi));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an API call to run a scan', async () => {
    const { apiCall } = hookResult;
    const spyAxiosRun = jest.spyOn(axios, 'post').mockResolvedValueOnce({});

    await apiCall(123);
    expect(spyAxiosRun.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to run a scan', async () => {
    const { runScans } = hookResult;
    mockCreateScan.mockResolvedValue({ id: '123', name: 'Lorem' });
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await runScans({ name: 'Lorem' });
    await runScans({ id: '123', name: 'Lorem' }, true);

    expect(mockCreateScan).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('runScans, success');
  });

  it('should handle errors while attempting to run a scan', async () => {
    const { runScans } = hookResult;
    mockCreateScan.mockResolvedValue({ id: '123', name: 'Lorem' });
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(runScans({ name: 'Lorem' })).rejects.toMatchSnapshot('runScans, without id error');
    await expect(runScans({ id: '123', name: 'Lorem' }, true)).rejects.toMatchSnapshot('runScans, with id error');

    expect(mockCreateScan).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('runScans, error alert');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess('Lorem');

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', async () => {
    const { callbackError } = hookResult;

    await expect(
      callbackError(
        {
          response: {
            data: {
              message: 'Dolor sit'
            }
          }
        },
        'Lorem'
      )
    ).rejects.toMatchSnapshot('callbackError');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError, alert');
  });

  it('should handle missing scan ID and trigger custom error', async () => {
    const { runScans } = hookResult;
    mockCreateScan.mockResolvedValue({});

    await expect(runScans({ name: 'Lorem' })).rejects.toMatchSnapshot('runScans, no ID returned');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('runScans, no ID returned, alert');
  });
});

describe('useGetAggregateReportApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useGetAggregateReportApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to show an aggregate report summary', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get').mockResolvedValueOnce({});

    apiCall(123);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to get a summary', async () => {
    const { getAggregateReport } = hookResult;
    jest.spyOn(axios, 'get').mockResolvedValue({});

    const response = await getAggregateReport(123);
    expect(response).toMatchSnapshot('getAggregateReport success');
  });

  it('should handle errors while attempting to get a summary', async () => {
    const { getAggregateReport } = hookResult;
    jest.spyOn(axios, 'get').mockRejectedValue({ isAxiosError: true, message: 'Mock error' });

    await expect(getAggregateReport(123)).rejects.toMatchSnapshot('getAggregateReport error');

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('getAggregateReport, error alert');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    expect(
      callbackSuccess(
        {
          data: {
            results: {
              ansible_hosts_all: 1,
              ansible_hosts_in_database: 1,
              ansible_hosts_in_jobs: 0
            },
            diagnostics: {
              inspect_result_status_failed: 0,
              inspect_result_status_success: 5,
              inspect_result_status_unknown: 0
            }
          }
        },
        123
      )
    ).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', async () => {
    const { callbackError } = hookResult;

    await expect(
      callbackError(
        {
          response: {
            data: {
              message: 'Dolor sit'
            }
          }
        },
        123
      )
    ).rejects.toMatchSnapshot('callbackError');

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError, alert');
  });
});

describe('useDownloadReportApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useDownloadReportApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
    jest.useFakeTimers();
    navigator.msSaveBlob = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should attempt an API call to download a report', async () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get').mockResolvedValueOnce({});

    await apiCall(123);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to download a report', async () => {
    const { downloadReport } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    await downloadReport(123);
    jest.advanceTimersToNextTimer();
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('downloadReport, success');
  });

  it('should handle errors while attempting to download a report', async () => {
    const { downloadReport } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await downloadReport(123);
    jest.advanceTimersToNextTimer();
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('downloadReport, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess(new Blob(['mock report data'], { type: 'application/gzip' }), 123);
    jest.advanceTimersToNextTimer();

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackSuccess');
  });

  it('should process an API error response', () => {
    const { callbackError } = hookResult;

    callbackError(
      {
        response: {
          data: {
            message: 'Dolor sit'
          }
        }
      },
      123
    );

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError');
  });
});

describe('useMergeReportsApi', () => {
  let spyPost;
  let spyGet;
  // Must be consistent with src/helpers/apiHelpers.ts `if (!data)` value
  const defaultApiHelperErrorMessage = 'Unknown error';
  const defaultJobId = 11;
  const defaultReportId = 3;
  const defaultPostResponse = { data: { job_id: defaultJobId } };
  const defaultGetResponse = { data: { status: 'completed', report_id: defaultReportId } };

  beforeEach(() => {
    spyPost = jest.spyOn(axios, 'post');
    spyGet = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should request merge and accept success', async () => {
    spyPost.mockResolvedValueOnce(defaultPostResponse);
    spyGet.mockResolvedValueOnce(defaultGetResponse);
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({
      state: 'Successful',
      mergedReportId: defaultReportId
    });
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyPost).toHaveBeenCalledWith(process.env.REACT_APP_REPORTS_SERVICE_MERGE, { reports: reportsToMerge });
    expect(spyGet).toHaveBeenCalledTimes(1);
  });

  it('should handle merge request failure', async () => {
    const errorMessage = 'Network error';
    spyPost.mockRejectedValue({ isAxiosError: true, message: errorMessage });
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({
      state: 'Errored',
      errorMessage: `${errorMessage}: ${defaultApiHelperErrorMessage}`
    });
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyGet).toHaveBeenCalledTimes(0);
  });

  it('should handle merge request response without data', async () => {
    spyPost.mockResolvedValue({ data: undefined });
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    // error message is generated by axios, we don't want to assert the exact phrasing
    expect(hook.result.current.mergeProcessState.state).toStrictEqual('Errored');
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyGet).toHaveBeenCalledTimes(0);
  });

  it('should handle job poll failure', async () => {
    const errorMessage = 'Network error';
    spyPost.mockResolvedValueOnce(defaultPostResponse);
    spyGet.mockRejectedValue({ isAxiosError: true, message: errorMessage });
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({
      state: 'Errored',
      errorMessage: `${errorMessage}: ${defaultApiHelperErrorMessage}`
    });
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyGet).toHaveBeenCalledTimes(1);
  });

  it('should handle merge failure', async () => {
    spyPost.mockResolvedValueOnce(defaultPostResponse);
    const errorMessage = 'Too many widgets';
    spyGet.mockResolvedValueOnce({ data: { status: 'failed', status_message: errorMessage } });
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({
      state: 'Errored',
      errorMessage: errorMessage
    });
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyGet).toHaveBeenCalledTimes(1);
  });

  it('should handle job poll response without data', async () => {
    spyPost.mockResolvedValueOnce(defaultPostResponse);
    spyGet.mockResolvedValueOnce({ data: undefined });
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    // error message is "Unknown error", going through `t()`; a bit awkward to assert
    expect(hook.result.current.mergeProcessState.state).toStrictEqual('Errored');
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyGet).toHaveBeenCalledTimes(1);
  });

  it('should poll a job endpoint', async () => {
    jest.useFakeTimers();
    spyPost.mockResolvedValueOnce(defaultPostResponse);
    spyGet.mockResolvedValueOnce({ data: { status: 'running' } }).mockResolvedValueOnce(defaultGetResponse);
    const reportsToMerge = [1, 2, 3];

    const hook = renderHook(() => useMergeReportsApi());

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({ state: 'InProgress' });

    await act(async () => {
      await hook.result.current.requestReportsMerge(reportsToMerge);
    });

    // useEffect(..., [mergeJobId, mergePollAttempt]) uses setTimeout, which is scheduled to run AFTER
    // above await completes. So we need another one.
    await act(async () => {
      await jest.advanceTimersToNextTimer();
    });

    expect(hook.result.current.mergeProcessState).toStrictEqual<MergeProcessState>({
      state: 'Successful',
      mergedReportId: defaultReportId
    });
    expect(spyPost).toHaveBeenCalledTimes(1);
    expect(spyPost).toHaveBeenCalledWith(process.env.REACT_APP_REPORTS_SERVICE_MERGE, { reports: reportsToMerge });
    expect(spyGet).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
