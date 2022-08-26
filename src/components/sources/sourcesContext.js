import React, { useEffect } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useTimeout } from '../../hooks';
import { apiTypes } from '../../constants/apiConstants';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * On Delete confirmation, and action.
 *
 * @param {object} options
 * @param {Function} options.deleteSource
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelector
 * @param {Function} options.useSelectorsResponse
 * @returns {Function}
 */
const useOnDelete = ({
  deleteSource = reduxActions.sources.deleteSource,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const sourceToDelete = useAliasSelector(({ sources }) => sources?.confirmDelete?.source, {});
  const { error, fulfilled, message } = useAliasSelectorsResponse(({ sources }) => sources?.deleted);
  const { [apiTypes.API_RESPONSE_SOURCE_ID]: sourceId, [apiTypes.API_RESPONSE_SOURCE_NAME]: sourceName } =
    sourceToDelete;

  useEffect(() => {
    if (sourceId) {
      dispatch([
        {
          type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
        }
      ]);

      deleteSource(sourceId)(dispatch);
    }
  }, [sourceId, deleteSource, dispatch]);

  useShallowCompareEffect(() => {
    if (fulfilled) {
      dispatch([
        {
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: 'success',
          header: t('toast-notifications.title', {
            context: ['deleted-source']
          }),
          message: t('toast-notifications.description', {
            context: ['deleted-source'],
            name: sourceName
          })
        },
        {
          type: reduxTypes.sources.RESET_DELETE_SOURCE
        },
        {
          type: reduxTypes.view.DESELECT_ITEM,
          viewType: reduxTypes.view.SOURCES_VIEW,
          item: sourceToDelete
        },
        {
          type: reduxTypes.sources.UPDATE_SOURCES
        }
      ]);
    }

    if (error) {
      dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: 'danger',
        header: t('toast-notifications.title', {
          context: ['error']
        }),
        message
      });
    }
  }, [error, fulfilled, message, dispatch, sourceName, sourceToDelete]);

  return source => {
    dispatch({
      type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_SHOW,
      title: t('form-dialog.confirmation', {
        context: ['title', 'delete-source']
      }),
      heading: t(
        'form-dialog.confirmation',
        {
          context: ['heading', 'delete-source'],
          name: source[apiTypes.API_RESPONSE_SOURCE_NAME]
        },
        [<strong />]
      ),
      confirmButtonText: t('form-dialog.label', {
        context: ['delete']
      }),
      onConfirm: () =>
        dispatch({
          type: reduxTypes.sources.CONFIRM_DELETE_SOURCE,
          source
        })
    });
  };
};

/**
 * On edit a source
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnEdit = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return source => {
    dispatch({
      type: reduxTypes.sources.EDIT_SOURCE_SHOW,
      source
    });
  };
};

/**
 * On expand a source row facet.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnExpand = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({ isExpanded, cellIndex, data: sourceData }) => {
    dispatch({
      type: isExpanded ? reduxTypes.sources.EXPANDED_SOURCE : reduxTypes.sources.NOT_EXPANDED_SOURCE,
      viewType: reduxTypes.view.SOURCES_VIEW,
      source: sourceData.source,
      cellIndex
    });
  };
};

/**
 * On refresh sources view.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnRefresh = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return () => {
    dispatch({
      type: reduxTypes.sources.UPDATE_SOURCES
    });
  };
};

/**
 * On scan a source
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnScan = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return source => {
    dispatch({
      type: reduxTypes.scans.EDIT_SCAN_SHOW,
      sources: [source]
    });
  };
};

/**
 * On select a source row.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnSelect = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({ isSelected, data: sourceData }) => {
    dispatch({
      type: isSelected ? reduxTypes.sources.SELECT_SOURCE : reduxTypes.sources.DESELECT_SOURCE,
      viewType: reduxTypes.view.SOURCES_VIEW,
      source: sourceData.source
    });
  };
};

/**
 * Poll sources data for pending results.
 *
 * @param {object} options
 * @param {number} options.pollInterval
 * @param {Function} options.useSelector
 * @param {Function} options.useTimeout
 * @returns {Function}
 */
const usePoll = ({
  pollInterval = helpers.POLL_INTERVAL,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useTimeout: useAliasTimeout = useTimeout
} = {}) => {
  const updatedSources = useAliasSelector(({ sources }) => sources?.view?.data?.results, []);
  const { update } = useAliasTimeout(() => {
    const filteredSources = updatedSources.filter(
      ({ connection }) =>
        connection?.status === 'created' || connection?.status === 'pending' || connection?.status === 'running'
    );

    return filteredSources.length > 0;
  }, pollInterval);

  return update;
};

/**
 * Get sources
 *
 * @param {object} options
 * @param {Function} options.getSources
 * @param {Function} options.useDispatch
 * @param {Function} options.usePoll
 * @param {Function} options.useSelectors
 * @param {Function} options.useSelectorsResponse
 * @returns {{date: *, sources: *[], expandedSources: *, pending: boolean, errorMessage: null, fulfilled: boolean, error: boolean, selectedSources: *}}
 */
const useGetSources = ({
  getSources = reduxActions.sources.getSources,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  usePoll: useAliasPoll = usePoll,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const pollUpdate = useAliasPoll();
  const [refreshUpdate, selectedRows, expandedRows, viewOptions] = useAliasSelectors([
    ({ sources }) => sources?.update,
    ({ sources }) => sources?.selected,
    ({ sources }) => sources?.expanded,
    ({ viewOptions: stateViewOptions }) => stateViewOptions?.[reduxTypes.view.SOURCES_VIEW]
  ]);
  const {
    data: responseData,
    error,
    fulfilled,
    message: errorMessage,
    pending,
    responses = {}
  } = useAliasSelectorsResponse({ id: 'view', selector: ({ sources }) => sources?.view });

  const [{ date } = {}] = responses?.list || [];
  const { results: data = [] } = responseData?.view || {};
  const query = helpers.createViewQueryObject(viewOptions);

  useShallowCompareEffect(() => {
    getSources(query)(dispatch);
  }, [dispatch, getSources, pollUpdate, query, refreshUpdate]);

  return {
    pending,
    error,
    errorMessage,
    fulfilled,
    data,
    date,
    selectedRows,
    expandedRows
  };
};

const context = {
  useGetSources,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnRefresh,
  useOnScan,
  useOnSelect,
  usePoll
};

export {
  context as default,
  context,
  useGetSources,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnRefresh,
  useOnScan,
  useOnSelect,
  usePoll
};
