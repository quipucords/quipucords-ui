/**
 * ScansListView Component
 *
 * This component provides a view for managing scans, including adding, running and deleting scans,
 * and also managing reports.
 *
 * @module scansListView
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { ErrorMessage } from '../../components/errorMessage/errorMessage';
import { RefreshTimeButton } from '../../components/refreshTimeButton/refreshTimeButton';
import { API_QUERY_TYPES, API_SCANS_LIST_QUERY } from '../../constants/apiConstants';
import { helpers } from '../../helpers';
import { useAlerts } from '../../hooks/useAlerts';
import { useDeleteScanApi, useDownloadReportApi, useGetScanJobsApi, useRunScanApi } from '../../hooks/useScanApi';
import useQueryClientConfig from '../../queryClientConfig';
import { type Scan, type ScanJobType } from '../../types/types';
import { ShowScansModal } from './showScansModal';
import { useScansQuery } from './useScansQuery';

const ScansListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [scanSelectedForSources, setScanSelectedForSources] = React.useState<Scan>();
  const [scanSelected, setScanSelected] = React.useState<Scan>();
  const [scanJobs, setScanJobs] = React.useState<ScanJobType[]>();
  const [pendingDeleteScan, setPendingDeleteScan] = React.useState<Scan>();
  const { queryClient } = useQueryClientConfig();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { deleteScans } = useDeleteScanApi(addAlert);
  const { runScans } = useRunScanApi(addAlert);
  const { getScanJobs } = useGetScanJobsApi(addAlert);
  const { downloadReport } = useDownloadReportApi(addAlert);
  const nav = useNavigate();

  /**
   * Invalidates the query cache for the scan list, triggering a refresh.
   */
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [API_SCANS_LIST_QUERY] });
  };

  /**
   * Configures table state for scan results, with URL persistence. Includes columns for name, last scanned,
   * sources, and actions. Enables name-based filtering, sorting by ID or last scanned, pagination, and row selection.
   * Utilizes `useTableState` for setup.
   */
  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      name: t('table.header', { context: 'name' }),
      most_recent: t('table.header', { context: 'last-scanned' }),
      sources: t('table.header', { context: 'sources' }),
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
          key: API_QUERY_TYPES.SEARCH_SOURCES_NAME,
          title: t('toolbar.label', { context: 'option_search_sources_by_name' }),
          type: FilterType.search,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_search_sources_by_name' })
        }
      ]
    },
    sort: {
      isEnabled: true,
      sortableColumns: ['name', 'most_recent'],
      initialSort: { columnKey: 'name', direction: 'asc' }
    },
    pagination: { isEnabled: true },
    selection: { isEnabled: true }
  });

  const { isError, isLoading, data } = useScansQuery({ tableState, setRefreshTime });

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

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <FilterToolbar id="client-paginated-example-filters" />
        <ToolbarItem>
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!selectedItems?.length}
            onClick={() =>
              deleteScans(selectedItems).finally(() => {
                setPendingDeleteScan(undefined);
                onRefresh();
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

  const renderConnection = (scan: Scan) => {
    if (!scan.most_recent) {
      return (
        <React.Fragment>
          <ContextIcon symbol={ContextIconVariant['off']} /> {t('table.label', { context: 'status_scans' })}
        </React.Fragment>
      );
    }
    return (
      <Button
        variant={ButtonVariant.link}
        onClick={() => {
          setScanSelected(scan);
          getScanJobs(scan.id).then(res => {
            setScanJobs(res?.data.results);
          });
        }}
      >
        <ContextIcon
          symbol={scan.most_recent ? ContextIconVariant[scan.most_recent.status] : ContextIconVariant['unknown']}
        />
        <React.Fragment>
          {' '}
          {scan.most_recent.status === 'failed' && t('table.label', { context: 'status_failed_scans' })}
          {scan.most_recent.status === 'completed' && t('table.label', { context: 'status_completed_scans' })}{' '}
          {helpers.getTimeDisplayHowLongAgo(scan.most_recent.end_time || scan.most_recent.start_time)}
        </React.Fragment>
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
            <Th columnKey="most_recent" />
            <Th columnKey="sources" />
            <Th columnKey="actions" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isError={isError}
          isLoading={isLoading}
          isNoData={currentPageItems.length === 0}
          errorEmptyState={<ErrorMessage title={t('view.error_title', { context: 'scans' })} />}
          noDataEmptyState={
            <EmptyState>
              <EmptyStateHeader
                headingLevel="h4"
                titleText={t('view.empty-state', { context: 'scans_title' })}
                icon={<EmptyStateIcon icon={PlusCircleIcon} />}
              />
              <EmptyStateBody>{t('view.empty-state', { context: 'scans_description' })}</EmptyStateBody>
              <EmptyStateFooter>
                <EmptyStateActions>
                  <Button onClick={() => nav('/sources')} variant="primary">
                    View Sources page
                  </Button>
                </EmptyStateActions>
              </EmptyStateFooter>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((scan: Scan, rowIndex) => (
              <Tr key={scan.id} item={scan} rowIndex={rowIndex}>
                <Td columnKey="name">{scan.name}</Td>
                <Td columnKey="most_recent">{renderConnection(scan)}</Td>
                <Td columnKey="sources">
                  <Button
                    variant={ButtonVariant.link}
                    onClick={() => {
                      setScanSelectedForSources(scan);
                    }}
                  >
                    {scan.sources.length}
                  </Button>
                </Td>
                <Td isActionCell columnKey="actions">
                  <ActionMenu<Scan>
                    item={scan}
                    actions={[
                      {
                        label: t('table.label', { context: 'delete' }),
                        onClick: setPendingDeleteScan
                      },
                      {
                        label: t('table.label', { context: 'rescan' }),
                        onClick: () => {
                          runScans(scan, true).finally(() => {
                            queryClient.invalidateQueries({ queryKey: [API_SCANS_LIST_QUERY] });
                            setScanSelected(undefined);
                          });
                        }
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
        title={t('view.label', { context: 'sources' })}
        isOpen={scanSelectedForSources !== undefined}
        onClose={() => setScanSelectedForSources(undefined)}
        actions={[
          <Button
            key="confirm"
            variant="secondary"
            onClick={() => {
              setScanSelectedForSources(undefined);
            }}
          >
            {t('table.label', { context: 'close' })}
          </Button>
        ]}
      >
        <List isPlain isBordered>
          {scanSelectedForSources?.sources
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(s => <ListItem key={s.id}>{s.name}</ListItem>)}
        </List>
      </Modal>
      <ShowScansModal
        scan={scanSelected}
        scanJobs={scanJobs}
        isOpen={scanSelected !== undefined}
        onDownload={downloadReport}
        onClose={() => {
          setScanSelected(undefined);
          setScanJobs(undefined);
        }}
        actions={[
          <Button
            key="close"
            variant="secondary"
            onClick={() => {
              setScanSelected(undefined); // Close the modal when this is clicked
              setScanJobs(undefined);
            }}
          >
            {t('table.label', { context: 'close' })}
          </Button>
        ]}
      />
      <Modal
        variant={ModalVariant.small}
        title={t('form-dialog.confirmation', { context: 'title_delete-source' })}
        isOpen={pendingDeleteScan !== undefined}
        onClose={() => setPendingDeleteScan(undefined)}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            onClick={() => {
              if (pendingDeleteScan) {
                deleteScans(pendingDeleteScan).finally(() => {
                  setPendingDeleteScan(undefined);
                  onRefresh();
                });
              }
            }}
          >
            {t('table.label', { context: 'delete' })}
          </Button>,
          <Button key="cancel" variant="link" onClick={() => setPendingDeleteScan(undefined)}>
            {t('form-dialog.label', { context: 'cancel' })}
          </Button>
        ]}
      >
        {t('form-dialog.confirmation_heading', {
          context: 'delete-source',
          name: pendingDeleteScan?.name
        })}
        {/* TODO: his modal should go on a list of getting it's own component * check PR #381 for details */}
      </Modal>
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

export default ScansListView;
