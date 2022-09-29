import React, { useCallback, useEffect, useState } from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useTimeout } from '../../hooks';
import { API_QUERY_SORT_TYPES, API_QUERY_TYPES, apiTypes } from '../../constants/apiConstants';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * State context identifier
 *
 * @type {string}
 */
const VIEW_ID = 'scans';

/**
 * Charge initial view query
 *
 * @type {{'[API_QUERY_TYPES.ORDERING]': string, '[API_QUERY_TYPES.SCAN_TYPE]': string, '[API_QUERY_TYPES.PAGE]': number,
 *    '[API_QUERY_TYPES.PAGE_SIZE]': number}}
 */
const INITIAL_QUERY = {
  [API_QUERY_TYPES.ORDERING]: API_QUERY_SORT_TYPES.NAME,
  [API_QUERY_TYPES.PAGE]: 1,
  [API_QUERY_TYPES.PAGE_SIZE]: 10,
  [API_QUERY_TYPES.SCAN_TYPE]: 'inspect'
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
      type: isExpanded ? reduxTypes.scans.EXPANDED_SCAN : reduxTypes.scans.NOT_EXPANDED_SCAN,
      viewType: reduxTypes.view.SCANS_VIEW,
      item: data.item,
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
      type: reduxTypes.scans.UPDATE_SCANS
    });
  };
};

/**
 * Report/scan actions cancel, pause, restart, start, and download.
 *
 * @param {object} options
 * @param {Function} options.cancelScan
 * @param {Function} options.getReportsDownload
 * @param {Function} options.pauseScan
 * @param {Function} options.restartScan
 * @param {Function} options.startScan
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsResponse
 * @returns {{onRestart: Function, onDownload: Function, onStart: Function, onCancel: Function, onPause: Function}}
 */
const useOnScanAction = ({
  cancelScan = reduxActions.scans.cancelScan,
  getReportsDownload = reduxActions.reports.getReportsDownload,
  pauseScan = reduxActions.scans.pauseScan,
  restartScan = reduxActions.scans.restartScan,
  startScan = reduxActions.scans.startScan,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [updatedScan, setUpdatedScan] = useState({});
  const { id: scanId, name: scanName, context: scanContext } = updatedScan;
  const dispatch = useAliasDispatch();
  const { data, error, fulfilled, pending } = useAliasSelectorsResponse(({ scans }) => scans?.action?.[scanId]);
  const { errorMessage } = data?.[0] || {};

  useEffect(() => {
    if (scanId && !pending) {
      const dispatchList = [];

      if (fulfilled) {
        dispatchList.push({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.success,
          message: t(
            'toast-notifications.description',
            { context: ['scan-report', scanContext], name: scanName || scanId },
            [<strong />]
          )
        });
      }

      if (error) {
        const isWarning = /already\sfinished/i.test(errorMessage);

        dispatchList.push({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: (isWarning && AlertVariant.warning) || AlertVariant.danger,
          header: t('toast-notifications.title', { context: [(isWarning && 'warning') || 'error'] }),
          message:
            errorMessage || t('toast-notifications.description', { context: [(isWarning && 'warning') || 'error'] })
        });
      }

      if (dispatchList.length) {
        dispatch([
          ...dispatchList,
          {
            type: reduxTypes.scans.UPDATE_SCANS
          }
        ]);

        setUpdatedScan({});
      }
    }
  }, [dispatch, error, errorMessage, fulfilled, pending, scanContext, scanId, scanName, t]);

  /**
   * onCancel for scanning
   *
   * @type {Function}
   */
  const onCancel = useCallback(
    ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent, [apiTypes.API_RESPONSE_SCAN_NAME]: name }) => {
      const id = mostRecent[apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID];
      cancelScan(id)(dispatch);
      setUpdatedScan(() => ({ id, name, context: 'canceled' }));
    },
    [cancelScan, dispatch]
  );

  /**
   * onDownload for reports
   *
   * @type {Function}
   */
  const onDownload = useCallback(
    ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent, [apiTypes.API_RESPONSE_SCAN_NAME]: name }) => {
      const id = mostRecent[apiTypes.API_RESPONSE_SCAN_MOST_RECENT_REPORT_ID];
      getReportsDownload(id)(dispatch);
      setUpdatedScan(() => ({ id, name, context: 'download' }));
    },
    [getReportsDownload, dispatch]
  );

  /**
   * onPause for scanning
   *
   * @type {Function}
   */
  const onPause = useCallback(
    ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent, [apiTypes.API_RESPONSE_SCAN_NAME]: name }) => {
      const id = mostRecent[apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID];
      pauseScan(id)(dispatch);
      setUpdatedScan(() => ({ id, name, context: 'paused' }));
    },
    [pauseScan, dispatch]
  );

  /**
   * onRestart for scanning
   *
   * @type {Function}
   */
  const onRestart = useCallback(
    ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent, [apiTypes.API_RESPONSE_SCAN_NAME]: name }) => {
      const id = mostRecent[apiTypes.API_RESPONSE_SCAN_MOST_RECENT_ID];
      restartScan(id)(dispatch);
      setUpdatedScan(() => ({ id, name, context: 'restart' }));
    },
    [restartScan, dispatch]
  );

  /**
   * onStart for scanning
   *
   * @type {Function}
   */
  const onStart = useCallback(
    ({ [apiTypes.API_RESPONSE_SCAN_ID]: id, [apiTypes.API_RESPONSE_SCAN_NAME]: name }) => {
      startScan(id)(dispatch);
      setUpdatedScan(() => ({ id, name, context: 'play' }));
    },
    [startScan, dispatch]
  );

  return {
    onCancel,
    onDownload,
    onPause,
    onRestart,
    onStart
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
      type: isSelected ? reduxTypes.scans.SELECT_SCAN : reduxTypes.scans.DESELECT_SCAN,
      viewType: reduxTypes.view.SCANS_VIEW,
      item: data.item
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
  const updatedScans = useAliasSelector(({ scans }) => scans?.view?.data?.[apiTypes.API_RESPONSE_SCANS_RESULTS], []);
  const { update } = useAliasTimeout(() => {
    const filteredScans = updatedScans.filter(
      ({ [apiTypes.API_RESPONSE_SCAN_MOST_RECENT]: mostRecent }) =>
        mostRecent?.status === 'created' || mostRecent?.status === 'pending' || mostRecent?.status === 'running'
    );

    return filteredScans.length > 0;
  }, pollInterval);

  return update;
};

