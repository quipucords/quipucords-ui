import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import { SourceType } from 'src/types/types';
import { useSourceApi } from '../useSourceApi';

const mockSource = {
  id: 1,
  name: 'Test Source',
  port: 8080,
  source_type: 'test',
  hosts: ['localhost'],
  exclude_hosts: [],
  credentials: [],
  connection: {
    id: 123,
    name: 'Test Connection',
    end_time: '2024-06-10T10:00:00Z',
    report_id: 1,
    source_systems_count: 0,
    source_systems_failed: 0,
    source_systems_scanned: 0,
    source_systems_unreachable: 0,
    start_time: '2024-06-10T09:00:00Z',
    status: 'active',
    status_details: {
      job_status_message: 'Scan in progress'
    },
    systems_count: 0,
    systems_scanned: 0,
    systems_failed: 0
  },
  options: { ssl_cert_verify: true, disable_ssl: false }
} as SourceType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAxios = (method: 'post' | 'put' | 'delete' | 'get', url: string, response: any) => {
  axios[method] = jest.fn().mockResolvedValue(response);
};

describe('useSourceApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;
  const emptyConnectionData = { successful: [], failure: [], unreachable: [] };

  beforeEach(() => {
    const hook = renderHook(() => useSourceApi());
    result = hook.result;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully initiate a scan with valid payload', async () => {
    mockAxios('post', `${process.env.REACT_APP_SCANS_SERVICE}`, { status: 200 });

    await act(async () => {
      await result.current.runScan(mockSource);
    });

    expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_SCANS_SERVICE}`, mockSource);
  });

  it('should successfully add a source and trigger a scan', async () => {
    mockAxios('post', `${process.env.REACT_APP_SOURCES_SERVICE}?scan=true`, { status: 200 });

    await act(async () => {
      await result.current.addSource(mockSource);
    });

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_SOURCES_SERVICE}?scan=true`,
      mockSource
    );
  });

  it('should successfully delete a source when provided', async () => {
    mockAxios('delete', `${process.env.REACT_APP_SOURCES_SERVICE}1/`, { status: 200 });

    await act(async () => {
      await result.current.deleteSource(mockSource);
    });

    expect(axios.delete).toHaveBeenCalledWith(`${process.env.REACT_APP_SOURCES_SERVICE}1/`);
  });

  it('should successfully update a source when provided with a valid payload', async () => {
    mockAxios('put', `${process.env.REACT_APP_SOURCES_SERVICE}1/`, { status: 200 });

    await act(async () => {
      await result.current.submitEditedSource(mockSource);
    });

    expect(axios.put).toHaveBeenCalledWith(
      `${process.env.REACT_APP_SOURCES_SERVICE}1/`,
      mockSource
    );
  });

  it('should successfully retrieve connection information for a valid source', async () => {
    const connectionUrl = `${process.env.REACT_APP_SCAN_JOBS_SERVICE}123/connection/?page=1&page_size=1000&ordering=name&source_type=1`;
    mockAxios('get', connectionUrl, {
      data: 'Connection information retrieved successfully',
      status: 200
    });

    await act(async () => {
      await result.current.showConnections(mockSource);
    });

    expect(axios.get).toHaveBeenCalledWith(connectionUrl);
  });

  it('should set multiple sources for scanning when called with an array of sources', () => {
    const mockSources = [
      { id: 1, name: 'Source 1' },
      { id: 2, name: 'Source 2' },
      { id: 3, name: 'Source 3' }
    ];

    act(() => {
      result.current.onScanSources(mockSources);
    });

    expect(result.current.scanSelected).toEqual(mockSources);
  });

  it('should set the source being edited', () => {
    act(() => {
      result.current.onEditSource(mockSource);
    });
    expect(result.current.sourceBeingEdited).toEqual(mockSource);
  });

  it('should set the pending delete source', () => {
    act(() => {
      result.current.setPendingDeleteSource(mockSource);
    });
    expect(result.current.pendingDeleteSource).toEqual(mockSource);
  });

  it('should close the connections view and reset data', () => {
    const mockConnectionsData = {
      successful: [{ id: 1, name: 'Connection 1' }],
      failure: [],
      unreachable: []
    };

    act(() => {
      result.current.setConnectionsData(mockConnectionsData);
      result.current.setConnectionsSelected(mockSource);
    });

    expect(result.current.connectionsData).toEqual(mockConnectionsData);
    expect(result.current.connectionsSelected).toEqual(mockSource);

    act(() => {
      result.current.onCloseConnections();
    });

    expect(result.current.connectionsData).toEqual(emptyConnectionData);
    expect(result.current.connectionsSelected).toBeUndefined();
  });

  it('should set a single source for scanning when called with a source', () => {
    act(() => {
      result.current.onScanSource(mockSource);
    });

    expect(result.current.scanSelected).toEqual([mockSource]);
  });
});
