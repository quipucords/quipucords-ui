import { factsTypes } from '../constants';
import { helpers } from '../../common/helpers';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  update: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: false,
    facts: {}
  }
};

const factsReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.REJECTED_ACTION(factsTypes.ADD_FACTS):
      return reduxHelpers.setStateProp(
        'update',
        {
          error: action.error,
          errorMessage: helpers.getMessageFromResults(action.payload).message
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(factsTypes.ADD_FACTS):
      return reduxHelpers.setStateProp(
        'update',
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(factsTypes.ADD_FACTS):
      return reduxHelpers.setStateProp(
        'update',
        {
          facts: action.payload.data,
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

factsReducer.initialState = initialState;

export { factsReducer as default, initialState, factsReducer };
