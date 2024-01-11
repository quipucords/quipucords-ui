import { TableState } from '@mturley-latest/react-table-batteries';
import { useServiceQuery } from 'src/common/queryHelpers';
import { CredentialType } from 'src/types';

export const CREDS_LIST_QUERY = 'credentialsList';

type CredentialsColumnKey = 'name' | 'type' | 'auth_type' | 'sources' | 'updated' | 'actions';

type CredentialsSortableColumnKey = 'name' | 'type';

export const useCredentialsQuery = ({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<CredentialType, CredentialsColumnKey, CredentialsSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<CredentialType, CredentialsColumnKey, CredentialsSortableColumnKey>({
    queryKey: [CREDS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_CREDENTIALS_SERVICE,
    columnOrderMap: {
      name: 'name',
      type: 'cred_type'
    },
    tableState,
    setRefreshTime
  });
