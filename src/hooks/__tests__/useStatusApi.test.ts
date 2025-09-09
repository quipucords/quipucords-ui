import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useStatusApi } from '../useStatusApi';

describe('useStatusApi', () => {
  let hookResult;

  beforeEach(() => {
    const hook = renderHook(() => useStatusApi());
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to get a status', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.resolve({}));

    apiCall();
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to get a status', async () => {
    const { getStatus } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    await expect(getStatus()).resolves.toMatchSnapshot('getStatus, success');
  });

  it('should handle errors while attempting to get a status', async () => {
    const { getStatus } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(getStatus()).rejects.toMatchSnapshot('getStatus, error');
  });

  it('should process an API success response', async () => {
    const { callbackSuccess } = hookResult;

    expect(callbackSuccess({ data: { api_version: 'lorem ipsum', server_version: 'dolor sit' } })).toMatchSnapshot(
      'callbackSuccess'
    );
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
