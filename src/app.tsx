/**
 * Root component of the application that sets up global styles, localization, secure API requests, and routing.
 * It includes automatic token authorization for axios requests and wraps the UI with localization and routing contexts.
 *
 * @module app
 */
import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/utilities/_index.css';
import { BrowserRouter } from 'react-router-dom';
import { I18n } from './components/i18n/i18n';
import { Login } from './components/login/login';
import { AppLayout } from './components/viewLayout/viewLayout';
import { AppRoutes } from './routes';
import './app.css';

const App: React.FC = () => (
  <I18n>
    <Login>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </Login>
  </I18n>
);

export { App as default, App };
