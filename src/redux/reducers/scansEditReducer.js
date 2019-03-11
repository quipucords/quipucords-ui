import helpers from '../../common/helpers';
import { scansTypes } from '../constants';

const initialState = {
  add: false,
  error: false,
  errorMessage: '',
  fulfilled: false,
  pending: false,
  show: false,
  sources: [],
  start: false
};

const scansEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case scansTypes.EDIT_SCAN_SHOW:
      return helpers.setStateProp(
        null,
        {
          show: true,
          sources: action.sources
        },
        {
          state,
          initialState
        }
      );

    case scansTypes.EDIT_SCAN_HIDE:
      return helpers.setStateProp(
        null,
        {
          show: false
        },
        {
          state,
          initialState
        }
      );

    case helpers.REJECTED_ACTION(scansTypes.ADD_SCAN):
      return helpers.setStateProp(
        null,
        {
          pending: false,
          add: true,
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          reset: false
        }
      );

    case helpers.PENDING_ACTION(scansTypes.ADD_SCAN):
      return helpers.setStateProp(
        null,
        {
          add: true,
          pending: true
        },
        {
          state,
          reset: false
        }
      );

    case helpers.FULFILLED_ACTION(scansTypes.ADD_SCAN):
      return helpers.setStateProp(
        null,
        {
          add: true,
          pending: false,
          fulfilled: true
        },
        {
          state,
          reset: false
        }
      );

    case helpers.REJECTED_ACTION(scansTypes.ADD_START_SCAN):
      return helpers.setStateProp(
        null,
        {
          pending: false,
          start: true,
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          reset: false
        }
      );

    case helpers.PENDING_ACTION(scansTypes.ADD_START_SCAN):
      return helpers.setStateProp(
        null,
        {
          start: true,
          pending: true
        },
        {
          state,
          reset: false
        }
      );

    case helpers.FULFILLED_ACTION(scansTypes.ADD_START_SCAN):
      return helpers.setStateProp(
        null,
        {
          start: true,
          pending: false,
          fulfilled: true
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

scansEditReducer.initialState = initialState;

export { scansEditReducer as default, initialState, scansEditReducer };
