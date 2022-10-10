import { reportsTypes } from '../constants';
import { reduxHelpers } from '../common';

const initialState = {};

const reportsReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer([reportsTypes.GET_MERGE_REPORT], state, action);

reportsReducer.initialState = initialState;

export { reportsReducer as default, initialState, reportsReducer };
