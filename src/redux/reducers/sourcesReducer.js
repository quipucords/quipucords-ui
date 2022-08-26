import { sourcesTypes } from '../constants';
import { helpers } from '../../common';
import { reduxHelpers } from '../common';

const initialState = {
  confirmDelete: {},
  deleted: {},
  selected: {},
  expanded: {},
  update: 0,
  view: {}
};

const sourcesReducer = (state = initialState, action) => {
  switch (action.type) {
    case sourcesTypes.UPDATE_SOURCES:
      return reduxHelpers.setStateProp(
        null,
        {
          update: helpers.getCurrentDate().getTime()
        },
        {
          state,
          reset: false
        }
      );
    case sourcesTypes.CONFIRM_DELETE_SOURCE:
      return reduxHelpers.setStateProp(
        'confirmDelete',
        {
          source: action.source
        },
        {
          state,
          initialState
        }
      );
    case sourcesTypes.RESET_DELETE_SOURCE:
      return reduxHelpers.setStateProp(
        null,
        {
          confirmDelete: {},
          deleted: {}
        },
        {
          state,
          initialState
        }
      );
    case sourcesTypes.SELECT_SOURCE:
      return reduxHelpers.setStateProp(
        'selected',
        {
          [action.source?.id]: action.source
        },
        {
          state,
          reset: false
        }
      );
    case sourcesTypes.DESELECT_SOURCE:
      return reduxHelpers.setStateProp(
        'selected',
        {
          [action.source?.id]: null
        },
        {
          state,
          reset: false
        }
      );
    case sourcesTypes.EXPANDED_SOURCE:
      return reduxHelpers.setStateProp(
        'expanded',
        {
          [action.source?.id]: action.cellIndex
        },
        {
          state,
          reset: false
        }
      );
    case sourcesTypes.NOT_EXPANDED_SOURCE:
      return reduxHelpers.setStateProp(
        'expanded',
        {
          [action.source?.id]: null
        },
        {
          state,
          reset: false
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'deleted', type: [sourcesTypes.DELETE_SOURCE, sourcesTypes.DELETE_SOURCES] },
          { ref: 'view', type: sourcesTypes.GET_SOURCES }
        ],
        state,
        action
      );
  }
};

sourcesReducer.initialState = initialState;

export { sourcesReducer as default, initialState, sourcesReducer };
