import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ConditionalTableBody,
  FilterToolbar,
  FilterType,
  TableHeaderContentWithBatteries,
  TableRowContentWithBatteries,
  useTablePropHelpers,
  useTableState
} from '@mturley-latest/react-table-batteries';
import {
  ActionGroup,
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertProps,
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Divider,
  DropdownItem,
  EmptyState,
  EmptyStateIcon,
  Form,
  FormGroup,
  Icon,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  Pagination,
  TextArea,
  TextContent,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  getUniqueId
} from '@patternfly/react-core';
import { CheckCircleIcon, CubesIcon, ExclamationCircleIcon, ExclamationTriangleIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import axios from 'axios';
import moment from 'moment';
import { helpers } from '../../common';
import { ContextIcon, ContextIconVariant } from '../../components/contextIcon/contextIcon';
import { i18nHelpers } from '../../components/i18n/i18nHelpers';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import useSearchParam from '../../hooks/useSearchParam';
import { SourceType } from '../../types';
import { ConnectionType } from '../../types';
import SourceActionMenu from './SourceActionMenu';
import SourcesScanModal from './SourcesScanModal';
import { SimpleDropdown } from 'src/components/SimpleDropdown';
import AddSourceModal from './AddSourceModal';

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
  const [credentialsSelected, setCredentialsSelected] = React.useState<any[]>([]);
  const [connectionsSelected, setConnectionsSelected] = React.useState<SourceType>();
  const [scanSelected, setScanSelected] = React.useState<SourceType[]>();
  const [addSourceModal, setAddSourceModal] = React.useState<string>();
  const [connectionsData, setConnectionsData] = React.useState<{successful: ConnectionType[], failure: ConnectionType[], unreachable: ConnectionType[]}>({successful: [], failure: [], unreachable: []});
  const [sortColumn] = useSearchParam('sortColumn') || ['name'];
  const [sortDirection] = useSearchParam('sortDirection') || ['asc'];
  const [filters] = useSearchParam('filters');
  const [selectedItems, setSelectedItems] = React.useState<SourceType[]>([]);
  const [pendingDeleteSource, setPendingDeleteSource] = React.useState<SourceType>();
  const queryClient = useQueryClient();
  const currentQuery = React.useRef<string>('');
  const emptyConnectionData = {successful: [], failure: [], unreachable: []};

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
  };

  const addAlert = (title: string, variant: AlertProps['variant'], key: React.Key) => {
    setAlerts((prevAlerts) => [...prevAlerts, { title, variant, key }]);
  };

  const removeAlert = (key: React.Key) => {
    setAlerts((prevAlerts) => [...prevAlerts.filter((alert) => alert.key !== key)]);
  };

  const tableState = useTableState({
    persistTo: 'urlParams',
    isSelectionEnabled: true,
    persistenceKeyPrefix: '', // The first Things table on this page.
    columnNames: {
      // The keys of this object define the inferred generic type `TColumnKey`. See "Unique Identifiers".
      name: 'Name',
      connection: 'Last connected',
      type: 'Type',
      credentials: 'Credentials',
      unreachableSystems: 'Unreachable systems',
      scan: ' ',
      actions: ' '
    },
    isFilterEnabled: true,
    isSortEnabled: true,
    isPaginationEnabled: true,
    // Because isFilterEnabled is true, TypeScript will require these filterCategories:
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
            key: 'network',
            label: 'Network',
            value: 'network'
          },
          {
            key: 'openshift',
            label: 'OpenShift',
            value: 'openshift'
          },
          {
            key: 'satellite',
            label: 'Satellite',
            value: 'satellite'
          },
          {
            key: 'vcenter',
            label: 'vCenter',
            value: 'vcenter'
          }
        ]
      }
    ],
    // Because isSortEnabled is true, TypeScript will require these sort-related properties:
    sortableColumns: ['name', 'connection', 'type', 'credentials', 'unreachableSystems'],
    initialSort: {
      columnKey: sortColumn as
        | 'name'
        | 'connection'
        | 'type'
        | 'credentials'
        | 'unreachableSystems',
      direction: sortDirection as 'asc' | 'desc'
    },
    initialFilterValues: filters ? JSON.parse(filters) : undefined
  });

  const token = localStorage.getItem("authToken");

  const {
    filterState: { filterValues },
    sortState: { activeSort },
    paginationState: { pageNumber, itemsPerPage }
  } = tableState;

  React.useEffect(() => {
    const filterParams = filterValues
      ? Object.keys(filterValues)
          .map(key => `${key}=${filterValues[key]}`)
          .join('&')
      : null;

    const ordering = `${(activeSort?.direction ?? sortDirection) === 'desc' ? '-' : ''}${
      activeSort?.columnKey ?? sortColumn
    }`;

    const query =
      `${process.env.REACT_APP_SOURCES_SERVICE}` +
      `?` +
      `ordering=${ordering}` +
      `&` +
      `page=${pageNumber}` +
      `&` +
      `page-size=${itemsPerPage}${filterParams ? `&${filterParams}` : ''}`;

    if (query !== currentQuery.current) {
      currentQuery.current = query;
      queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
    }
  }, [filterValues, activeSort, sortDirection, sortColumn, pageNumber, itemsPerPage, queryClient]);


  const { isLoading, data } = useQuery({
    queryKey: [SOURCES_LIST_QUERY],
    refetchOnWindowFocus: !helpers.DEV_MODE,
    queryFn: () => {
      console.log(`Query: `, currentQuery.current);
      return axios.get(currentQuery.current, { headers: {"Authorization": `Token ${token}`}})
        .then(res => {
          setRefreshTime(new Date());
          return res.data;
        })
        .catch(err => console.error(err));
    }
  });

  let totalResults = data?.count || 0;
  if (helpers.DEV_MODE) {
    totalResults = helpers.devModeNormalizeCount(totalResults);
  }

  const tableBatteries = useTablePropHelpers({
    ...tableState,
    idProperty: 'id',
    isLoading,
    currentPageItems: (data?.results || []) as SourceType[],
    totalItemCount: totalResults,
    selectionState: {
      selectedItems,
      setSelectedItems,
      isItemSelected: (item: SourceType) => !!selectedItems.find(i => i.id === item.id),
      isItemSelectable: () => true,
      toggleItemSelected: (item: SourceType) => {
        const index = selectedItems.findIndex(i => i.id === item.id);
        if (index > -1) {
          setSelectedItems(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
        } else {
          setSelectedItems(prev => [...prev, item]);
        }
      },
      selectMultiple: () => {},
      areAllSelected: false,
      selectAll: () => {}
    }
  });

  const {
    currentPageItems, // These items have already been paginated.
    // `numRenderedColumns` is based on the number of columnNames and additional columns needed for
    // rendering controls related to features like selection, expansion, etc.
    // It is used as the colSpan when rendering a full-table-wide cell.
    numRenderedColumns,
    // The objects and functions in `propHelpers` correspond to the props needed for specific PatternFly or Tackle
    // components and are provided to reduce prop-drilling and make the rendering code as short as possible.
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps
    }
  } = tableBatteries;

  const onCloseConnections = () => {
    setConnectionsSelected(undefined);
    setConnectionsData(emptyConnectionData);
  }
  const onShowAddSourceWizard = () => {};
  const onScanSources = () => {};
  const onScanSource = (source: SourceType) => {
    setScanSelected([source]);
  };
  const onRunScan = (payload) => {
    axios.post(`https://0.0.0.0:9443/api/v1/scans/`, payload, { headers: {"Authorization": `Token ${token}`}})
        .then(res => {
          addAlert(`${payload.name} started to scan`, 'success', getUniqueId());
          queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
          setScanSelected(undefined);
        })
        .catch(err => console.error(err));
  };
  const onAddSource = (payload) => {
    console.log('addsource', payload);
    axios.post(`https://0.0.0.0:9443/api/v1/sources/?scan=true`, payload, { headers: {"Authorization": `Token ${token}`}})
    .then(res => {
      addAlert(`${payload.name} added successfully`, 'success', getUniqueId());
      queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
      setAddSourceModal(undefined);
    })
    .catch(err => console.error(err));
  }

  const onEditSource = (source: SourceType) => {
    console.log("edit source", source);
  }

  const onDeleteSource = (source: SourceType) => {
    axios.delete(`https://0.0.0.0:9443/api/v1/sources/${source.id}/`, { headers: {"Authorization": `Token ${token}`}})
    .then(res => {
      addAlert(`Source "${source.name}" deleted successfully`, 'success', getUniqueId());
      queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
    })
    .catch(err => {
      console.error(err);
      addAlert(`Error removing source ${source.name}. ${err?.response?.data?.detail}`, 'danger', getUniqueId());
    })
    .finally(() => setPendingDeleteSource(undefined));
  }

  const renderToolbar = () => (
    <Toolbar {...toolbarProps}>
      <ToolbarContent>
        <FilterToolbar {...filterToolbarProps} id="client-paginated-example-filters" />
        {/* You can render whatever other custom toolbar items you may need here! */}
        <Divider orientation={{ default: 'vertical' }} />
        <ToolbarItem>
          <SimpleDropdown
            label="Add Source"
            variant="primary"
            dropdownItems={['Network range', 'OpenShift', 'RHACS', 'Satellite', 'vCenter server', 'Ansible controller'].map(type => 
              <DropdownItem onClick={() => setAddSourceModal(type)}>{type}</DropdownItem>
            )}
          />{' '}
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={
              Object.values(tableBatteries.selectionState.selectedItems).filter(val => val !== null)
                .length <= 1
            }
            onClick={onScanSources}
          >
            {t('table.label', { context: 'scan' })}
          </Button>
          <RefreshTimeButton lastRefresh={refreshTime?.getTime() ?? 0} onRefresh={onRefresh} />
        </ToolbarItem>
        <ToolbarItem {...paginationToolbarItemProps}>
          <Pagination
            variant="top"
            isCompact
            {...paginationProps}
            widgetId="client-paginated-example-pagination"
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
  
  const showConnections = (source: SourceType) => {
    axios.get(`https://0.0.0.0:9443/api/v1/jobs/${source.connection.id}/connection/?page=1&page_size=1000&ordering=name&source_type=${source.id}`,
      { headers: {"Authorization": `Token ${token}`}})
        .then(res => {
          console.log(res);
          setConnectionsData({
            successful: res.data.results.filter((c: { status: string; }) => c.status === 'success'),
            failure: res.data.results.filter((c: { status: string; }) => c.status === 'failure'),
            unreachable: res.data.results.filter((c: { status: string; }) => !['success','failure'].includes(c.status))
          });
        })
        .catch(err => console.error(err));
    setConnectionsSelected(source);
  };

  const getTimeDisplayHowLongAgo =
    process.env.REACT_APP_ENV !== 'test'
      ? (timestamp) => moment().utc(timestamp).utcOffset(moment().utcOffset()).fromNow()
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
      <Button variant={ButtonVariant.link} onClick={() => {
        showConnections(source);
      }}>
        <ContextIcon symbol={ContextIconVariant[source.connection.status]} />
        {' '}{statusString}{' '}
        {getTimeDisplayHowLongAgo(scanTime)}
      </Button>
    );
  };

  return (
    <PageSection variant="light">
      {renderToolbar()}
      <Table {...tableProps} aria-label="Example things table" variant="compact">
        <Thead>
          <Tr>
            <TableHeaderContentWithBatteries {...tableBatteries}>
              <Th {...getThProps({ columnKey: 'name' })} />
              <Th {...getThProps({ columnKey: 'connection' })} />
              <Th {...getThProps({ columnKey: 'type' })} />
              <Th {...getThProps({ columnKey: 'credentials' })} />
              <Th {...getThProps({ columnKey: 'scan' })} />
              <Th {...getThProps({ columnKey: 'actions' })} />
            </TableHeaderContentWithBatteries>
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
            {currentPageItems?.map((source: SourceType, rowIndex) => (
              <Tr key={source.id} {...getTrProps({ item: source })}>
                <TableRowContentWithBatteries {...tableBatteries} item={source} rowIndex={rowIndex}>
                  <Td {...getTdProps({ columnKey: 'name' })}>{source.name}</Td>
                  <Td {...getTdProps({ columnKey: 'connection' })}>{renderConnection(source)}</Td>
                  <Td {...getTdProps({ columnKey: 'type' })}>
                    {SourceTypeLabels[source.source_type]}
                  </Td>
                  <Td {...getTdProps({ columnKey: 'credentials' })}><Button variant={ButtonVariant.link} onClick={() => {
                    setCredentialsSelected(source.credentials)
                  }}>{source.credentials.length}</Button></Td>
                  <Td isActionCell {...getTdProps({ columnKey: 'scan' })}>
                    <Button isDisabled={source.connection.status === "pending"} variant={ButtonVariant.link} onClick={() => onScanSource(source)}>
                      Scan
                    </Button>
                  </Td>
                </TableRowContentWithBatteries>
                <Td isActionCell {...getTdProps({ columnKey: 'actions' })}>
                  <SourceActionMenu source={source} onEditSource={onEditSource} onDeleteSource={setPendingDeleteSource} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination
        variant="bottom"
        isCompact
        {...paginationProps}
        widgetId="server-paginated-example-pagination"
      />
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
              {credentialsSelected.map((c, i) => (
                <ListItem>
                  {c.name}
                </ListItem>
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
            <TextContent style={{margin: '1em 0'}}><h5><Icon status="danger"><ExclamationCircleIcon /></Icon> Failed connections</h5></TextContent>
            <List isPlain isBordered>
            {connectionsData.failure.length ? connectionsData.failure.map((con) => (
                <ListItem>{con.name}</ListItem>
              )) : (<ListItem>N/A</ListItem>)}
            </List>
            <TextContent style={{margin: '1em 0'}}><h5><Icon status="warning"><ExclamationTriangleIcon /></Icon> Unreachable systems</h5></TextContent>
            <List isPlain isBordered>
            {connectionsData.unreachable.length ? connectionsData.unreachable.map((con) => (
                <ListItem>{con.name}</ListItem>
              )) : (<ListItem>N/A</ListItem>)}
            </List>
            <TextContent style={{margin: '1em 0'}}><h5><Icon status="success"><CheckCircleIcon /></Icon>  Successful connections</h5></TextContent>
            <List isPlain isBordered>
            {connectionsData.successful.length ? connectionsData.successful.map((con) => (
                <ListItem>{con.name}</ListItem>
              )) : (<ListItem>N/A</ListItem>)}
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
                <Button key="confirm" variant="danger" onClick={() => onDeleteSource(pendingDeleteSource)}>
                  Delete
                </Button>,
                <Button key="cancel" variant="link" onClick={() => setPendingDeleteSource(undefined)}>
                  Cancel
                </Button>
              ]}
            >
              Are you sure you want to delete the source "{pendingDeleteSource.name}"
            </Modal>
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
          sources={scanSelected} />
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