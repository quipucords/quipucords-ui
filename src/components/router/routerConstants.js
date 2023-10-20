import React from 'react';
import { ViewContext } from '../view/viewContext';
import { Scans, CONFIG as ScansConfig } from '../scans/scans';
import { Sources, CONFIG as SourcesConfig } from '../sources/sources';
import { Credentials, CONFIG as CredentialsConfig } from '../credentials/credentials';
import { ContextIcon, ContextIconVariant, IconSize } from '../contextIcon/contextIcon';

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
    icon: function Icon() {
      return <ContextIcon size={IconSize.sm} symbol={ContextIconVariant.sources} />;
    },
    title: 'sources',
    path: '/sources',
    redirect: true,
    element: (
      <ViewContext.Provider value={{ ...SourcesConfig }}>
        <Sources />
      </ViewContext.Provider>
    )
  },
  {
    icon: function Icon() {
      return <ContextIcon size={IconSize.sm} symbol={ContextIconVariant.scans} />;
    },
    title: 'scans',
    path: '/scans',
    element: (
      <ViewContext.Provider value={{ ...ScansConfig }}>
        <Scans />
      </ViewContext.Provider>
    )
  },
  {
    icon: function Icon() {
      return <ContextIcon color={undefined} size={IconSize.sm} symbol={ContextIconVariant.idCard} />;
    },
    title: 'credentials',
    path: '/credentials',
    element: (
      <ViewContext.Provider value={{ ...CredentialsConfig }}>
        <Credentials />
      </ViewContext.Provider>
    )
  }
];

export { routes as default, baseName, routes };
