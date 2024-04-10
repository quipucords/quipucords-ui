/**
 * Credentials List View Component
 *
 * This component displays a table of credentials, allowing users to view, filter, and manage credentials.
 * It provides features like adding credentials, deleting selected credentials, and refreshing the data.
 *
 ** @module credentialsListView
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
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  ToolbarContent,
  ToolbarItem,
  getUniqueId
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import ActionMenu from 'src/components/actionMenu';
import { SimpleDropdown } from 'src/components/simpleDropdown';
import {
  API_CREDS_LIST_QUERY,
  API_DATA_SOURCE_TYPES,
  API_QUERY_TYPES
} from 'src/constants/apiConstants';
import useCredentialApi from 'src/hooks/api/useCredentialApi';
import useAlerts from 'src/hooks/useAlerts';
import useQueryClientConfig from 'src/services/queryClientConfig';
import { helpers } from '../../common';
import { RefreshTimeButton } from '../../components/refreshTimeButton/refreshTimeButton';
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
        const successMessage = t('toast-notifications.description', {
          context: 'deleted-credential',
          name: pendingDeleteCredential?.name
        });
        addAlert(successMessage, 'success', getUniqueId());
        onRefresh();
      })
      .catch(err => {
        console.log(err);
        const errorMessage = t('toast-notifications.description', {
          context: 'deleted-credential_error',
          name: pendingDeleteCredential?.name,
          message: err.response.data.detail
        });
        addAlert(errorMessage, 'danger', getUniqueId());
      })
      .finally(() => setPendingDeleteCredential(undefined));
  };

  /**
   * Initializes table state with URL persistence, including configurations for columns, filters, sorting, pagination, and selection.
   *
   * Features:
   * - Column definitions: 'name', 'type', 'auth_type', 'sources', 'updated', with actions placeholder.
   * - Filters for name and credential type, with selectable options for data source types.
   * - Sortable columns with 'name' as default sort field.
   * - Pagination and selection enabled for enhanced table interaction.
   *
   * Utilizes `useTableState` hook for state management based on these configurations.
   */
  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      name: t('table.header', { context: 'name' }),
      type: t('table.header', { context: 'type' }),
      auth_type: t('table.header', { context: 'auth-type' }),
      sources: t('table.header', { context: 'sources' }),
      updated: t('table.header', { context: 'last-updated' }),
      actions: ' '
    },
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: API_QUERY_TYPES.SEARCH_NAME,
          title: t('toolbar.label', { context: 'option_name' }),
          type: FilterType.search,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_search_by_name' })
        },
        {
          key: API_QUERY_TYPES.CREDENTIAL_TYPE,
          title: t('toolbar.label', { context: 'option_cred_type' }),
          type: FilterType.select,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_cred_type' }),
          selectOptions: [
            {
              key: API_DATA_SOURCE_TYPES.ANSIBLE,
              label: API_DATA_SOURCE_TYPES.ANSIBLE,
              value: t('toolbar.label', { context: 'chip_ansible' })
            },
            {
              key: API_DATA_SOURCE_TYPES.NETWORK,
              label: API_DATA_SOURCE_TYPES.NETWORK,
              value: t('toolbar.label', { context: 'chip_network' })
            },
            {
              key: API_DATA_SOURCE_TYPES.OPENSHIFT,
              label: API_DATA_SOURCE_TYPES.OPENSHIFT,
              value: t('toolbar.label', { context: 'chip_openshift' })
            },
            {
              key: API_DATA_SOURCE_TYPES.RHACS,
              label: API_DATA_SOURCE_TYPES.RHACS,
              value: t('toolbar.label', { context: 'chip_rhacs' })
            },
            {
              key: API_DATA_SOURCE_TYPES.SATELLITE,
              label: API_DATA_SOURCE_TYPES.SATELLITE,
              value: t('toolbar.label', { context: 'chip_satellite' })
            },
            {
              key: API_DATA_SOURCE_TYPES.VCENTER,
              label: API_DATA_SOURCE_TYPES.VCENTER,
              value: t('toolbar.label', { context: 'chip_vcenter' })
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

  const renderAddCredsButton = () => (
    <SimpleDropdown
      label={t('view.empty-state_label_credentials')}
      variant="primary"
      dropdownItems={[
        t('dataSource.network'),
        t('dataSource.openshift'),
        t('dataSource.rhacs'),
        t('dataSource.satellite'),
        t('dataSource.vcenter'),
        t('dataSource.ansible')
      ].map(type => (
        <DropdownItem key={type} onClick={() => setAddCredentialModal(type)}>
          {type}
        </DropdownItem>
      ))}
    />
  );

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem> {renderAddCredsButton()}</ToolbarItem>
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
            <EmptyState>
              <EmptyStateHeader
                headingLevel="h4"
                titleText="No available credential"
                icon={<EmptyStateIcon icon={PlusCircleIcon} />}
              />
              <EmptyStateBody>
                A credential contains authentication information needed to scan a source.A
                credential includes a username and a password or SSH key. The quipucords tool uses
                SSH to connect to servers on the network and uses credentials to access those
                servers.
              </EmptyStateBody>
              <EmptyStateFooter>
                <EmptyStateActions>{renderAddCredsButton()}</EmptyStateActions>
              </EmptyStateFooter>
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
          title={t('form-dialog.label', { context: 'sources' })}
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
          title={t('form-dialog.confirmation', { context: 'title_delete-credential' })}
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
