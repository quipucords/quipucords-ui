import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertVariant,
  Bullseye,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateVariant,
  Spinner,
  Title,
  TitleSizes
} from '@patternfly/react-core';
import { IconSize, SearchIcon } from '@patternfly/react-icons';
import { Modal, ModalVariant } from '../modal/modal';
import { reduxTypes, storeHooks } from '../../redux';
import { useOnShowAddSourceWizard } from '../addSourceWizard/addSourceWizardContext';
import { useView } from '../view/viewContext';
import { useToolbarFieldClearAll } from '../viewToolbar/viewToolbarContext';
import { ViewToolbar } from '../viewToolbar/viewToolbar';
import { ViewPaginationRow } from '../viewPaginationRow/viewPaginationRow';
import { SourcesEmptyState } from './sourcesEmptyState';
import { Table } from '../table/table';
import { sourcesTableCells } from './sourcesTableCells';
import {
  VIEW_ID,
  INITIAL_QUERY,
  useGetSources,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnScan,
  useOnSelect
} from './sourcesContext';
import { SourcesToolbar } from './sourcesToolbar';
import { translate } from '../i18n/i18n';

const CONFIG = {
  viewId: VIEW_ID,
  initialQuery: INITIAL_QUERY,
  toolbar: SourcesToolbar
};

