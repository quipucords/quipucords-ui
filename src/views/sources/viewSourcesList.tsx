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
import ActionMenu from '../../components/actionMenu/actionMenu';
import { ContextIcon, ContextIconVariant } from '../../components/contextIcon/contextIcon';
import { RefreshTimeButton } from '../../components/refreshTimeButton/refreshTimeButton';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { API_DATA_SOURCE_TYPES, API_QUERY_TYPES, API_SOURCES_LIST_QUERY } from '../../constants/apiConstants';
import { helpers } from '../../helpers';
import { useAlerts } from '../../hooks/useAlerts';
import { useRunScanApi, useShowConnectionsApi } from '../../hooks/useScanApi';
import { useDeleteSourceApi, useEditSourceApi, useAddSourceApi } from '../../hooks/useSourceApi';
import useQueryClientConfig from '../../queryClientConfig';
import { type Connections, type CredentialType, type Scan, type SourceType } from '../../types/types';
import AddSourceModal from './addSourceModal';
import { AddSourcesScanModal } from './addSourcesScanModal';
import { ShowConnectionsModal } from './showSourceConnectionsModal';
import { SOURCES_LIST_QUERY, useSourcesQuery } from './useSourcesQuery';

const SourcesListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [credentialsSelected, setCredentialsSelected] = React.useState<CredentialType[]>([]);
  const [scanSelected, setScanSelected] = React.useState<SourceType[]>();
  const [pendingDeleteSource, setPendingDeleteSource] = React.useState<SourceType>();
  const [sourceBeingEdited, setSourceBeingEdited] = React.useState<SourceType>();
  const [addSourceModal, setAddSourceModal] = React.useState<string>();
  const [connectionsSelected, setConnectionsSelected] = React.useState<SourceType>();
  const emptyConnectionData: Connections = { successful: [], failed: [], unreachable: [] };
  const [connectionsData, setConnectionsData] = React.useState<Connections>(emptyConnectionData);
  const { queryClient } = useQueryClientConfig();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { deleteSources } = useDeleteSourceApi(addAlert);
  const { addSources } = useAddSourceApi(addAlert);
  const { editSources } = useEditSourceApi(addAlert);
  const { showConnections } = useShowConnectionsApi();
  const { runScans } = useRunScanApi(addAlert);

  /**
   * Fetches the translated label for a source type.
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
   * Sets the source that is currently being edited.
   *
   * @param {SourceType} source - The source to be set as the one being edited.
   */
  const onEditSource = (source: SourceType) => {
    setSourceBeingEdited(source);
  };

  /**
   * Closes the connections view by resetting selected connections and clearing connection data.
   */
  const onCloseConnections = () => {
    setConnectionsSelected(undefined);
    setConnectionsData(emptyConnectionData);
  };

  /**
   * Sets the selected sources for scanning.
   *
   * @param {SourceType[]} sources - An array of source items to be selected for scanning.
   */
  const onScanSources = (sources: SourceType[]) => {
    setScanSelected(sources);
  };

  /**
   * Sets a single source for scanning as the selected source.
   *
   * @param {SourceType} source - The source to be selected for scanning.
   */
  const onScanSource = (source: SourceType) => {
    setScanSelected([source]);
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
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_search_credentials_by_name' })
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
              value: t('dataSource.ansible')
            },
            {
              key: API_DATA_SOURCE_TYPES.NETWORK,
              label: API_DATA_SOURCE_TYPES.NETWORK,
              value: t('dataSource.network')
            },
            {
              key: API_DATA_SOURCE_TYPES.OPENSHIFT,
              label: API_DATA_SOURCE_TYPES.OPENSHIFT,
              value: t('dataSource.openshift')
            },
            {
              key: API_DATA_SOURCE_TYPES.RHACS,
              label: API_DATA_SOURCE_TYPES.RHACS,
              value: t('dataSource.rhacs')
            },
            {
              key: API_DATA_SOURCE_TYPES.SATELLITE,
              label: API_DATA_SOURCE_TYPES.SATELLITE,
              value: t('dataSource.satellite')
            },
            {
              key: API_DATA_SOURCE_TYPES.VCENTER,
              label: API_DATA_SOURCE_TYPES.VCENTER,
              value: t('dataSource.vcenter')
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
    totalItemCount: helpers.normalizeTotal(data)
  });

  const {
    selection: { selectedItems },
    currentPageItems,
    numRenderedColumns,
    components: { Toolbar, FilterToolbar, PaginationToolbarItem, Pagination, Table, Tbody, Td, Th, Thead, Tr }
  } = tableBatteries;

  const hasSelectedSources = () => {
    return Object.values(selectedItems).filter(val => val !== null).length > 0;
  };

  const renderAddSourceButton = () => (
    <SimpleDropdown
      label={t('view.empty-state_label_sources')}
      menuToggleOuiaId="add_source_button"
      variant="primary"
      onSelect={item => setAddSourceModal(item)}
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
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem>{renderAddSourceButton()}</ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={Object.values(selectedItems).filter(val => val !== null).length <= 1}
            onClick={() => onScanSources(selectedItems)}
          >
            {t('table.label', { context: 'scan' })}
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!hasSelectedSources()}
            onClick={() => deleteSources(selectedItems).finally(() => onRefresh())}
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

  const renderConnection = (source: SourceType) => {
    if (!source?.connection) {
      return null;
    }
    const isPending =
      source.connection.status === 'created' ||
      source.connection.status === 'pending' ||
      source.connection.status === 'running';
    const scanTime = (isPending && source.connection.start_time) || source.connection.end_time;

    const statusString = t(`table.label_status_${source.connection.status}`, { context: 'sources' });
    return (
      <Button
        variant={ButtonVariant.link}
        onClick={() => {
          showConnections(source).then(success => setConnectionsData(success));
          setConnectionsSelected(source);
        }}
      >
        <ContextIcon symbol={ContextIconVariant[source.connection.status]} /> {statusString}{' '}
        {helpers.getTimeDisplayHowLongAgo(scanTime)}
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
                titleText={t('view.empty-state', { context: 'sources_title' })}
                icon={<EmptyStateIcon icon={PlusCircleIcon} />}
              />
              <EmptyStateBody>{t('view.empty-state', { context: 'sources_description' })}</EmptyStateBody>
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
                    ouiaId="scan_button"
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
      <Modal
        variant={ModalVariant.small}
        title={t('view.label', { context: 'credentials' })}
        isOpen={credentialsSelected.length > 0}
        onClose={() => setCredentialsSelected([])}
        actions={[
          <Button
            key="confirm"
            variant="secondary"
            onClick={() => {
              setCredentialsSelected([]);
            }}
          >
            {t('table.label', { context: 'close' })}
          </Button>
        ]}
      >
        <List isPlain isBordered>
          {credentialsSelected
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => (
              <ListItem key={c.name}>{c.name}</ListItem>
            ))}
        </List>
        {/* TODO: his modal should go on a list of getting it's own component * check PR #381 for details */}
      </Modal>
      <ShowConnectionsModal
        isOpen={connectionsSelected !== undefined}
        source={connectionsSelected}
        connections={connectionsData}
        onClose={onCloseConnections}
      />
      <Modal
        variant={ModalVariant.small}
        title={t('form-dialog.confirmation', { context: 'title_delete-source' })}
        isOpen={pendingDeleteSource !== undefined}
        onClose={() => setPendingDeleteSource(undefined)}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            onClick={() => {
              if (pendingDeleteSource) {
                deleteSources(pendingDeleteSource).finally(() => {
                  setPendingDeleteSource(undefined);
                  onRefresh();
                });
              }
            }}
          >
            {t('table.label', { context: 'delete' })}
          </Button>,
          <Button key="cancel" variant="link" onClick={() => setPendingDeleteSource(undefined)}>
            {t('form-dialog.label', { context: 'cancel' })}
          </Button>
        ]}
      >
        {t('form-dialog.confirmation_heading', {
          context: 'delete-source',
          name: pendingDeleteSource?.name
        })}
      </Modal>
      {/* TODO: Simplify add/edit sources functionality * check PR #380 for details */}
      <AddSourceModal
        isOpen={sourceBeingEdited !== undefined}
        source={sourceBeingEdited}
        onClose={() => setSourceBeingEdited(undefined)}
        onSubmit={(payload: SourceType) =>
          editSources(payload).finally(() => {
            queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
            setSourceBeingEdited(undefined);
          })
        }
      />
      <AddSourceModal
        isOpen={addSourceModal !== undefined}
        sourceType={addSourceModal}
        onClose={() => setAddSourceModal(undefined)}
        onSubmit={(payload: SourceType) =>
          addSources(payload).finally(() => {
            queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
            setAddSourceModal(undefined);
          })
        }
      />
      <AddSourcesScanModal
        isOpen={scanSelected !== undefined}
        onClose={() => setScanSelected(undefined)}
        onSubmit={(payload: Scan) =>
          runScans(payload).finally(() => {
            queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
            setScanSelected(undefined);
          })
        }
        sources={scanSelected}
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

export default SourcesListView;
