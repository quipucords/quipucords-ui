/**
 * Fetches scan data for displaying in a table, integrating sorting and pagination based on table state.
 * Utilizes a custom hook to query scan data, handling API interactions and providing refresh capabilities.
 *
 * @param params Object containing `tableState` for query configuration and `setRefreshTime` for refresh control.
 * @returns Query result with data, loading status, and errors.
 *
 * @module useScansQuery
 */
import { useServiceQuery } from '../../helpers/queryHelpers';
import { type ScanResponse } from '../../types/types';
import { type TableState } from '../../vendor/react-table-batteries';

export const SCANS_LIST_QUERY = 'scansList';

type ScansColumnKey = 'selection' | 'name' | 'most_recent' | 'sources' | 'actions';

type ScansSortableColumnKey = 'name' | 'most_recent';

export const useScansQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<ScanResponse, ScansColumnKey, ScansSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<ScanResponse, ScansColumnKey, ScansSortableColumnKey>({
    queryKey: [SCANS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_SCANS_SERVICE,
    columnOrderMap: {
      name: 'name',
      most_recent: 'most_recent_scanjob__start_time'
    },
    tableState,
    setRefreshTime
  });
