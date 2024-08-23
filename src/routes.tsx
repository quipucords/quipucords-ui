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
  component: React.ReactNode;
  path: string;
  title: string;
  routes?: undefined;
}

interface IAppRouteGroup {
  id: string;
  label: string;
  routes: IAppRoute[];
}

type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    id: 'credentials',
    component: <Credentials />,
    label: 'Credentials',
    path: '/credentials',
    title: 'Credentials'
  },
  {
    id: 'sources',
    component: <Sources />,
    label: 'Sources',
    path: '/sources',
    title: 'Sources'
  },
  {
    id: 'scans',
    component: <Scans />,
    label: 'Scans',
    path: '/scans',
    title: 'Scans'
  }
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[]
);

const AppRoutes = () => (
  <React.Suspense fallback={<p> Loading...</p>}>
    <Routes>
      {flattenedRoutes.map(route => (
        <Route path={route.path} element={route.component} key={route.id} />
      ))}
      <Route path="/" element={<Navigate to="/sources" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </React.Suspense>
);

export { AppRoutes as default, AppRoutes, routes, type IAppRoute, type IAppRouteGroup, type AppRouteConfig };
