import { statusTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  apiVersion: null,
  build: null,
  error: false,
  errorMessage: '',
  fulfilled: false,
  pending: false,
  serverVersion: null
};

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.REJECTED_ACTION(statusTypes.STATUS_INFO):
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

    case reduxHelpers.PENDING_ACTION(statusTypes.STATUS_INFO):
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

    case reduxHelpers.FULFILLED_ACTION(statusTypes.STATUS_INFO):
      return reduxHelpers.setStateProp(
        null,
        {
          apiVersion: action.payload.data[apiTypes.API_RESPONSE_STATUS_API_VERSION],
          build: action.payload.data[apiTypes.API_RESPONSE_STATUS_BUILD],
          serverVersion: action.payload.data[apiTypes.API_RESPONSE_STATUS_SERVER_VERSION],
          fulfilled: true
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

statusReducer.initialState = initialState;

export { statusReducer as default, initialState, statusReducer };
