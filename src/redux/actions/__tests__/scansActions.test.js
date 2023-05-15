import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import moxios from 'moxios';
import { multiActionMiddleware } from '../../middleware';
import { scansReducer, scansEditReducer, sourcesReducer } from '../../reducers';
import { scansActions } from '..';

describe('ScansActions', () => {
  const middleware = [multiActionMiddleware, promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        scans: scansReducer,
        scansEdit: scansEditReducer,
        sources: sourcesReducer
      }),
      applyMiddleware(...middleware)
    );

  const generateDispatch = async dispatcher => {
    const store = generateStore();
    return dispatcher(store.dispatch).then(_ => ({ state: store.getState(), value: _ }));
  };

  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(api).*?/, {
      status: 200,
      timeout: 1,
      response: {
        test: 'success'
      }
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for addScan method', async () => {
    const dispatcher = scansActions.addScan();

    const { state } = await generateDispatch(dispatcher);
    expect(state.scansEdit.add).toEqual(true);
  });

  it('Should return response content for addStartScan method', async () => {
    const dispatcher = scansActions.addStartScan();

    const { value } = await generateDispatch(dispatcher);
    expect(value.action.type).toMatchSnapshot('addStartScan');
  });

  it('Should return response content for getScans method', async () => {
    const dispatcher = scansActions.getScans();

    const { state } = await generateDispatch(dispatcher);
    expect(state.sources.view.fulfilled).toEqual(true);
    expect(state.scans.view.fulfilled).toEqual(true);
  });

  it('Should return response content for getScanJobs method', async () => {
    const dispatcher = scansActions.getScanJobs('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.jobs.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for getScanJob method', async () => {
    const dispatcher = scansActions.getScanJob('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.job.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for getConnectionScanResults method', async () => {
    const dispatcher = scansActions.getConnectionScanResults('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.connection.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for getInspectionScanResults method', async () => {
    const dispatcher = scansActions.getInspectionScanResults('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.inspection.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for startScan method', async () => {
    const dispatcher = scansActions.startScan('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.action.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for pauseScan method', async () => {
    const dispatcher = scansActions.pauseScan('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.action.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for cancelScan method', async () => {
    const dispatcher = scansActions.cancelScan('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.action.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for restartScan method', async () => {
    const dispatcher = scansActions.restartScan('lorem');

    const { state } = await generateDispatch(dispatcher);
    expect(state.scans.action.lorem.fulfilled).toEqual(true);
  });

  it('Should return response content for deleteScan method', async () => {
    const dispatcher = scansActions.deleteScan();
    const { value } = await generateDispatch(dispatcher);
    expect(value.action.type).toMatchSnapshot('deleteScan');
  });
});
