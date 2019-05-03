import { sourcesTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';
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
    case reduxHelpers.REJECTED_ACTION(sourcesTypes.GET_SCANS_SOURCES):
      return reduxHelpers.setStateProp(
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

    case reduxHelpers.PENDING_ACTION(sourcesTypes.GET_SCANS_SOURCES):
      return reduxHelpers.setStateProp(
        null,
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(sourcesTypes.GET_SCANS_SOURCES):
      return reduxHelpers.setStateProp(
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
