import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useSearchParam from '../../hooks/useSearchParam';
import { CredentialType } from '../../types';
import {
  ConditionalTableBody,
  FilterToolbar,
  FilterType,
  TableHeaderContentWithBatteries,
  TableRowContentWithBatteries,
  useTablePropHelpers,
  useTableState
} from '@mturley-latest/react-table-batteries';
import { helpers } from '../../common';
import {
  Button,
  ButtonVariant,
  Divider,
  EmptyState,
  EmptyStateIcon,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  Pagination,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { CubesIcon } from '@patternfly/react-icons';
import CredentialActionMenu from './CredentialActionMenu';

const CREDS_LIST_QUERY = 'credentialsList';

const CredentialTypeLabels = {
  ansible: 'Ansible Controller',
  network: 'Network',
  openshift: 'OpenShift',
  rhacs: 'RHACS',
  satellite: 'Satellite',
  vcenter: 'vCenter Server'
};

const CredentialsListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  // const [credentialsSelected, setCredentialsSelected] = React.useState<any[]>([]);
  const [sourcesSelected, setSourcesSelected] = React.useState<any[]>([]);
  const [sortColumn] = useSearchParam('sortColumn') || ['name'];
  const [sortDirection] = useSearchParam('sortDirection') || ['asc'];
  const [filters] = useSearchParam('filters');
  const [selectedItems, setSelectedItems] = React.useState<CredentialType[]>([]);
  const queryClient = useQueryClient();
  const currentQuery = React.useRef<string>('');

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [CREDS_LIST_QUERY] });
  };

    const tableState = useTableState({
    persistTo: 'urlParams',
    isSelectionEnabled: true,
    persistenceKeyPrefix: '', // The first Things table on this page.
    columnNames: {
      // The keys of this object define the inferred generic type `TColumnKey`. See "Unique Identifiers".
      name: 'Name',
      type: 'Type',
      auth_type: 'Authentication type',
      sources: 'Sources',
      updated: 'Last updated',
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
    ],
    // Because isSortEnabled is true, TypeScript will require these sort-related properties:
    sortableColumns: ['name','type', 'auth_type', 'sources', 'updated'],
    initialSort: {
      columnKey: sortColumn as
        | 'name'
        | 'type'
        | 'auth_type'
        | 'sources'
        | 'updated',
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
      `${process.env.REACT_APP_CREDENTIALS_SERVICE}` +
      `?` +
      `ordering=${ordering}` +
      `&` +
      `page=${pageNumber}` +
      `&` +
      `page-size=${itemsPerPage}${filterParams ? `&${filterParams}` : ''}`;

    if (query !== currentQuery.current) {
      currentQuery.current = query;
      queryClient.invalidateQueries({ queryKey: [CREDS_LIST_QUERY] });
    }
  }, [filterValues, activeSort, sortDirection, sortColumn, pageNumber, itemsPerPage, queryClient]);

  const token = localStorage.getItem("authToken");

  const { isLoading, data } = useQuery({
    queryKey: [CREDS_LIST_QUERY],
    refetchOnWindowFocus: !helpers.DEV_MODE,
    queryFn: async () => {
      try {
        console.log(`Query: `, currentQuery.current);
        const response = await axios.get(currentQuery.current, { headers: { "Authorization": `Token ${token}` } });
        setRefreshTime(new Date());
        return response.data;
      } catch (error) {
        console.error(error);
        throw error; // You can choose to throw the error or return a default value here
      }
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
    currentPageItems: (data?.results || []) as CredentialType[],
    totalItemCount: totalResults,
    selectionState: {
      selectedItems,
      setSelectedItems,
      isItemSelected: (item: CredentialType) => !!selectedItems.find(i => i.id === item.id),
      isItemSelectable: () => true,
      toggleItemSelected: (item: CredentialType) => {
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

  const onShowAddCredentialWizard = () => {};
  const onDeleteSelectedCredentials = () => {
    const selectedItems = Object.values(tableBatteries.selectionState.selectedItems).filter(val => val !== null);
    // add logic
    console.log('Deleting selected credentials:', selectedItems);
  };
  const hasSelectedCredentials = () => {
    return Object.values(tableBatteries.selectionState.selectedItems).filter(val => val !== null).length > 0;
  };  

  const renderToolbar = () => (
    <Toolbar {...toolbarProps}>
      <ToolbarContent>
        <FilterToolbar {...filterToolbarProps} id="client-paginated-example-filters" />
        {/* You can render whatever other custom toolbar items you may need here! */}
        <Divider orientation={{ default: 'vertical' }} />
        <ToolbarItem>
          <RefreshTimeButton lastRefresh={refreshTime?.getTime() ?? 0} onRefresh={onRefresh} />
          <Button className="pf-v5-u-mr-md" onClick={onShowAddCredentialWizard} ouiaId="add_credential">
            {t('table.label', { context: 'add' })}
          </Button>{' '}
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!hasSelectedCredentials()}
            onClick={onDeleteSelectedCredentials}>
            {t('table.label', { context: 'delete' })}
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
  const getAuthType = (credential: CredentialType): string => {
    if (credential.username && credential.password) {
      return 'Username and Password';
    } else if (credential.ssh_key) {
      return 'SSH Key';
    } else if (credential.auth_token) {
      return 'Token';
    } else if (credential.ssh_keyfile) {
      return 'SSH Key file';
    } else {
      return 'Unknown'; // Default value or handle as needed
    }
  };

  const getLastUpdated = (credential: CredentialType): string => {
    const now = new Date();
    const lastUpdated = credential.updated_at || credential.created_at || now;
    const timeDifference = now.getTime() - new Date(lastUpdated).getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (seconds < 60) {
      return 'Just now';
    } else if (minutes === 1) {
      return 'A minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return 'An hour ago';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 30) {
      return `${days} days ago`;
    } else if (months === 1) {
      return 'A month ago';
    } else if (months < 12) {
      return `${months} months ago`;
    } else if (years === 1) {
      return 'A year ago';
    } else {
      return `${years} years ago`;
    }
  };

  return (
    <PageSection variant="light">
      {renderToolbar()}
      <Table {...tableProps} aria-label="Example things table" variant="compact">
        <Thead>
          <Tr>
            <TableHeaderContentWithBatteries {...tableBatteries}>
              <Th {...getThProps({ columnKey: 'name' })} />
              <Th {...getThProps({ columnKey: 'type' })} />
              <Th {...getThProps({ columnKey: 'auth_type' })} />
              <Th {...getThProps({ columnKey: 'sources' })} />
              <Th {...getThProps({ columnKey: 'updated' })} />
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
            {currentPageItems?.map((credential: CredentialType, rowIndex) => (
              <Tr key={credential.id} {...getTrProps({ item: credential })}>
                <TableRowContentWithBatteries {...tableBatteries} item={credential} rowIndex={rowIndex}>
                  <Td {...getTdProps({ columnKey: 'name' })}>{credential.name}</Td>
                  <Td {...getTdProps({ columnKey: 'type' })}>
                    {CredentialTypeLabels[credential.cred_type]}
                  </Td>
                  <Td {...getTdProps({ columnKey: 'auth_type' })}>{getAuthType(credential)}</Td>
                  <Td {...getTdProps({ columnKey: 'sources' })}>
                    <Button
                      variant={ButtonVariant.link}
                      onClick={() => {
                        if (credential.sources && credential.sources.length > 0) {
                        setSourcesSelected(credential.sources);
                      }
                      }}
                      isDisabled={!credential.sources?.length} > {credential.sources?.length || 0}
                    </Button>
                  </Td>
                  <Td {...getTdProps({ columnKey: 'updated' })}>{getLastUpdated(credential).toString()}</Td>
                </TableRowContentWithBatteries>
                <Td isActionCell {...getTdProps({ columnKey: 'actions' })}>
                  <CredentialActionMenu credential={credential} />
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
              {sourcesSelected.map((c, i) => (
                <ListItem>
                  {c.name}
                </ListItem>
              ))}
            </List>
          </Modal>
      )}
    </PageSection>
  );
};


export default CredentialsListView;
