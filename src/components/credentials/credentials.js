import React, { useCallback } from 'react';
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
import {
  AddCredentialType,
  ButtonVariant as CredentialButtonVariant,
  SelectPosition
} from '../addCredentialType/addCredentialType';
import { useOnShowAddSourceWizard } from '../addSourceWizard/addSourceWizardContext';
import { useView } from '../view/viewContext';
import { useToolbarFieldClearAll } from '../viewToolbar/viewToolbarContext';
import { ViewToolbar } from '../viewToolbar/viewToolbar';
import { ViewPaginationRow } from '../viewPaginationRow/viewPaginationRow';
import { CredentialsEmptyState } from './credentialsEmptyState';
import { Table } from '../table/table';
import { credentialsTableCells } from './credentialsTableCells';
import {
  VIEW_ID,
  INITIAL_QUERY,
  useGetCredentials,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnSelect
} from './credentialsContext';
import { CredentialsToolbar } from './credentialsToolbar';
import { translate } from '../i18n/i18n';

const CONFIG = {
  viewId: VIEW_ID,
  initialQuery: INITIAL_QUERY,
  toolbar: CredentialsToolbar
};

/**
 * A credentials view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGetCredentials
 * @param {Function} props.useOnDelete
 * @param {Function} props.useOnEdit
 * @param {Function} props.useOnExpand
 * @param {Function} props.useOnSelect
 * @param {Function} props.useOnShowAddSourceWizard
 * @param {Function} props.useToolbarFieldClearAll
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const Credentials = ({
  t,
  useGetCredentials: useAliasGetCredentials,
  useOnDelete: useAliasOnDelete,
  useOnEdit: useAliasOnEdit,
  useOnExpand: useAliasOnExpand,
  useOnSelect: useAliasOnSelect,
  useOnShowAddSourceWizard: useAliasOnShowAddSourceWizard,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll,
  useView: useAliasView
}) => {
  const onToolbarFieldClearAll = useAliasToolbarFieldClearAll();
  const { isFilteringActive, viewId } = useAliasView();
  const onExpand = useAliasOnExpand();
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
    expandedRows = {},
    totalResults
  } = useAliasGetCredentials();
  const isActive = isFilteringActive || data?.length > 0 || false;

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
        ouiaId="add_credential"
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
 * @type {{useOnEdit: Function, useView: Function, useOnSelect: Function, t: Function, useOnDelete: Function,
 *     useOnExpand: Function, useToolbarFieldClearAll: Function, useGetCredentials: Function,
 *     useOnShowAddSourceWizard: Function}}
 */
Credentials.propTypes = {
  t: PropTypes.func,
  useGetCredentials: PropTypes.func,
  useOnDelete: PropTypes.func,
  useOnEdit: PropTypes.func,
  useOnExpand: PropTypes.func,
  useOnSelect: PropTypes.func,
  useOnShowAddSourceWizard: PropTypes.func,
  useToolbarFieldClearAll: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnEdit: Function, useView: Function, useOnSelect: Function, t: translate, useOnDelete: Function,
 *     useOnExpand: Function, useToolbarFieldClearAll: Function, useGetCredentials: Function,
 *     useOnShowAddSourceWizard: Function}}
 */
Credentials.defaultProps = {
  t: translate,
  useGetCredentials,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnSelect,
  useOnShowAddSourceWizard,
  useToolbarFieldClearAll,
  useView
};

export { Credentials as default, Credentials, CONFIG };
