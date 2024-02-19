/**
 * ScansListView Component
 *
 * This component provides a view for managing scans, including adding, running and deleting scans,
 * and also managing reports.
 *
 * @module ScansListView
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
import { API_QUERY_TYPES, API_SCANS_LIST_QUERY } from 'src/constants/apiConstants';
import useScanApi from 'src/hooks/api/useScanApi';
import useAlerts from 'src/hooks/useAlerts';
import useQueryClientConfig from 'src/services/queryClientConfig';
import { helpers } from '../../common';
import { ContextIcon, ContextIconVariant } from '../../components/contextIcon/contextIcon';
import { RefreshTimeButton } from '../../components/refreshTimeButton/RefreshTimeButton';
import { ScanJobType, ScanType } from '../../types';
import { useScansQuery } from './useScansQuery';
import { ScansModal } from './components/ScansModal';
import FileDownload from 'js-file-download';

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
    downloadReport,
  } = useScanApi();
  const { queryClient } = useQueryClientConfig();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { getTimeDisplayHowLongAgo } = helpers;

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
        addAlert(successMessage, 'success', getUniqueId());
        onRefresh();
      })
      .catch(err => {
        console.log(err);
        const errorMessage = t('toast-notifications.description', {
          context: 'deleted-scan_error',
          name: pendingDeleteScan?.id,
          message: err.response.data.detail
        });
        addAlert(errorMessage, 'danger', getUniqueId());
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
            {getTimeDisplayHowLongAgo(scan.most_recent.end_time || scan.most_recent.start_time)}
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
            <EmptyState variant="sm">
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h2" size="lg">
                No scans available
              </Title>
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
        <ScansModal scan={scanSelected} scanJobs={scanJobs}
          onDownload={(reportId) => {
            downloadReport(reportId).then( (res) => {
              addAlert(`Report "${reportId}" downloaded`, 'success', getUniqueId());
              FileDownload(
                res.data,
                `report_id_${reportId}_${new Date().toISOString().replace('T','_').replace(/[^\d_]/g,'')}.tar.gz`
              );
            }).catch( (err) => {
              console.error(err);
              addAlert(`Report "${reportId}" failed to download. ${JSON.stringify(err.response.data)}`, 'danger', getUniqueId())
            });
          }}
          onClose={() => {
            setScanSelected(undefined);
            setScanJobs(undefined);
          }
        } />
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

export default ScansListView;
