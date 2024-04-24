import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { thunk as thunkMiddleware } from 'redux-thunk';
import { multiActionMiddleware } from './multiActionMiddleware';

/**
 * Redux middleware.
 *
 * @type {Array}
 */
const reduxMiddleware = [thunkMiddleware, multiActionMiddleware, promiseMiddleware];

if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_DEBUG_MIDDLEWARE === 'true') {
  reduxMiddleware.push(createLogger());
}

export {
  reduxMiddleware as default,
  reduxMiddleware,
  createLogger,
  multiActionMiddleware,
  promiseMiddleware,
  thunkMiddleware
};
