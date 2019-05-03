import { credentialsTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  view: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    credentials: []
  },
  update: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    credential: null,
    credentialType: '',
    show: false,
    add: false,
    edit: false,
    delete: false
  }
};

const credentialsReducer = (state = initialState, action) => {
  switch (action.type) {
    case credentialsTypes.CREATE_CREDENTIAL_SHOW:
      return reduxHelpers.setStateProp(
        'update',
        {
          show: true,
          add: true,
          credentialType: action.credentialType
        },
        {
          state,
          initialState
        }
      );

    case credentialsTypes.EDIT_CREDENTIAL_SHOW:
      return reduxHelpers.setStateProp(
        'update',
        {
          show: true,
          edit: true,
          credential: action.credential
        },
        {
          state,
          initialState
        }
      );

    case credentialsTypes.UPDATE_CREDENTIAL_HIDE:
      return reduxHelpers.setStateProp(
        'update',
        {
          show: false
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.REJECTED_ACTION(credentialsTypes.ADD_CREDENTIAL):
      return reduxHelpers.setStateProp(
        'update',
        {
          add: true,
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          pending: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.REJECTED_ACTION(credentialsTypes.DELETE_CREDENTIAL):
    case reduxHelpers.REJECTED_ACTION(credentialsTypes.DELETE_CREDENTIALS):
      return reduxHelpers.setStateProp(
        'update',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          delete: true,
          pending: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.REJECTED_ACTION(credentialsTypes.UPDATE_CREDENTIAL):
      return reduxHelpers.setStateProp(
        'update',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          pending: false,
          edit: true
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.REJECTED_ACTION(credentialsTypes.GET_CREDENTIALS):
      return reduxHelpers.setStateProp(
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

    case reduxHelpers.PENDING_ACTION(credentialsTypes.ADD_CREDENTIAL):
      return reduxHelpers.setStateProp(
        'update',
        {
          pending: true,
          error: false,
          fulfilled: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.PENDING_ACTION(credentialsTypes.DELETE_CREDENTIAL):
    case reduxHelpers.PENDING_ACTION(credentialsTypes.DELETE_CREDENTIALS):
      return reduxHelpers.setStateProp(
        'update',
        {
          pending: true,
          delete: true,
          error: false,
          fulfilled: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.PENDING_ACTION(credentialsTypes.UPDATE_CREDENTIAL):
      return reduxHelpers.setStateProp(
        'update',
        {
          pending: true,
          error: false,
          fulfilled: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.PENDING_ACTION(credentialsTypes.GET_CREDENTIALS):
      return reduxHelpers.setStateProp(
        'view',
        {
          pending: true,
          credentials: state.view.credentials
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(credentialsTypes.ADD_CREDENTIAL):
      return reduxHelpers.setStateProp(
        'update',
        {
          add: true,
          credential: action.payload.data || {},
          fulfilled: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(credentialsTypes.DELETE_CREDENTIAL):
    case reduxHelpers.FULFILLED_ACTION(credentialsTypes.DELETE_CREDENTIALS):
      return reduxHelpers.setStateProp(
        'update',
        {
          delete: true,
          fulfilled: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(credentialsTypes.UPDATE_CREDENTIAL):
      return reduxHelpers.setStateProp(
        'update',
        {
          credential: action.payload.data || {},
          edit: true,
          fulfilled: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(credentialsTypes.GET_CREDENTIALS):
      return reduxHelpers.setStateProp(
        'view',
        {
          credentials: (action.payload.data && action.payload.data[apiTypes.API_RESPONSE_CREDENTIALS_RESULTS]) || [],
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

credentialsReducer.initialState = initialState;

export { credentialsReducer as default, initialState, credentialsReducer };
