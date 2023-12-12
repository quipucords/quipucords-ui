import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
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
  Button,
  ButtonVariant,
  Divider,
  EmptyState,
  EmptyStateIcon,
  Flex,
  FlexItem,
  PageSection,
  Pagination,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import axios from 'axios';
import moment from 'moment';
import { helpers } from '../../common';
import { ContextIcon, ContextIconVariant } from '../../components/contextIcon/contextIcon';
import { i18nHelpers } from '../../components/i18n/i18nHelpers';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import useSearchParam from '../../hooks/useSearchParam';
import { SourceType } from '../../types';
import SourceActionMenu from './SourceActionMenu';

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
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [sortColumn] = useSearchParam('sortColumn') || ['name'];
  const [sortDirection] = useSearchParam('sortDirection') || ['asc'];
  const [filters] = useSearchParam('filters');
  const [selectedItems, setSelectedItems] = React.useState<SourceType[]>([]);
  const queryClient = useQueryClient();
  const currentQuery = React.useRef<string>('');

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
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
      return axios.get(currentQuery.current).then(res => {
        setRefreshTime(new Date());
        return res.data;
      });
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

  const onShowAddSourceWizard = () => {};
  const onScanSources = () => {};
  const onScanSource = (source: SourceType) => {
    alert(`Scan: ${source.name}`);
  };

  const renderToolbar = () => (
    <Toolbar {...toolbarProps}>
      <ToolbarContent>
        <FilterToolbar {...filterToolbarProps} id="client-paginated-example-filters" />
        {/* You can render whatever other custom toolbar items you may need here! */}
        <Divider orientation={{ default: 'vertical' }} />
        <ToolbarItem>
          <RefreshTimeButton lastRefresh={refreshTime?.getTime() ?? 0} onRefresh={onRefresh} />
          <Button className="pf-v5-u-mr-md" onClick={onShowAddSourceWizard} ouiaId="add_source">
            {t('table.label', { context: 'add' })}
          </Button>{' '}
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

  const getTimeDisplayHowLongAgo =
    process.env.REACT_APP_ENV !== 'test'
      ? timestamp => moment().utc(timestamp).utcOffset(moment().utcOffset()).fromNow()
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
      <Flex gap={{ default: 'gapSm' }}>
        <FlexItem>
          <ContextIcon symbol={ContextIconVariant[source.connection.status]} />
        </FlexItem>
        <FlexItem>
          <div>{statusString}</div>
          {getTimeDisplayHowLongAgo(scanTime)}
        </FlexItem>
      </Flex>
    );
  };

  return (
    <PageSection variant="light">
      {renderToolbar()}
      <Table {...tableProps} aria-label="Example things table">
        <Thead>
          <Tr>
            <TableHeaderContentWithBatteries {...tableBatteries}>
              <Th {...getThProps({ columnKey: 'name' })} />
              <Th {...getThProps({ columnKey: 'connection' })} />
              <Th {...getThProps({ columnKey: 'type' })} />
              <Th {...getThProps({ columnKey: 'credentials' })} />
              <Th {...getThProps({ columnKey: 'unreachableSystems' })} />
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
                  <Td {...getTdProps({ columnKey: 'credentials' })}>{source.credentials.length}</Td>
                  <Td {...getTdProps({ columnKey: 'unreachableSystems' })}>
                    {helpers.devModeNormalizeCount(
                      source.connection?.source_systems_unreachable ?? 0
                    )}
                  </Td>
                  <Td {...getTdProps({ columnKey: 'scan' })}>
                    <Button variant={ButtonVariant.link} onClick={() => onScanSource(source)}>
                      Scan
                    </Button>
                  </Td>
                </TableRowContentWithBatteries>
                <Td {...getTdProps({ columnKey: 'actions' })}>
                  <SourceActionMenu source={source} />
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
    </PageSection>
  );
};

export default SourcesListView;
