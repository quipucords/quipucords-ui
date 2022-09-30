import React from 'react';
import { translate } from '../i18n/i18n';
import { ViewToolbarTextInput } from '../viewToolbar/viewToolbarTextInput';
import { API_QUERY_SORT_TYPES, API_QUERY_TYPES } from '../../constants/apiConstants';

/**
 * Available filtering
 *
 * @type {{component: React.ReactNode, selected: boolean, title: Function|string, selected: boolean}[]}
 */
const ScansFilterFields = [
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.SEARCH_NAME] }),
    value: API_QUERY_TYPES.SEARCH_NAME,
    component: function SearchName(props) {
      return <ViewToolbarTextInput filter={API_QUERY_TYPES.SEARCH_NAME} {...props} />;
    },
    selected: true
  },
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_TYPES.SEARCH_SOURCES_NAME] }),
    value: API_QUERY_TYPES.SEARCH_SOURCES_NAME,
    component: function SearchSourcesName(props) {
      return <ViewToolbarTextInput filter={API_QUERY_TYPES.SEARCH_SOURCES_NAME} {...props} />;
    }
  }
];

/**
 * Available sorting
 *
 * @type {{isNumeric: boolean, title: string|Function, value: string, selected: boolean}[]}
 */
const ScansSortFields = [
  {
    title: () => translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.NAME] }),
    value: API_QUERY_SORT_TYPES.NAME,
    selected: true
  },
  {
    title: () =>
      translate('toolbar.label', { context: ['option', API_QUERY_SORT_TYPES.MOST_RECENT_CONNECT_SCAN_START_TIME] }),
    value: API_QUERY_SORT_TYPES.MOST_RECENT_CONNECT_SCAN_START_TIME,
    isDefaultDescending: true
  }
];

const ScansToolbar = {
  filterFields: ScansFilterFields,
  sortFields: ScansSortFields
};

export { ScansToolbar as default, ScansToolbar, ScansFilterFields, ScansSortFields };
