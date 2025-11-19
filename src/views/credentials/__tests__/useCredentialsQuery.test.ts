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
import { type CredentialResponse } from '../../../types/types';
import { type TableState } from '../../../vendor/react-table-batteries';
import {
  type CredentialsColumnKey,
  type CredentialsSortableColumnKey,
  useCredentialsQuery
} from '../useCredentialsQuery';

describe('useCredentialsQuery', () => {
  it('should call useServiceQuery with correct parameters', () => {
    const mockSetRefreshTime = jest.fn();
    const mockTableState = {} as TableState<CredentialResponse, CredentialsColumnKey, CredentialsSortableColumnKey>;

    renderHook(() =>
      useCredentialsQuery({
        tableState: mockTableState,
        setRefreshTime: mockSetRefreshTime
      })
    );

    expect(useServiceQuery).toHaveBeenCalledWith({
      queryKey: ['credentialsList'],
      baseUrl: '/api/v2/credentials/',
      columnOrderMap: {
        name: 'name',
        type: 'cred_type'
      },
      tableState: mockTableState,
      setRefreshTime: mockSetRefreshTime
    });
    expect(useServiceQuery).toHaveBeenCalledTimes(1);
  });
});
