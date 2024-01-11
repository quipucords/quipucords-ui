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
