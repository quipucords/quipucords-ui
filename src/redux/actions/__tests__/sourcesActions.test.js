import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import moxios from 'moxios';
import { addSourceWizardReducer, scansReducer, sourcesReducer } from '../../reducers';
import { sourcesActions } from '..';
import apiTypes from '../../../constants/apiConstants';

describe('SourcesActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        addSourceWizard: addSourceWizardReducer,
        scans: scansReducer,
        sources: sourcesReducer
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
          [apiTypes.API_RESPONSE_SOURCES_COUNT]: 3
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for addSource method', done => {
    const store = generateStore();
    const dispatcher = sourcesActions.addSource();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().addSourceWizard;

      expect(response.source.test).toEqual('success');
      done();
    });
  });

  it('Should have a defined deleteSource method', done => {
    const store = generateStore();
    const dispatcher = sourcesActions.deleteSource();

    dispatcher(store.dispatch).then(value => {
      expect(value.action.type).toMatchSnapshot('deleteSource');
      done();
    });
  });

  it('Should return response content for getSources method', done => {
    const store = generateStore();
    const dispatcher = sourcesActions.getSources();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().sources;

      expect(response.view.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for updateSource method', done => {
    const store = generateStore();
    const dispatcher = sourcesActions.updateSource();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().addSourceWizard;

      expect(response.source.test).toEqual('success');
      done();
    });
  });
});
