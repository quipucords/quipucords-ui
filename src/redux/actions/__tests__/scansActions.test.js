import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { scansReducer, scansActionReducer, scansEditReducer } from '../../reducers';
import { scansActions } from '..';

describe('ScansActions', () => {
  const middleware = [promiseMiddleware()];
  const generateStore = () =>
    createStore(
      combineReducers({
        scans: scansReducer,
        scansAction: scansActionReducer,
        scansEdit: scansEditReducer
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

  it('Should return response content for addScan method', done => {
    const store = generateStore();
    const dispatcher = scansActions.addScan();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansEdit;

      expect(response.add).toEqual(true);
      done();
    });
  });

  it('Should return response content for addStartScan method', done => {
    const store = generateStore();
    const dispatcher = scansActions.addStartScan();

    dispatcher(store.dispatch).then(value => {
      expect(value.action.type).toMatchSnapshot('addStartScan');
      done();
    });
  });

  it('Should return response content for getScans method', done => {
    const store = generateStore();
    const dispatcher = scansActions.getScans();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scans;

      expect(response.view.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for getScanJobs method', done => {
    const store = generateStore();
    const dispatcher = scansActions.getScanJobs('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.jobs.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for getScanJob method', done => {
    const store = generateStore();
    const dispatcher = scansActions.getScanJob('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.job.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for getConnectionScanResults method', done => {
    const store = generateStore();
    const dispatcher = scansActions.getConnectionScanResults('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.connection.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for getInspectionScanResults method', done => {
    const store = generateStore();
    const dispatcher = scansActions.getInspectionScanResults('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.inspection.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for startScan method', done => {
    const store = generateStore();
    const dispatcher = scansActions.startScan('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.start.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for pauseScan method', done => {
    const store = generateStore();
    const dispatcher = scansActions.pauseScan('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.pause.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for cancelScan method', done => {
    const store = generateStore();
    const dispatcher = scansActions.cancelScan('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.cancel.lorem.fulfilled).toEqual(true);
      done();
    });
  });

  it('Should return response content for restartScan method', done => {
    const store = generateStore();
    const dispatcher = scansActions.restartScan('lorem');

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().scansAction;

      expect(response.restart.lorem.fulfilled).toEqual(true);
      done();
    });
  });
});
