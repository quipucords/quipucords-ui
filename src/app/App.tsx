import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter } from 'react-router-dom';
import I18n from '../components/i18n/I18n';
import { useLocale } from '../components/sessionContext/SessionProvider';
import AppLayout from './appLayout/AppLayout';
import { AppRoutes } from './routes';

import './app.css';
import axios from 'axios';

const App: React.FC = () => {
  const locale = useLocale();
  if (localStorage.getItem('authToken')) {
    axios.interceptors.request.use( config => {
      config.headers['Authorization'] = `Token ${localStorage.getItem('authToken')}`;
      return config;
    }, error => {
        console.error('Failed to set config', error);
    });
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
