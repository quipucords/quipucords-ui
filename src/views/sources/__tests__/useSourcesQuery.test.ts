import { type TableState } from '@mturley-latest/react-table-batteries';
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
import { type SourceType } from '../../../types/types';
import { type SourcesColumnKey, type SourcesSortableColumnKey, useSourcesQuery } from '../useSourcesQuery';

describe('useSourcesQuery', () => {
  it('should call useServiceQuery with correct parameters', () => {
    const mockSetRefreshTime = jest.fn();
    const mockTableState = {} as TableState<SourceType, SourcesColumnKey, SourcesSortableColumnKey>;

    renderHook(() =>
      useSourcesQuery({
        tableState: mockTableState,
        setRefreshTime: mockSetRefreshTime
      })
    );

    expect(useServiceQuery).toHaveBeenCalledWith({
      queryKey: ['sourcesList'],
      baseUrl: '/api/v2/sources/',
      columnOrderMap: {
        name: 'name',
        connection: 'most_recent_connect_scan__start_time',
        type: 'source_type'
      },
      tableState: mockTableState,
      setRefreshTime: mockSetRefreshTime
    });
    expect(useServiceQuery).toHaveBeenCalledTimes(1);
  });
});
