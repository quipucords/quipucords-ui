import { scansActionReducer } from '../scansActionReducer';
import { scansTypes as types } from '../../constants';
import helpers from '../../../common/helpers';

describe('ScansActionReducer', () => {
  it('should return the initial state', () => {
    expect(scansActionReducer.initialState).toBeDefined();
  });

  it('should handle all defined error types', () => {
    const specificTypes = [
      types.GET_SCAN_CONNECTION_RESULTS,
      types.GET_SCAN_INSPECTION_RESULTS,
      types.GET_SCAN_JOB,
      types.GET_SCAN_JOBS,
      types.CANCEL_SCAN,
      types.PAUSE_SCAN,
      types.RESTART_SCAN,
      types.START_SCAN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        meta: {
          id: 1,
          data: {},
          query: {}
        },
        type: helpers.REJECTED_ACTION(value),
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

      const resultState = scansActionReducer(undefined, dispatched);

      expect({ type: helpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(`rejected types ${value}`);
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [
      types.GET_SCAN_CONNECTION_RESULTS,
      types.GET_SCAN_INSPECTION_RESULTS,
      types.GET_SCAN_JOB,
      types.GET_SCAN_JOBS,
      types.CANCEL_SCAN,
      types.PAUSE_SCAN,
      types.RESTART_SCAN,
      types.START_SCAN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        meta: {
          id: 1,
          data: {},
          query: {}
        },
        type: helpers.PENDING_ACTION(value)
      };

      const resultState = scansActionReducer(undefined, dispatched);

      expect({ type: helpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(`pending types ${value}`);
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      types.GET_SCAN_CONNECTION_RESULTS,
      types.GET_SCAN_INSPECTION_RESULTS,
      types.GET_SCAN_JOB,
      types.GET_SCAN_JOBS,
      types.CANCEL_SCAN,
      types.PAUSE_SCAN,
      types.RESTART_SCAN,
      types.START_SCAN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        meta: {
          id: 1,
          data: {},
          query: {}
        },
        type: helpers.FULFILLED_ACTION(value),
        payload: {
          data: {
            test: 'success'
          }
        }
      };

      const resultState = scansActionReducer(undefined, dispatched);

      expect({ type: helpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
