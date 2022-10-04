import { credentialsTypes } from '../constants';
import { reduxHelpers } from '../common';
import { helpers } from '../../common';

const initialState = {
  deleted: {},
  dialog: {
    show: false,
    add: false,
    edit: false,
    credentialType: undefined,
    credential: undefined
  },
  selected: {},
  expanded: {},
  update: 0,
  view: {}
};

const credentialsReducer = (state = initialState, action) => {
  switch (action.type) {
    case credentialsTypes.RESET_ACTIONS:
      return reduxHelpers.setStateProp(
        null,
        {
          deleted: {},
          dialog: {
            ...initialState.dialog
          }
        },
        {
          state,
          reset: false
        }
      );
    case credentialsTypes.UPDATE_CREDENTIALS:
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
    case credentialsTypes.SELECT_CREDENTIAL:
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
    case credentialsTypes.DESELECT_CREDENTIAL:
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
    case credentialsTypes.EXPANDED_CREDENTIAL:
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
    case credentialsTypes.NOT_EXPANDED_CREDENTIAL:
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

    case credentialsTypes.CREATE_CREDENTIAL_SHOW:
      return reduxHelpers.setStateProp(
        'dialog',
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
        'dialog',
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
        'dialog',
        {
          show: false
        },
        {
          state,
          initialState
        }
      );

    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          {
            ref: 'deleted',
            type: [credentialsTypes.DELETE_CREDENTIAL]
          },
          {
            ref: 'dialog',
            type: [credentialsTypes.ADD_CREDENTIAL, credentialsTypes.UPDATE_CREDENTIAL]
          },
          { ref: 'view', type: credentialsTypes.GET_CREDENTIALS }
        ],
        state,
        action
      );
  }
};

credentialsReducer.initialState = initialState;

export { credentialsReducer as default, initialState, credentialsReducer };
