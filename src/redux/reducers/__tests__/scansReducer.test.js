import { scansReducer } from '../scansReducer';
import { reportsTypes, scansTypes as types } from '../../constants';
import { reduxHelpers } from '../../common';

describe('ScansReducer', () => {
  it('should return the initial state', () => {
    expect(scansReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      types.UPDATE_SCANS,
      types.MERGE_SCAN_DIALOG_SHOW,
      types.MERGE_SCAN_DIALOG_HIDE,
      types.SELECT_SCAN,
      types.DESELECT_SCAN,
      types.EXPANDED_SCAN,
      types.NOT_EXPANDED_SCAN,
      types.RESET_ACTIONS
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value
      };

      const resultState = scansReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [
      reportsTypes.GET_REPORTS_DOWNLOAD,
      types.GET_SCAN_CONNECTION_RESULTS,
      types.GET_SCAN_INSPECTION_RESULTS,
      types.GET_SCAN_JOB,
      types.GET_SCAN_JOBS,
      types.CANCEL_SCAN,
      types.PAUSE_SCAN,
      types.RESTART_SCAN,
      types.START_SCAN,
      types.GET_SCANS,
      types.DELETE_SCAN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.REJECTED_ACTION(value),
        error: true,
        payload: {
          message: 'MESSAGE',
          response: {
            status: 0,
            statusText: 'ERROR TEST',
            data: {
              detail: 'ERROR'
            }
          }
        }
      };

      const resultState = scansReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [
      reportsTypes.GET_REPORTS_DOWNLOAD,
      types.GET_SCAN_CONNECTION_RESULTS,
      types.GET_SCAN_INSPECTION_RESULTS,
      types.GET_SCAN_JOB,
      types.GET_SCAN_JOBS,
      types.CANCEL_SCAN,
      types.PAUSE_SCAN,
      types.RESTART_SCAN,
      types.START_SCAN,
      types.GET_SCANS,
      types.DELETE_SCAN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = scansReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      reportsTypes.GET_REPORTS_DOWNLOAD,
      types.GET_SCAN_CONNECTION_RESULTS,
      types.GET_SCAN_INSPECTION_RESULTS,
      types.GET_SCAN_JOB,
      types.GET_SCAN_JOBS,
      types.CANCEL_SCAN,
      types.PAUSE_SCAN,
      types.RESTART_SCAN,
      types.START_SCAN,
      types.GET_SCANS,
      types.DELETE_SCAN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.FULFILLED_ACTION(value),
        payload: {
          data: {
            test: 'success'
          }
        }
      };

      const resultState = scansReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
