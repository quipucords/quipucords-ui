/**
 * Credentials List View Component
 *
 * This component displays a table of credentials, allowing users to view, filter, and manage credentials.
 * It provides features like adding credentials, deleting selected credentials, and refreshing the data.
 *
 ** @module CredentialsListView
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ConditionalTableBody,
  FilterType,
  useTablePropHelpers,
  useTableState
} from '@mturley-latest/react-table-batteries';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  DropdownItem,
  EmptyState,
  EmptyStateIcon,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  Title,
  ToolbarContent,
  ToolbarItem,
  getUniqueId
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import ActionMenu from 'src/components/ActionMenu';
import { SimpleDropdown } from 'src/components/SimpleDropdown';
import { API_CREDS_LIST_QUERY } from 'src/constants/apiConstants';
import useCredentialApi from 'src/hooks/api/useCredentialApi';
import useAlerts from 'src/hooks/useAlerts';
import useQueryClientConfig from 'src/services/queryClientConfig';
import { helpers } from '../../common';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import { CredentialType, SourceType } from '../../types';
import { useCredentialsQuery } from './useCredentialsQuery';

const CredentialsListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [sourcesSelected, setSourcesSelected] = React.useState<SourceType[]>([]);
  const [addCredentialModal, setAddCredentialModal] = React.useState<string>();
  const {
    deleteCredential,
    onDeleteSelectedCredentials,
    pendingDeleteCredential,
    setPendingDeleteCredential
  } = useCredentialApi();
  const { queryClient } = useQueryClientConfig();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { getAuthType, getTimeDisplayHowLongAgo } = helpers;

  /** Fetches the translated label for a credential type.
   *
   * @param {string} credentialType - The cred type identifier.
   * @returns {string} Translated label for the given source type.
   */
  const getTranslatedCredentialTypeLabel = credentialType => {
    const labelKey = `dataSource.${credentialType}`;
    return t(labelKey);
  };

  /**
   * Invalidates the query cache for the creds list, triggering a refresh.
   */
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [API_CREDS_LIST_QUERY] });
  };

  /**
   * Deletes the pending credential and handles success, error, and cleanup operations.
   */
  const onDeleteCredential = () => {
    deleteCredential()
      .then(() => {
        addAlert(
          `Credential "${pendingDeleteCredential?.name}" deleted successfully`,
          'success',
          getUniqueId()
        );
        onRefresh();
      })
      .catch(err => {
        console.log(err);
        let errorDetail = '';
        if (err?.response?.data) {
          errorDetail += JSON.stringify(err.response.data);
        }
        addAlert(
          `Error removing credential ${pendingDeleteCredential?.name}. ${errorDetail}`,
          'danger',
          getUniqueId()
        );
      })
      .finally(() => setPendingDeleteCredential(undefined));
  };

  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      name: 'Name',
      type: 'Type',
      auth_type: 'Authentication type',
      sources: 'Sources',
      updated: 'Last updated',
      actions: ' '
    },
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: 'search_by_name',
          title: 'Name',
          type: FilterType.search,
          placeholderText: 'Filter by name'
        },
        {
          key: 'cred_type',
          title: 'Credential type',
          type: FilterType.select,
          placeholderText: 'Filter by credential type',
          selectOptions: [
            {
              key: 'ansible',
              label: 'ansible',
              value: 'Ansible'
            },
            {
              key: 'network',
              label: 'network',
              value: 'Network'
            },
            {
              key: 'openshift',
              label: 'openShift',
              value: 'Openshift'
            },
            {
              key: 'rhacs',
              label: 'rhacs',
              value: 'RHACS'
            },
            {
              key: 'satellite',
              label: 'satellite',
              value: 'Satellite'
            },
            {
              key: 'vcenter',
              label: 'vcenter',
              value: 'vCenter'
            }
          ]
        }
      ]
    },
    sort: {
      isEnabled: true,
      sortableColumns: ['name', 'type'],
      initialSort: { columnKey: 'name', direction: 'asc' }
    },
    pagination: { isEnabled: true },
    selection: { isEnabled: true }
  });

  const { isLoading, data } = useCredentialsQuery({ tableState, setRefreshTime });

  let totalResults = data?.count || 0;
  if (helpers.DEV_MODE) {
    totalResults = helpers.devModeNormalizeCount(totalResults);
  }

  const tableBatteries = useTablePropHelpers({
    ...tableState,
    idProperty: 'id',
    isLoading,
    currentPageItems: data?.results || [],
    totalItemCount: totalResults,
    variant: 'compact'
  });

  const {
    selection: { selectedItems },
    currentPageItems,
    numRenderedColumns,
    components: {
      Toolbar,
      FilterToolbar,
      PaginationToolbarItem,
      Pagination,
      Table,
      Tbody,
      Td,
      Th,
      Thead,
      Tr
    }
  } = tableBatteries;

  const hasSelectedCredentials = () => {
    return Object.values(selectedItems).filter(val => val !== null).length > 0;
  };

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem>
          <SimpleDropdown
            label="Add Credential"
            variant="primary"
            dropdownItems={[
              'Network range',
              'OpenShift',
              'RHACS',
              'Satellite',
              'vCenter server',
              'Ansible controller'
            ].map(type => (
              <DropdownItem key={type} onClick={() => setAddCredentialModal(type)}>
                {type}
              </DropdownItem>
            ))}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!hasSelectedCredentials()}
            onClick={onDeleteSelectedCredentials}
          >
            {t('table.label', { context: 'delete' })}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <RefreshTimeButton lastRefresh={refreshTime?.getTime() ?? 0} onRefresh={onRefresh} />
        </ToolbarItem>
        <PaginationToolbarItem>
          <Pagination variant="top" isCompact widgetId="client-paginated-example-pagination" />
        </PaginationToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <PageSection variant="light">
      {renderToolbar()}
      <Table aria-label="Example things table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="type" />
            <Th columnKey="auth_type" />
            <Th columnKey="sources" />
            <Th columnKey="updated" />
            <Th columnKey="actions" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isLoading}
          isNoData={currentPageItems.length === 0}
          noDataEmptyState={
            <EmptyState variant="sm">
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h2" size="lg">
                No things available
              </Title>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((credential: CredentialType, rowIndex) => (
              <Tr key={credential.id} item={credential} rowIndex={rowIndex}>
                <Td columnKey="name">{credential.name}</Td>
                <Td columnKey="type">{getTranslatedCredentialTypeLabel(credential.cred_type)}</Td>
                <Td columnKey="auth_type">{getAuthType(credential)}</Td>
                <Td columnKey="sources">
                  <Button
                    variant={ButtonVariant.link}
                    onClick={() => {
                      if (credential.sources && credential.sources.length > 0) {
                        setSourcesSelected(credential.sources);
                      }
                    }}
                    isDisabled={!credential.sources?.length}
                  >
                    {' '}
                    {credential.sources?.length || 0}
                  </Button>
                </Td>
                <Td columnKey="updated">{getTimeDisplayHowLongAgo(credential.updated_at)}</Td>
                <Td isActionCell columnKey="actions">
                  <ActionMenu<CredentialType>
                    item={credential}
                    actions={[{ label: 'Delete', onClick: setPendingDeleteCredential }]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" widgetId="server-paginated-example-pagination" />
      {!!addCredentialModal && (
        <Modal
          variant={ModalVariant.small}
          title="Add"
          isOpen={!!addCredentialModal}
          onClose={() => setAddCredentialModal(undefined)}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              onClick={() => setAddCredentialModal(undefined)}
            >
              Close
            </Button>
          ]}
        >
          Placeholder - add {addCredentialModal}
        </Modal>
      )}
      {!!sourcesSelected.length && (
        <Modal
          variant={ModalVariant.small}
          title="Sources"
          isOpen={!!sourcesSelected}
          onClose={() => setSourcesSelected([])}
          actions={[
            <Button key="cancel" variant="secondary" onClick={() => setSourcesSelected([])}>
              Close
            </Button>
          ]}
        >
          <List isPlain isBordered>
            {sourcesSelected.map(c => (
              <ListItem key={c.name}>{c.name}</ListItem>
            ))}
          </List>
        </Modal>
      )}
      {!!pendingDeleteCredential && (
        <Modal
          variant={ModalVariant.small}
          title="Permanently delete credential"
          isOpen={!!pendingDeleteCredential}
          onClose={() => setPendingDeleteCredential(undefined)}
          actions={[
            <Button key="confirm" variant="danger" onClick={() => onDeleteCredential()}>
              Delete
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={() => setPendingDeleteCredential(undefined)}
            >
              Cancel
            </Button>
          ]}
        >
          Are you sure you want to delete the credential &quot;
          {pendingDeleteCredential.name}&quot;
        </Modal>
      )}
      <AlertGroup isToast isLiveRegion>
        {alerts.map(({ key, variant, title }) => (
          <Alert
            timeout={8000}
            onTimeout={() => key && removeAlert(key)}
            variant={AlertVariant[variant || 'info']}
            title={title}
            actionClose={
              <AlertActionCloseButton
                title={title as string}
                variantLabel={`${variant} alert`}
                onClose={() => key && removeAlert(key)}
              />
            }
            key={key}
          />
        ))}
      </AlertGroup>
    </PageSection>
  );
};

export default CredentialsListView;
