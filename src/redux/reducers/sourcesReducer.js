import { sourcesTypes } from '../constants';
import { helpers } from '../../common';
import { reduxHelpers } from '../common';

const initialState = {
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
    case sourcesTypes.SELECT_SOURCE:
      return reduxHelpers.setStateProp(
        'selected',
        {
          [action.item?.id]: action.item
        },
        {
          state,
          reset: false
        }
      );
    case sourcesTypes.DESELECT_SOURCE:
      const itemsToDeselect = {};
      const deselectItems = (Array.isArray(action.item) && action.item) || [action?.item || {}];
      deselectItems.forEach(({ id }) => {
        itemsToDeselect[id] = null;
      });

      return reduxHelpers.setStateProp(
        'selected',
        {
          ...itemsToDeselect
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
          [action.item?.id]: action.cellIndex
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
          [action.item?.id]: null
        },
        {
          state,
          reset: false
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'deleted', type: [sourcesTypes.DELETE_SOURCE] },
          { ref: 'view', type: sourcesTypes.GET_SOURCES }
        ],
        state,
        action
      );
  }
};

sourcesReducer.initialState = initialState;

export { sourcesReducer as default, initialState, sourcesReducer };
