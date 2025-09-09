import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useDeleteSourceApi, useAddSourceApi, useEditSourceApi } from '../useSourceApi';

describe('useDeleteSourceApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useDeleteSourceApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to delete sources', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post').mockImplementationOnce(() => Promise.resolve({}));

    apiCall([456, 789]);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to delete single and multiple sources', async () => {
    const { deleteSources } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve({}));

    await deleteSources({ id: 123, name: 'lorem ipsum dolor sit' });
    await deleteSources([
      { id: 456, name: 'lorem ipsum' },
      { id: 789, name: 'dolor sit' }
    ]);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('deleteSources, success');
  });

  it('should handle errors while attempting to delete single and multiple sources', async () => {
    const { deleteSources } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await deleteSources({ id: 123, name: 'lorem ipsum dolor sit' });
    await deleteSources([
      { id: 456, name: 'lorem ipsum' },
      { id: 789, name: 'dolor sit' }
    ]);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('deleteSources, error');
  });

  it('should process an API success response', () => {
    const { callbackSuccess } = hookResult;

    // danger
    callbackSuccess(
      {
        data: {
          skipped: [{ source: 123 }, { source: 456 }]
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
          skipped: [{ source: 123 }]
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

describe('useAddSourceApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useAddSourceApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to add sources', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'post').mockImplementationOnce(() => Promise.resolve({}));

    apiCall({ name: 'Lorem' });
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to add a source', async () => {
    const { addSources } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() =>
      Promise.resolve({
        data: { name: 'Lorem', id: '123' }
      })
    );

    await addSources({ name: 'Lorem' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('addSources, success');
  });

  it('should handle errors while attempting to add a source', async () => {
    const { addSources } = hookResult;
    jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(addSources({ name: 'Lorem' })).rejects.toMatchSnapshot('addSources, error');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('addSources, alert error');
  });
});

describe('useEditSourceApi', () => {
  let mockOnAddAlert;
  let hookResult;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    const hook = renderHook(() => useEditSourceApi(mockOnAddAlert));
    hookResult = hook?.result?.current;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should attempt an api call to edit sources', () => {
    const { apiCall } = hookResult;
    const spyAxios = jest.spyOn(axios, 'put').mockImplementationOnce(() => Promise.resolve({}));

    apiCall({ id: 123, name: 'Lorem' }).catch(Function.prototype);
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
  });

  it('should handle success while attempting to edit a source', async () => {
    const { editSources } = hookResult;
    jest.spyOn(axios, 'put').mockImplementation(() =>
      Promise.resolve({
        data: { name: 'Lorem', id: '123' }
      })
    );

    await editSources({ name: 'Lorem', id: '123' });
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('editSources, success');
  });

  it('should handle errors while attempting to edit a source', async () => {
    const { editSources } = hookResult;
    jest.spyOn(axios, 'put').mockImplementation(() => Promise.reject({ isAxiosError: true, message: 'Mock error' }));

    await expect(editSources({ name: 'Lorem', id: '123' })).rejects.toMatchSnapshot('editSources, error');
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('editSources, alert error');
  });
});
