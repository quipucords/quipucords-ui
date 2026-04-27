import React, { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useGetHashicorpVaultConfigApi } from '../useGetHashicorpVaultConfigApi';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useGetHashicorpVaultConfigApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not call the API when disabled', () => {
    const spyAxios = jest.spyOn(axios, 'get');
    renderHook(() => useGetHashicorpVaultConfigApi(false), { wrapper: createWrapper() });
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall, disabled');
  });

  it('should retrieve vault global config on success', async () => {
    const spyAxios = jest.spyOn(axios, 'get').mockResolvedValue({
      data: { address: '127.0.0.1', port: 8200, ssl_verify: false }
    });
    const { result } = renderHook(() => useGetHashicorpVaultConfigApi(true), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(spyAxios.mock.calls).toMatchSnapshot('apiCall');
    expect(result.current.data).toMatchSnapshot('getHashicorpVaultConfig, success');
  });

  it('should return not configured on HTTP 404', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { detail: 'HashiCorp Vault server definition not found.' } }
    });
    const { result } = renderHook(() => useGetHashicorpVaultConfigApi(true), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot('getHashicorpVaultConfig, 404');
  });

  it('should return not configured on other HTTP errors', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue({
      isAxiosError: true,
      response: { status: 503, data: {} }
    });
    const { result } = renderHook(() => useGetHashicorpVaultConfigApi(true), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot('getHashicorpVaultConfig, error');
  });
});
