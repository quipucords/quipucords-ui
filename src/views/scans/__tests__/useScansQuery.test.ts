import { renderHook } from '@testing-library/react';
jest.mock('../../../helpers/queryHelpers', () => ({
  ...jest.requireActual('../../../helpers/queryHelpers'),
  useServiceQuery: jest.fn(() => ({
    data: { results: [], count: 0 },
    isLoading: false,
    isError: false,
    error: null
  }))
}));
import { getServiceQueryUrl, useServiceQuery } from '../../../helpers/queryHelpers';
import { type ScanResponse } from '../../../types/types';
import { type TableState } from '../../../vendor/react-table-batteries';
import { useScansQuery } from '../useScansQuery';

type ScansColumnKey = 'selection' | 'name' | 'most_recent' | 'sources' | 'actions';
type ScansSortableColumnKey = 'name' | 'most_recent';

const makeTableState = (initialSort: {
  columnKey: ScansSortableColumnKey;
  direction: 'asc' | 'desc';
}): TableState<ScanResponse, ScansColumnKey, ScansSortableColumnKey> =>
  ({
    sort: { activeSort: null, initialSort },
    filter: { filterValues: null },
    pagination: { pageNumber: 1, itemsPerPage: 10 },
    cacheKey: 'test'
  }) as unknown as TableState<ScanResponse, ScansColumnKey, ScansSortableColumnKey>;

const columnOrderMap: Record<ScansSortableColumnKey, string> = {
  name: 'name',
  most_recent: 'most_recent_scanjob__start_time'
};

describe('useScansQuery', () => {
  it('calls useServiceQuery with correct parameters', () => {
    const mockSetRefreshTime = jest.fn();
    const mockTableState = {} as TableState<ScanResponse, ScansColumnKey, ScansSortableColumnKey>;

    renderHook(() =>
      useScansQuery({
        tableState: mockTableState,
        setRefreshTime: mockSetRefreshTime
      })
    );

    expect(useServiceQuery).toHaveBeenCalledWith({
      queryKey: ['scansList'],
      baseUrl: process.env.REACT_APP_SCANS_SERVICE,
      columnOrderMap,
      tableState: mockTableState,
      setRefreshTime: mockSetRefreshTime
    });
  });
});

describe('scans default sort ordering', () => {
  it('produces descending most_recent ordering by default', () => {
    const tableState = makeTableState({ columnKey: 'most_recent', direction: 'desc' });
    const url = getServiceQueryUrl({
      tableState,
      baseUrl: 'http://localhost/api/v2/scans/',
      columnOrderMap
    });
    expect(url).toContain('ordering=-most_recent');
  });

  it('produces ascending name ordering when name asc is set', () => {
    const tableState = makeTableState({ columnKey: 'name', direction: 'asc' });
    const url = getServiceQueryUrl({
      tableState,
      baseUrl: 'http://localhost/api/v2/scans/',
      columnOrderMap
    });
    expect(url).toContain('ordering=name');
    expect(url).not.toContain('ordering=-name');
  });
});
