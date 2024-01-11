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
  Divider,
  DropdownItem,
  EmptyState,
  EmptyStateIcon,
  getUniqueId,
  List,
  ListItem,
  Modal,
  ModalVariant,
  PageSection,
  Title,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { SimpleDropdown } from 'src/components/SimpleDropdown';
import { helpers } from '../../common';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import { CredentialType, SourceType } from '../../types';
import CredentialActionMenu from './CredentialActionMenu';
import { useCredentialsQuery } from './useCredentialsQuery';
import axios from 'axios';

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
  const [alerts, setAlerts] = React.useState<Partial<AlertProps>[]>([]);
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [sourcesSelected, setSourcesSelected] = React.useState<SourceType[]>([]);
  const [addCredentialModal, setAddCredentialModal] = React.useState<string>();
  const [pendingDeleteCredential, setPendingDeleteCredential] = React.useState<CredentialType>();
  const queryClient = useQueryClient();
  const addAlert = (title: string, variant: AlertProps['variant'], key: React.Key) => {
    setAlerts(prevAlerts => [...prevAlerts, { title, variant, key }]);
  };
  const removeAlert = (key: React.Key) => {
    setAlerts(prevAlerts => [...prevAlerts.filter(alert => alert.key !== key)]);
  };
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [CREDS_LIST_QUERY] });
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

  const onShowAddCredentialWizard = () => {};
  const onDeleteCredential = (credential: CredentialType) => {
    axios
      .delete(`https://0.0.0.0:9443/api/v1/credentials/${credential.id}/`)
      .then(() => {
        addAlert(`Credential "${credential.name}" deleted successfully`, 'success', getUniqueId());
        queryClient.invalidateQueries({ queryKey: [CREDS_LIST_QUERY] });
      })
      .catch(err => {
        console.error(err);
        addAlert(
          `Error removing credential ${credential.name}. ${err?.response?.data?.detail}`,
          'danger',
          getUniqueId()
        );
      })
      .finally(() => setPendingDeleteCredential(undefined));
  };
  const onDeleteSelectedCredentials = () => {
    const itemsToDelete = Object.values(selectedItems).filter(val => val !== null);
    // add logic
    console.log('Deleting selected credentials:', itemsToDelete);
  };
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
                <Td columnKey="type">{CredentialTypeLabels[credential.cred_type]}</Td>
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
                <Td columnKey="updated">{getLastUpdated(credential).toString()}</Td>
                <Td isActionCell columnKey="actions">
                <CredentialActionMenu
                    credential={credential}
                    onDeleteCredential={setPendingDeleteCredential}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" widgetId="server-paginated-example-pagination" />
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
            <Button
              key="confirm"
              variant="danger"
              onClick={() => onDeleteCredential(pendingDeleteCredential)}
            >
              Delete
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setPendingDeleteCredential(undefined)}>
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
