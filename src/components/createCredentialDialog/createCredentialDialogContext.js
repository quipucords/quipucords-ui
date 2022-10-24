import { useState } from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useInferredContext as useViewContext } from '../view/viewContext';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * Return credential dialog response
 *
 * @param {object} options
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useCredential = ({ useSelector: useAliasSelector = storeHooks.reactRedux.useSelector } = {}) => {
  const { credentialType, ...data } = useAliasSelector(({ credentials }) => credentials?.dialog, {});
  const updatedCredentialType = data?.credential?.[apiTypes.API_QUERY_TYPES.CREDENTIAL_TYPE] || credentialType;

  return {
    credentialType: updatedCredentialType,
    ...data
  };
};

/**
 * Return an updated source. Display relative toast messaging after wizard closes.
 *
 * @param {object} options
 * @param {Function} options.addCredential
 * @param {Function} options.getCredentials
 * @param {Function} options.t
 * @param {Function} options.updateCredential
 * @param {Function} options.useCredential
 * @param {Function} options.useDispatch
 * @param {Function} options.useViewContext
 * @returns {(function(*, *): void)|*}
 */
const useOnSubmitCredential = ({
  addCredential = reduxActions.credentials.addCredential,
  getCredentials = reduxActions.credentials.getCredentials,
  t = translate,
  updateCredential = reduxActions.credentials.updateCredential,
  useCredential: useAliasCredential = useCredential,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useViewContext: useAliasViewContext = useViewContext
} = {}) => {
  const { viewId } = useAliasViewContext();
  const [credential, setCredential] = useState();
  const dispatch = useAliasDispatch();
  const { edit, fulfilled } = useAliasCredential();

  useShallowCompareEffect(() => {
    if (credential?.values) {
      const { id, ...data } = credential.values;

      if (id) {
        updateCredential(id, data)(dispatch);
      } else {
        addCredential(data)(dispatch);
      }
    }
  }, [addCredential, credential, dispatch, updateCredential]);

  useShallowCompareEffect(() => {
    if (credential?.values && fulfilled) {
      dispatch([
        {
          type: reduxTypes.credentials.UPDATE_CREDENTIAL_HIDE
        },
        {
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.success,
          header: t('toast-notifications.title', { context: ['credential', edit && 'edit'] }),
          message: t('toast-notifications.description', { context: ['credential', edit && 'edit'] })
        },
        {
          type: reduxTypes.credentials.RESET_ACTIONS
        },
        {
          type: reduxTypes.view.UPDATE_VIEW,
          viewId
        }
      ]);

      getCredentials()(dispatch);
    }
  }, [credential, dispatch, edit, fulfilled, getCredentials, t]);

  return data => setCredential(() => data);
};

/**
 * Functions for handling state updates for credentials.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {{onEdit: Function, onHide: Function, onAdd: Function}}
 */
const useOnUpdateCredential = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  /**
   * On edit show the credential in dialog
   *
   * @event onEdit
   * @param {object|*} credential
   */
  const onEdit = credential => {
    dispatch({
      type: reduxTypes.credentials.EDIT_CREDENTIAL_SHOW,
      credential
    });
  };

  /**
   * Hide the credential dialog
   *
   * @event onHide
   */
  const onHide = () => {
    dispatch([
      {
        type: reduxTypes.credentials.UPDATE_CREDENTIAL_HIDE
      },
      {
        type: reduxTypes.credentials.RESET_ACTIONS
      }
    ]);
  };

  /**
   * on add show the credential dialog
   *
   * @event onAdd
   * @param {string|*} credentialType
   */
  const onAdd = credentialType => {
    dispatch([
      {
        type: reduxTypes.credentials.CREATE_CREDENTIAL_SHOW,
        credentialType
      }
    ]);
  };

  return {
    onEdit,
    onHide,
    onAdd
  };
};

const context = {
  useCredential,
  useOnSubmitCredential,
  useOnUpdateCredential
};

export { context as default, context, useCredential, useOnSubmitCredential, useOnUpdateCredential };
