/**
 * Manages application routes with lazy loading for efficient performance. Includes navigation to 'Sources', 'Scans',
 * 'Credentials', a default redirect, and authentication check redirecting unauthenticated users to the login page.
 * @module routes
 */
import * as React from 'react';
import { Route, Routes } from 'react-router';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Login } from '../pages/login/login';
import NotFound from '../pages/notFound/notFound';

const Sources = React.lazy(() => import('../pages/sources/sourcesListView'));
const Scans = React.lazy(() => import('../pages/scans/scansListView'));
const Credentials = React.lazy(() => import('../pages/credentials/credentialsListView'));

export interface IAppRoute {
  id: string;
  label?: string; // Excluding the label will exclude the route from the nav sidebar in appLayout
  component: React.ReactNode;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  id: string;
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

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

const AppRoutes = (): React.ReactElement => {
  const nav = useNavigate();
  const location = useLocation();

  axios.get(`${process.env.REACT_APP_USER_SERVICE_CURRENT}`).catch(() => {
    if (location.pathname !== '/login') {
      nav('/login');
    }
  });
  return (
    <React.Suspense fallback={<p> Loading...</p>}>
      <Routes>
        {flattenedRoutes.map(route => (
          <Route path={route.path} element={route.component} key={route.id} />
        ))}
        <Route path="/" element={<Navigate to="/sources" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export { AppRoutes, routes };
