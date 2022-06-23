import { credentialsActions } from './credentialsActions';
import { factsActions } from './factsActions';
import { reportsActions } from './reportsActions';
import { scansActions } from './scansActions';
import { sourcesActions } from './sourcesActions';
import { statusActions } from './statusActions';
import { userActions } from './userActions';

const reduxActions = {
  credentials: credentialsActions,
  facts: factsActions,
  reports: reportsActions,
  scans: scansActions,
  sources: sourcesActions,
  status: statusActions,
  user: userActions
};

export {
  reduxActions as default,
  reduxActions,
  credentialsActions,
  factsActions,
  reportsActions,
  scansActions,
  sourcesActions,
  statusActions,
  userActions
};
