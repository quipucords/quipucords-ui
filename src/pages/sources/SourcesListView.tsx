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
  AlertProps,
  AlertVariant,
  Button,
  ButtonVariant,
  DropdownItem,
  EmptyState,
  EmptyStateIcon,
  Icon,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  TextContent,
  Title,
  ToolbarContent,
  ToolbarItem,
  getUniqueId
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  CubesIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@patternfly/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
import { SimpleDropdown } from 'src/components/SimpleDropdown';
import { helpers } from '../../common';
import { ContextIcon, ContextIconVariant } from '../../components/contextIcon/contextIcon';
import { i18nHelpers } from '../../components/i18n/i18nHelpers';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import { SourceType, ConnectionType, CredentialType } from '../../types';
import AddSourceModal from './AddSourceModal';
import SourceActionMenu from './SourceActionMenu';
import SourcesScanModal from './SourcesScanModal';
import { useSourcesQuery } from './useSourcesQuery';

const SOURCES_LIST_QUERY = 'sourcesList';

const SourceTypeLabels = {
  acs: 'ACS',
  ansible: 'Ansible Controller',
  network: 'Network',
  openshift: 'OpenShift',
  satellite: 'Satellite',
  vcenter: 'vCenter Server'
};

const SourcesListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = React.useState<Partial<AlertProps>[]>([]);
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [credentialsSelected, setCredentialsSelected] = React.useState<CredentialType[]>([]);
  const [connectionsSelected, setConnectionsSelected] = React.useState<SourceType>();
  const [scanSelected, setScanSelected] = React.useState<SourceType[]>();
  const [addSourceModal, setAddSourceModal] = React.useState<string>();
  const [sourceBeingEdited, setSourceBeingEdited] = React.useState<SourceType>();
  const [connectionsData, setConnectionsData] = React.useState<{
    successful: ConnectionType[];
    failure: ConnectionType[];
    unreachable: ConnectionType[];
  }>({ successful: [], failure: [], unreachable: [] });
  const [pendingDeleteSource, setPendingDeleteSource] = React.useState<SourceType>();
  const queryClient = useQueryClient();
  const emptyConnectionData = { successful: [], failure: [], unreachable: [] };

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
  };

  const addAlert = (title: string, variant: AlertProps['variant'], key: React.Key) => {
    setAlerts(prevAlerts => [...prevAlerts, { title, variant, key }]);
  };

  const removeAlert = (key: React.Key) => {
    setAlerts(prevAlerts => [...prevAlerts.filter(alert => alert.key !== key)]);
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

  const token = localStorage.getItem('authToken');

  const onCloseConnections = () => {
    setConnectionsSelected(undefined);
    setConnectionsData(emptyConnectionData);
  };
  const onScanSources = () => {
    setScanSelected(selectedItems);
  };
  const onScanSource = (source: SourceType) => {
    setScanSelected([source]);
  };
  const onRunScan = payload => {
    axios
      .post(`https://0.0.0.0:9443/api/v1/scans/`, payload)
      .then(() => {
        addAlert(`${payload.name} started to scan`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setScanSelected(undefined);
      })
      .catch(err => {
        addAlert(
          `Error starting scan. ${JSON.stringify(err?.response?.data)}`,
          'danger',
          getUniqueId()
        );
        console.error({ err });
      });
  };
  const onAddSource = payload => {
    axios
      .post(`https://0.0.0.0:9443/api/v1/sources/?scan=true`, payload)
      .then(() => {
        addAlert(`${payload.name} added successfully`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setAddSourceModal(undefined);
      })
      .catch(err => console.error(err));
  };

  const onEditSource = (source: SourceType) => {
    setSourceBeingEdited(source);
  };

  const onSubmitEditedSource = (payload: SourceType) => {
    axios
      .put(`https://0.0.0.0:9443/api/v1/sources/${payload.id}`, payload)
      .then(() => {
        addAlert(`${payload.name} updated successfully`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
        setSourceBeingEdited(undefined);
      })
      .catch(err => console.error(err));
  };

  const onDeleteSource = (source: SourceType) => {
    axios
      .delete(`https://0.0.0.0:9443/api/v1/sources/${source.id}/`)
      .then(() => {
        addAlert(`Source "${source.name}" deleted successfully`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
      })
      .catch(err => {
        console.error(err);
        addAlert(
          `Error removing source ${source.name}. ${err?.response?.data?.detail}`,
          'danger',
          getUniqueId()
        );
      })
      .finally(() => setPendingDeleteSource(undefined));
  };

  const onDeleteSelectedSources = () => {
    const itemsToDelete = selectedItems?.length;
    // add logic
    console.log('Deleting selected credentials:', itemsToDelete);
  };

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
            isDisabled={!!selectedItems?.length}
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

  const showConnections = (source: SourceType) => {
    axios
      .get(
        `https://0.0.0.0:9443/api/v1/jobs/${source.connection.id}/connection/?page=1&page_size=1000&ordering=name&source_type=${source.id}`
      )
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

  const getTimeDisplayHowLongAgo =
    process.env.REACT_APP_ENV !== 'test'
      ? timestamp => moment.utc(timestamp).fromNow()
      : () => 'a day ago';

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
          showConnections(source);
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
                  <SourceActionMenu
                    source={source}
                    onEditSource={onEditSource}
                    onDeleteSource={setPendingDeleteSource}
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
        <Modal
          variant={ModalVariant.medium}
          title={connectionsSelected.name}
          isOpen={!!connectionsSelected}
          onClose={onCloseConnections}
          actions={[
            <Button key="cancel" variant="secondary" onClick={onCloseConnections}>
              Close
            </Button>
          ]}
        >
          <TextContent style={{ margin: '1em 0' }}>
            <h5>
              <Icon status="danger">
                <ExclamationCircleIcon />
              </Icon>{' '}
              Failed connections
            </h5>
          </TextContent>
          <List isPlain isBordered>
            {connectionsData.failure.length ? (
              connectionsData.failure.map(con => <ListItem key={con.name}>{con.name}</ListItem>)
            ) : (
              <ListItem>N/A</ListItem>
            )}
          </List>
          <TextContent style={{ margin: '1em 0' }}>
            <h5>
              <Icon status="warning">
                <ExclamationTriangleIcon />
              </Icon>{' '}
              Unreachable systems
            </h5>
          </TextContent>
          <List isPlain isBordered>
            {connectionsData.unreachable.length ? (
              connectionsData.unreachable.map(con => <ListItem key={con.name}>{con.name}</ListItem>)
            ) : (
              <ListItem>N/A</ListItem>
            )}
          </List>
          <TextContent style={{ margin: '1em 0' }}>
            <h5>
              <Icon status="success">
                <CheckCircleIcon />
              </Icon>{' '}
              Successful connections
            </h5>
          </TextContent>
          <List isPlain isBordered>
            {connectionsData.successful.length ? (
              connectionsData.successful.map(con => <ListItem key={con.name}>{con.name}</ListItem>)
            ) : (
              <ListItem>N/A</ListItem>
            )}
          </List>
        </Modal>
      )}

      {!!pendingDeleteSource && (
        <Modal
          variant={ModalVariant.small}
          title="Permanently delete source"
          isOpen={!!pendingDeleteSource}
          onClose={() => setPendingDeleteSource(undefined)}
          actions={[
            <Button
              key="confirm"
              variant="danger"
              onClick={() => onDeleteSource(pendingDeleteSource)}
            >
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
