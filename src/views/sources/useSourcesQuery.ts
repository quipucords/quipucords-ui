/**
 * Utilizes a custom hook to query and manage source data for presentation in a table, integrating sorting, pagination, and refresh functionality.
 * Leverages the `useServiceQuery` hook for API interactions, adapting to table state changes and facilitating efficient data retrieval and display.
 *
 * @param params Object containing `tableState` for handling table configurations and `setRefreshTime` for updating refresh timestamps.
 * @returns A query hook result providing source data, loading states, and error handling.
 *
 * @module useSourcesQuery
 */
import { TableState } from '@mturley-latest/react-table-batteries';
import { useServiceQuery } from 'src/helpers/queryHelpers';
import { SourceType } from 'src/types/types';

export const SOURCES_LIST_QUERY = 'sourcesList';

type SourcesColumnKey =
  | 'name'
  | 'connection'
  | 'type'
  | 'actions'
  | 'credentials'
  | 'unreachableSystems'
  | 'scan';

type SourcesSortableColumnKey = 'name' | 'connection' | 'type';

export const useSourcesQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<SourceType, SourcesColumnKey, SourcesSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<SourceType, SourcesColumnKey, SourcesSortableColumnKey>({
    queryKey: [SOURCES_LIST_QUERY],
    baseUrl: process.env.REACT_APP_SOURCES_SERVICE,
    columnOrderMap: {
      name: 'name',
      connection: 'most_recent_connect_scan__start_time',
      type: 'source_type'
    },
    tableState,
    setRefreshTime
  });
