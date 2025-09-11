import { act } from 'react';
import { renderHook } from '@testing-library/react';
import axios from 'axios';
import cookies from 'js-cookie';
import { useLoginApi, useLogoutApi, useUserApi, useGetSetAuthApi } from '../useLoginApi';

describe('useLoginApi', () => {
  let spyCookies;
  let hookResult;

  beforeEach(() => {
    spyCookies = jest.spyOn(cookies, 'set').mockReturnValue('123');
    const hook = renderHook(() => useLoginApi());
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to login', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post').mockImplementationOnce(() => Promise.resolve({}));

    apiCall({ username: 'lorem', password: '123456' });
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to login a user', async () => {
    const { login } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));

    await expect(login({ username: 'lorem', password: '123456' })).resolves.toMatchSnapshot('login, success');
  });

  it('should handle errors while attempting to login a user', async () => {
    const { login } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(login({ username: 'lorem', password: '123456' })).rejects.toMatchSnapshot('login, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    callbackSuccess({
      data: { token: 'Dolor sit' }
    });

    expect(spyCookies.mock.calls).toMatchSnapshot('callbackSuccess');
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

describe('useLogoutApi', () => {
  let spyCookies;
  let hookResult;

  beforeEach(() => {
    spyCookies = jest.spyOn(cookies, 'remove').mockReturnValue('123');
    const hook = renderHook(() => useLogoutApi());
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to logout', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'put').mockImplementationOnce(() => Promise.resolve({}));

    apiCall().catch(Function.prototype);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to logout a user', async () => {
    const { logout } = hookResult;
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve({}));

    await expect(logout()).resolves.toMatchSnapshot('logout, success');
  });

  it('should handle errors while attempting to logout a user', async () => {
    const { logout } = hookResult;
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(logout()).rejects.toMatchSnapshot('logout, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;
    callbackSuccess();

    expect(spyCookies.mock.calls).toMatchSnapshot('callbackSuccess');
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

describe('useUserApi', () => {
  let hookResult;

  beforeEach(() => {
    const hook = renderHook(() => useUserApi());
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to get a user', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.resolve({}));

    apiCall();
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to get a user', async () => {
    const { getUser } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    await expect(getUser()).resolves.toMatchSnapshot('getUser, success');
  });

  it('should handle errors while attempting to get a user', async () => {
    const { getUser } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(getUser()).rejects.toMatchSnapshot('getUser, error');
  });

  it('should process an API success response', async () => {
    const { callbackSuccess } = hookResult;

    expect(callbackSuccess({ data: { username: 'Lorem ipsum' } })).toMatchSnapshot('callbackSuccess');
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
