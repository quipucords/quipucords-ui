import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import store from './store';
import reduxActions from './actions';
import reduxReducers from './reducers';
import reduxSelectors from './selectors';
import reduxTypes from './constants';

const connectTranslate = (mapStateToProps, mapDispatchToProps) => component =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(component));

const connectRouterTranslate = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(connectTranslate(mapStateToProps, mapDispatchToProps)(component));

const connectRouter = (mapStateToProps, mapDispatchToProps) => component =>
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(component)
  );

export {
  connect,
  connectRouter,
  connectRouterTranslate,
  connectTranslate,
  reduxActions,
  reduxReducers,
  reduxSelectors,
  reduxTypes,
  store
};
