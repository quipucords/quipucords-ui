import { TableState } from '@mturley-latest/react-table-batteries';
import { useServiceQuery } from 'src/common/queryHelpers';
import { CredentialType } from 'src/types';

export const CREDS_LIST_QUERY = 'credentialsList';

export const useCredentialsQuery = <
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey
>({
  tableState,
  setRefreshTime
}: {
  tableState: TableState<CredentialType, TColumnKey, TSortableColumnKey>;
  setRefreshTime: (date: Date) => void;
}) =>
  useServiceQuery<CredentialType, TColumnKey, TSortableColumnKey>({
    queryKey: [CREDS_LIST_QUERY],
    baseUrl: process.env.REACT_APP_CREDENTIALS_SERVICE,
    tableState,
    setRefreshTime
  });
