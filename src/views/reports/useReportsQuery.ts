/**
 * Fetches report data for displaying in a table, integrating sorting and pagination based on table state.
 * Utilizes a custom hook to query report data, handling API interactions and providing refresh capabilities.
 *
 * @param params Object containing `tableState` for query configuration and `setRefreshTime` for refresh control.
 * @returns Query result with data, loading status, and errors.
 *
 * @module useReportsQuery
 */
import { API_REPORTS_LIST_QUERY } from '../../constants/apiConstants';
import { useServiceQuery } from '../../helpers/queryHelpers';
import { type ReportType } from '../../types/types';
import { type TableState } from '../../vendor/react-table-batteries';

type ReportsColumnKey = 'selection' | 'id' | 'origin' | 'created' | 'actions';

type ReportsSortableColumnKey = 'id' | 'origin' | 'created';

const useReportsQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<ReportType, ReportsColumnKey, ReportsSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<ReportType, ReportsColumnKey, ReportsSortableColumnKey>({
    queryKey: [API_REPORTS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_REPORTS_SERVICE_LIST,
    columnOrderMap: {
      id: 'id',
      origin: 'origin',
      created: 'created_at'
    },
    tableState,
    setRefreshTime
  });

export { useReportsQuery as default, useReportsQuery, type ReportsColumnKey, type ReportsSortableColumnKey };
