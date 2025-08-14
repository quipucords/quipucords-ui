/**
 * Fetches credentials data for a table, supporting sorting, pagination, and refresh control.
 *
 * @param params Object containing `tableState` for query configuration and `setRefreshTime` for refresh control.
 * @returns Query result with data, loading status, and errors.
 *
 * @module useCredentialsQuery
 */
import { API_CREDS_LIST_QUERY } from '../../constants/apiConstants';
import { useServiceQuery } from '../../helpers/queryHelpers';
import { type CredentialType } from '../../types/types';
import { type TableState } from '../../vendor/react-table-batteries';

type CredentialsColumnKey = 'selection' | 'name' | 'type' | 'auth_type' | 'sources' | 'updated' | 'actions';

type CredentialsSortableColumnKey = 'name' | 'type';

/** Fetches and manages credentials data based on table state. */
const useCredentialsQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<CredentialType, CredentialsColumnKey, CredentialsSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<CredentialType, CredentialsColumnKey, CredentialsSortableColumnKey>({
    queryKey: [API_CREDS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_CREDENTIALS_SERVICE,
    columnOrderMap: {
      name: 'name',
      type: 'cred_type'
    },
    tableState,
    setRefreshTime
  });

export {
  useCredentialsQuery as default,
  useCredentialsQuery,
  type CredentialsColumnKey,
  type CredentialsSortableColumnKey
};
