import { scansTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  view: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    lastRefresh: 0,
    scans: [],
    updateScans: false
  },

  mergeDialog: {
    show: false,
    scans: [],
    details: false
  }
};

const scansReducer = (state = initialState, action) => {
  switch (action.type) {
    case scansTypes.UPDATE_SCANS:
      return reduxHelpers.setStateProp(
        'view',
        {
          updateScans: true
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.REJECTED_ACTION(scansTypes.GET_SCANS):
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

    case reduxHelpers.PENDING_ACTION(scansTypes.GET_SCANS):
      return reduxHelpers.setStateProp(
        'view',
        {
          pending: true,
          scans: state.view.scans
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(scansTypes.GET_SCANS):
      return reduxHelpers.setStateProp(
        'view',
        {
          fulfilled: true,
          lastRefresh: (action.payload.headers && new Date(action.payload.headers.date).getTime()) || 0,
          scans: (action.payload.data && action.payload.data[apiTypes.API_RESPONSE_SCANS_RESULTS]) || []
        },
        {
          state,
          initialState
        }
      );

    case scansTypes.MERGE_SCAN_DIALOG_SHOW:
      return reduxHelpers.setStateProp(
        'mergeDialog',
        {
          show: true,
          scans: action.scans,
          details: action.details
        },
        {
          state,
          initialState
        }
      );

    case scansTypes.MERGE_SCAN_DIALOG_HIDE:
      return reduxHelpers.setStateProp(
        'mergeDialog',
        {
          show: false
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

scansReducer.initialState = initialState;

export { scansReducer as default, initialState, scansReducer };
