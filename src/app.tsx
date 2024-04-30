/**
 * Root component of the application that sets up global styles, localization, secure API requests, and routing.
 * It includes automatic token authorization for axios requests and wraps the UI with localization and routing contexts.
 * @module app
 */
import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import I18n from './components/i18n/I18n';
import { useLocale } from './components/sessionContext/sessionProvider';
import AppLayout from './components/viewLayout/viewLayout';
import { AppRoutes } from './routes';
import './app.css';

const App: React.FC = () => {
  const locale = useLocale();
  if (localStorage.getItem('authToken')) {
    axios.interceptors.request.use(
      config => {
        config.headers['Authorization'] = `Token ${localStorage.getItem('authToken')}`;
        return config;
      },
      error => {
        console.error('Failed to set config', error);
      }
    );
  }

  return (
    <I18n locale={locale}>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </I18n>
  );
};

export default App;
