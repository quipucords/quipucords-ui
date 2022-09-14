import { aboutModalTypes } from './aboutModalConstants';
import { confirmationModalTypes } from './confirmationModalConstants';
import { credentialsTypes } from './credentialsConstants';
import { factsTypes } from './factsConstants';
import { reportsTypes } from './reportsConstants';
import { scansTypes } from './scansConstants';
import { sourcesTypes } from './sourcesConstants';
import { statusTypes } from './statusConstants';
import { toastNotificationTypes } from './toasNotificationConstants';
import { userTypes } from './userConstants';
import { viewTypes } from './viewConstants';
import { viewPaginationTypes } from './viewPaginationConstants';
import { viewToolbarTypes } from './viewToolbarConstants';

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
