import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertVariant,
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
import {
  AddCredentialType,
  ButtonVariant as CredentialButtonVariant,
  SelectPosition
} from '../addCredentialType/addCredentialType';
import { reduxTypes, storeHooks } from '../../redux';
import { useOnShowAddSourceWizard } from '../addSourceWizard/addSourceWizardContext';
import { useView } from '../view/viewContext';
import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';
import { CredentialsEmptyState } from './credentialsEmptyState';
import { CredentialFilterFields, CredentialSortFields } from './credentialConstants';
import { Table } from '../table/table';
import { credentialsTableCells } from './credentialsTableCells';
import {
  VIEW_ID,
  INITIAL_QUERY,
  useGetCredentials,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnRefresh,
  useOnSelect
} from './credentialsContext';
import { translate } from '../i18n/i18n';

const CONFIG = {
  viewId: VIEW_ID,
  initialQuery: INITIAL_QUERY
};

/**
 * A credentials view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useGetCredentials
 * @param {Function} props.useOnDelete
 * @param {Function} props.useOnEdit
 * @param {Function} props.useOnExpand
 * @param {Function} props.useOnRefresh
 * @param {Function} props.useOnSelect
 * @param {Function} props.useSelectors
 * @param {Function} props.useOnShowAddSourceWizard
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const Credentials = ({
  t,
  useDispatch: useAliasDispatch,
  useGetCredentials: useAliasGetCredentials,
  useOnDelete: useAliasOnDelete,
  useOnEdit: useAliasOnEdit,
  useOnExpand: useAliasOnExpand,
  useOnRefresh: useAliasOnRefresh,
  useOnSelect: useAliasOnSelect,
  useSelectors: useAliasSelectors,
  useOnShowAddSourceWizard: useAliasOnShowAddSourceWizard,
  useView: useAliasView
}) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();
  const onExpand = useAliasOnExpand();
  const onRefresh = useAliasOnRefresh();
  const onDelete = useAliasOnDelete();
  const onEdit = useAliasOnEdit();
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
    expandedRows = {}
  } = useAliasGetCredentials();
  const [viewOptions = {}] = useAliasSelectors([
    ({ viewOptions: stateViewOptions }) => stateViewOptions[reduxTypes.view.CREDENTIALS_VIEW]
  ]);
  const isActive = viewOptions?.activeFilters?.length > 0 || data?.length > 0 || false;

  /**
   * Clear toolbar filters
   *
   * @event onToolbarFieldClearAll
   */
  const onToolbarFieldClearAll = () => {
    dispatch({
      type: reduxTypes.viewToolbar.CLEAR_FILTERS,
      viewType: reduxTypes.view.CREDENTIALS_VIEW
    });
  };

  /**
   * Toolbar actions onDeleteCredentials
   *
   * @event onDeleteCredentials
   */
  const onDeleteCredentials = useCallback(() => {
    const credentialsToDelete = Object.values(selectedRows).filter(val => val !== null);
    onDelete(credentialsToDelete);
  }, [onDelete, selectedRows]);

  /**
   * Return toolbar actions.
   *
   * @returns {React.ReactNode}
   */
  const renderToolbarActions = () => (
    <React.Fragment>
      <AddCredentialType
        buttonVariant={CredentialButtonVariant.primary}
        position={SelectPosition.right}
        placeholder={t('form-dialog.label', { context: 'add' })}
      />{' '}
      <Button
        variant={ButtonVariant.secondary}
        isDisabled={Object.values(selectedRows).filter(val => val !== null).length <= 1}
        onClick={onDeleteCredentials}
      >
        {t('form-dialog.label', { context: 'delete' })}
      </Button>
    </React.Fragment>
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
            <ViewToolbar
              viewType={reduxTypes.view.CREDENTIALS_VIEW}
              filterFields={CredentialFilterFields}
              sortFields={CredentialSortFields}
              onRefresh={() => onRefresh()}
              lastRefresh={new Date(date).getTime()}
              actions={renderToolbarActions()}
              itemsType="Credential"
              itemsTypePlural="Credentials"
              selectedCount={viewOptions.selectedItems?.length}
              {...viewOptions}
            />
            <ViewPaginationRow viewType={reduxTypes.view.CREDENTIALS_VIEW} {...viewOptions} />
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
                  content: credentialsTableCells.description(item),
                  width: 35,
                  dataLabel: t('table.header', { context: ['description'] })
                },
                {
                  content: credentialsTableCells.authType(item, { viewId }),
                  dataLabel: t('table.header', { context: ['auth-type'] })
                },
                {
                  ...credentialsTableCells.sourcesCellContent(item, { viewId }),
                  isExpanded: expandedRows?.[item.id] === 2,
                  width: 8,
                  dataLabel: t('table.header', { context: ['sources'] })
                },
                {
                  style: { textAlign: 'right' },
                  content: credentialsTableCells.actionsCell({
                    isFirst: index === 0,
                    isLast: index === data.length - 1,
                    item,
                    onEdit: () => onEdit(item),
                    onDelete: () => onDelete(item)
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
            {fulfilled && !isActive && <CredentialsEmptyState viewId={viewId} onAddSource={onShowAddSourceWizard} />}
          </Table>
        </div>
      </div>
    </div>
  );
};

/**
 * Prop types
 *
 * @type {{useOnEdit: Function, useView: Function, useOnSelect: Function, t: Function, useOnRefresh: Function,
 *     useDispatch: Function, useOnDelete: Function, useOnExpand: Function, useSelectors: Function, useGetCredentials: Function,
 *     useOnShowAddSourceWizard: Function}}
 */
Credentials.propTypes = {
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useGetCredentials: PropTypes.func,
  useOnDelete: PropTypes.func,
  useOnEdit: PropTypes.func,
  useOnExpand: PropTypes.func,
  useOnRefresh: PropTypes.func,
  useOnSelect: PropTypes.func,
  useOnShowAddSourceWizard: PropTypes.func,
  useSelectors: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnEdit: Function, useView: Function, useOnSelect: Function, t: translate, useOnRefresh: Function,
 *     useDispatch: Function, useOnDelete: Function, useOnExpand: Function, useSelectors: Function, useGetCredentials: Function,
 *     useOnShowAddSourceWizard: Function}}
 */
Credentials.defaultProps = {
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useGetCredentials,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnRefresh,
  useOnSelect,
  useOnShowAddSourceWizard,
  useSelectors: storeHooks.reactRedux.useSelectors,
  useView
};

export { Credentials as default, Credentials, CONFIG };
