import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { baseName, routes } from './routerConstants';
import { RouterContext } from './routerContext';

/**
 * Routing wrapper
 *
 * @param {object} props
 * @param {string} props.baseName
 * @param {Array} props.routes
 * @param {Function} props.useLocation
 * @param {Function} props.useNavigate
 * @param {Function} props.useParams
 * @returns {React.ReactNode}
 */
const Router = ({
  baseName: routesBaseName,
  routes: routesList,
  useLocation: useAliasLocation,
  useNavigate: useAliasNavigate,
  useParams: useAliasParams
}) => (
  <RouterContext.Provider
    value={{ useLocation: useAliasLocation, useNavigate: useAliasNavigate, useParams: useAliasParams }}
  >
    <Routes basename={routesBaseName}>
      {routesList.map(({ path, element }) => (
        <Route key={path} element={element} path={path} />
      ))}
      {routesList.length && (
        <Route
          key="redirect"
          path="*"
          element={
            <Navigate
              replace
              to={routesList.find(({ redirect }) => redirect === true)?.path || routesList?.[0]?.path}
            />
          }
        />
      )}
    </Routes>
  </RouterContext.Provider>
);

/**
 * Prop types
 *
 * @type {{routes: Array, useLocation: Function, useNavigate: Function, baseName: string, useParams: Function}}
 */
Router.propTypes = {
  baseName: PropTypes.string,
  routes: PropTypes.array,
  useLocation: PropTypes.func,
  useNavigate: PropTypes.func,
  useParams: PropTypes.func
};

/**
 * Default props
 *
 * @type {{routes: Array, useLocation: Function, useNavigate: Function, baseName: string, useParams: Function}}
 */
Router.defaultProps = {
  baseName,
  routes,
  useLocation,
  useNavigate,
  useParams
};

export { Router as default, Router, baseName, routes };
