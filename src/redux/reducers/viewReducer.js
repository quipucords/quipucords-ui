import { reduxHelpers } from '../common';
import { reduxTypes } from '../constants';
import { API_QUERY_TYPES } from '../../constants/apiConstants';
import { helpers } from '../../common';

/**
 * Initial state.
 */
const initialState = {
  filters: {},
  query: {},
  update: {}
};

/**
 * Apply user observer/reducer logic for views to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.view.SET_FILTER:
      return reduxHelpers.setStateProp(
        'filters',
        {
          [action.viewId]: {
            ...state.filters[action.viewId],
            currentFilterCategory: action.currentFilterCategory
          }
        },
        {
          state,
          reset: false
        }
      );

    case reduxTypes.view.UPDATE_VIEW:
      return reduxHelpers.setStateProp(
        'update',
        {
          [action.viewId]: helpers.getCurrentDate().getTime()
        },
        {
          state,
          reset: false
        }
      );

    case reduxTypes.view.SET_QUERY:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );

    case reduxTypes.view.RESET_PAGE:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [API_QUERY_TYPES.PAGE]: 1
          }
        },
        {
          state,
          reset: false
        }
      );

    default:
      return state;
  }
};

viewReducer.initialState = initialState;

export { viewReducer as default, initialState, viewReducer };
