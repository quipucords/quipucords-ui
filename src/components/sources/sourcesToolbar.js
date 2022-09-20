import React from 'react';
import { translate } from '../i18n/i18n';
import { ViewToolbarTextInput } from '../viewToolbar/viewToolbarTextInput';
import { ViewToolbarSelect } from '../viewToolbar/viewToolbarSelect';
import { API_QUERY_SORT_TYPES, API_QUERY_TYPES } from '../../constants/apiConstants';

/**
 * Available filtering
 *
 * @type {{component: React.ReactNode, selected: boolean, title: Function|string, selected: boolean}[]}
 */
const SourcesFilterFields = [
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.SEARCH_NAME] }),
    value: API_QUERY_TYPES.SEARCH_NAME,
    component: function SearchName(props) {
      return <ViewToolbarTextInput filter={API_QUERY_TYPES.SEARCH_NAME} {...props} />;
    },
    selected: true
  },
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME] }),
    value: API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME,
    component: function SearchCredentialsName(props) {
      return <ViewToolbarTextInput filter={API_QUERY_TYPES.SEARCH_CREDENTIALS_NAME} {...props} />;
    }
  },
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.SOURCE_TYPE] }),
    value: API_QUERY_TYPES.SOURCE_TYPE,
    component: function SourceType(props) {
      return <ViewToolbarSelect filter={API_QUERY_TYPES.SOURCE_TYPE} {...props} />;
    }
  }
];

/**
 * Available sorting
 *
 * @type {{isNumeric: boolean, title: string|Function, value: string, selected: boolean}[]}
 */
const SourcesSortFields = [
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.NAME] }),
    value: API_QUERY_SORT_TYPES.NAME,
    selected: true
  },
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.SOURCE_TYPE] }),
    value: API_QUERY_SORT_TYPES.SOURCE_TYPE
  },
  {
    title: () =>
      translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.MOST_RECENT_CONNECT_SCAN_START_TIME] }),
    value: API_QUERY_SORT_TYPES.MOST_RECENT_CONNECT_SCAN_START_TIME,
    isDefaultDescending: true
  }
];

const SourcesToolbar = {
  filterFields: SourcesFilterFields,
  sortFields: SourcesSortFields
};

export { SourcesToolbar as default, SourcesToolbar, SourcesFilterFields, SourcesSortFields };
