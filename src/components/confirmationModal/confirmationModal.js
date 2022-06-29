import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant, Button, ButtonVariant, Title } from '@patternfly/react-core';
import { Modal } from '../modal/modal';
import { connect, store, reduxTypes } from '../../redux';
import { translate } from '../i18n/i18n';

const ConfirmationModal = ({
  show,
  title,
  heading,
  body,
  icon,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  t
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

  return (
    <Modal
      className="quipucords-modal__confirmation"
      isOpen={show}
      backdrop={false}
      showClose
      onClose={cancel}
      actions={setActions()}
      header={
        <Title headingLevel="h4">{title || t('form-dialog.label', { context: ['submit', 'confirmation'] })}</Title>
      }
      disableFocusTrap
    >
      <Alert isInline isPlain variant={icon} title={heading}>
        {body && <p>{body}</p>}
      </Alert>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  heading: PropTypes.node,
  icon: PropTypes.node,
  body: PropTypes.node,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  t: PropTypes.func
};

ConfirmationModal.defaultProps = {
  title: null,
  heading: null,
  body: null,
  icon: AlertVariant.warning,
  confirmButtonText: null,
  cancelButtonText: null,
  onConfirm: null,
  onCancel: null,
  t: translate
};

const mapStateToProps = state => ({ ...state.confirmationModal });

const ConnectedConfirmationModal = connect(mapStateToProps)(ConfirmationModal);

export { ConnectedConfirmationModal as default, ConnectedConfirmationModal, ConfirmationModal };
