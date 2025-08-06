/**
 * Provides hooks and utility functions for building and executing service queries with pagination, filtering,
 * and sorting capabilities, integrating with `react-table-batteries` and `react-query`.
 * Supports constructing query URLs and performing data fetching with automatic refresh control in development mode.
 *
 * @module queryHelpers
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type TableState } from '../vendor/react-table-batteries';
import { helpers } from './helpers';

export const getServiceQueryUrl = <TItem, TColumnKey extends string, TSortableColumnKey extends TColumnKey>({
  tableState: {
    filter: { filterValues },
    sort: { activeSort, initialSort },
    pagination: { pageNumber, itemsPerPage }
  },
  baseUrl,
  columnOrderMap
}: {
  tableState: TableState<TItem, TColumnKey, TSortableColumnKey>;
  baseUrl?: string;
  columnOrderMap?: Record<TSortableColumnKey, string>;
}) => {
  const filterParams = filterValues
    ? Object.keys(filterValues)
        .map(key => `${key}=${filterValues[key]}`)
        .join('&')
    : null;

  const ordering = `${(activeSort?.direction ?? initialSort?.direction) === 'desc' ? '-' : ''}${
    activeSort?.columnKey ? columnOrderMap?.[activeSort.columnKey] || activeSort.columnKey : initialSort?.columnKey
  }`;

  const query =
    `${baseUrl}` +
    `?` +
    `ordering=${ordering}` +
    `&` +
    `page=${pageNumber}` +
    `&` +
    `page_size=${itemsPerPage}${filterParams ? `&${filterParams}` : ''}` +
    `${baseUrl?.includes('scans') ? '&scan_type=inspect' : ''}`;

  return query;
};

export type ServiceQueryResult<TItem> = { count: number; results: TItem[] };

export const useServiceQuery = <TItem, TColumnKey extends string, TSortableColumnKey extends TColumnKey>({
  queryKey,
  baseUrl,
  columnOrderMap,
  tableState,
  setRefreshTime
}: {
  queryKey: string[];
  baseUrl?: string;
  columnOrderMap?: Record<TSortableColumnKey, string>;
  tableState: TableState<TItem, TColumnKey, TSortableColumnKey>;
  setRefreshTime?: (date: Date) => void;
}) => {
  const pollInterval = process.env.REACT_APP_POLL_INTERVAL
    ? Number.parseInt(process.env.REACT_APP_POLL_INTERVAL, 10)
    : undefined;

  return useQuery<ServiceQueryResult<TItem>>({
    queryKey: [...queryKey, tableState.cacheKey],
    refetchOnWindowFocus: !helpers.DEV_MODE,
    refetchInterval: pollInterval,
    queryFn: async () => {
      try {
        const query = getServiceQueryUrl({ tableState, baseUrl, columnOrderMap });
        console.log(`Query: `, query);
        const response = await axios.get<ServiceQueryResult<TItem>>(query);
        setRefreshTime?.(new Date());
        return response.data;
      } catch (error) {
        console.error('Error during data fetching:', error);
        return { count: 0, results: [] } as ServiceQueryResult<TItem>;
      }
    }
  });
};
