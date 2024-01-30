/**
 * SourcesListView Component
 *
 * This component provides a view for managing sources, including adding, editing, and deleting sources,
 * initiating scans, and displaying source-related information.
 *
 * @module SourcesListView
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
import { API_SOURCES_LIST_QUERY } from 'src/constants/apiConstants';
import useSourceApi from 'src/hooks/api/useSourceApi';
import useAlerts from 'src/hooks/useAlerts';
import useQueryClientConfig from 'src/services/queryClientConfig';
import { helpers } from '../../common';
import { ContextIcon, ContextIconVariant } from '../../components/contextIcon/contextIcon';
import { i18nHelpers } from '../../components/i18n/i18nHelpers';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import { CredentialType, SourceType } from '../../types';
import AddSourceModal from './components/AddSourceModal';
import { ConnectionsModal } from './components/ConnectionsModal';
import SourcesScanModal from './components/SourcesScanModal';
import { SOURCES_LIST_QUERY, useSourcesQuery } from './useSourcesQuery';

const SourceTypeLabels = {
  acs: 'RHACS',
  ansible: 'Ansible Controller',
  network: 'Network',
  openshift: 'OpenShift',
  satellite: 'Satellite',
  vcenter: 'vCenter Server'
};

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
        addAlert(
          `Source "${pendingDeleteSource?.name}" deleted successfully`,
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
          `Error removing source ${pendingDeleteSource?.name}. ${errorDetail}`,
          'danger',
          getUniqueId()
        );
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
        addAlert(`${payload.name} updated successfully`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setSourceBeingEdited(undefined);
      })
      .catch(err => {
        console.error({ err });
        addAlert(
          `There was a problem while editing your source. ${JSON.stringify(err?.response?.data)}`,
          'danger',
          getUniqueId()
        );
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
        addAlert(`${payload.name} started to scan`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setScanSelected(undefined);
      })
      .catch(err => {
        console.error({ err });
        addAlert(
          `Error starting scan. ${JSON.stringify(err?.response?.data)}`,
          'danger',
          getUniqueId()
        );
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
        addAlert(`${payload.name} added successfully`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setAddSourceModal(undefined);
      })
      .catch(err => {
        console.error({ err });
        addAlert(
          `Error adding source. ${JSON.stringify(err?.response?.data)}`,
          'danger',
          getUniqueId()
        );
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

  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      name: 'Name',
      connection: 'Last connected',
      type: 'Type',
      credentials: 'Credentials',
      unreachableSystems: 'Unreachable systems',
      scan: ' ',
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
          key: 'search_credentials_by_name',
          title: 'Credential name',
          type: FilterType.search,
          placeholderText: 'Filter by credential'
        },
        {
          key: 'source_type',
          title: 'Source type',
          type: FilterType.select,
          placeholderText: 'Filter by source type',
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

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem>
          <SimpleDropdown
            label="Add Source"
            variant="primary"
            dropdownItems={[
              'Network range',
              'OpenShift',
              'RHACS',
              'Satellite',
              'vCenter server',
              'Ansible controller'
            ].map(type => (
              <DropdownItem key={type} onClick={() => setAddSourceModal(type)}>
                {type}
              </DropdownItem>
            ))}
          />
        </ToolbarItem>
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
            <EmptyState variant="sm">
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h2" size="lg">
                No sources available
              </Title>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((source: SourceType, rowIndex) => (
              <Tr key={source.id} item={source} rowIndex={rowIndex}>
                <Td columnKey="name">{source.name}</Td>
                <Td columnKey="connection">{renderConnection(source)}</Td>
                <Td columnKey="type">{SourceTypeLabels[source.source_type]}</Td>
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
                      { label: 'Edit', onClick: onEditSource },
                      { label: 'Delete', onClick: setPendingDeleteSource }
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
          title="Credentials"
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
          title="Permanently delete source"
          isOpen={!!pendingDeleteSource}
          onClose={() => setPendingDeleteSource(undefined)}
          actions={[
            <Button key="confirm" variant="danger" onClick={() => onDeleteSource()}>
              Delete
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setPendingDeleteSource(undefined)}>
              Cancel
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
