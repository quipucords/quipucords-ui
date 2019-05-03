import reduxHelpers from '../../common/reduxHelpers';
import { scansTypes } from '../constants';

const initialState = {
  connection: {},
  inspection: {},
  job: {},
  jobs: {},
  cancel: {},
  pause: {},
  restart: {},
  start: {}
};

const scansActionReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [
      { ref: 'connection', type: scansTypes.GET_SCAN_CONNECTION_RESULTS },
      { ref: 'inspection', type: scansTypes.GET_SCAN_INSPECTION_RESULTS },
      { ref: 'job', type: scansTypes.GET_SCAN_JOB },
      { ref: 'jobs', type: scansTypes.GET_SCAN_JOBS },
      { ref: 'cancel', type: scansTypes.CANCEL_SCAN },
      { ref: 'pause', type: scansTypes.PAUSE_SCAN },
      { ref: 'restart', type: scansTypes.RESTART_SCAN },
      { ref: 'start', type: scansTypes.START_SCAN }
    ],
    state,
    action
  );

scansActionReducer.initialState = initialState;

export { scansActionReducer as default, initialState, scansActionReducer };
