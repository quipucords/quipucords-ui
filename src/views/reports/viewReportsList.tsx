/**
 * ReportsListView Component
 *
 * This component provides a view for a list of reports.
 *
 * @module reportsListView
 */
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  EmptyState,
  EmptyStateBody,
  PageSection,
  ToolbarContent,
  ToolbarItem,
  getUniqueId
} from '@patternfly/react-core';
import ActionMenu from '../../components/actionMenu/actionMenu';
import { ErrorMessage } from '../../components/errorMessage/errorMessage';
import { RefreshTimeButton } from '../../components/refreshTimeButton/refreshTimeButton';
import { API_QUERY_TYPES, API_REPORTS_LIST_QUERY } from '../../constants/apiConstants';
import { helpers } from '../../helpers';
import { useAlerts } from '../../hooks/useAlerts';
import useQueryClientConfig from '../../queryClientConfig';
import { type ReportType } from '../../types/types';
import {
  ConditionalTableBody,
  FilterType,
  useTablePropHelpers,
  useTableState
} from '../../vendor/react-table-batteries';
import { useTrWithBatteries } from '../../vendor/react-table-batteries/components/useTrWithBatteries';
import { useReportsQuery } from './useReportsQuery';

const ReportsListView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [refreshTime, setRefreshTime] = React.useState<Date | null>();
  const { queryClient } = useQueryClientConfig();
  // TODO: uncomment `addAlert` once actions are properly implemented
  const { alerts, /*addAlert,*/ removeAlert } = useAlerts();

  /**
   * Invalidates the query cache for the reports list, triggering a refresh.
   */
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [API_REPORTS_LIST_QUERY] });
  };

  /**
   * Check if report can be published.
   */
  const reportCanPublish = (report: ReportType): boolean => report.can_publish;

  /**
   * Check if report can be downloaded.
   */
  const reportCanDownload = (_report: ReportType): boolean => false;

  /**
   * Handles "publish" action.
   */
  const handlePublish = useCallback((report: ReportType) => {
    console.log(`Would attempt to publish report with id ${report.id}`);
  }, []);

  /**
   * Handles "download" action.
   */
  const handleDownload = useCallback((report: ReportType) => {
    console.log(`Would attempt to download report with id ${report.id}`);
  }, []);

  /**
   * Configures table state for report results, with URL persistence. Includes columns for ID, origin,
   * created, and actions. Enables origin and ID filtering, sorting by ID, origin, or created, pagination.
   * Utilizes `useTableState` for setup.
   */
  const tableState = useTableState({
    persistTo: 'urlParams',
    columnNames: {
      selection: ' ',
      id: t('table.header', { context: 'id' }),
      origin: t('table.header', { context: 'origin' }),
      created: t('table.header', { context: 'created' }),
      actions: ' '
    },
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: API_QUERY_TYPES.SEARCH_REPORT_ID,
          title: t('toolbar.label', { context: 'option_report_id' }),
          type: FilterType.search,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_report_id' })
        },
        {
          key: API_QUERY_TYPES.REPORT_ORIGIN,
          title: t('toolbar.label', { context: 'option_report_origin' }),
          type: FilterType.select,
          placeholderText: t('toolbar.label', { context: 'placeholder_filter_report_origin' }),
          selectOptions: [
            {
              key: 'local',
              value: t('report.origin.local')
            },
            {
              key: 'uploaded',
              value: t('report.origin.uploaded')
            },
            {
              key: 'merged',
              value: t('report.origin.merged')
            }
          ]
        }
      ]
    },
    sort: {
      isEnabled: true,
      sortableColumns: ['id', 'origin', 'created'],
      initialSort: { columnKey: 'created', direction: 'desc' }
    },
    pagination: { isEnabled: true },
    selection: { isEnabled: false }
  });

  const { isError, isLoading, data } = useReportsQuery({
    tableState,
    setRefreshTime
  });

  const tableBatteries = useTablePropHelpers({
    ...tableState,
    idProperty: 'id',
    isLoading,
    currentPageItems: data?.results || [],
    totalItemCount: data?.count || 0
  });

  const {
    currentPageItems,
    numRenderedColumns,
    components: { Toolbar, FilterToolbar, PaginationToolbarItem, Pagination, Table, Tbody, Td, Th, Thead }
  } = tableBatteries;

  const TrWithBatteries = useTrWithBatteries(tableBatteries);

  const renderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <FilterToolbar id="reports-filters" />
        <ToolbarItem>
          <RefreshTimeButton lastRefresh={refreshTime?.getTime() ?? 0} onRefresh={onRefresh} />
        </ToolbarItem>
        <PaginationToolbarItem>
          <Pagination variant="top" isCompact widgetId="reports-pagination" />
        </PaginationToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  const formatReportDate = (dateString: string) => {
    try {
      return helpers.formatDate(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  };

  return (
    <PageSection hasBodyWrapper={false}>
      {renderToolbar()}
      <Table aria-label={t('table.label', { context: 'aria-reports' })} variant="compact">
        <Thead>
          <TrWithBatteries isHeaderRow>
            <Th columnKey="id" />
            <Th columnKey="origin" />
            <Th columnKey="created" />
            <Th columnKey="actions" />
          </TrWithBatteries>
        </Thead>
        <ConditionalTableBody
          isError={isError}
          isLoading={isLoading}
          isNoData={currentPageItems.length === 0}
          errorEmptyState={<ErrorMessage title={t('view.error_title', { context: 'reports' })} />}
          noDataEmptyState={
            <EmptyState headingLevel="h4" titleText={t('view.empty-state', { context: 'reports_title' })}>
              <EmptyStateBody>{t('view.empty-state', { context: 'reports_description' })}</EmptyStateBody>
            </EmptyState>
          }
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((report: ReportType, rowIndex) => (
              <TrWithBatteries key={report.id} item={report} rowIndex={rowIndex}>
                <Td columnKey="id">{report.id}</Td>
                <Td columnKey="origin">{t('table.label', { context: `origin-${report.origin || 'unknown'}` })}</Td>
                <Td columnKey="created">{formatReportDate(report.created_at)}</Td>
                <Td isActionCell columnKey="actions">
                  <ActionMenu<ReportType>
                    popperProps={{ position: 'right' }}
                    item={report}
                    size="sm"
                    actions={[
                      {
                        label: t('table.label', { context: 'publish' }),
                        disabled: !reportCanPublish(report),
                        onClick: handlePublish,
                        ouiaId: 'publish-report',
                        ...(!reportCanPublish(report) && {
                          tooltipProps: {
                            content: t('table.label', {
                              context: `publish-disabled-tooltip-report-${report.cannot_publish_reason}`
                            })
                          }
                        })
                      },
                      {
                        label: t('table.label', { context: 'download' }),
                        disabled: !reportCanDownload(report),
                        onClick: handleDownload,
                        ouiaId: 'download-report',
                        ...(!reportCanDownload(report) && {
                          tooltipProps: { content: t('table.label', { context: 'download-disabled-tooltip-report' }) }
                        })
                      }
                    ]}
                  />
                </Td>
              </TrWithBatteries>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" widgetId="reports-pagination-bottom" />
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

export default ReportsListView;
