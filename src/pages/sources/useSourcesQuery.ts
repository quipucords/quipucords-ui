import { TableState } from '@mturley-latest/react-table-batteries';
import { useServiceQuery } from 'src/common/queryHelpers';
import { SourceType } from 'src/types';

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
