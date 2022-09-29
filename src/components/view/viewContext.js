import React, { useContext } from 'react';
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
 * Context config and query for views
 *
 * @param {object} options
 * @param {Function} options.useViewContext
 * @returns {{viewId, query: object, config: {toolbar: *}}}
 */
const useView = ({ useViewContext: useAliasViewContext = useViewContext } = {}) => {
  const { viewId } = useAliasViewContext();

  return {
    viewId
  };
};

const context = {
  ViewContext,
  DEFAULT_CONTEXT,
  useView,
  useViewContext
};

export { context as default, context, ViewContext, DEFAULT_CONTEXT, useView, useViewContext };
