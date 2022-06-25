import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { store } from './store';
import { reduxActions } from './actions';
import { reduxHelpers } from './common';
import { storeHooks } from './hooks';
import { reduxReducers } from './reducers';
import { reduxSelectors } from './selectors';
import { reduxTypes } from './constants';

const connectRouter = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(connect(mapStateToProps, mapDispatchToProps)(component));

export {
  connect,
  connectRouter,
  reduxActions,
  reduxHelpers,
  reduxReducers,
  reduxSelectors,
  reduxTypes,
  store,
  storeHooks
};
