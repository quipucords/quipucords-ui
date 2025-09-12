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

  it('should preserve dark theme during logout using environment variable', () => {
    // Test the theme preservation behavior by directly calling callbackSuccess
    const spyLocalStorageSet = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Create a new hook instance to test theme preservation
    const hook = renderHook(() => useLogoutApi());
    const { callbackSuccess } = hook.result.current;

    // Test callbackSuccess with dark theme parameter
    callbackSuccess('dark');

    expect(spyLocalStorageSet).toHaveBeenCalledWith('discovery-ui-theme', 'dark');
    expect(spyCookies).toHaveBeenCalledWith('user');

    // Snapshot the localStorage calls for theme preservation
    expect({
      localStorageSetCalls: spyLocalStorageSet.mock.calls,
      cookieRemoveCalls: spyCookies.mock.calls
    }).toMatchSnapshot('logout with dark theme preservation');

    spyLocalStorageSet.mockRestore();
  });

  it('should preserve light theme during logout using environment variable', () => {
    // Test the theme preservation behavior by directly calling callbackSuccess
    const spyLocalStorageSet = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Create a new hook instance to test theme preservation
    const hook = renderHook(() => useLogoutApi());
    const { callbackSuccess } = hook.result.current;

    // Test callbackSuccess with light theme parameter
    callbackSuccess('light');

    expect(spyLocalStorageSet).toHaveBeenCalledWith('discovery-ui-theme', 'light');
    expect(spyCookies).toHaveBeenCalledWith('user');

    // Snapshot the localStorage calls for theme preservation
    expect({
      localStorageSetCalls: spyLocalStorageSet.mock.calls,
      cookieRemoveCalls: spyCookies.mock.calls
    }).toMatchSnapshot('logout with light theme preservation');

    spyLocalStorageSet.mockRestore();
  });

  it('should handle logout when no theme is stored using environment variable', () => {
    // Test behavior when no theme is provided
    const spyLocalStorageSet = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Create a new hook instance
    const hook = renderHook(() => useLogoutApi());
    const { callbackSuccess } = hook.result.current;

    // Test callbackSuccess with no theme (null/undefined)
    callbackSuccess(null);

    // Should not call localStorage.setItem when no theme exists
    expect(spyLocalStorageSet).not.toHaveBeenCalled();
    expect(spyCookies).toHaveBeenCalledWith('user');

    // Snapshot the behavior without theme preservation
    expect({
      localStorageSetCalls: spyLocalStorageSet.mock.calls,
      cookieRemoveCalls: spyCookies.mock.calls
    }).toMatchSnapshot('logout without theme preservation');

    spyLocalStorageSet.mockRestore();
  });

  it('should read theme from localStorage using environment variable during logout', async () => {
    // Mock localStorage.getItem to return 'dark' theme
    const spyLocalStorageGet = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
    const spyAxios = jest.spyOn(axios, 'put').mockImplementationOnce(() => Promise.resolve({}));
    const spyLocalStorageSet = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Create a new hook instance to test the complete logout flow
    const hook = renderHook(() => useLogoutApi());
    const { logout } = hook.result.current;

    // Execute logout which should read theme from localStorage
    await logout();

    // Verify that localStorage.getItem was called with the environment variable key
    expect(spyLocalStorageGet).toHaveBeenCalledWith('discovery-ui-theme');

    // Verify the complete logout flow including theme preservation
    expect(spyAxios).toHaveBeenCalledWith('/api/v1/users/logout/');
    expect(spyLocalStorageSet).toHaveBeenCalledWith('discovery-ui-theme', 'dark');

    // Snapshot the complete logout flow with theme preservation
    expect({
      logoutFlow: {
        localStorageGetCalls: spyLocalStorageGet.mock.calls,
        axiosCalls: spyAxios.mock.calls,
        localStorageSetCalls: spyLocalStorageSet.mock.calls,
        cookieRemoveCalls: spyCookies.mock.calls
      }
    }).toMatchSnapshot('complete logout flow with theme preservation');

    spyLocalStorageGet.mockRestore();
    spyAxios.mockRestore();
    spyLocalStorageSet.mockRestore();
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

describe('useGetSetAuthApi', () => {
  const mockLogoutCallback = jest.fn();
  let hookResult;

  beforeEach(() => {
    const mockLogoutApi = () => ({
      callbackSuccess: mockLogoutCallback,
      callbackError: jest.fn(),
      apiCall: jest.fn(),
      logout: jest.fn()
    });
    const hook = renderHook(() => useGetSetAuthApi({ useLogout: mockLogoutApi }));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt a call to get a token', () => {
    const { getToken } = hookResult;
    const spyCookie = jest.spyOn(cookies, 'get').mockImplementationOnce(() => Promise.resolve({}));

    getToken();
    expect(spyCookie.mock.calls).toMatchSnapshot('getToken');
  });

  it('should process an interceptor request success', async () => {
    const { interceptorRequestSuccess } = hookResult;

    jest.spyOn(cookies, 'get').mockReturnValueOnce('RG9sb3Igc2l0');
    const mockConfig = { headers: {}, url: '//mock-url' };
    act(() => interceptorRequestSuccess(mockConfig));
    expect(mockConfig).toMatchSnapshot('interceptorRequestSuccess');

    jest.spyOn(cookies, 'get').mockReturnValueOnce('');
    const mockConfigTokenService = { headers: {}, url: `${process.env.REACT_APP_USER_SERVICE_AUTH_TOKEN}` };
    act(() => interceptorRequestSuccess(mockConfigTokenService));
    expect(mockConfigTokenService).toMatchSnapshot('interceptorRequestSuccess, token service');
  });

  it('should process an interceptor response success', async () => {
    const { interceptorResponseSuccess } = hookResult;

    expect(interceptorResponseSuccess()).toMatchSnapshot('interceptorResponseSuccess');
  });

  it('should process interceptor request errors', async () => {
    const { interceptorRequestError } = hookResult;

    await expect(interceptorRequestError()).rejects.toMatchSnapshot('interceptorRequestError');
  });

  it('should process interceptor response errors', async () => {
    const { interceptorResponseError } = hookResult;

    await expect(interceptorResponseError()).rejects.toMatchSnapshot('interceptorResponseError');

    await interceptorResponseError({ response: { status: 401 } });
    expect(mockLogoutCallback).toHaveBeenCalledTimes(1);
  });

  it('should return an authorization value on mount', async () => {
    const { isAuthorized: isAuthorizedTestMock } = hookResult;
    expect(isAuthorizedTestMock).toBe(false);

    jest.spyOn(cookies, 'get').mockReturnValueOnce('RG9sb3Igc2l0');
    const { result } = renderHook(() => useGetSetAuthApi());
    const { isAuthorized } = result.current;
    expect(isAuthorized).toBe(true);
  });
});
