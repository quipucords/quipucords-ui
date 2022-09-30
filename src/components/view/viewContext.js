import React, { useContext } from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { helpers } from '../../common';

const DEFAULT_CONTEXT = [{}, helpers.noop];

const ViewContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated view context.
 *
 * @returns {React.Context<{}>}
 */
const useViewContext = () => useContext(ViewContext);

/**
 * Context query for views
 *
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {Function} options.useViewContext
 * @returns {{}}
 */
const useQuery = ({
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useViewContext: useAliasViewContext = useViewContext
} = {}) => {
  const { initialQuery, viewId } = useAliasViewContext();
  const query = useAliasSelector(({ view }) => view.query?.[viewId], {});

  return {
    ...initialQuery,
    ...query
  };
};

/**
 * Context config for views
 *
 * @param {object} options
 * @param {Function} options.useViewContext
 * @returns {{toolbar}}
 */
const useConfig = ({ useViewContext: useAliasViewContext = useViewContext } = {}) => {
  const { toolbar } = useAliasViewContext();

  return {
    toolbar
  };
};

/**
 * Context config and query for views
 *
 * @param {object} options
 * @param {Function} options.useConfig
 * @param {Function} options.useQuery
 * @param {Function} options.useViewContext
 * @returns {{viewId, query: object, config: {toolbar: *}}}
 */
const useView = ({
  useConfig: useAliasConfig = useConfig,
  useQuery: useAliasQuery = useQuery,
  useViewContext: useAliasViewContext = useViewContext
} = {}) => {
  const { initialQuery, viewId } = useAliasViewContext();
  const config = useAliasConfig();
  const query = useAliasQuery();
  const checkFilters = Object.entries(query).filter(([key, value]) => initialQuery && !(key in initialQuery) && value);

  return {
    viewId,
    query,
    isFilteringActive: checkFilters.length > 0,
    config
  };
};

/**
 * On refresh view.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useViewContext
 * @returns {Function}
 */
const useOnRefresh = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useViewContext: useAliasViewContext = useViewContext
} = {}) => {
  const { viewId } = useAliasViewContext();
  const dispatch = useAliasDispatch();

  return () => {
    dispatch({
      type: reduxTypes.view.UPDATE_VIEW,
      viewId
    });
  };
};

const context = {
  ViewContext,
  DEFAULT_CONTEXT,
  useQuery,
  useConfig,
  useOnRefresh,
  useView,
  useViewContext
};

export {
  context as default,
  context,
  ViewContext,
  DEFAULT_CONTEXT,
  useQuery,
  useConfig,
  useOnRefresh,
  useView,
  useViewContext
};
