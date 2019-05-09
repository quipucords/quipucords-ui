import { reportsTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  report: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    reports: []
  },

  reports: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false
  },

  merge: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false
  }
};

const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.REJECTED_ACTION(reportsTypes.GET_REPORT):
      return reduxHelpers.setStateProp(
        'report',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.REJECTED_ACTION(reportsTypes.GET_REPORTS):
      return reduxHelpers.setStateProp(
        'reports',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.REJECTED_ACTION(reportsTypes.GET_MERGE_REPORT):
      return reduxHelpers.setStateProp(
        'merge',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(reportsTypes.GET_REPORT):
      return reduxHelpers.setStateProp(
        'report',
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(reportsTypes.GET_REPORTS):
      return reduxHelpers.setStateProp(
        'reports',
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(reportsTypes.GET_MERGE_REPORT):
      return reduxHelpers.setStateProp(
        'merge',
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(reportsTypes.GET_REPORT):
      return reduxHelpers.setStateProp(
        'report',
        {
          fulfilled: true,
          reports: action.payload.data
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(reportsTypes.GET_REPORTS):
      return reduxHelpers.setStateProp(
        'reports',
        {
          fulfilled: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(reportsTypes.GET_MERGE_REPORT):
      return reduxHelpers.setStateProp(
        'merge',
        {
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

reportsReducer.initialState = initialState;

export { reportsReducer as default, initialState, reportsReducer };
