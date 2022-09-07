import moxios from 'moxios';
import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import { credentialsReducer } from '../../reducers';
import { credentialsActions } from '..';
import apiTypes from '../../../constants/apiConstants';

describe('CredentialsActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        credentials: credentialsReducer
      }),
      applyMiddleware(...middleware)
    );

  beforeEach(() => {
    moxios.install();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        responseText: 'success',
        timeout: 1,
        response: {
          test: 'success',
          [apiTypes.API_RESPONSE_CREDENTIALS_RESULTS]: ['success']
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for addCredential method', done => {
    const store = generateStore();
    const dispatcher = credentialsActions.addCredential();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().credentials;
      expect(response.dialog.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for getCredentials method', done => {
    const store = generateStore();
    const dispatcher = credentialsActions.getCredentials();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().credentials;
      expect(response.view.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for updateCredential method', done => {
    const store = generateStore();
    const dispatcher = credentialsActions.updateCredential();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().credentials;
      expect(response.dialog.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for deleteCredential method', done => {
    const store = generateStore();
    const dispatcher = credentialsActions.deleteCredential(['loremId']);

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().credentials;
      expect(response.deleted.fulfilled).toEqual(true);
      done();
    });
  });
});
