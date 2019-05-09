import { scansTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';
import apiTypes from '../../constants/apiConstants';

const initialState = {
  add: false,
  error: false,
  errorMessage: '',
  fulfilled: false,
  pending: false,
  show: false,
  sources: [],
  start: false,
  submitErrorMessages: {}
};

const scansEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case scansTypes.EDIT_SCAN_SHOW:
      return reduxHelpers.setStateProp(
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
      return reduxHelpers.setStateProp(
        null,
        {
          show: false
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.REJECTED_ACTION(scansTypes.ADD_SCAN):
      const filterProperties = [
        apiTypes.API_SUBMIT_SCAN_NAME,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_DIRS,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_MAX_CONCURRENCY,
        apiTypes.API_SUBMIT_SCAN_SOURCES
      ];

      const rejectedErrors = helpers.getMessageFromResults(action.payload, filterProperties);
      const messages = {};

      Object.keys(rejectedErrors.messages || {}).forEach(key => {
        if (apiTypes.API_SUBMIT_SCAN_NAME === key) {
          messages.scanName = rejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_DIRS === key) {
          messages.scanDirectories = rejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SCAN_OPTIONS_MAX_CONCURRENCY === key) {
          messages.scanConcurrency = rejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SCAN_SOURCES === key) {
          messages.scanSources = rejectedErrors.messages[key];
        }
      });

      return reduxHelpers.setStateProp(
        null,
        {
          pending: false,
          add: true,
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          submitErrorMessages: messages
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.PENDING_ACTION(scansTypes.ADD_SCAN):
      return reduxHelpers.setStateProp(
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

    case reduxHelpers.FULFILLED_ACTION(scansTypes.ADD_SCAN):
      return reduxHelpers.setStateProp(
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

    case reduxHelpers.REJECTED_ACTION(scansTypes.ADD_START_SCAN):
      return reduxHelpers.setStateProp(
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

    case reduxHelpers.PENDING_ACTION(scansTypes.ADD_START_SCAN):
      return reduxHelpers.setStateProp(
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

    case reduxHelpers.FULFILLED_ACTION(scansTypes.ADD_START_SCAN):
      return reduxHelpers.setStateProp(
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
