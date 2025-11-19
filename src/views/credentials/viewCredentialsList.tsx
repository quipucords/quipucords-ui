/**
 * Credentials List View Component
 *
 * This component displays a table of credentials, allowing users to view, filter, and manage credentials.
 * It provides features like adding credentials, deleting selected credentials, and refreshing the data.
 *
 *@module credentialsListView
 */
import * as React from 'react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  List,
  ListItem,
  PageSection,
  ToolbarContent,
  ToolbarItem,
  getUniqueId
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { PlusCircleIcon } from '@patternfly/react-icons';
import ActionMenu from '../../components/actionMenu/actionMenu';
import { ErrorMessage } from '../../components/errorMessage/errorMessage';
import { RefreshTimeButton } from '../../components/refreshTimeButton/refreshTimeButton';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { API_CREDS_LIST_QUERY, API_DATA_SOURCE_TYPES, API_QUERY_TYPES } from '../../constants/apiConstants';
import { helpers } from '../../helpers';
import { useAlerts } from '../../hooks/useAlerts';
import { useAddCredentialApi, useDeleteCredentialApi, useEditCredentialApi } from '../../hooks/useCredentialApi';
import useQueryClientConfig from '../../queryClientConfig';
import { type CredentialRequest, type CredentialResponse, type SourceType } from '../../types/types';
import {
  ConditionalTableBody,
  FilterType,
  useTablePropHelpers,
  useTableState
} from '../../vendor/react-table-batteries';
import { useToolbarBulkSelectorWithBatteries } from '../../vendor/react-table-batteries/components/useToolbarBulkSelectorWithBatteries';
import { useTrWithBatteries } from '../../vendor/react-table-batteries/components/useTrWithBatteries';
import { AddCredentialModal, CredentialErrorType } from './addCredentialModal';
import { useCredentialsQuery } from './useCredentialsQuery';

const CredentialsListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [sourcesSelected, setSourcesSelected] = React.useState<SourceType[]>([]);
  const [pendingDeleteCredential, setPendingDeleteCredential] = React.useState<CredentialResponse>();
  const { addAlert, alerts, removeAlert } = useAlerts();
  const { queryClient } = useQueryClientConfig();
  const [addCredentialModal, setAddCredentialModal] = useState<string>();
  const [credentialBeingEdited, setCredentialBeingEdited] = useState<CredentialResponse>();
  const [credentialErrors, setCredentialErrors] = useState<CredentialErrorType | undefined>();
  const { deleteCredentials } = useDeleteCredentialApi(addAlert);
  const { addCredentials } = useAddCredentialApi(addAlert, setCredentialErrors);
  const { editCredentials } = useEditCredentialApi(addAlert, setCredentialErrors);

  /**
   * Invalidates the credentials query to refresh the list
   */
  const refreshCredentialsList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [API_CREDS_LIST_QUERY] });
  }, [queryClient]);

  /**
   * Clears all form validation errors
   */
  const clearCredentialErrors = useCallback(() => {
    setCredentialErrors(undefined);
  }, []);

  /**
   * Opens the add credential modal for a specific credential type
   */
  const openAddCredentialModal = useCallback((credentialType: string) => {
    setAddCredentialModal(credentialType);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Closes the add credential modal
   */
  const closeAddCredentialModal = useCallback(() => {
    setAddCredentialModal(undefined);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Opens the edit credential modal for a specific credential
   */
  const openEditCredentialModal = useCallback((credential: CredentialResponse) => {
    setCredentialBeingEdited(credential);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Closes the edit credential modal
   */
  const closeEditCredentialModal = useCallback(() => {
    setCredentialBeingEdited(undefined);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Handles adding a new credential
   */
  const handleAddCredentialSubmit = useCallback(
    async (payload: CredentialRequest) => {
      try {
        await addCredentials(payload);
        refreshCredentialsList();
        closeAddCredentialModal();
      } catch (error) {
        // Error is handled by the API hook via setCredentialErrors callback
        // This catch prevents unhandled promise rejection warnings
        console.debug('Credential submission failed, handled by API hook');
      }
    },
    [addCredentials, refreshCredentialsList, closeAddCredentialModal]
  );

  /**
   * Handles editing an existing credential
   */
  const handleEditCredentialSubmit = useCallback(
    async (payload: CredentialRequest) => {
      if (!payload.id) {
        console.error('Edit credential requires an id');
        return;
      }
      try {
        await editCredentials(payload as CredentialRequest & { id: number });
        refreshCredentialsList();
        closeEditCredentialModal();
      } catch (error) {
        // Error is handled by the API hook via setCredentialErrors callback
        // This catch prevents unhandled promise rejection warnings
        console.debug('Credential edit failed, handled by API hook');
      }
    },
    [editCredentials, refreshCredentialsList, closeEditCredentialModal]
  );

  /**
   * Handles deleting credentials (single or multiple)
   */
  const handleDeleteCredentials = useCallback(
    async (credential: CredentialResponse | CredentialResponse[]) => {
      try {
        await deleteCredentials(credential);
        refreshCredentialsList();
      } catch (error) {
        // Error is handled by the API hook via addAlert callback
        // This catch prevents unhandled promise rejection warnings
        console.debug('Credential deletion failed, handled by API hook');
      }
    },
    [deleteCredentials, refreshCredentialsList]
  );

  // Create form state objects for the modals
  const addCredentialForm = {
    isOpen: addCredentialModal !== undefined,
    credentialType: addCredentialModal,
    onSubmit: handleAddCredentialSubmit,
    onClose: closeAddCredentialModal,
    errors: credentialErrors,
    onClearErrors: clearCredentialErrors
  };

  const editCredentialForm = {
    isOpen: credentialBeingEdited !== undefined,
    credential: credentialBeingEdited,
    onSubmit: handleEditCredentialSubmit,
    onClose: closeEditCredentialModal,
    errors: credentialErrors,
    onClearErrors: clearCredentialErrors
  };

  /**
   * Fetches the translated label for a credential type.
   *
   * @param {string} credentialType - The cred type identifier.
   * @returns {string} Translated label for the given source type.
   */
  const getTranslatedCredentialTypeLabel = credentialType => {
    const labelKey = `dataSource.${credentialType}`;
    return t(labelKey);
  };

  /**
   * Indicates if credential has any associated sources or not.
   *
   * @param {CredentialResponse} credential - The cred type identifier.
   * @returns {boolean} Translated label for the given source type.
   */
  const credentialHasSources = (credential: CredentialResponse) => credential?.sources?.length;

  /**
   * Invalidates the query cache for the creds list, triggering a refresh.
   */
  const onRefresh = () => {
    refreshCredentialsList();
  };

  /**
   * Initializes table state with URL persistence, including configurations for columns, filters, sorting, pagination,
   * and selection.
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
      selection: ' ',
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
              value: t('dataSource.ansible')
            },
            {
              key: API_DATA_SOURCE_TYPES.NETWORK,
              value: t('dataSource.network')
            },
            {
              key: API_DATA_SOURCE_TYPES.OPENSHIFT,
              value: t('dataSource.openshift')
            },
            {
              key: API_DATA_SOURCE_TYPES.RHACS,
              value: t('dataSource.rhacs')
            },
            {
              key: API_DATA_SOURCE_TYPES.SATELLITE,
              value: t('dataSource.satellite')
            },
            {
              key: API_DATA_SOURCE_TYPES.VCENTER,
              value: t('dataSource.vcenter')
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
    selection: {
      isEnabled: true
    }
  });

  const { isError, isLoading, data } = useCredentialsQuery({ tableState, setRefreshTime });

  const tableBatteries = useTablePropHelpers({
    ...tableState,
    idProperty: 'id',
    isLoading,
    currentPageItems: data?.results || [],
    totalItemCount: data?.count || 0
  });

  const {
    selection: { selectedItems, setSelectedItems },
    currentPageItems,
    numRenderedColumns,
    components: { Toolbar, FilterToolbar, PaginationToolbarItem, Pagination, Table, Tbody, Td, Th, Thead }
  } = tableBatteries;

  const ToolbarBulkSelector = useToolbarBulkSelectorWithBatteries(tableBatteries);

  const TrWithBatteries = useTrWithBatteries(tableBatteries);

  const hasSelectedCredentials = () => {
    if (Array.isArray(selectedItems)) {
      return selectedItems.length > 0;
    }
    return Object.values(selectedItems ?? {}).filter(Boolean).length > 0;
  };

  const renderAddCredsButton = () => (
    <SimpleDropdown
      label={t('view.empty-state_label_credentials')}
      menuToggleOuiaId="add_credential_button"
      variant="primary"
      onSelect={openAddCredentialModal}
      dropdownItems={[
        { item: t('dataSource.network'), ouiaId: 'network' },
        { item: t('dataSource.openshift'), ouiaId: 'openshift' },
        { item: t('dataSource.rhacs'), ouiaId: 'rhacs' },
        { item: t('dataSource.satellite'), ouiaId: 'satellite' },
        { item: t('dataSource.vcenter'), ouiaId: 'vcenter' },
        { item: t('dataSource.ansible'), ouiaId: 'ansible' }
      ]}
    />
  );

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        {/* Only show bulk selector when there are items to select */}
        {!isLoading && currentPageItems.length > 0 && <ToolbarBulkSelector />}
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem> {renderAddCredsButton()}</ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!hasSelectedCredentials()}
            onClick={() =>
              handleDeleteCredentials(selectedItems).finally(() => {
                setSelectedItems([]);
              })
            }
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
    <PageSection hasBodyWrapper={false}>
      {renderToolbar()}
      <Table aria-label={t('table.label', { context: 'aria-credentials' })} variant="compact">
        <Thead>
          <TrWithBatteries isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="type" />
            <Th columnKey="auth_type" />
            <Th columnKey="sources" />
            <Th columnKey="updated" />
            <Th columnKey="actions" />
          </TrWithBatteries>
        </Thead>
        <ConditionalTableBody
          isError={isError}
          isLoading={isLoading}
          isNoData={currentPageItems.length === 0}
          errorEmptyState={<ErrorMessage title={t('view.error_title', { context: 'credentials' })} />}
          noDataEmptyState={
            <EmptyState
              headingLevel="h4"
              icon={PlusCircleIcon}
              titleText={t('view.empty-state', { context: 'credentials_title' })}
            >
              <EmptyStateBody>{t('view.empty-state', { context: 'credentials_description' })}</EmptyStateBody>
              <EmptyStateFooter>
                <EmptyStateActions>{renderAddCredsButton()}</EmptyStateActions>
              </EmptyStateFooter>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((credential: CredentialResponse, rowIndex) => (
              <TrWithBatteries key={credential.id} item={credential} rowIndex={rowIndex}>
                <Td columnKey="name">{credential.name}</Td>
                <Td columnKey="type">{getTranslatedCredentialTypeLabel(credential.cred_type)}</Td>
                <Td columnKey="auth_type">{helpers.getAuthType(credential)}</Td>
                <Td hasAction columnKey="sources">
                  <Button
                    variant={ButtonVariant.link}
                    size="sm"
                    onClick={() => {
                      if (credential.sources && credential.sources.length > 0) {
                        setSourcesSelected(credential.sources);
                      }
                    }}
                    isDisabled={!credentialHasSources(credential)}
                  >
                    {' '}
                    {credential.sources?.length || 0}
                  </Button>
                </Td>
                <Td columnKey="updated">{helpers.getTimeDisplayHowLongAgo(credential.updated_at)}</Td>
                <Td isActionCell columnKey="actions">
                  <ActionMenu<CredentialResponse>
                    popperProps={{ position: 'right' }}
                    item={credential}
                    size="sm"
                    actions={[
                      {
                        label: t('table.label', { context: 'edit' }),
                        onClick: openEditCredentialModal,
                        ouiaId: 'edit-credential'
                      },
                      {
                        label: t('table.label', { context: 'delete' }),
                        disabled: !!credentialHasSources(credential),
                        onClick: setPendingDeleteCredential,
                        ouiaId: 'delete-credential',
                        ...(credentialHasSources(credential) && {
                          tooltipProps: { content: t('table.label', { context: 'delete-disabled-tooltip-credential' }) }
                        })
                      }
                    ]}
                  />
                </Td>
              </TrWithBatteries>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" widgetId="server-paginated-example-pagination" />
      <Modal
        variant={ModalVariant.small}
        title={t('form-dialog.label', { context: 'sources' })}
        isOpen={sourcesSelected.length > 0}
        onClose={() => setSourcesSelected([])}
        actions={[
          <Button
            key="confirm"
            variant="secondary"
            onClick={() => {
              setSourcesSelected([]);
            }}
          >
            {t('table.label', { context: 'close' })}
          </Button>
        ]}
      >
        <List isPlain isBordered>
          {sourcesSelected
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => (
              <ListItem key={c.name}>{c.name}</ListItem>
            ))}
        </List>
        {/* TODO: his modal should go on a list of getting it's own component * check PR #381 for details */}
      </Modal>
      <Modal
        variant={ModalVariant.small}
        title={t('form-dialog.confirmation', { context: 'title_delete-credential' })}
        isOpen={pendingDeleteCredential !== undefined}
        onClose={() => setPendingDeleteCredential(undefined)}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            onClick={() => {
              if (pendingDeleteCredential) {
                handleDeleteCredentials(pendingDeleteCredential).finally(() => {
                  setPendingDeleteCredential(undefined);
                });
              }
            }}
          >
            {t('table.label', { context: 'delete' })}
          </Button>,
          <Button key="cancel" variant="link" onClick={() => setPendingDeleteCredential(undefined)}>
            {t('form-dialog.label', { context: 'cancel' })}
          </Button>
        ]}
      >
        {t('form-dialog.confirmation_heading', {
          context: 'delete-credential',
          name: pendingDeleteCredential?.name
        })}
      </Modal>
      <AddCredentialModal
        isOpen={editCredentialForm.isOpen}
        credential={editCredentialForm.credential}
        errors={editCredentialForm.errors}
        onClose={editCredentialForm.onClose}
        onSubmit={editCredentialForm.onSubmit}
        onClearErrors={editCredentialForm.onClearErrors}
      />
      <AddCredentialModal
        isOpen={addCredentialForm.isOpen}
        credentialType={addCredentialForm.credentialType}
        errors={addCredentialForm.errors}
        onClose={addCredentialForm.onClose}
        onSubmit={addCredentialForm.onSubmit}
        onClearErrors={addCredentialForm.onClearErrors}
      />
      <AlertGroup isToast isLiveRegion>
        {alerts.map(({ id, variant, title }) => (
          <Alert
            timeout={8000}
            onTimeout={() => id && removeAlert(id)}
            variant={AlertVariant[variant || 'info']}
            title={title}
            actionClose={
              <AlertActionCloseButton
                title={title as string}
                variantLabel={`${variant} alert`}
                onClose={() => id && removeAlert(id)}
              />
            }
            id={id}
            key={id || getUniqueId()}
          />
        ))}
      </AlertGroup>
    </PageSection>
  );
};

export default CredentialsListView;
