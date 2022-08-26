import Scans from '../scans/scans';
import { Sources } from '../sources/sources';
import Credentials from '../credentials/credentials';

/**
 * Return the application base directory.
 *
 * @type {string}
 */
const baseName = '/client';

/**
 * Return array of objects that describe navigation
 *
 * @returns {Array}
 */
const routes = [
  {
    iconClass: 'fa fa-crosshairs',
    title: 'Sources',
    to: '/sources',
    redirect: true,
    component: Sources
  },
  {
    iconClass: 'pficon pficon-orders',
    title: 'Scans',
    to: '/scans',
    component: Scans
  },
  {
    iconClass: 'fa fa-id-card',
    title: 'Credentials',
    to: '/credentials',
    component: Credentials
  }
];

export { routes as default, baseName, routes };
