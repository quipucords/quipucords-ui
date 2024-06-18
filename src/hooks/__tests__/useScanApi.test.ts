import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import { ScanType } from 'src/types/types';
import { useScanApi } from '../useScanApi';

const mockScan: ScanType = {
  id: 1,
  jobs: [],
  most_recent: {
    end_time: '',
    id: 0,
    report_id: 1,
    scan_type: '',
    start_time: '',
    status: '',
    status_details: {
      job_status_message: ''
    },
    system_fingerprint_count: 0,
    systems_count: 0,
    systems_failed: 0,
    systems_scanned: 0,
    systems_unreachable: 0
  },
  sources: []
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAxios = (method: 'post' | 'put' | 'delete' | 'get', url: string, response: any) => {
  axios[method] = jest.fn().mockResolvedValue(response);
};

describe('useScanApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

  beforeEach(() => {
    const hook = renderHook(() => useScanApi());
    result = hook.result;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a scan using the provided scan id', async () => {
    mockAxios('delete', `${process.env.REACT_APP_SCANS_SERVICE}1/`, { status: 200 });

    await act(async () => {
      await result.current.deleteScan(mockScan);
    });

    expect(axios.delete).toHaveBeenCalledWith(`${process.env.REACT_APP_SCANS_SERVICE}1/`);
  });

  it('should get scan jobs when valid scanId is provided', async () => {
    const mockScanId = 1;
    const mockResponse = {
      data: [
        { id: 1, name: 'Job 1' },
        { id: 2, name: 'Job 2' }
      ]
    };

    mockAxios('get', `${process.env.REACT_APP_SCANS_SERVICE}${mockScanId}/jobs/`, mockResponse);

    await act(async () => {
      const response = await result.current.getScanJobs(mockScanId);
      const jobs = response.data;
      expect(jobs).toEqual(mockResponse.data);
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.REACT_APP_SCANS_SERVICE}${mockScanId}/jobs/`
    );
  });

  it('should run a scan with the provided payload', async () => {
    const mockResponse = { data: { scanId: 2 } };
    mockAxios('post', `${process.env.REACT_APP_SCANS_SERVICE}`, mockResponse);

    await act(async () => {
      const response = await result.current.runScan(mockScan);
      expect(response).toEqual(mockResponse);
    });

    expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_SCANS_SERVICE}`, mockScan);
  });

  it('should set the pending delete scan', () => {
    act(() => {
      result.current.setPendingDeleteScan(mockScan);
    });

    expect(result.current.pendingDeleteScan).toEqual(mockScan);
  });

  it('should set the selected scan', () => {
    act(() => {
      result.current.setScanSelected(mockScan);
    });

    expect(result.current.scanSelected).toEqual(mockScan);
  });
});
