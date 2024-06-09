import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import { CredentialType } from 'src/types/types';
import { useCredentialApi } from '../useCredentialApi';

const mockCredential: CredentialType = {
  id: '123',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAxios = (method: 'post' | 'put' | 'delete' | 'get', url: string, response: any) => {
  axios[method] = jest.fn().mockResolvedValue(response);
};

describe('useCredentialApi', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

  beforeEach(() => {
    const hook = renderHook(() => useCredentialApi());
    result = hook.result;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a credential when provided', async () => {
    mockAxios('delete', `${process.env.REACT_APP_CREDENTIALS_SERVICE}123/`, { status: 200 });

    await act(async () => {
      await result.current.deleteCredential(mockCredential);
    });

    expect(axios.delete).toHaveBeenCalledWith(`${process.env.REACT_APP_CREDENTIALS_SERVICE}123/`);
  });

  it('should return an Axios response object when deleting a credential', async () => {
    const axiosResponse = { data: 'Deleted credential successfully', status: 200 };

    mockAxios('delete', `${process.env.REACT_APP_CREDENTIALS_SERVICE}123/`, axiosResponse);

    const deleteResult = await result.current.deleteCredential(mockCredential);

    expect(deleteResult).toEqual(axiosResponse);
  });

  it('should set the pending delete credential', () => {
    act(() => {
      result.current.setPendingDeleteCredential(mockCredential);
    });

    expect(result.current.pendingDeleteCredential).toEqual(mockCredential);
  });

  it('should delete a credential using pendingDeleteCredential if no credential is provided', async () => {
    act(() => {
      result.current.setPendingDeleteCredential(mockCredential);
    });

    mockAxios('delete', `${process.env.REACT_APP_CREDENTIALS_SERVICE}123/`, { status: 200 });

    await act(async () => {
      await result.current.deleteCredential();
    });

    expect(axios.delete).toHaveBeenCalledWith(`${process.env.REACT_APP_CREDENTIALS_SERVICE}123/`);
  });
});
