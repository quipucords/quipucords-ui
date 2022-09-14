import { userTypes } from '../constants';
import { helpers } from '../../common';
import { reduxHelpers } from '../common';
import { apiTypes } from '../../constants/apiConstants';

const initialState = {
  session: {
    authorized: false,
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    locale: null,
    username: null
  }
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.REJECTED_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          locale: state.session.locale
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          locale: state.session.locale,
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          authorized: true,
          fulfilled: true,
          locale: state.session.locale,
          username: action.payload.data[apiTypes.API_RESPONSE_USER_USERNAME]
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.REJECTED_ACTION(userTypes.USER_LOGOUT):
      return reduxHelpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          locale: state.session.locale
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(userTypes.USER_LOGOUT):
      return reduxHelpers.setStateProp(
        'session',
        {
          pending: true,
          locale: state.session.locale
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_LOGOUT):
      return reduxHelpers.setStateProp(
        'session',
        {
          authorized: false,
          locale: state.session.locale
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_LOCALE):
      return reduxHelpers.setStateProp(
        'session',
        {
          locale: action.payload.data
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

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
