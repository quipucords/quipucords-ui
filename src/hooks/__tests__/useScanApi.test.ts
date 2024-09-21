import { renderHook } from '@testing-library/react';
import axios from 'axios';
import {
  useCreateScanApi,
  useDeleteScanApi,
  useDownloadReportApi,
  useGetScanJobsApi,
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
    jest.clearAllMocks();
  });

  it('should attempt an api call to show connections', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get');

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
    jest.clearAllMocks();
  });

  it('should attempt an api call to delete scans', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post');

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
    jest.clearAllMocks();
  });

  it('should attempt an api call to create a scan', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post');

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

    await createScans({ name: 'Lorem' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('createScans, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess({
      data: { name: 'Lorem' }
    });

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
      'Lorem Ipsum'
    );

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError');
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
    jest.clearAllMocks();
  });

  it('should attempt an api call to retrieve a scanJob', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get');

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

  it('should process an API success response', async () => {
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
    mockCreateScan = jest.fn().mockResolvedValue({ id: '123' });
    const mockUseCreateScanApi = jest.fn().mockReturnValue({
      createScans: mockCreateScan
    });
    const hook = renderHook(() => useRunScanApi(mockOnAddAlert, mockUseCreateScanApi));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt an API call to run a scan', async () => {
    const { apiCall } = hookResult;
    const spyAxiosRun = jest.spyOn(axios, 'post');

    await apiCall(123);
    expect(spyAxiosRun.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to run a scan', async () => {
    const { runScans } = hookResult;
    jest.spyOn(axios, 'post').mockResolvedValue(Promise.resolve({}));

    await runScans({ name: 'Lorem' });
    await runScans({ id: '123', name: 'Lorem' }, true);

    expect(mockCreateScan).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('runScans, success');
  });

  it('should handle errors while attempting to run a scan', async () => {
    const { runScans } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await runScans({ name: 'Lorem' });
    await runScans({ id: '123', name: 'Lorem' }, true);

    expect(mockCreateScan).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('runScans, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess('Lorem');

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
      'Lorem'
    );

    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('callbackError');
  });
});

describe('useDownloadReportApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useDownloadReportApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt an API call to download a report', async () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get');

    await apiCall(123);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to download a report', async () => {
    const { downloadReport } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    await downloadReport(123);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('downloadReport, success');
  });

  it('should handle errors while attempting to download a report', async () => {
    const { downloadReport } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await downloadReport(123);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('downloadReport, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess(new Blob(['mock report data'], { type: 'application/gzip' }), 123);

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
