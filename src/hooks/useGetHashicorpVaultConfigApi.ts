import { useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { API_HASHICORP_VAULT_CONFIG_QUERY } from '../constants/apiConstants';
import { helpers } from '../helpers';

export type HashicorpVaultGlobalConfig = {
  address: string;
  port: number;
  ssl_verify: boolean;
};

export type HashicorpVaultConfigResult = {
  vaultConfigured: boolean;
  config?: HashicorpVaultGlobalConfig;
};

const fetchHashicorpVaultConfig = async (): Promise<HashicorpVaultConfigResult> => {
  const url = process.env.REACT_APP_AUTH_HASHICORP_VAULT_SERVICE?.trim();
  if (!url) {
    return { vaultConfigured: false };
  }

  try {
    const { data } = await axios.get<HashicorpVaultGlobalConfig>(url);
    return { vaultConfigured: true, config: data };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { vaultConfigured: false };
    }
    if (!helpers.TEST_MODE) {
      console.error(error);
    }
    return { vaultConfigured: false };
  }
};

const useGetHashicorpVaultConfigApi = (enabled: boolean) =>
  useQuery({
    queryKey: [API_HASHICORP_VAULT_CONFIG_QUERY],
    queryFn: fetchHashicorpVaultConfig,
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false
  });

export { useGetHashicorpVaultConfigApi };
