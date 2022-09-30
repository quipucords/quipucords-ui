import React, { useState } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { AlertVariant, List, ListItem } from '@patternfly/react-core';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useConfirmation } from '../../hooks/useConfirmation';
import { useView } from '../view/viewContext';
import { API_QUERY_SORT_TYPES, API_QUERY_TYPES, apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * State context identifier
 *
 * @type {string}
 */
const VIEW_ID = 'credentials';

/**
 * Charge initial view query
 *
 * @type {{'[API_QUERY_TYPES.ORDERING]': string, '[API_QUERY_TYPES.PAGE]': number, '[API_QUERY_TYPES.PAGE_SIZE]': number}}
 */
const INITIAL_QUERY = {
  [API_QUERY_TYPES.ORDERING]: API_QUERY_SORT_TYPES.NAME,
  [API_QUERY_TYPES.PAGE]: 1,
  [API_QUERY_TYPES.PAGE_SIZE]: 10
};

/**
 * Credential action, onDelete.
 *
 * @param {object} options
 * @param {Function} options.deleteCredentials
 * @param {Function} options.t
 * @param {Function} options.useConfirmation
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsResponse
 * @param {Function} options.useView
 * @returns {(function(*): void)|*}
 */
const useOnDelete = ({
  deleteCredentials = reduxActions.credentials.deleteCredential,
  t = translate,
  useConfirmation: useAliasConfirmation = useConfirmation,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse,
  useView: useAliasView = useView
} = {}) => {
  const { viewId } = useAliasView();
  const onConfirmation = useAliasConfirmation();
  const [credentialsToDelete, setCredentialsToDelete] = useState([]);
  const dispatch = useAliasDispatch();
  const {
    data,
    error: deletedError,
    fulfilled: deletedFulfilled
  } = useAliasSelectorsResponse(({ credentials }) => credentials?.deleted);
  const { errorMessage } = data?.[0] || {};

  useShallowCompareEffect(() => {
    if (credentialsToDelete.length) {
      const credentialIds = credentialsToDelete.map(cred => cred[apiTypes.API_RESPONSE_CREDENTIAL_ID]);
      deleteCredentials(credentialIds)(dispatch);
    }
  }, [credentialsToDelete, deleteCredentials, dispatch]);

  useShallowCompareEffect(() => {
    if (deletedFulfilled && credentialsToDelete.length) {
      const credentialNames = credentialsToDelete.map(cred => cred[apiTypes.API_RESPONSE_CREDENTIAL_NAME]);
      dispatch([
        {
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.success,
          header: t('toast-notifications.title', {
            context: ['deleted-credential'],
            count: credentialNames.length
          }),
          message: t('toast-notifications.description', {
            context: ['deleted-credential'],
            name: credentialNames[0],
            count: credentialNames.length
          })
        },
        {
          type: reduxTypes.credentials.DESELECT_CREDENTIAL,
          item: credentialsToDelete
        },
        {
          type: reduxTypes.view.UPDATE_VIEW,
          viewId
        }
      ]);

      setCredentialsToDelete(() => []);
    }

    if (deletedError && credentialsToDelete.length) {
      const credentialNames = credentialsToDelete.map(cred => cred[apiTypes.API_RESPONSE_CREDENTIAL_NAME]);
      dispatch([
        {
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.danger,
          header: t('toast-notifications.title', {
            context: ['error']
          }),
          message: t('toast-notifications.description', {
            context: ['deleted-credential', 'error'],
            name: credentialNames[0],
            count: credentialNames.length,
            message: errorMessage
          })
        },
        {
          type: reduxTypes.credentials.DESELECT_CREDENTIAL,
          item: credentialsToDelete
        },
        {
          type: reduxTypes.view.UPDATE_VIEW,
          viewId
        }
      ]);

      setCredentialsToDelete(() => []);
    }
  }, [credentialsToDelete, deletedError, deletedFulfilled, dispatch, errorMessage, t]);

  /**
   * Confirmation, and state, for deleting a single or multiple credentials
   *
   * @param {Array|string} credentials
   */
  return credentials => {
    const updatedCredentials = (Array.isArray(credentials) && credentials) || [credentials];

    onConfirmation({
      title: t('form-dialog.confirmation', {
        context: ['title', 'delete-credential'],
        count: updatedCredentials.length
      }),
      heading: t(
        'form-dialog.confirmation',
        {
          context: ['heading', 'delete-credential'],
          count: updatedCredentials.length,
          name: updatedCredentials?.[0]?.[apiTypes.API_RESPONSE_CREDENTIAL_NAME]
        },
        [<strong />]
      ),
      body:
        (updatedCredentials.length > 1 && (
          <List className="quipucords-list__overflow-scroll" isPlain>
            {updatedCredentials.map(
              ({
                [apiTypes.API_RESPONSE_CREDENTIAL_NAME]: name,
                [apiTypes.API_RESPONSE_CREDENTIAL_CRED_TYPE]: credType
              }) => (
                <ListItem key={name} icon={<ContextIcon symbol={ContextIconVariant[credType]} />}>
                  {name}
                </ListItem>
              )
            )}
          </List>
        )) ||
        undefined,
      confirmButtonText: t('form-dialog.label', {
        context: ['delete']
      }),
      onConfirm: () => setCredentialsToDelete(() => updatedCredentials)
    });
  };
};

/**
 * On edit a credential, show modal.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnEdit = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return item => {
    dispatch({
      type: reduxTypes.credentials.EDIT_CREDENTIAL_SHOW,
      credential: item
    });
  };
};

/**
 * On expand a row facet.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnExpand = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({ isExpanded, cellIndex, data }) => {
    dispatch({
      type: isExpanded ? reduxTypes.credentials.EXPANDED_CREDENTIAL : reduxTypes.credentials.NOT_EXPANDED_CREDENTIAL,
      viewType: reduxTypes.view.CREDENTIALS_VIEW,
      item: data.item,
      cellIndex
    });
  };
};

/**
 * On select a row.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnSelect = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({ isSelected, data }) => {
    dispatch({
      type: isSelected ? reduxTypes.credentials.SELECT_CREDENTIAL : reduxTypes.credentials.DESELECT_CREDENTIAL,
      viewType: reduxTypes.view.CREDENTIALS_VIEW,
      item: data.item
    });
  };
};

/**
 * Use credentials' response
 *
 * @param {object} options
 * @param {Function} options.useSelectors
 * @param {Function} options.useSelectorsResponse
 * @returns {{date: *, totalResults: (*|number), data: *[], pending: boolean, hasData: boolean, errorMessage: null,
 *     fulfilled: boolean, selectedRows: *, expandedRows: *, error: boolean}}
 */
const useCredentials = ({
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [selectedRows, expandedRows] = useAliasSelectors([
    ({ credentials }) => credentials?.selected,
    ({ credentials }) => credentials?.expanded
  ]);
  const {
    data: responseData,
    error,
    fulfilled,
    message: errorMessage,
    pending,
    responses = {}
  } = useAliasSelectorsResponse({ id: 'view', selector: ({ credentials }) => credentials?.view });

  const [{ date } = {}] = responses?.list || [];
  const {
    [apiTypes.API_RESPONSE_CREDENTIALS_COUNT]: totalResults,
    [apiTypes.API_RESPONSE_CREDENTIALS_RESULTS]: data = []
  } = responseData?.view || {};

  return {
    pending,
    error,
    errorMessage,
    fulfilled,
    data,
    date,
    hasData: fulfilled === true && totalResults > 0,
    selectedRows,
    expandedRows,
    totalResults: totalResults || 0
  };
};

/**
 * Get credentials
 *
 * @param {object} options
 * @param {Function} options.getCredentials
 * @param {Function} options.useCredentials
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectors
 * @param {Function} options.useView
 * @returns {{date: *, data: *[], pending: boolean, errorMessage: null, fulfilled: boolean, selectedRows: *,
 *     expandedRows: *, error: boolean}}
 */
const useGetCredentials = ({
  getCredentials = reduxActions.credentials.getCredentials,
  useCredentials: useAliasCredentials = useCredentials,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useView: useAliasView = useView
} = {}) => {
  const { query, viewId } = useAliasView();
  const dispatch = useAliasDispatch();
  const [refreshUpdate] = useAliasSelectors([({ view }) => view.update?.[viewId]]);
  const response = useAliasCredentials();

  useShallowCompareEffect(() => {
    getCredentials(null, query)(dispatch);
  }, [dispatch, getCredentials, query, refreshUpdate]);

  return response;
};

const context = {
  VIEW_ID,
  INITIAL_QUERY,
  useCredentials,
  useGetCredentials,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnSelect
};

export {
  context as default,
  context,
  VIEW_ID,
  INITIAL_QUERY,
  useCredentials,
  useGetCredentials,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnSelect
};