/**
 * A sources view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGetSources
 * @param {Function} props.useOnDelete
 * @param {Function} props.useOnEdit
 * @param {Function} props.useOnExpand
 * @param {Function} props.useOnScan
 * @param {Function} props.useOnSelect
 * @param {Function} props.useOnShowAddSourceWizard
 * @param {Function} props.useDispatch
 * @param {Function} props.useToolbarFieldClearAll
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const Sources = ({
  t,
  useGetSources: useAliasGetSources,
  useOnDelete: useAliasOnDelete,
  useOnEdit: useAliasOnEdit,
  useOnExpand: useAliasOnExpand,
  useOnScan: useAliasOnScan,
  useOnSelect: useAliasOnSelect,
  useOnShowAddSourceWizard: useAliasOnShowAddSourceWizard,
  useDispatch: useAliasDispatch,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll,
  useView: useAliasView
}) => {
  const onToolbarFieldClearAll = useAliasToolbarFieldClearAll();
  const { isFilteringActive, viewId } = useAliasView();
  const dispatch = useAliasDispatch();
  const onDelete = useAliasOnDelete();
  const onEdit = useAliasOnEdit();
  const onExpand = useAliasOnExpand();
  const onScan = useAliasOnScan();
  const onSelect = useAliasOnSelect();
  const onShowAddSourceWizard = useAliasOnShowAddSourceWizard();
  const {
    pending,
    error,
    errorMessage,
    fulfilled,
    date,
    data,
    selectedRows = {},
    expandedRows = {},
    totalResults
  } = useAliasGetSources();
  const isActive = isFilteringActive || data?.length > 0 || false;

  /**
   * Toolbar actions onScanSources
   *
   * @event onScanSources
   */
  const onScanSources = () => {
    dispatch({
      type: reduxTypes.scans.EDIT_SCAN_SHOW,
      sources: Object.values(selectedRows).filter(val => val !== null)
    });
  };

  /**
   * Return toolbar actions.
   *
   * @returns {React.ReactNode}
   */
  const renderToolbarActions = () => (
    <React.Fragment>
      <Button onClick={onShowAddSourceWizard}>{t('table.label', { context: 'add' })}</Button>{' '}
      <Button
        variant={ButtonVariant.secondary}
        isDisabled={Object.values(selectedRows).filter(val => val !== null).length <= 1}
        onClick={onScanSources}
      >
        {t('table.label', { context: 'scan' })}
      </Button>
    </React.Fragment>
  );

  if (pending) {
    return (
      <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
        <Bullseye>
          <Spinner isSVG size={IconSize.lg} /> &nbsp; {t('view.loading', { context: viewId })}
        </Bullseye>
      </Modal>
    );
  }

  if (error) {
    return (
      <EmptyState className="quipucords-empty-state__alert">
        <Alert variant={AlertVariant.danger} title={t('view.error', { context: viewId })}>
          {t('view.error-message', {
            context: [viewId],
            message: errorMessage
          })}
        </Alert>
      </EmptyState>
    );
  }

  return (
    <div className="quipucords-content">
      <div className="quipucords-view-container">
        {isActive && (
          <React.Fragment>
            <ViewToolbar lastRefresh={new Date(date).getTime()} secondaryFields={renderToolbarActions()} />
            <ViewPaginationRow totalResults={totalResults} />
          </React.Fragment>
        )}
        <div className="quipucords-list-container">
          <Table
            onExpand={onExpand}
            onSelect={onSelect}
            rows={data?.map((item, index) => ({
              isSelected: (selectedRows?.[item.id] && true) || false,
              source: item,
              cells: [
                {
                  content: sourcesTableCells.description(item),
                  dataLabel: t('table.header', { context: ['description'] })
                },
                {
                  content: sourcesTableCells.scanStatus(item, { viewId }),
                  width: 20,
                  dataLabel: t('table.header', { context: ['scan'] })
                },
                {
                  ...sourcesTableCells.credentialsCellContent(item),
                  isExpanded: expandedRows?.[item.id] === 2,
                  width: 8,
                  dataLabel: t('table.header', { context: ['credentials'] })
                },
                {
                  ...sourcesTableCells.okHostsCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 3,
                  width: 8,
                  dataLabel: t('table.header', { context: ['success', viewId] })
                },
                {
                  ...sourcesTableCells.failedHostsCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 4,
                  width: 8,
                  dataLabel: t('table.header', { context: ['failed', viewId] })
                },
                {
                  ...sourcesTableCells.unreachableHostsCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 5,
                  width: 8,
                  dataLabel: t('table.header', { context: ['unreachable', viewId] })
                },
                {
                  content: sourcesTableCells.actionsCell({
                    isFirst: index === 0,
                    isLast: index === data.length - 1,
                    item,
                    onDelete: () => onDelete(item),
                    onEdit: () => onEdit(item),
                    onScan: () => onScan(item)
                  }),
                  isActionCell: true
                }
              ]
            }))}
          >
            {fulfilled && isActive && (
              <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
                <EmptyStateIcon icon={SearchIcon} />
                <Title size={TitleSizes.lg} headingLevel="h1">
                  {t('view.empty-state', { context: ['filter', 'title'] })}
                </Title>
                <EmptyStateBody>{t('view.empty-state', { context: ['filter', 'description'] })}</EmptyStateBody>
                <EmptyStatePrimary>
                  <Button variant={ButtonVariant.link} onClick={onToolbarFieldClearAll}>
                    {t('view.empty-state', { context: ['label', 'clear'] })}
                  </Button>
                </EmptyStatePrimary>
              </EmptyState>
            )}
            {fulfilled && !isActive && <SourcesEmptyState onAddSource={onShowAddSourceWizard} viewId={viewId} />}
          </Table>
        </div>
      </div>
    </div>
  );
};

/**
 * Prop types
 *
 * @type {{useOnEdit: Function, useOnSelect: Function, useView: Function, t: Function, useOnScan: Function,
 *     useDispatch: Function, useOnDelete: Function, useOnExpand: Function,
 *     useToolbarFieldClearAll: Function, useGetSources: Function, useOnShowAddSourceWizard: Function}}
 */
Sources.propTypes = {
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useGetSources: PropTypes.func,
  useOnDelete: PropTypes.func,
  useOnEdit: PropTypes.func,
  useOnExpand: PropTypes.func,
  useOnScan: PropTypes.func,
  useOnSelect: PropTypes.func,
  useOnShowAddSourceWizard: PropTypes.func,
  useToolbarFieldClearAll: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnEdit: Function, useOnSelect: Function, useView: Function, t: translate, useOnRefresh: Function,
 *     useOnScan: Function, useDispatch: Function, useOnDelete: Function, useOnExpand: Function,
 *     useToolbarFieldClearAll: Function, useGetSources: Function, useOnShowAddSourceWizard: Function}}
 */
Sources.defaultProps = {
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useGetSources,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnScan,
  useOnSelect,
  useOnShowAddSourceWizard,
  useToolbarFieldClearAll,
  useView
};

export { Sources as default, Sources, CONFIG };
