import helpers from '../../common/helpers';
import { sourcesTypes } from '../constants';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  view: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    lastRefresh: 0,
    sources: [],
    updateSources: false
  }
};

const sourcesReducer = (state = initialState, action) => {
  switch (action.type) {
    case sourcesTypes.UPDATE_SOURCES:
      return helpers.setStateProp(
        'view',
        {
          updateSources: true
        },
        {
          state,
          reset: false
        }
      );

    case helpers.REJECTED_ACTION(sourcesTypes.GET_SOURCES):
      return helpers.setStateProp(
        'view',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case helpers.PENDING_ACTION(sourcesTypes.GET_SOURCES):
      return helpers.setStateProp(
        'view',
        {
          pending: true,
          sources: state.view.sources
        },
        {
          state,
          initialState
        }
      );

    case helpers.FULFILLED_ACTION(sourcesTypes.GET_SOURCES):
      return helpers.setStateProp(
        'view',
        {
          fulfilled: true,
          lastRefresh: (action.payload.headers && new Date(action.payload.headers.date).getTime()) || 0,
          sources: (action.payload.data && action.payload.data[apiTypes.API_RESPONSE_SOURCES_RESULTS]) || []
        },
        {
          state,
          initialState
        }
      );

    default:
      return state;
  }
};

sourcesReducer.initialState = initialState;

export { sourcesReducer as default, initialState, sourcesReducer };
