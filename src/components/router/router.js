import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Routes, Route } from 'react-router-dom';
import { baseName, routes } from './routerConstants';

const Router = ({ baseName: routesBaseName, routes: routesList }) => (
  <Routes basename={routesBaseName}>
    {routesList.map(({ path, element }) => (
      <Route key={path} element={element} path={path} />
    ))}
    {routesList.length && (
      <Route
        key="redirect"
        path="*"
        element={
          <Navigate replace to={routesList.find(({ redirect }) => redirect === true)?.path || routesList?.[0]?.path} />
        }
      />
    )}
  </Routes>
);

Router.propTypes = {
  baseName: PropTypes.string,
  routes: PropTypes.array
};

Router.defaultProps = {
  baseName,
  routes
};

export { Router as default, Router, baseName, routes };
