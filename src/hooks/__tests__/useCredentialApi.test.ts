import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useAddCredentialApi, useDeleteCredentialApi, useEditCredentialApi } from '../useCredentialApi';

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
    await addCredentials({ name: 'Lorem' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('addCredentials, error');
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

    await editCredentials({ name: 'Lorem', id: '123' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('editCredentials, error');
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
