import { aboutModalTypes } from '../constants';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  show: false
};

const aboutModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case aboutModalTypes.ABOUT_MODAL_SHOW:
      return reduxHelpers.setStateProp(
        null,
        {
          show: true
        },
        {
          state,
          reset: false
        }
      );

    case aboutModalTypes.ABOUT_MODAL_HIDE:
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

    default:
      return state;
  }
};

aboutModalReducer.initialState = initialState;

export { aboutModalReducer as default, initialState, aboutModalReducer };
