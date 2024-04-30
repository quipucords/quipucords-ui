/**
 * Query Client Configuration Hook
 *
 * This hook provides access to the query client configuration for making API calls
 * and managing data fetching using React Query.
 *
 * @module useQueryClientConfig
 */
import { useQueryClient } from '@tanstack/react-query';

const useQueryClientConfig = () => {
  const queryClient = useQueryClient();

  return { queryClient };
};

export default useQueryClientConfig;
