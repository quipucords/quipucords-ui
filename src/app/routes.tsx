import * as React from 'react';
import { Route, Routes } from 'react-router';
import NotFound from '../pages/notFound/NotFound';

const Sources = React.lazy(() => import('../pages/sources/SourcesListView'));
const Scans = React.lazy(() => import('../pages/scans/ScansListView'));

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
    id: 'sources',
    component: <Sources />,
    label: 'Sources',
    path: '/',
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

const AppRoutes = (): React.ReactElement => (
  <React.Suspense fallback={<p> Loading...</p>}>
    <Routes>
      {flattenedRoutes.map(route => (
        <Route path={route.path} element={route.component} key={route.id} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </React.Suspense>
);

export { AppRoutes, routes };
