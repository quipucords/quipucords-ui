import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { reportsReducer } from '../../reducers';
import { reportsActions } from '..';

describe('ReportsActions', () => {
  const middleware = [promiseMiddleware()];
  const generateStore = () =>
    createStore(
      combineReducers({
        reports: reportsReducer
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
          test: 'success'
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for getReportsDownload method', done => {
    const store = generateStore();
    const dispatcher = reportsActions.getReportsDownload();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().reports;

      expect(response.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for mergeReports method', done => {
    const store = generateStore();
    const dispatcher = reportsActions.mergeReports();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().reports;

      expect(response.fulfilled).toEqual(true);
      done();
    });
  });
});
