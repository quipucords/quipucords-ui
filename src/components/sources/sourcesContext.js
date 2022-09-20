import React, { useState } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { AlertVariant, List, ListItem } from '@patternfly/react-core';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useTimeout } from '../../hooks';
import { useView } from '../view/viewContext';
import { useConfirmation } from '../../hooks/useConfirmation';
import { API_QUERY_SORT_TYPES, API_QUERY_TYPES, apiTypes } from '../../constants/apiConstants';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * State context identifier
 *
 * @type {string}
 */
const VIEW_ID = 'sources';

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
 * Sources action, onDelete.
 *
 * @param {object} options
 * @param {Function} options.deleteSources
 * @param {Function} options.t
 * @param {Function} options.useConfirmation
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsResponse
 * @param {Function} options.useView
 * @returns {(function(*): void)|*}
 */
const useOnDelete = ({
  deleteSources = reduxActions.sources.deleteSource,
  t = translate,
  useConfirmation: useAliasConfirmation = useConfirmation,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse,
  useView: useAliasView = useView
} = {}) => {
  const { viewId } = useAliasView();
  const onConfirmation = useAliasConfirmation();
  const [sourcesToDelete, setSourcesToDelete] = useState([]);
  const dispatch = useAliasDispatch();
  const {
    data,
    error: deletedError,
    fulfilled: deletedFulfilled
  } = useAliasSelectorsResponse(({ sources }) => sources?.deleted);
  const { errorMessage } = data?.[0] || {};

  useShallowCompareEffect(() => {
    if (sourcesToDelete.length) {
      const sourceIds = sourcesToDelete.map(source => source[apiTypes.API_RESPONSE_SOURCE_ID]);
      deleteSources(sourceIds)(dispatch);
    }
  }, [sourcesToDelete, deleteSources, dispatch]);

  useShallowCompareEffect(() => {
    if (deletedFulfilled && sourcesToDelete.length) {
      const sourceNames = sourcesToDelete.map(source => source[apiTypes.API_RESPONSE_SOURCE_NAME]);
      dispatch([
        {
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.success,
          header: t('toast-notifications.title', {
            context: ['deleted-source'],
            count: sourceNames.length
          }),
          message: t('toast-notifications.description', {
            context: ['deleted-source'],
            name: sourceNames[0],
            count: sourceNames.length
          })
        },
        {
          type: reduxTypes.sources.DESELECT_SOURCE,
          item: sourcesToDelete
        },
        {
          type: reduxTypes.view.UPDATE_VIEW,
          viewId
        }
      ]);

      setSourcesToDelete(() => []);
    }

    if (deletedError && sourcesToDelete.length) {
      const sourceNames = sourcesToDelete.map(source => source[apiTypes.API_RESPONSE_SOURCE_NAME]);
      dispatch([
        {
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.danger,
          header: t('toast-notifications.title', {
            context: ['error']
          }),
          message: t('toast-notifications.description', {
            context: ['deleted-source', 'error'],
            name: sourceNames[0],
            count: sourceNames.length,
            message: errorMessage
          })
        },
        {
          type: reduxTypes.sources.DESELECT_SOURCE,
          item: sourcesToDelete
        },
        {
          type: reduxTypes.view.UPDATE_VIEW,
          viewId
        }
      ]);

      setSourcesToDelete(() => []);
    }
  }, [deletedError, deletedFulfilled, dispatch, errorMessage, sourcesToDelete, t, viewId]);

  return sources => {
    const updatedSources = (Array.isArray(sources) && sources) || [sources];

    onConfirmation({
      title: t('form-dialog.confirmation', {
        context: ['title', 'delete-source'],
        count: updatedSources.length
      }),
      heading: t(
        'form-dialog.confirmation',
        {
          context: ['heading', 'delete-source'],
          count: updatedSources.length,
          name: updatedSources?.[0]?.[apiTypes.API_RESPONSE_SOURCE_NAME]
        },
        [<strong />]
      ),
      body:
        (updatedSources.length > 1 && (
          <List className="quipucords-list__overflow-scroll" isPlain>
            {updatedSources.map(
              ({
                [apiTypes.API_RESPONSE_SOURCE_NAME]: name,
                [apiTypes.API_RESPONSE_SOURCE_SOURCE_TYPE]: sourceType
              }) => (
                <ListItem key={name} icon={<ContextIcon symbol={ContextIconVariant[sourceType]} />}>
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
      onConfirm: () => setSourcesToDelete(() => updatedSources)
    });
  };
};

/**
 * On edit a source, show modal.
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
 * On expand a row facet.
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
      item: sourceData.source,
      cellIndex
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
 * On select a row.
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
      item: sourceData.source
    });
  };
};

/**
 * Poll data for pending results.
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
  const updatedSources = useAliasSelector(
    ({ sources }) => sources?.view?.data?.[apiTypes.API_RESPONSE_SOURCES_RESULTS],
    []
  );
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
 * Use sources' response
 *
 * @param {object} options
 * @param {Function} options.useSelectors
 * @param {Function} options.useSelectorsResponse
 * @returns {{date: *, totalResults: (*|number), data: *[], pending: boolean, hasData: boolean, errorMessage: null,
 *     fulfilled: boolean, selectedRows: *, expandedRows: *, error: boolean}}
 */
const useSources = ({
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [selectedRows, expandedRows] = useAliasSelectors([
    ({ sources }) => sources?.selected,
    ({ sources }) => sources?.expanded
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
  const { [apiTypes.API_RESPONSE_SOURCES_COUNT]: totalResults, [apiTypes.API_RESPONSE_SOURCES_RESULTS]: data = [] } =
    responseData?.view || {};

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
 * Get sources
 *
 * @param {object} options
 * @param {Function} options.getSources
 * @param {Function} options.useDispatch
 * @param {Function} options.usePoll
 * @param {Function} options.useSelectors
 * @param {Function} options.useView
 * @param {Function} options.useSources
 * @returns {{date: *, totalResults: (*|number), data: *[], pending: boolean, hasData: boolean, errorMessage: null,
 *     fulfilled: boolean, selectedRows: *, expandedRows: *, error: boolean}}
 */
const useGetSources = ({
  getSources = reduxActions.sources.getSources,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  usePoll: useAliasPoll = usePoll,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSources: useAliasSources = useSources,
  useView: useAliasView = useView
} = {}) => {
  const { query, viewId } = useAliasView();
  const dispatch = useAliasDispatch();
  const pollUpdate = useAliasPoll();
  const [refreshUpdate] = useAliasSelectors([({ view }) => view.update?.[viewId]]);
  const response = useAliasSources();

  useShallowCompareEffect(() => {
    getSources(query)(dispatch);
  }, [dispatch, getSources, pollUpdate, query, refreshUpdate]);

  return response;
};

const context = {
  VIEW_ID,
  INITIAL_QUERY,
  useGetSources,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnScan,
  useOnSelect,
  usePoll,
  useSources
};

export {
  context as default,
  context,
  VIEW_ID,
  INITIAL_QUERY,
  useGetSources,
  useOnDelete,
  useOnEdit,
  useOnExpand,
  useOnScan,
  useOnSelect,
  usePoll,
  useSources
};
