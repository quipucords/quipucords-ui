import _get from 'lodash/get';
import { helpers } from '../../common/helpers';

const FULFILLED_ACTION = base => `${base}_FULFILLED`;

const PENDING_ACTION = base => `${base}_PENDING`;

const REJECTED_ACTION = base => `${base}_REJECTED`;

const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  let obj = { ...state };

  if (process.env.REACT_APP_ENV === 'development' && prop && !state[prop]) {
    console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (process.env.REACT_APP_ENV === 'development' && reset && prop && !initialState[prop]) {
    console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset && prop) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data
    };
  } else if (reset && !prop) {
    obj = {
      ...state,
      ...initialState,
      ...data
    };
  } else if (prop) {
    obj[prop] = {
      ...state[prop],
      ...data
    };
  } else {
    obj = {
      ...state,
      ...data
    };
  }

  return obj;
};

const generatedPromiseActionReducer = (types = [], state = {}, action = {}) => {
  const { type } = action;
  const expandedTypes = [];

  types.forEach(
    val =>
      (Array.isArray(val.type) && val.type.forEach(subVal => expandedTypes.push({ ref: val.ref, type: subVal }))) ||
      expandedTypes.push(val)
  );

  const [whichType] = expandedTypes.filter(val =>
    new RegExp(
      `^(${REJECTED_ACTION(val.type || val)}|${PENDING_ACTION(val.type || val)}|${FULFILLED_ACTION(val.type || val)})$`
    ).test(type)
  );

  if (!whichType) {
    return state;
  }

  const baseState = {
    error: false,
    errorMessage: '',
    errorStatus: undefined,
    fulfilled: false,
    metaData: action.meta && action.meta.data,
    metaId: action.meta && action.meta.id,
    metaQuery: action.meta && action.meta.query,
    pending: false,
    update: false
  };

  // Automatically apply data and state to a contextual ID if meta.id exists.
  const idUse = data => {
    const typeId = typeof action?.meta?.id;
    return (
      ((typeId === 'string' || typeId === 'number') &&
        action?.meta?.id && { [action.meta.id]: { ...baseState, ...data } }) || {
        ...baseState,
        ...data
      }
    );
  };

  switch (type) {
    case REJECTED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        idUse({
          error: true,
          errorMessage: helpers.getMessageFromResults(action.payload).message,
          errorStatus: helpers.getStatusFromResults(action.payload)
        }),
        {
          state
        }
      );
    case PENDING_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        idUse({
          pending: true
        }),
        {
          state
        }
      );

    case FULFILLED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        idUse({
          date: _get(
            action.payload,
            'headers.date',
            (helpers.DEV_MODE && helpers.getCurrentDate().toUTCString()) || undefined
          ),
          data: (action.payload && action.payload.data) || {},
          fulfilled: true
        }),
        {
          state
        }
      );

    default:
      return state;
  }
};

const reduxHelpers = {
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  generatedPromiseActionReducer,
  setStateProp
};

export { reduxHelpers as default, reduxHelpers };
