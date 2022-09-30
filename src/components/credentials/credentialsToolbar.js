import React from 'react';
import { translate } from '../i18n/i18n';
import { ViewToolbarSelect } from '../viewToolbar/viewToolbarSelect';
import { ViewToolbarTextInput } from '../viewToolbar/viewToolbarTextInput';
import { API_QUERY_SORT_TYPES, API_QUERY_TYPES } from '../../constants/apiConstants';

/**
 * Available filtering
 *
 * @type {{component: React.ReactNode, selected: boolean, title: Function|string, selected: boolean}[]}
 */
const CredentialsFilterFields = [
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.SEARCH_NAME] }),
    value: API_QUERY_TYPES.SEARCH_NAME,
    component: function SearchName(props) {
      return <ViewToolbarTextInput filter={API_QUERY_TYPES.SEARCH_NAME} {...props} />;
    },
    selected: true
  },
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.CREDENTIAL_TYPE] }),
    value: API_QUERY_TYPES.CREDENTIAL_TYPE,
    component: function CredentialType(props) {
      return <ViewToolbarSelect filter={API_QUERY_TYPES.CREDENTIAL_TYPE} {...props} />;
    }
  }
];

/**
 * Available sorting
 *
 * @type {{isNumeric: boolean, title: string|Function, value: string, selected: boolean}[]}
 */
const CredentialsSortFields = [
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.NAME] }),
    value: API_QUERY_SORT_TYPES.NAME,
    selected: true
  },
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.CREDENTIAL_TYPE] }),
    value: API_QUERY_SORT_TYPES.CREDENTIAL_TYPE
  }
];

const CredentialsToolbar = {
  filterFields: CredentialsFilterFields,
  sortFields: CredentialsSortFields
};

export { CredentialsToolbar as default, CredentialsToolbar, CredentialsFilterFields, CredentialsSortFields };
