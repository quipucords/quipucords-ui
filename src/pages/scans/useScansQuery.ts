/**
 * Fetches scan data for displaying in a table, integrating sorting and pagination based on table state.
 * Utilizes a custom hook to query scan data, handling API interactions and providing refresh capabilities.
 *
 * @param params Object containing `tableState` for query configuration and `setRefreshTime` for refresh control.
 * @returns Query result with data, loading status, and errors.
 *
 * @module useScansQuery
 */
import { TableState } from '@mturley-latest/react-table-batteries';
import { useServiceQuery } from 'src/common/queryHelpers';
import { ScanType } from 'src/types';

export const SCANS_LIST_QUERY = 'scansList';

type ScansColumnKey = 'id' | 'most_recent' | 'sources' | 'actions';

type ScansSortableColumnKey = 'id' | 'most_recent';

export const useScansQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<ScanType, ScansColumnKey, ScansSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<ScanType, ScansColumnKey, ScansSortableColumnKey>({
    queryKey: [SCANS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_SCANS_SERVICE,
    columnOrderMap: {
      id: 'id',
      most_recent: 'most_recent_connect_scan__start_time'
    },
    tableState,
    setRefreshTime
  });
