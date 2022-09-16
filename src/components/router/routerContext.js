import React, { useContext } from 'react';
import { helpers } from '../../common';

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const RouterContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated router context.
 *
 * @returns {React.Context<{}>}
 */
const useRouterContext = () => useContext(RouterContext);

/**
 * Route context wrapper for useLocation
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
const useLocation = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useLocation: useAliasLocation = helpers.noop } = useAliasRouterContext();
  return useAliasLocation();
};

/**
 * Route context wrapper for useNavigate
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
const useNavigate = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useNavigate: useAliasNavigate = helpers.noop } = useAliasRouterContext();
  return useAliasNavigate();
};

/**
 * Route context wrapper for useParams
 *
 * @param {object} options
 * @param {Function} options.useRouterContext
 * @returns {*}
 */
const useParams = ({ useRouterContext: useAliasRouterContext = useRouterContext } = {}) => {
  const { useParams: useAliasParams = helpers.noop } = useAliasRouterContext();
  return useAliasParams();
};

const context = {
  RouterContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useLocation,
  useNavigate,
  useParams
};

export {
  context as default,
  context,
  RouterContext,
  DEFAULT_CONTEXT,
  useRouterContext,
  useLocation,
  useNavigate,
  useParams
};
