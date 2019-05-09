import credentialsSelectors from './credentialsSelectors';
import scansSelectors from './scansSelectors';
import sourcesSelectors from './sourcesSelectors';

const reduxSelectors = {
  credentials: credentialsSelectors,
  scans: scansSelectors,
  sources: sourcesSelectors
};

export { reduxSelectors as default, reduxSelectors, credentialsSelectors, scansSelectors, sourcesSelectors };
