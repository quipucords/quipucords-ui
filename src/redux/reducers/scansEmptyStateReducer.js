import helpers from '../../common/helpers';
import { sourcesTypes } from '../constants';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  sourcesExist: false
};

const scansEmptyStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case helpers.REJECTED_ACTION(sourcesTypes.GET_SCANS_SOURCES):
      return helpers.setStateProp(
        null,
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case helpers.PENDING_ACTION(sourcesTypes.GET_SCANS_SOURCES):
      return helpers.setStateProp(
        null,
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case helpers.FULFILLED_ACTION(sourcesTypes.GET_SCANS_SOURCES):
      return helpers.setStateProp(
        null,
        {
          fulfilled: true,
          sourcesExist: (action.payload.data && action.payload.data[apiTypes.API_RESPONSE_SOURCES_COUNT]) > 0
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

scansEmptyStateReducer.initialState = initialState;

export { scansEmptyStateReducer as default, initialState, scansEmptyStateReducer };
