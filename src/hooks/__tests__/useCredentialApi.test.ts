import { act, renderHook } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import { CredentialType, SourceType } from 'src/types/types';
import { useDeleteCredentialApi } from '../useCredentialApi';

const mockCredential1: CredentialType = {
  id: 1,
  name: 'Test Credential',
  created_at: new Date(),
  updated_at: new Date(),
  cred_type: 'Test Type',
  username: 'testuser',
  password: 'testpassword',
  ssh_keyfile: 'testkeyfile',
  auth_token: 'testtoken',
  ssh_passphrase: 'testpassphrase',
  become_method: 'testmethod',
  become_user: 'testuser',
  become_password: 'testpassword',
  sources: []
};

const mockSource: SourceType = {
  id: 3,
  name: 'Test Source',
  port: 8080,
  source_type: 'test',
  hosts: ['localhost'],
  exclude_hosts: [],
  credentials: [],
  connection: {
    id: 123,
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
};

const mockCredential2: CredentialType = {
  id: 2,
  name: 'Test Credential',
  created_at: new Date(),
  updated_at: new Date(),
  cred_type: 'Test Type',
  username: 'testuser',
  password: 'testpassword',
  ssh_keyfile: 'testkeyfile',
  auth_token: 'testtoken',
  ssh_passphrase: 'testpassphrase',
  become_method: 'testmethod',
  become_user: 'testuser',
  become_password: 'testpassword',
  sources: [mockSource]
};

jest.mock('axios');

describe('useDeleteCredentialApi', () => {
  let mockOnAddAlert: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useDeleteCredentialApi(mockOnAddAlert));
    result = hook.result;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully deletes credentials (no attached sources)', async () => {
    (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue({
      data: { skipped: [], deleted: ['1'] }
    });

    await act(async () => {
      await result.current.deleteCredentials(mockCredential1);
    });

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_CREDENTIALS_SERVICE_BULK_DELETE}`,
      { ids: [mockCredential1.id] }
    );
    expect(mockOnAddAlert).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
  });

  it('shows warning alert (some deleted, some skipped)', async () => {
    (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue({
      data: { skipped: [mockCredential2.id], deleted: [mockCredential1.id] }
    });

    await act(async () => {
      await result.current.deleteCredentials([mockCredential2, mockCredential1]);
    });

    expect(mockOnAddAlert).toHaveBeenCalledWith(expect.objectContaining({ variant: 'warning' }));
  });

  it('shows error alert (all skipped)', async () => {
    (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue({
      data: { skipped: [{ credential: mockCredential2.id }], deleted: [] }
    });

    await act(async () => {
      await result.current.deleteCredentials(mockCredential2);
    });

    expect(mockOnAddAlert).toHaveBeenCalledWith(expect.objectContaining({ variant: 'danger' }));
  });

  it('should handle Axios errors gracefully', async () => {
    const error = new AxiosError('Request failed with status code 400');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).response = {
      status: 400,
      data: { detail: 'Request failed with status code 400' }
    };
    (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(error);

    await act(async () => {
      await result.current.deleteCredentials(mockCredential1);
    });

    expect(mockOnAddAlert).toHaveBeenCalledWith(expect.objectContaining({ variant: 'danger' }));
  });
});
