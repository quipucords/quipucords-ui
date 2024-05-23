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
import { RefreshTimeButton } from '../../components/refreshTimeButton/refreshTimeButton';
import { API_QUERY_TYPES, API_SCANS_LIST_QUERY } from '../../constants/apiConstants';
import { helpers } from '../../helpers';
import { useAlerts } from '../../hooks/useAlerts';
import useScanApi from '../../hooks/useScanApi';
import useQueryClientConfig from '../../queryClientConfig';
import { ScanJobType, ScanType } from '../../types/types';
import { ScansModal } from './showScansModal';
import { useScansQuery } from './useScansQuery';

const ScansListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const [scanSelectedForSources, setScanSelectedForSources] = React.useState<ScanType>();
  const [scanJobs, setScanJobs] = React.useState<ScanJobType[]>();
  const {
    deleteScan,
    onDeleteSelectedScans,
    pendingDeleteScan,
    setPendingDeleteScan,
    scanSelected,
    setScanSelected,
    getScanJobs,
    downloadReport
  } = useScanApi();
  const { queryClient } = useQueryClientConfig();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const nav = useNavigate();

  /**
   * Invalidates the query cache for the scan list, triggering a refresh.
   */
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [API_SCANS_LIST_QUERY] });
  };

  /**
   * Deletes the pending scan and handles success, error, and cleanup operations.
   */
  const onDeleteScan = () => {
    deleteScan()
      .then(() => {
        const successMessage = t('toast-notifications.description', {
          context: 'deleted-scan',
          name: pendingDeleteScan?.id
        });
        addAlert({ title: successMessage, variant: 'success', key: getUniqueId() });
        onRefresh();
      })
      .catch(err => {
        console.log(err);
        const errorMessage = t('toast-notifications.description', {
          context: 'deleted-scan_error',
          name: pendingDeleteScan?.id,
          message: err.response.data.detail
        });
        addAlert({ title: errorMessage, variant: 'danger', key: getUniqueId() });
      })
      .finally(() => setPendingDeleteScan(undefined));
  };

  /**
   * Initiates a scan for the provided source, handles success, error, and cleanup operations.
   *
   * @param source - source information to start the scan.
   */
  const onRunScan = source => {
    console.log('run scan:', source);
    // runScan(payload);
    // .then( () => {
    //   addAlert(`${payload.name} started to scan`, 'success', getUniqueId());
    //   queryClient.invalidateQueries({ queryKey: [SOURCES_LIST_QUERY] });
    //   setScanSelected(undefined);
    // })
    // .catch(err => {
    //   console.error({ err });
    //   addAlert(
    //     `Error starting scan. ${JSON.stringify(err?.response?.data)}`,
    //     'danger',
    //     getUniqueId()
    //   );
    // });
  };

  /**
   * Configures table state for scan results, with URL persistence. Includes columns for scan ID, last scanned, sources, and actions. Enables name-based filtering, sorting by ID or last scanned, pagination, and row selection. Utilizes `useTableState` for setup.
   */
  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      id: t('table.header', { context: 'scan-id' }),
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
        }
      ]
    },
    sort: {
      isEnabled: true,
      sortableColumns: ['id', 'most_recent'],
      initialSort: { columnKey: 'id', direction: 'asc' }
    },
    pagination: { isEnabled: true },
    selection: { isEnabled: true }
  });

  const { isLoading, data } = useScansQuery({ tableState, setRefreshTime });

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
          <Button
            variant={ButtonVariant.secondary}
            isDisabled={!selectedItems?.length}
            onClick={onDeleteSelectedScans}
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

  const renderConnection = (scan: ScanType): React.ReactNode => {
    return (
      <Button
        variant={ButtonVariant.link}
        onClick={() => {
          setScanSelected(scan);
          getScanJobs(scan.id).then(res => {
            setScanJobs(res.data.results);
          });
        }}
      >
        <ContextIcon symbol={ContextIconVariant[scan.most_recent?.status]} />{' '}
        {scan.most_recent && (
          <>
            {scan.most_recent.status === 'failed' &&
              t('table.label', { context: 'status_failed_scans' })}
            {scan.most_recent.status === 'completed' &&
              t('table.label', { context: 'status_completed_scans' })}{' '}
            {helpers.getTimeDisplayHowLongAgo(
              scan.most_recent.end_time || scan.most_recent.start_time
            )}
          </>
        )}
        {!scan.most_recent && t('table.label', { context: 'status_scans' })}
      </Button>
    );
  };

  return (
    <PageSection variant="light">
      {renderToolbar()}
      <Table aria-label="Example things table" variant="compact">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="id" />
            <Th columnKey="most_recent" />
            <Th columnKey="sources" />
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
                titleText="No scans available"
                icon={<EmptyStateIcon icon={PlusCircleIcon} />}
              />
              <EmptyStateBody>
                Create a scan from the Sources page by selecting an individual source or multiple
                sources.
              </EmptyStateBody>
              <EmptyStateFooter>
                <EmptyStateActions>
                  <Button onClick={() => nav('/')} variant="primary">
                    View Sources page
                  </Button>
                </EmptyStateActions>
              </EmptyStateFooter>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((scan: ScanType, rowIndex) => (
              <Tr key={scan.id} item={scan} rowIndex={rowIndex}>
                <Td columnKey="id">{scan.id}</Td>
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
                  <ActionMenu<ScanType>
                    item={scan}
                    actions={[
                      {
                        label: t('table.label', { context: 'delete' }),
                        onClick: setPendingDeleteScan
                      },
                      { label: t('table.label', { context: 'rescan' }), onClick: onRunScan }
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" widgetId="server-paginated-example-pagination" />
      {!!scanSelectedForSources && (
        <Modal
          variant={ModalVariant.small}
          title={t('view.label', { context: 'sources' })}
          isOpen={!!scanSelectedForSources}
          onClose={() => setScanSelectedForSources(undefined)}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              onClick={() => setScanSelectedForSources(undefined)}
            >
              Close
            </Button>
          ]}
        >
          <List isPlain isBordered>
            {scanSelectedForSources.sources.map(s => (
              <ListItem key={s.id}>{s.name}</ListItem>
            ))}
          </List>
        </Modal>
      )}
      {!!scanSelected && (
        <ScansModal
          scan={scanSelected}
          scanJobs={scanJobs}
          onDownload={reportId => {
            downloadReport(reportId)
              .then(res => {
                addAlert({
                  title: `Report "${reportId}" downloaded`,
                  variant: 'success',
                  key: getUniqueId()
                });
                helpers.downloadData(
                  res.data,
                  `report_id_${reportId}_${new Date()
                    .toISOString()
                    .replace('T', '_')
                    .replace(/[^\d_]/g, '')}.tar.gz`,
                  'application/gzip'
                );
              })
              .catch(err => {
                console.error(err);
                addAlert({
                  title: `Report "${reportId}" failed to download. ${JSON.stringify(err.response.data)}`,
                  variant: 'danger',
                  key: getUniqueId()
                });
              });
          }}
          onClose={() => {
            setScanSelected(undefined);
            setScanJobs(undefined);
          }}
        />
      )}
      {!!pendingDeleteScan && (
        <Modal
          variant={ModalVariant.small}
          title={t('form-dialog.confirmation', { context: 'title_delete-scan' })}
          isOpen={!!pendingDeleteScan}
          onClose={() => setPendingDeleteScan(undefined)}
          actions={[
            <Button key="confirm" variant="danger" onClick={() => onDeleteScan()}>
              {t('form-dialog.label', { context: 'delete' })}
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setPendingDeleteScan(undefined)}>
              {t('form-dialog.label', { context: 'cancel' })}
            </Button>
          ]}
        >
          Are you sure you want to delete the scan &quot;
          {pendingDeleteScan.id}&quot;
        </Modal>
      )}
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
