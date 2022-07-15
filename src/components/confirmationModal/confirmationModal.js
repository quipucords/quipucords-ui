import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant as ConfirmationVariant, Button, ButtonVariant, Title } from '@patternfly/react-core';
import { Modal } from '../modal/modal';
import { connect, store, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Display a confirmation modal with actions.
 *
 * @param {object} props
 * @param {React.ReactNode} props.body
 * @param {React.ReactNode} props.children
 * @param {string} props.cancelButtonText
 * @param {string} props.confirmButtonText
 * @param {React.ReactNode} props.heading
 * @param {string} props.icon
 * @param {boolean} props.isClose
 * @param {boolean} props.isContentOnly
 * @param {boolean} props.isActions
 * @param {Function} props.onCancel
 * @param {Function} props.onConfirm
 * @param {boolean} props.show
 * @param {Function} props.t
 * @param {string} props.title
 * @returns {React.ReactNode}
 */
const ConfirmationModal = ({
  body,
  children,
  cancelButtonText,
  confirmButtonText,
  heading,
  icon,
  isClose,
  isContentOnly,
  isActions,
  onCancel,
  onConfirm,
  show,
  t,
  title
}) => {
  const cancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      store.dispatch({
        type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
      });
    }
  };

  const setActions = () => {
    const actions = [];

    if (!isActions) {
      return actions;
    }

    if (onConfirm) {
      actions.push(
        <Button key="submit" onClick={onConfirm}>
          {confirmButtonText || t('form-dialog.label', { context: ['submit', 'confirmation'] })}
        </Button>
      );
    }

    actions.push(
      <Button key="cancel" variant={ButtonVariant.secondary} onClick={cancel}>
        {cancelButtonText || t('form-dialog.label', { context: 'cancel' })}
      </Button>
    );

    return actions;
  };

  const updatedChildren =
    body || heading ? (
      <Alert isInline isPlain variant={icon || undefined} title={heading}>
        <p>{body}</p>
      </Alert>
    ) : (
      children
    );

  return (
    <Modal
      className="quipucords-modal__confirmation"
      isContentOnly={isContentOnly}
      isOpen={show}
      backdrop={false}
      showClose={isClose}
      onClose={cancel}
      actions={setActions()}
      header={
        title && (
          <Title headingLevel="h4">{title || t('form-dialog.label', { context: ['submit', 'confirmation'] })}</Title>
        )
      }
      disableFocusTrap
    >
      {updatedChildren || ''}
    </Modal>
  );
};

/**
 * Prop types
 *
 * @type {{isClose: boolean, isActions: boolean, heading: React.ReactNode, icon: string, body: React.ReactNode, title: string,
 *     show: boolean, t: Function, children: React.ReactNode, onCancel: Function, onConfirm: Function, isContentOnly: boolean,
 *     cancelButtonText: string, confirmButtonText: string}}
 */
ConfirmationModal.propTypes = {
  body: PropTypes.node,
  cancelButtonText: PropTypes.string,
  children: PropTypes.node,
  confirmButtonText: PropTypes.string,
  heading: PropTypes.node,
  icon: PropTypes.oneOf([...Object.values(ConfirmationVariant)]),
  isActions: PropTypes.bool,
  isClose: PropTypes.bool,
  isContentOnly: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  t: PropTypes.func,
  title: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{isClose: boolean, isActions: boolean, heading: null, icon: ConfirmationVariant.warning, title: null, body: null,
 *     t: translate, children: null, onCancel: null, onConfirm: null, isContentOnly: boolean, confirmButtonText: null,
 *     cancelButtonText: null}}
 */
ConfirmationModal.defaultProps = {
  children: null,
  title: null,
  heading: null,
  body: null,
  icon: ConfirmationVariant.warning,
  isActions: true,
  isClose: true,
  isContentOnly: false,
  confirmButtonText: null,
  cancelButtonText: null,
  onConfirm: null,
  onCancel: null,
  t: translate
};

const mapStateToProps = state => ({ ...state.confirmationModal });

const ConnectedConfirmationModal = connect(mapStateToProps)(ConfirmationModal);

export { ConnectedConfirmationModal as default, ConnectedConfirmationModal, ConfirmationModal, ConfirmationVariant };
