import { sourcesTypes } from '../constants';
import { helpers } from '../../common';
import { reduxHelpers } from '../common';
import { apiTypes } from '../../constants/apiConstants';

const initialState = {
  add: false,
  edit: false,
  editSource: null,
  error: false,
  errorMessage: null,
  errorStatus: null,
  fulfilled: false,
  pending: false,
  show: false,
  source: {},
  stepOneValid: true,
  stepTwoValid: false,
  stepTwoErrorMessages: {}
};

const addSourceWizardReducer = (state = initialState, action) => {
  switch (action.type) {
    case sourcesTypes.CREATE_SOURCE_SHOW:
      return reduxHelpers.setStateProp(
        null,
        {
          add: true,
          show: true
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.EDIT_SOURCE_SHOW:
      return reduxHelpers.setStateProp(
        null,
        {
          edit: true,
          editSource: action.source,
          show: true
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.UPDATE_SOURCE_HIDE:
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

    case sourcesTypes.VALID_SOURCE_WIZARD_STEPONE:
      return reduxHelpers.setStateProp(
        null,
        {
          add: state.add,
          edit: state.edit,
          editSource: state.editSource,
          show: true,
          source: action.source,
          stepOneValid: true
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.VALID_SOURCE_WIZARD_STEPTWO:
      return reduxHelpers.setStateProp(
        null,
        {
          add: state.add,
          edit: state.edit,
          editSource: state.editSource,
          show: true,
          source: { ...state.source, ...action.source },
          stepTwoValid: true
        },
        {
          state,
          initialState
        }
      );

    case sourcesTypes.INVALID_SOURCE_WIZARD_STEPTWO:
      return reduxHelpers.setStateProp(
        null,
        {
          stepTwoValid: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.REJECTED_ACTION(sourcesTypes.UPDATE_SOURCE):
    case reduxHelpers.REJECTED_ACTION(sourcesTypes.ADD_SOURCE):
      const filterProperties = [
        apiTypes.API_SUBMIT_SOURCE_CREDENTIALS,
        apiTypes.API_SUBMIT_SOURCE_HOSTS,
        apiTypes.API_SUBMIT_SOURCE_NAME,
        apiTypes.API_SUBMIT_SOURCE_PORT,
        apiTypes.API_SUBMIT_SOURCE_OPTIONS
      ];

      const stepTwoRejectedErrors = helpers.getMessageFromResults(action.payload, filterProperties);

      const messages = {};

      Object.keys(stepTwoRejectedErrors.messages || {}).forEach(key => {
        if (apiTypes.API_SUBMIT_SOURCE_CREDENTIALS === key) {
          messages.credentials = stepTwoRejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SOURCE_HOSTS === key) {
          messages.hosts = stepTwoRejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SOURCE_NAME === key) {
          messages.name = stepTwoRejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SOURCE_PORT === key) {
          messages.port = stepTwoRejectedErrors.messages[key];
        }

        if (apiTypes.API_SUBMIT_SOURCE_OPTIONS === key) {
          messages.options = stepTwoRejectedErrors.messages[key];
        }
      });

      return reduxHelpers.setStateProp(
        null,
        {
          error: action.error,
          errorMessage: stepTwoRejectedErrors.message,
          errorStatus: stepTwoRejectedErrors.status,
          stepTwoValid: false,
          stepTwoErrorMessages: messages,
          pending: false
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.PENDING_ACTION(sourcesTypes.UPDATE_SOURCE):
    case reduxHelpers.PENDING_ACTION(sourcesTypes.ADD_SOURCE):
      return reduxHelpers.setStateProp(
        null,
        {
          error: false,
          errorMessage: null,
          pending: true
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.FULFILLED_ACTION(sourcesTypes.UPDATE_SOURCE):
    case reduxHelpers.FULFILLED_ACTION(sourcesTypes.ADD_SOURCE):
      return reduxHelpers.setStateProp(
        null,
        {
          add: state.add,
          edit: state.edit,
          error: false,
          errorMessage: null,
          pending: false,
          fulfilled: true,
          source: action.payload.data
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

addSourceWizardReducer.initialState = initialState;

export { addSourceWizardReducer as default, initialState, addSourceWizardReducer };
