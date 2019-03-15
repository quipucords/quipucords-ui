import { combineReducers } from 'redux';

import aboutModalReducer from './aboutModalReducer';
import addSourceWizardReducer from './addSourceWizardReducer';
import confirmationModalReducer from './confirmationModalReducer';
import credentialsReducer from './credentialsReducer';
import factsReducer from './factsReducer';
import reportsReducer from './reportsReducer';
import scansReducer from './scansReducer';
import sourcesReducer from './sourcesReducer';
import statusReducer from './statusReducer';
import toastNotificationsReducer from './toastNotificationsReducer';
import userReducer from './userReducer';
import viewOptionsReducer from './viewOptionsReducer';

const reducers = {
  aboutModal: aboutModalReducer,
  addSourceWizard: addSourceWizardReducer,
  confirmationModal: confirmationModalReducer,
  credentials: credentialsReducer,
  facts: factsReducer,
  reports: reportsReducer,
  scans: scansReducer,
  sources: sourcesReducer,
  status: statusReducer,
  toastNotifications: toastNotificationsReducer,
  user: userReducer,
  viewOptions: viewOptionsReducer
};

const reduxReducers = combineReducers(reducers);

export {
  reduxReducers as default,
  reduxReducers,
  aboutModalReducer,
  addSourceWizardReducer,
  confirmationModalReducer,
  credentialsReducer,
  factsReducer,
  reportsReducer,
  scansReducer,
  sourcesReducer,
  statusReducer,
  toastNotificationsReducer,
  userReducer,
  viewOptionsReducer
};
