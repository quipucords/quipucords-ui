import * as aboutModalTypes from './aboutModalConstants';
import * as confirmationModalTypes from './confirmationModalConstants';
import { credentialsTypes } from './credentialsConstants';
import * as factsTypes from './factsConstants';
import * as reportsTypes from './reportsConstants';
import { scansTypes } from './scansConstants';
import { sourcesTypes } from './sourcesConstants';
import * as statusTypes from './statusConstants';
import * as toastNotificationTypes from './toasNotificationConstants';
import * as userTypes from './userConstants';
import * as viewTypes from './viewConstants';
import { viewPaginationTypes } from './viewPaginationConstants';
import * as viewToolbarTypes from './viewToolbarConstants';

const reduxTypes = {
  aboutModal: aboutModalTypes,
  confirmationModal: confirmationModalTypes,
  credentials: credentialsTypes,
  facts: factsTypes,
  reports: reportsTypes,
  scans: scansTypes,
  sources: sourcesTypes,
  status: statusTypes,
  toastNotifications: toastNotificationTypes,
  user: userTypes,
  view: viewTypes,
  viewPagination: viewPaginationTypes,
  viewToolbar: viewToolbarTypes
};

export {
  reduxTypes as default,
  reduxTypes,
  aboutModalTypes,
  confirmationModalTypes,
  credentialsTypes,
  factsTypes,
  reportsTypes,
  scansTypes,
  sourcesTypes,
  statusTypes,
  toastNotificationTypes,
  userTypes,
  viewTypes,
  viewPaginationTypes,
  viewToolbarTypes
};
