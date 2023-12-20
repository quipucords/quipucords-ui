import { TableState } from '@mturley-latest/react-table-batteries';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import helpers from 'src/common';

export const getServiceQueryUrl = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey
>({
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
    activeSort?.columnKey
      ? columnOrderMap?.[activeSort.columnKey] || activeSort.columnKey
      : initialSort?.columnKey
  }`;

  const query =
    `${baseUrl}` +
    `?` +
    `ordering=${ordering}` +
    `&` +
    `page=${pageNumber}` +
    `&` +
    `page_size=${itemsPerPage}${filterParams ? `&${filterParams}` : ''}`;

  return query;
};

export type ServiceQueryResult<TItem> = { count: number; results: TItem[] };

export const useServiceQuery = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey
>({
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
}) =>
  useQuery<ServiceQueryResult<TItem>>({
    queryKey: [...queryKey, tableState.cacheKey],
    refetchOnWindowFocus: !helpers.DEV_MODE,
    queryFn: async () => {
      try {
        const query = getServiceQueryUrl({ tableState, baseUrl, columnOrderMap });
        console.log(`Query: `, query);
        const response = await axios.get<ServiceQueryResult<TItem>>(query, {
          headers: { Authorization: `Token ${localStorage.getItem('authToken')}` }
        });
        setRefreshTime?.(new Date());
        return response.data;
      } catch (error) {
        console.error(error);
        throw error; // You can choose to throw the error or return a default value here
      }
    }
  });
