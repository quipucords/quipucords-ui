import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useDeleteCredentialApi } from '../useCredentialApi';

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
