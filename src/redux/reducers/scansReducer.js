import { scansTypes, sourcesTypes } from '../constants';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  mergeDialog: {
    show: false,
    scans: [],
    details: false
  },

  empty: {},
  connection: {},
  inspection: {},
  job: {},
  jobs: {},
  cancel: {},
  pause: {},
  restart: {},
  start: {},
  view: {}
};

const scansReducer = (state = initialState, action) => {
  switch (action.type) {
    case scansTypes.UPDATE_SCANS:
      return reduxHelpers.setStateProp(
        'view',
        {
          update: true
        },
        {
          state,
          reset: false
        }
      );

    case scansTypes.MERGE_SCAN_DIALOG_SHOW:
      return reduxHelpers.setStateProp(
        'mergeDialog',
        {
          show: true,
          scans: action.scans,
          details: action.details
        },
        {
          state,
          initialState
        }
      );

    case scansTypes.MERGE_SCAN_DIALOG_HIDE:
      return reduxHelpers.setStateProp(
        'mergeDialog',
        {
          show: false
        },
        {
          state,
          initialState
        }
      );

    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'empty', type: sourcesTypes.GET_SCANS_SOURCES },
          { ref: 'connection', type: scansTypes.GET_SCAN_CONNECTION_RESULTS },
          { ref: 'inspection', type: scansTypes.GET_SCAN_INSPECTION_RESULTS },
          { ref: 'job', type: scansTypes.GET_SCAN_JOB },
          { ref: 'jobs', type: scansTypes.GET_SCAN_JOBS },
          { ref: 'cancel', type: scansTypes.CANCEL_SCAN },
          { ref: 'pause', type: scansTypes.PAUSE_SCAN },
          { ref: 'restart', type: scansTypes.RESTART_SCAN },
          { ref: 'start', type: scansTypes.START_SCAN },
          { ref: 'view', type: scansTypes.GET_SCANS }
        ],
        state,
        action
      );
  }
};

scansReducer.initialState = initialState;

export { scansReducer as default, initialState, scansReducer };
