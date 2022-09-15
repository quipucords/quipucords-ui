import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant, Button, ButtonVariant, EmptyState, Spinner } from '@patternfly/react-core';
import { IconSize } from '@patternfly/react-icons';
import { Modal, ModalVariant } from '../modal/modal';
import { reduxTypes, storeHooks } from '../../redux';
import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';
import { ScansEmptyState } from './scansEmptyState';
import { ScanFilterFields, ScanSortFields } from './scanConstants';
import { translate } from '../i18n/i18n';
import { Table } from '../table/table';
import { scansTableCells } from './scansTableCells';
import { useGetScans, useOnExpand, useOnRefresh, useOnScanAction, useOnSelect } from './scansContext';
import { Tooltip } from '../tooltip/tooltip';

const VIEW_ID = 'scans';

// ToDo: review onMergeReports, renderToolbarActions being standalone with upcoming toolbar updates
// ToDo: review items being selected and the page polling. Randomized dev data gives the appearance of an issue. Also applies to sources selected items
/**
 * A scans view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGetScans
 * @param {Function} props.useOnExpand
 * @param {Function} props.useOnRefresh
 * @param {Function} props.useOnScanAction
 * @param {Function} props.useOnSelect
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelectors
 * @param {string} props.viewId
 * @returns {React.ReactNode}
 */
const Scans = ({
  t,
  useGetScans: useAliasGetScans,
  useOnExpand: useAliasOnExpand,
  useOnRefresh: useAliasOnRefresh,
  useOnScanAction: useAliasOnScanAction,
  useOnSelect: useAliasOnSelect,
  useDispatch: useAliasDispatch,
  useSelectors: useAliasSelectors,
  viewId
}) => {
  const dispatch = useAliasDispatch();
  const onExpand = useAliasOnExpand();
  const onRefresh = useAliasOnRefresh();
  const { onCancel, onDownload, onPause, onRestart, onStart } = useAliasOnScanAction();
  const onSelect = useAliasOnSelect();
  const { pending, error, errorMessage, date, data, selectedRows = {}, expandedRows = {} } = useAliasGetScans();
  const [viewOptions = {}] = useAliasSelectors([
    ({ viewOptions: stateViewOptions }) => stateViewOptions[reduxTypes.view.SCANS_VIEW]
  ]);
  const isActive = viewOptions?.activeFilters?.length > 0 || data?.length > 0 || false;

  /**
   * Toolbar actions onScanSources
   *
   * @event onMergeReports
   */
  const onMergeReports = () => {
    dispatch({
      type: reduxTypes.scans.MERGE_SCAN_DIALOG_SHOW,
      show: true,
      scans: Object.values(selectedRows).filter(val => val !== null)
    });
  };

  /**
   * Return toolbar actions.
   *
   * @returns {React.ReactNode}
   */
  const renderToolbarActions = () => (
    <Tooltip content={t('table.tooltip', { context: ['merge-reports'] })}>
      <Button
        variant={ButtonVariant.primary}
        isDisabled={Object.values(selectedRows).filter(val => val !== null).length <= 1}
        onClick={onMergeReports}
      >
        {t('table.label', { context: ['merge-reports'] })}
      </Button>
    </Tooltip>
  );

  if (pending) {
    return (
      <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
        <Spinner isSVG size={IconSize.lg} />
        <div className="text-center">{t('view.loading', { context: viewId })}</div>
      </Modal>
    );
  }

  if (error) {
    return (
      <EmptyState className="quipucords-empty-state__alert">
        <Alert variant={AlertVariant.danger} title={t('view.error', { context: viewId })}>
          {t('view.error-message', { context: [viewId], message: errorMessage })}
        </Alert>
      </EmptyState>
    );
  }

  return (
    <div className="quipucords-content">
      <div className="quipucords-view-container">
        {isActive && (
          <React.Fragment>
            <ViewToolbar
              viewType={reduxTypes.view.SCANS_VIEW}
              filterFields={ScanFilterFields}
              sortFields={ScanSortFields}
              onRefresh={() => onRefresh()}
              lastRefresh={new Date(date).getTime()}
              actions={renderToolbarActions()}
              itemsType="Scan"
              itemsTypePlural="Scans"
              selectedCount={viewOptions.selectedItems?.length}
              {...viewOptions}
            />
            <ViewPaginationRow viewType={reduxTypes.view.SCANS_VIEW} {...viewOptions} />
          </React.Fragment>
        )}
        <div className="quipucords-list-container">
          <Table
            onExpand={onExpand}
            onSelect={onSelect}
            rows={data?.map((item, index) => ({
              isSelected: (selectedRows?.[item.id] && true) || false,
              item,
              cells: [
                {
                  content: scansTableCells.description(item),
                  dataLabel: t('table.header', { context: ['description'] })
                },
                {
                  content: scansTableCells.scanStatus(item, { viewId }),
                  width: 20,
                  dataLabel: t('table.header', { context: ['scan'] })
                },
                {
                  ...scansTableCells.okHostsCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 2,
                  width: 8,
                  dataLabel: t('table.header', { context: ['success', viewId] })
                },
                {
                  ...scansTableCells.failedHostsCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 3,
                  width: 8,
                  dataLabel: t('table.header', { context: ['failed', viewId] })
                },
                {
                  ...scansTableCells.sourcesCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 4,
                  width: 8,
                  dataLabel: t('table.header', { context: ['sources'] })
                },
                {
                  ...scansTableCells.scansCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 5,
                  width: 8,
                  dataLabel: t('table.header', { context: ['scan-jobs'] })
                },
                {
                  style: { textAlign: 'right' },
                  content: scansTableCells.actionsCell({
                    isFirst: index === 0,
                    isLast: index === data.length - 1,
                    item,
                    onCancel: () => onCancel(item),
                    onDownload: () => onDownload(item),
                    onRestart: () => onRestart(item),
                    onPause: () => onPause(item),
                    onStart: () => onStart(item)
                  }),
                  isActionCell: true
                }
              ]
            }))}
          >
            <ScansEmptyState viewId={viewId} />
          </Table>
        </div>
      </div>
    </div>
  );
};

/**
 * Prop types
 *
 * @type {{useOnEdit: Function, useOnSelect: Function, viewId: string, t: Function, useOnRefresh: Function, useOnScan: Function,
 *     useDispatch: Function, useOnDelete: Function, useOnExpand: Function, useGetSources: Function, useSelectors: Function,
 *     useOnShowAddSourceWizard: Function}}
 */
Scans.propTypes = {
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useGetScans: PropTypes.func,
  useOnExpand: PropTypes.func,
  useOnRefresh: PropTypes.func,
  useOnScanAction: PropTypes.func,
  useOnSelect: PropTypes.func,
  useSelectors: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{useOnEdit: Function, useOnSelect: Function, viewId: string, t: translate, useOnRefresh: Function, useOnScan: Function,
 *     useDispatch: Function, useOnDelete: Function, useOnExpand: Function, useGetSources: Function, useSelectors: Function,
 *     useOnShowAddSourceWizard: Function}}
 */
Scans.defaultProps = {
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useGetScans,
  useOnExpand,
  useOnRefresh,
  useOnScanAction,
  useOnSelect,
  useSelectors: storeHooks.reactRedux.useSelectors,
  viewId: VIEW_ID
};

export { Scans as default, Scans, VIEW_ID };
