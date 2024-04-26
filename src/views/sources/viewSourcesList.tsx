/**
 * SourcesListView Component
 *
 * This component provides a view for managing sources, including adding, editing, and deleting sources,
 * initiating scans, and displaying source-related information.
 *
 * @module sourcesListView
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
import ActionMenu from 'src/components/actionMenu/actionMenu';
import { ContextIcon, ContextIconVariant } from 'src/components/contextIcon/contextIcon';
import { i18nHelpers } from 'src/components/i18n/i18nHelpers';
import { RefreshTimeButton } from 'src/components/refreshTimeButton/refreshTimeButton';
import { SimpleDropdown } from 'src/components/simpleDropdown/simpleDropdown';
import {
  API_DATA_SOURCE_TYPES,
  API_QUERY_TYPES,
  API_SOURCES_LIST_QUERY
} from 'src/constants/apiConstants';
import { helpers } from 'src/helpers';
import useAlerts from 'src/hooks/useAlerts';
import useSourceApi from 'src/hooks/useSourceApi';
import useQueryClientConfig from 'src/queryClientConfig';
import { CredentialType, SourceType } from 'src/types/types';
import AddSourceModal from './addSourceModal';
import SourcesScanModal from './addSourcesScanModal';
import { ConnectionsModal } from './showSourceConnectionsModal';
import { SOURCES_LIST_QUERY, useSourcesQuery } from './useSourcesQuery';

const SourcesListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [credentialsSelected, setCredentialsSelected] = React.useState<CredentialType[]>([]);
  const {
    runScan,
    addSource,
    submitEditedSource,
    deleteSource,
    showConnections,
    onEditSource,
    onScanSources,
    scanSelected,
    setScanSelected,
    onDeleteSelectedSources,
    onCloseConnections,
    onScanSource,
    addSourceModal,
    setAddSourceModal,
    setConnectionsData,
    sourceBeingEdited,
    setSourceBeingEdited,
    pendingDeleteSource,
    setPendingDeleteSource,
    connectionsData,
    connectionsSelected,
    setConnectionsSelected
  } = useSourceApi();
  const { queryClient } = useQueryClientConfig();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { getTimeDisplayHowLongAgo } = helpers;

  /** Fetches the translated label for a source type.
   *
   * @param {string} sourceType - The source type identifier.
   * @returns {string} Translated label for the given source type.
   */
  const getTranslatedSourceTypeLabel = sourceType => {
    const labelKey = `dataSource.${sourceType}`;
    return t(labelKey);
  };

  /**
   * Invalidates the query cache for the sources list, triggering a refresh.
   */
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [API_SOURCES_LIST_QUERY] });
  };

  /**
   * Deletes the pending source and handles success, error, and cleanup operations.
   */
  const onDeleteSource = () => {
    deleteSource()
      .then(() => {
        const successMessage = t('toast-notifications.description', {
          context: 'deleted-source',
          name: pendingDeleteSource?.name
        });
        addAlert(successMessage, 'success', getUniqueId());
        onRefresh();
      })
      .catch(err => {
        console.log(err);
        const errorMessage = t('toast-notifications.description', {
          context: 'deleted-source_error',
          name: pendingDeleteSource?.name,
          message: err.response.data.detail
        });
        addAlert(errorMessage, 'danger', getUniqueId());
      })
      .finally(() => setPendingDeleteSource(undefined));
  };

  /**
   * Submits edited source data, handles success, error, and cleanup operations.
   *
   * @param {SourceType} payload - The payload containing updated source information.
   */
  const onSubmitEditedSource = (payload: SourceType) => {
    submitEditedSource(payload)
      .then(() => {
        const successMessage = t('toast-notifications.description', {
          context: 'add-source_hidden_edit',
          name: pendingDeleteSource?.name
        });
        addAlert(successMessage, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setSourceBeingEdited(undefined);
      })
      .catch(err => {
        console.error({ err });
        const errorMessage = t('toast-notifications.title', {
          context: 'add-source_hidden_error_edit'
        });
        addAlert(errorMessage, 'danger', getUniqueId());
      });
  };

  /**
   * Initiates a scan for the provided source, handles success, error, and cleanup operations.
   *
   * @param {SourceType} payload - The payload containing source information to start the scan.
   */
  const onRunScan = (payload: SourceType) => {
    runScan(payload)
      .then(() => {
        const successMessage = t('toast-notifications.description', {
          context: 'scan-report_play',
          name: payload.name
        });
        addAlert(successMessage, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setScanSelected(undefined);
      })
      .catch(err => {
        console.error({ err });
        const errorMessage = t('toast-notifications.description', {
          context: 'starting-scan-error',
          name: payload.name,
          message: JSON.stringify(err?.response?.data.name)
        });
        addAlert(errorMessage, 'danger', getUniqueId());
      });
  };

  /**
   * Adds a new source using the provided payload, handles success, error, and cleanup operations.
   *
   * @param {SourceType} payload - The payload containing information for the new source to be added.
   */
  const onAddSource = (payload: SourceType) => {
    addSource(payload)
      .then(() => {
        const successMessage = t('toast-notifications.description', {
          context: 'add-source_hidden',
          name: payload.name
        });
        addAlert(successMessage, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setAddSourceModal(undefined);
      })
      .catch(err => {
        console.error({ err });
        console.log(JSON.stringify(err?.response?.data));
        const errorMessage = t('toast-notifications', {
          context: 'title_add-source_hidden_error',
          name: payload.name,
          message: JSON.stringify(err?.response?.data)
        });
        addAlert(errorMessage, 'danger', getUniqueId());
      });
  };

  /**
   * Retrieves connection information related to a source, updates connection data, and selects the source.
   *
   * @param {SourceType} source - The source for which to retrieve connection information.
   */
  const onShowConnections = (source: SourceType) => {
    showConnections(source)
      .then(res => {
        setConnectionsData({
          successful: res.data.results.filter((c: { status: string }) => c.status === 'success'),
          failure: res.data.results.filter((c: { status: string }) => c.status === 'failure'),
          unreachable: res.data.results.filter(
            (c: { status: string }) => !['success', 'failure'].includes(c.status)
          )
        });
      })
      .catch(err => console.error(err));
    setConnectionsSelected(source);
  };

  /**
   * Initializes table state with URL persistence, defining columns, filters, sorting, pagination, and selection.
   * Features include:
   * - Column names for 'name', 'connection', 'type', 'credentials', and 'unreachableSystems', plus placeholders.
   * - Filters for name, credential search, and source type with specific options.
   * - Sortable columns with initial sort on 'name'.
   * - Enabled pagination and selection.
   * Uses `useTableState` hook for state management based on provided configurations.
   */
  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      name: t('table.header', { context: 'name' }),
      connection: t('table.label', { context: 'status_completed_sources' }),
      type: t('table.header', { context: 'type' }),
      credentials: t('table.header', { context: 'credentials' }),
      unreachableSystems: t('table.header', { context: 'unreachable' }),
      scan: ' ',
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
          key: API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME,
          title: t('toolbar.label', { context: 'option_search_credentials_by_name' }),
          type: FilterType.search,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_cred_type' })
        },
        {
          key: API_QUERY_TYPES.SOURCE_TYPE,
          title: t('toolbar.label', { context: 'option_source_type' }),
          type: FilterType.select,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_source_type' }),
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
      sortableColumns: ['name', 'connection', 'type'],
      initialSort: { columnKey: 'name', direction: 'asc' }
    },
    pagination: { isEnabled: true },
    selection: { isEnabled: true }
  });

  const { isLoading, data } = useSourcesQuery({ tableState, setRefreshTime });

  let totalResults = data?.count || 0;
  if (helpers.DEV_MODE) {
    totalResults = helpers.devModeNormalizeCount(totalResults);
  }

  /**
   * Configures 'batteries' table with `useTablePropHelpers` by extending `tableState` for:
   * - Item identification (`idProperty: 'id'`)
   * - Loading status (`isLoading`)
   * - Current page data (`currentPageItems`)
   * - Pagination control (`totalItemCount`)
   */
  const tableBatteries = useTablePropHelpers({
    ...tableState,
    idProperty: 'id',
    isLoading,
    currentPageItems: data?.results || [],
    totalItemCount: totalResults
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

  const renderAddSourceButton = () => (
    <SimpleDropdown
      label={t('view.empty-state_label_sources')}
      variant="primary"
      dropdownItems={[
        t('dataSource.network'),
        t('dataSource.openshift'),
        t('dataSource.rhacs'),
        t('dataSource.satellite'),
        t('dataSource.vcenter'),
        t('dataSource.ansible')
      ].map(type => (
        <DropdownItem key={type} onClick={() => setAddSourceModal(type)}>
          {type}
        </DropdownItem>
      ))}
    />
  );

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem>{renderAddSourceButton()}</ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={Object.values(selectedItems).filter(val => val !== null).length <= 1}
            onClick={onScanSources}
          >
            {t('table.label', { context: 'scan' })}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!selectedItems?.length}
            onClick={onDeleteSelectedSources}
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

  const renderConnection = (source: SourceType): React.ReactNode => {
    if (!source?.connection) {
      return null;
    }
    const isPending =
      source.connection.status === 'created' ||
      source.connection.status === 'pending' ||
      source.connection.status === 'running';
    const scanTime = (isPending && source.connection.start_time) || source.connection.end_time;

    const statusString = i18nHelpers.translate(t, 'table.label', {
      context: ['status', source.connection.status, 'sources']
    });
    return (
      <Button
        variant={ButtonVariant.link}
        onClick={() => {
          onShowConnections(source);
        }}
      >
        <ContextIcon symbol={ContextIconVariant[source.connection.status]} /> {statusString}{' '}
        {getTimeDisplayHowLongAgo(scanTime)}
      </Button>
    );
  };

  return (
    <PageSection variant="light">
      {renderToolbar()}
      <Table aria-label="Example things table" variant="compact">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="connection" />
            <Th columnKey="type" />
            <Th columnKey="credentials" />
            <Th columnKey="scan" />
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
                titleText="No sources available"
                icon={<EmptyStateIcon icon={PlusCircleIcon} />}
              />
              <EmptyStateBody>
                Begin by adding a source. A source contains a collection of network information,
                including systems management solution information, IP addresses, or host names, in
                addition to SSH ports and credentials.
              </EmptyStateBody>
              <EmptyStateFooter>
                <EmptyStateActions>{renderAddSourceButton()}</EmptyStateActions>
              </EmptyStateFooter>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((source: SourceType, rowIndex) => (
              <Tr key={source.id} item={source} rowIndex={rowIndex}>
                <Td columnKey="name">{source.name}</Td>
                <Td columnKey="connection">{renderConnection(source)}</Td>
                <Td columnKey="type">{getTranslatedSourceTypeLabel(source.source_type)}</Td>
                <Td columnKey="credentials">
                  <Button
                    variant={ButtonVariant.link}
                    onClick={() => {
                      setCredentialsSelected(source.credentials);
                    }}
                  >
                    {source.credentials.length}
                  </Button>
                </Td>
                <Td isActionCell columnKey="scan">
                  <Button
                    isDisabled={source.connection?.status === 'pending'}
                    variant={ButtonVariant.link}
                    onClick={() => onScanSource(source)}
                  >
                    Scan
                  </Button>
                </Td>
                <Td isActionCell columnKey="actions">
                  <ActionMenu<SourceType>
                    item={source}
                    actions={[
                      { label: t('table.label', { context: 'edit' }), onClick: onEditSource },
                      {
                        label: t('table.label', { context: 'delete' }),
                        onClick: setPendingDeleteSource
                      }
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" widgetId="server-paginated-example-pagination" />
      {!!credentialsSelected.length && (
        <Modal
          variant={ModalVariant.small}
          title={t('view.label', { context: 'credentials' })}
          isOpen={!!credentialsSelected}
          onClose={() => setCredentialsSelected([])}
          actions={[
            <Button key="cancel" variant="secondary" onClick={() => setCredentialsSelected([])}>
              Close
            </Button>
          ]}
        >
          <List isPlain isBordered>
            {credentialsSelected.map(c => (
              <ListItem key={c.name}>{c.name}</ListItem>
            ))}
          </List>
        </Modal>
      )}
      {connectionsSelected && (
        <ConnectionsModal
          source={connectionsSelected}
          connections={connectionsData}
          onClose={onCloseConnections}
        />
      )}

      {!!pendingDeleteSource && (
        <Modal
          variant={ModalVariant.small}
          title={t('form-dialog.confirmation', { context: 'title_delete-source' })}
          isOpen={!!pendingDeleteSource}
          onClose={() => setPendingDeleteSource(undefined)}
          actions={[
            <Button key="confirm" variant="danger" onClick={() => onDeleteSource()}>
              {t('form-dialog.label', { context: 'delete' })}
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setPendingDeleteSource(undefined)}>
              {t('form-dialog.label', { context: 'cancel' })}
            </Button>
          ]}
        >
          Are you sure you want to delete the source &quot;
          {pendingDeleteSource.name}&quot;
        </Modal>
      )}

      {sourceBeingEdited && (
        <AddSourceModal
          source={sourceBeingEdited}
          type={sourceBeingEdited.source_type}
          onClose={() => setSourceBeingEdited(undefined)}
          onSubmit={onSubmitEditedSource}
        />
      )}
      {addSourceModal && (
        <AddSourceModal
          type={addSourceModal}
          onClose={() => setAddSourceModal(undefined)}
          onSubmit={onAddSource}
        />
      )}

      {scanSelected && (
        <SourcesScanModal
          onClose={() => setScanSelected(undefined)}
          onSubmit={onRunScan}
          sources={scanSelected}
        />
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

export default SourcesListView;
