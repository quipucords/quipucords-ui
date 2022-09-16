import React, { useState } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { AlertVariant, List, ListItem } from '@patternfly/react-core';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useTimeout } from '../../hooks';
import { apiTypes } from '../../constants/apiConstants';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { useConfirmation } from '../../hooks/useConfirmation';

/**
 * Sources action, onDelete.
 *
 * @param {object} options
 * @param {Function} options.deleteSources
 * @param {Function} options.t
 * @param {Function} options.useConfirmation
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsResponse
 * @returns {(function(*): void)|*}
 */
const useOnDelete = ({
  deleteSources = reduxActions.sources.deleteSource,
  t = translate,
  useConfirmation: useAliasConfirmation = useConfirmation,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
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
          type: reduxTypes.sources.UPDATE_SOURCES
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
          type: reduxTypes.sources.UPDATE_SOURCES
        }
      ]);

      setSourcesToDelete(() => []);
    }
  }, [deletedError, deletedFulfilled, dispatch, errorMessage, sourcesToDelete, t]);

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
 * On refresh view.
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
 * Get sources
 *
 * @param {object} options
 * @param {Function} options.getSources
 * @param {Function} options.useDispatch
 * @param {Function} options.usePoll
 * @param {Function} options.useSelectors
 * @param {Function} options.useSelectorsResponse
 * @returns {{date: *, sources: *[], expandedSources: *, pending: boolean, errorMessage: null, fulfilled: boolean,
 *     error: boolean, selectedSources: *}}
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
  const { [apiTypes.API_RESPONSE_SOURCES_RESULTS]: data = [] } = responseData?.view || {};
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

/**
 * Confirm if sources exist
 *
 * @param {object} options
 * @param {Function} options.useGetSources
 * @returns {boolean}
 */
const useSourcesExist = ({ useGetSources: useAliasGetSources = useGetSources } = {}) => {
  const { fulfilled, data } = useAliasGetSources();

  return {
    sourcesCount: data?.length ?? 0,
    hasSources: fulfilled === true && data?.length > 0
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
  usePoll,
  useSourcesExist
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
  usePoll,
  useSourcesExist
};
