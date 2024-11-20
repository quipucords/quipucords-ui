import { renderHook } from '@testing-library/react';
import axios from 'axios';
import {
  useAddCredentialApi,
  useDeleteCredentialApi,
  useEditCredentialApi,
  useGetCredentialsApi
} from '../useCredentialApi';

describe('useDeleteCredentialApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useDeleteCredentialApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt an api call to delete credentials', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post');

    apiCall([456, 789]);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to delete single and multiple credentials', async () => {
    const { deleteCredentials } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));

    await deleteCredentials({ id: 123, name: 'lorem ipsum dolor sit' });
    await deleteCredentials([
      { id: 456, name: 'lorem ipsum' },
      { id: 789, name: 'dolor sit' }
    ]);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('deleteCredentials, success');
  });

  it('should handle errors while attempting to delete single and multiple credentials', async () => {
    const { deleteCredentials } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await deleteCredentials({ id: 123, name: 'lorem ipsum dolor sit' });
    await deleteCredentials([
      { id: 456, name: 'lorem ipsum' },
      { id: 789, name: 'dolor sit' }
    ]);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('deleteCredentials, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    // danger
    callbackSuccess(
      {
        data: {
          skipped: [{ credential: 123 }, { credential: 456 }]
        }
      },
      [
        { id: 123, name: 'Lorem' },
        { id: 456, name: 'Ipsum' }
      ]
    );

    // warning
    callbackSuccess(
      {
        data: {
          deleted: [456],
          skipped: [{ credential: 123 }]
        }
      },
      [
        { id: 123, name: 'Lorem' },
        { id: 456, name: 'Ipsum' }
      ]
    );

    // success
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

describe('useAddCredentialApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useAddCredentialApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt an api call to add credentials', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post');

    apiCall({ name: 'Lorem' });
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to add a credential', async () => {
    const { addCredentials } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));

    await addCredentials({ name: 'Lorem' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('addCredentials, success');
  });

  it('should handle errors while attempting to add a credential', async () => {
    const { addCredentials } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(addCredentials({ name: 'Lorem' })).rejects.toMatchSnapshot('addCredentials, error');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('addCredentials, alert error');
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

describe('useEditCredentialApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useEditCredentialApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt an api call to edit credentials', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'put');

    apiCall({ id: 123, name: 'Lorem' }).catch(Function.prototype);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to edit a credential', async () => {
    const { editCredentials } = hookResult;
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.resolve({}));

    await editCredentials({ name: 'Lorem', id: '123' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('editCredentials, success');
  });

  it('should handle errors while attempting to edit a credential', async () => {
    const { editCredentials } = hookResult;
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(editCredentials({ name: 'Lorem', id: '123' })).rejects.toMatchSnapshot('editCredentials, error');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('editCredentials, alert error');
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

describe('useGetCredentialsApi', () => {
  let hookResult;

  beforeEach(() => {
    const hook = renderHook(() => useGetCredentialsApi());
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt an api call to retrieve credentials', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'get');

    apiCall().catch(Function.prototype);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to retrieve credentials', async () => {
    const { getCredentials } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}));

    await expect(getCredentials()).resolves.toMatchSnapshot('getCredentials, success');
  });

  it('should handle errors while attempting to retrieve credentials', async () => {
    const { getCredentials } = hookResult;
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(getCredentials()).rejects.toMatchSnapshot('getCredentials, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    expect(
      callbackSuccess({
        data: {
          results: [{ name: 'Lorem', id: '1' }]
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
