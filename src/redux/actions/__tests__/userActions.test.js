import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { userReducer } from '../../reducers';
import { userActions } from '..';
import apiTypes from '../../../constants/apiConstants';

describe('UserActions', () => {
  const middleware = [promiseMiddleware()];
  const generateStore = () =>
    createStore(
      combineReducers({
        user: userReducer
      }),
      applyMiddleware(...middleware)
    );

  beforeEach(() => {
    moxios.install();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          test: 'success',
          [apiTypes.API_RESPONSE_USER_USERNAME]: 'success'
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for authorizeUser method', done => {
    const store = generateStore();
    const dispatcher = userActions.authorizeUser();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().user;

      expect(response.session.fulfilled).toEqual(true);
      expect(response.session.authorized).toEqual(true);
      expect(response.session.username).toEqual('success');
      done();
    });
  });

  it('Should return response content for logoutUser method', done => {
    const store = generateStore();
    const dispatcher = userActions.logoutUser();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().user;

      expect(response.session.fulfilled).toEqual(false);
      expect(response.session.authorized).toEqual(false);
      done();
    });
  });
});