/**
 * Get scans
 *
 * @param {object} options
 * @param {Function} options.getScans
 * @param {Function} options.useDispatch
 * @param {Function} options.usePoll
 * @param {Function} options.useSelectors
 * @param {Function} options.useSelectorsResponse
 * @returns {{date: *, data: *[], pending: boolean, errorMessage: null, fulfilled: boolean, selectedRows: *,
 *     expandedRows: *, error: boolean}}
 */
const useGetScans = ({
  getScans = reduxActions.scans.getScans,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  usePoll: useAliasPoll = usePoll,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const pollUpdate = useAliasPoll();
  const [refreshUpdate, selectedRows, expandedRows, viewOptions] = useAliasSelectors([
    ({ scans }) => scans?.update,
    ({ scans }) => scans?.selected,
    ({ scans }) => scans?.expanded,
    ({ viewOptions: stateViewOptions }) => stateViewOptions?.[reduxTypes.view.SCANS_VIEW]
  ]);
  const {
    data: responseData,
    error,
    fulfilled,
    message: errorMessage,
    pending,
    responses = {}
  } = useAliasSelectorsResponse({ id: 'view', selector: ({ scans }) => scans?.view });

  const [{ date } = {}] = responses?.list || [];
  const { [apiTypes.API_RESPONSE_SCANS_COUNT]: totalResults, [apiTypes.API_RESPONSE_SCANS_RESULTS]: data = [] } =
    responseData?.view || {};
  const query = helpers.createViewQueryObject(viewOptions, { [apiTypes.API_QUERY_TYPES.SCAN_TYPE]: 'inspect' });

  useShallowCompareEffect(() => {
    getScans(query)(dispatch);
  }, [dispatch, getScans, pollUpdate, query, refreshUpdate]);

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
 * Get scans in the context of the scans view.
 *
 * @param {object} options
 * @param {Function} options.useGetScans
 * @returns {{date: *, data: *[], pending: boolean, errorMessage: null, fulfilled: boolean, selectedRows: *, expandedRows: *, error: boolean}}
 */
const useContextGetScans = ({ useGetScans: useAliasGetScans = useGetScans } = {}) => {
  const results = useAliasGetScans();

  return {
    ...results
  };
};

const context = {
  VIEW_ID,
  INITIAL_QUERY,
  useContextGetScans,
  useGetScans,
  useOnExpand,
  useOnRefresh,
  useOnScanAction,
  useOnSelect,
  usePoll
};

export {
  context as default,
  context,
  VIEW_ID,
  INITIAL_QUERY,
  useContextGetScans,
  useGetScans,
  useOnExpand,
  useOnRefresh,
  useOnScanAction,
  useOnSelect,
  usePoll
};
