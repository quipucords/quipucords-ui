/**
 * Manages application routes with lazy loading for efficient performance. Includes navigation to 'Sources', 'Scans',
 * 'Credentials', a default redirect, and authentication check redirecting unauthenticated users to the login page.
 *
 * @module routes
 */
import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './views/notFound/notFound';

const Overview = React.lazy(() => import('./views/overview/viewOverview'));
const Sources = React.lazy(() => import('./views/sources/viewSourcesList'));
const Scans = React.lazy(() => import('./views/scans/viewScansList'));
const Credentials = React.lazy(() => import('./views/credentials/viewCredentialsList'));
const Reports = React.lazy(() => import('./views/reports/viewReportsList'));

interface IAppRoute {
  id: string;
  label?: string; // Excluding the label will exclude the route from the nav sidebar in appLayout
  component: React.ReactNode;
  path: string;
  title: string;
  routes?: undefined;
}

const routes: IAppRoute[] = [
  {
    id: 'overview',
    component: <Overview />,
    label: 'routes.overview.label',
    path: '/overview',
    title: 'routes.overview.title'
  },
  {
    id: 'credentials',
    component: <Credentials />,
    label: 'routes.credentials.label',
    path: '/credentials',
    title: 'routes.credentials.title'
  },
  {
    id: 'sources',
    component: <Sources />,
    label: 'routes.sources.label',
    path: '/sources',
    title: 'routes.sources.title'
  },
  {
    id: 'scans',
    component: <Scans />,
    label: 'routes.scans.label',
    path: '/scans',
    title: 'routes.scans.title'
  },
  {
    id: 'reports',
    component: <Reports />,
    label: 'routes.reports.label',
    path: '/reports',
    title: 'routes.reports.title'
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
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </React.Suspense>
);

export { AppRoutes as default, AppRoutes, routes, type IAppRoute };
