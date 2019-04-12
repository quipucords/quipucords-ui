import React from 'react';
import { connectRouter } from '../redux';
import Authentication from './authentication/authentication';
import { ConnectedPageLayout } from './pageLayout/pageLayout';
import { Router } from './router/router';
import ToastNotificationsList from './toastNotificationsList/toastNotificationsList';
import ConfirmationModal from './confirmationModal/confirmationModal';
import AboutModal from './aboutModal/aboutModal';
import AddSourceWizard from './addSourceWizard/addSourceWizard';
import CreateCredentialDialog from './createCredentialDialog/createCredentialDialog';
import CreateScanDialog from './createScanDialog/createScanDialog';

const App = () => (
  <Authentication>
    <ConnectedPageLayout>
      <Router />
      <ToastNotificationsList />
      <ConfirmationModal />
      <AboutModal />
      <AddSourceWizard />
      <CreateCredentialDialog />
      <CreateScanDialog />
    </ConnectedPageLayout>
  </Authentication>
);

App.propTypes = {};

App.defaultProps = {};

const ConnectedApp = connectRouter()(App);

export { ConnectedApp as default, ConnectedApp, App };
