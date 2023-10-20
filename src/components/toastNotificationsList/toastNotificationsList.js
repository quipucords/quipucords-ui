import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton, AlertGroup } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import helpers from '../../common/helpers';

/**
 * Dismiss a toast
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {(function(*): void)|*}
 */
const useOnDismiss = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return toast => {
    dispatch({
      type: reduxTypes.toastNotifications.TOAST_REMOVE,
      toast
    });
  };
};

/**
 * Hover a toast
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {(function(*): void)|*}
 */
const useOnHover = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return toast => {
    dispatch({
      type: reduxTypes.toastNotifications.TOAST_PAUSE,
      toast
    });
  };
};

/**
 * Leave a toast
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {(function(*): void)|*}
 */
const useOnLeave = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return toast => {
    dispatch({
      type: reduxTypes.toastNotifications.TOAST_RESUME,
      toast
    });
  };
};

/**
 * Toast notifications list: operates by allowing mutation of the passed/original toast object from state.
 *
 * @param {object} props
 * @param {number} props.timeout
 * @param {Function} props.useOnDismiss
 * @param {Function} props.useOnHover
 * @param {Function} props.useOnLeave
 * @param {Function} props.useSelector
 * @returns {React.ReactNode}
 */
const ToastNotificationsList = ({
  timeout,
  useOnDismiss: useAliasOnDismiss,
  useOnHover: useAliasOnHover,
  useOnLeave: useAliasOnLeave,
  useSelector: useAliasSelector
}) => {
  const onDismiss = useAliasOnDismiss();
  const onHover = useAliasOnHover();
  const onLeave = useAliasOnLeave();
  const toasts = useAliasSelector(({ toastNotifications }) => toastNotifications?.toasts, []);

  return (
    <AlertGroup isLiveRegion isToast className="quipucords-toast-notifications__alert-group">
      {toasts?.map(toast => {
        if (!toast.removed) {
          return (
            <Alert
              title={toast.header || toast.message}
              truncateTitle={2}
              timeout={timeout}
              onTimeout={() => onDismiss(toast)}
              variant={toast.alertType}
              actionClose={<AlertActionCloseButton onClose={() => onDismiss(toast)} />}
              key={helpers.generateId('key')}
              onMouseEnter={() => {
                window.setTimeout(() => onHover(toast), timeout);
              }}
              onMouseLeave={() => onLeave(toast)}
            >
              {(toast.header && toast.message) || ''}
            </Alert>
          );
        }
        return null;
      })}
    </AlertGroup>
  );
};

/**
 * Prop types
 *
 * @type {{useOnLeave: Function, useSelector: Function, useOnDismiss: Function, useOnHover: Function, timeout: number}}
 */
ToastNotificationsList.propTypes = {
  timeout: PropTypes.number,
  useOnDismiss: PropTypes.func,
  useOnHover: PropTypes.func,
  useOnLeave: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props
 *
 * @type {{useOnLeave: Function, useSelector: Function, useOnDismiss: Function, useOnHover: Function, timeout: number}}
 */
ToastNotificationsList.defaultProps = {
  timeout: helpers.TOAST_NOTIFICATIONS_TIMEOUT,
  useOnDismiss,
  useOnHover,
  useOnLeave,
  useSelector: storeHooks.reactRedux.useSelector
};

export { ToastNotificationsList as default, ToastNotificationsList, useOnDismiss, useOnHover, useOnLeave };
