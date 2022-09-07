import { createSelector } from 'reselect';
import apiTypes from '../../constants/apiConstants';

/**
 * Map a credential array to a consumable dropdown format
 *
 * @param {object} state
 * @returns {*}
 */
const credentials = state => state.credentials.view?.data?.[apiTypes.API_RESPONSE_CREDENTIALS_RESULTS];

const credentialsDropdownSelector = createSelector([credentials], creds =>
  (creds || []).map(cred => ({
    title: cred[apiTypes.API_RESPONSE_CREDENTIAL_NAME],
    value: cred[apiTypes.API_RESPONSE_CREDENTIAL_ID],
    type: cred[apiTypes.API_RESPONSE_CREDENTIAL_CRED_TYPE]
  }))
);

const makeCredentialsDropdownSelector = () => credentialsDropdownSelector;

const credentialsSelectors = {
  credentialsDropdown: credentialsDropdownSelector,
  makeCredentialsDropdown: makeCredentialsDropdownSelector
};

export {
  credentialsSelectors as default,
  credentialsSelectors,
  credentialsDropdownSelector,
  makeCredentialsDropdownSelector
};
