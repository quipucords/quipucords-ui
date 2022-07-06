import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton, AlertGroup, AlertVariant } from '@patternfly/react-core';
import { connect, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';

/**
 * Toast notifications list: operates by allowing mutation of the passed/original toast object from state.
 */
class ToastNotificationsList extends React.Component {
  onHover = toast => {
    store.dispatch({
      type: reduxTypes.toastNotifications.TOAST_PAUSE,
      toast
    });
  };

  onLeave = toast => {
    store.dispatch({
      type: reduxTypes.toastNotifications.TOAST_RESUME,
      toast
    });
  };

  onDismiss = toast => {
    store.dispatch({
      type: reduxTypes.toastNotifications.TOAST_REMOVE,
      toast
    });
  };

  render() {
    const { toasts, timeout } = this.props;

    return (
      <AlertGroup isLiveRegion isToast className="quipucords-toast-notifications__alert-group">
        {toasts?.map(toast => {
          if (!toast.removed) {
            return (
              <Alert
                title={toast.header || toast.message}
                truncateTitle={2}
                timeout={!toast.paused && timeout}
                onTimeout={() => this.onDismiss(toast)}
                variant={toast.alertType}
                actionClose={<AlertActionCloseButton onClose={() => this.onDismiss(toast)} />}
                key={helpers.generateId('key')}
                onMouseEnter={() => this.onHover(toast)}
                onMouseLeave={() => this.onLeave(toast)}
              >
                {(toast.header && toast.message) || ''}
              </Alert>
            );
          }
          return null;
        })}
      </AlertGroup>
    );
  }
}

ToastNotificationsList.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      alertType: PropTypes.oneOf([...Object.values(AlertVariant)]),
      header: PropTypes.node,
      message: PropTypes.node,
      removed: PropTypes.bool
    })
  ),
  timeout: PropTypes.number
};

ToastNotificationsList.defaultProps = {
  toasts: [],
  timeout: helpers.TOAST_NOTIFICATIONS_TIMEOUT
};

const mapStateToProps = state => ({ ...state.toastNotifications });

const ConnectedToastNotificationsList = connect(mapStateToProps)(ToastNotificationsList);

export { ConnectedToastNotificationsList as default, ConnectedToastNotificationsList, ToastNotificationsList };
