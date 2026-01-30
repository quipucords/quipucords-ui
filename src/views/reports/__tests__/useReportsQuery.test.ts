import { renderHook } from '@testing-library/react';
jest.mock('../../../helpers/queryHelpers', () => ({
  useServiceQuery: jest.fn(() => ({
    data: { results: [], count: 0 },
    isLoading: false,
    isError: false,
    error: null
  }))
}));
import { useServiceQuery } from '../../../helpers/queryHelpers';
import { type ReportType } from '../../../types/types';
import { type TableState } from '../../../vendor/react-table-batteries';
import { type ReportsColumnKey, type ReportsSortableColumnKey, useReportsQuery } from '../useReportsQuery';

describe('useReportsQuery', () => {
  it('should call useServiceQuery with correct parameters', () => {
    const mockSetRefreshTime = jest.fn();
    const mockTableState = {} as TableState<ReportType, ReportsColumnKey, ReportsSortableColumnKey>;

    renderHook(() =>
      useReportsQuery({
        tableState: mockTableState,
        setRefreshTime: mockSetRefreshTime
      })
    );

    expect(useServiceQuery).toHaveBeenCalledWith({
      queryKey: ['reportsList'],
      baseUrl: process.env.REACT_APP_REPORTS_SERVICE_LIST,
      columnOrderMap: {
        id: 'id',
        origin: 'origin',
        created: 'created_at'
      },
      tableState: mockTableState,
      setRefreshTime: mockSetRefreshTime
    });
    expect(useServiceQuery).toHaveBeenCalledTimes(1);
  });
});
