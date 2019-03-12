import { userTypes } from '../constants';
import helpers from '../../common/helpers';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    username: null
  }
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case helpers.REJECTED_ACTION(userTypes.USER_AUTH):
      return helpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case helpers.PENDING_ACTION(userTypes.USER_AUTH):
      return helpers.setStateProp(
        'session',
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case helpers.FULFILLED_ACTION(userTypes.USER_AUTH):
      return helpers.setStateProp(
        'session',
        {
          authorized: true,
          fulfilled: true,
          username: action.payload.data[apiTypes.API_RESPONSE_USER_USERNAME]
        },
        {
          state,
          initialState
        }
      );

    case helpers.REJECTED_ACTION(userTypes.USER_LOGOUT):
      return helpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case helpers.PENDING_ACTION(userTypes.USER_LOGOUT):
      return helpers.setStateProp(
        'session',
        {
          pending: true
        },
        {
          state,
          reset: false
        }
      );

    case helpers.FULFILLED_ACTION(userTypes.USER_LOGOUT):
      return helpers.setStateProp(
        'session',
        {
          authorized: false
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

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
