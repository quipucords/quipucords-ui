/**
 * Manages application routes with lazy loading for efficient performance. Includes navigation to 'Sources', 'Scans',
 * 'Credentials', a default redirect, and authentication check redirecting unauthenticated users to the login page.
 *
 * @module routes
 */
import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './views/notFound/notFound';

const Sources = React.lazy(() => import('./views/sources/viewSourcesList'));
const Scans = React.lazy(() => import('./views/scans/viewScansList'));
const Credentials = React.lazy(() => import('./views/credentials/viewCredentialsList'));

interface IAppRoute {
  id: string;
  label?: string; // Excluding the label will exclude the route from the nav sidebar in appLayout
  Component: React.ElementType;
  path: string;
  title: string;
  routes?: undefined;
}

const routes: IAppRoute[] = [
  {
    id: 'credentials',
    Component: Credentials,
    label: 'Credentials',
    path: '/credentials',
    title: 'Credentials'
  }
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[]
);

const AppRoutes = () => (
  <React.Suspense fallback={<p> Loading...</p>}>
    <Routes>
      {flattenedRoutes.map(({ id, path, Component }) => (
        <Route path={path} element={<Component />} key={id} />
      ))}
      <Route path="/" element={<Navigate to="/credentials" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </React.Suspense>
);

export { AppRoutes as default, AppRoutes, routes, type IAppRoute };
