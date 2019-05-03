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
  if (!action.meta || !action.meta.id) {
    return state;
  }

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

  switch (type) {
    case REJECTED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        {
          [action.meta.id]: {
            error: action.error,
            errorMessage: helpers.getMessageFromResults(action.payload).message,
            errorStatus: helpers.getStatusFromResults(action.payload),
            metaData: action.meta.data,
            metaId: action.meta.id,
            metaQuery: action.meta.query
          }
        },
        {
          state
        }
      );
    case PENDING_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        {
          [action.meta.id]: {
            metaData: action.meta.data,
            metaId: action.meta.id,
            metaQuery: action.meta.query,
            pending: true
          }
        },
        {
          state
        }
      );

    case FULFILLED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        {
          [action.meta.id]: {
            data: (action.payload && action.payload.data) || {},
            fulfilled: true,
            metaData: action.meta.data,
            metaId: action.meta.id,
            metaQuery: action.meta.query
          }
        },
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
