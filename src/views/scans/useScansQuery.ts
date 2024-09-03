/**
 * Fetches scan data for displaying in a table, integrating sorting and pagination based on table state.
 * Utilizes a custom hook to query scan data, handling API interactions and providing refresh capabilities.
 *
 * @param params Object containing `tableState` for query configuration and `setRefreshTime` for refresh control.
 * @returns Query result with data, loading status, and errors.
 *
 * @module useScansQuery
 */
import { type TableState } from '@mturley-latest/react-table-batteries';
import { useServiceQuery } from '../../helpers/queryHelpers';
import { type Scan } from '../../types/types';

export const SCANS_LIST_QUERY = 'scansList';

type ScansColumnKey = 'name' | 'most_recent' | 'sources' | 'actions';

type ScansSortableColumnKey = 'name' | 'most_recent';

export const useScansQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<Scan, ScansColumnKey, ScansSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<Scan, ScansColumnKey, ScansSortableColumnKey>({
    queryKey: [SCANS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_SCANS_SERVICE,
    columnOrderMap: {
      name: 'name',
      most_recent: 'most_recent_connect_scan__start_time'
    },
    tableState,
    setRefreshTime
  });
