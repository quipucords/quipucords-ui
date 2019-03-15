import React from 'react';
import PropTypes from 'prop-types';
import { MessageDialog, Icon } from 'patternfly-react';
import { connect, store, reduxTypes } from '../../redux';
import helpers from '../../common/helpers';

const ConfirmationModal = ({
  show,
  title,
  heading,
  body,
  icon,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel
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

  return (
    <MessageDialog
      primaryAction={onConfirm}
      secondaryAction={cancel}
      onHide={cancel}
      icon={icon}
      show={show}
      title={title}
      primaryActionButtonContent={confirmButtonText}
      secondaryActionButtonContent={cancelButtonText}
      primaryContent={<p>{heading}</p>}
      secondaryContent={<p>{body}</p>}
    />
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
  onCancel: PropTypes.func
};

ConfirmationModal.defaultProps = {
  title: 'Confirm',
  heading: null,
  body: null,
  icon: <Icon type="pf" name="warning-triangle-o" />,
  confirmButtonText: 'Confirm',
  cancelButtonText: '',
  onConfirm: helpers.noop,
  onCancel: null
};

const mapStateToProps = state => ({ ...state.confirmationModal });

const ConnectedConfirmationModal = connect(mapStateToProps)(ConfirmationModal);

export { ConnectedConfirmationModal as default, ConnectedConfirmationModal, ConfirmationModal };
