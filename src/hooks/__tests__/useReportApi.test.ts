import { act, renderHook } from '@testing-library/react';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import {
  ReportPublishFailureResponse,
  ReportPublishStatusFailureResponse,
  type ReportPublishStatusSuccessResponse
} from '../../types/types';
import { useReportPublishApi } from '../useReportApi';

const publishStatusBodyFactory = (
  reportId: number,
  status: ReportPublishStatusSuccessResponse['status']
): ReportPublishStatusSuccessResponse => ({
  report_id: reportId,
  status,
  error_code: '',
  error_message: '',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
});

const asAxiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosResponse['config']
  }) as AxiosResponse<T>;

describe('useReportPublishApi', () => {
  let mockOnAddAlert: jest.Mock;
  let mockOnTokenExpired: jest.Mock;

  beforeEach(() => {
    mockOnAddAlert = jest.fn();
    mockOnTokenExpired = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should succeed at publishing report', async () => {
    const id = 11;
    jest.spyOn(axios, 'post').mockResolvedValueOnce(asAxiosResponse({} as never));
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce(asAxiosResponse(publishStatusBodyFactory(id, 'pending')))
      .mockResolvedValueOnce(asAxiosResponse(publishStatusBodyFactory(id, 'sent')));

    const { result } = renderHook(() => useReportPublishApi(mockOnAddAlert));
    await act(async () => {
      result.current.requestPublish(id);
    });
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('success');
  });

  it('should handle publish responding with not publishable', async () => {
    const id = 11;
    let publishPromise;
    const publishResponse: ReportPublishFailureResponse = {
      code: 'invalid_report',
      message: `Report cannot be published: ${id}`
    };
    jest.spyOn(axios, 'post').mockRejectedValueOnce(
      new AxiosError('Bad Request', undefined, undefined, undefined, {
        ...asAxiosResponse(publishResponse),
        status: 400,
        statusText: 'Bad Request'
      })
    );

    const { result } = renderHook(() => useReportPublishApi(mockOnAddAlert));

    await act(async () => {
      publishPromise = result.current.requestPublish(id);
    });

    await act(async () => {
      await expect(publishPromise).rejects.toBeInstanceOf(AxiosError);
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('publish - not publishable');
  });

  it('should handle publish responding with already pending', async () => {
    const id = 11;
    let publishPromise;
    const publishResponse: ReportPublishFailureResponse = {
      code: 'already_pending',
      message: 'A publish is already in progress for this report.'
    };
    jest.spyOn(axios, 'post').mockRejectedValueOnce(
      new AxiosError('Conflict', undefined, undefined, undefined, {
        ...asAxiosResponse(publishResponse),
        status: 409,
        statusText: 'Conflict'
      })
    );

    const { result } = renderHook(() => useReportPublishApi(mockOnAddAlert));

    await act(async () => {
      publishPromise = result.current.requestPublish(id);
    });

    await act(async () => {
      await expect(publishPromise).rejects.toBeInstanceOf(AxiosError);
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('publish - already pending');
  });

  it('should handle publish settling on status failed', async () => {
    const id = 11;
    let publishPromise;
    const statusResponse = {
      ...publishStatusBodyFactory(id, 'failed'),
      error_code: 'expired_token',
      error_message: 'token is expired'
    };

    jest.spyOn(axios, 'post').mockResolvedValueOnce(asAxiosResponse({} as never));
    jest.spyOn(axios, 'get').mockResolvedValueOnce(asAxiosResponse(statusResponse));

    const { result } = renderHook(() => useReportPublishApi(mockOnAddAlert, mockOnTokenExpired));

    await act(async () => {
      publishPromise = result.current.requestPublish(id);
    });

    await act(async () => {
      await expect(publishPromise).rejects.toBeInstanceOf(AxiosError);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(mockOnTokenExpired).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('status - expired token');
  });

  it('should not call onTokenExpired when error_code is something else', async () => {
    const id = 11;
    let publishPromise;
    const statusResponse = {
      ...publishStatusBodyFactory(id, 'failed'),
      error_code: 'network_unreachable',
      error_message: 'this is disconnected installation'
    };

    jest.spyOn(axios, 'post').mockResolvedValueOnce(asAxiosResponse({} as never));
    jest.spyOn(axios, 'get').mockResolvedValueOnce(asAxiosResponse(statusResponse));

    const { result } = renderHook(() => useReportPublishApi(mockOnAddAlert, mockOnTokenExpired));

    await act(async () => {
      publishPromise = result.current.requestPublish(id);
    });

    await act(async () => {
      await expect(publishPromise).rejects.toBeInstanceOf(AxiosError);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(mockOnTokenExpired).toHaveBeenCalledTimes(0);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('status - no network');
  });

  it('should handle status check failure', async () => {
    const id = 11;
    let publishPromise;
    const statusResponse: ReportPublishStatusFailureResponse = {
      detail: 'No publish request found for this report.'
    };
    const publishStatusError = new AxiosError('status check failed', undefined, undefined, undefined, {
      ...asAxiosResponse(statusResponse),
      status: 404,
      statusText: 'Not Found'
    });
    jest.spyOn(axios, 'post').mockResolvedValueOnce(asAxiosResponse({} as never));
    jest.spyOn(axios, 'get').mockRejectedValueOnce(publishStatusError);

    const { result } = renderHook(() => useReportPublishApi(mockOnAddAlert));

    await act(async () => {
      publishPromise = result.current.requestPublish(id);
    });

    await act(async () => {
      await expect(publishPromise).rejects.toBe(publishStatusError);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(mockOnAddAlert.mock.calls).toMatchSnapshot('status - rejected');
  });
});
