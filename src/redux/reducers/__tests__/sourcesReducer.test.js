import sourcesReducer from '../sourcesReducer';
import { sourcesTypes as types } from '../../constants';
import { reduxHelpers } from '../../common';

describe('SourcesReducer', () => {
  it('should return the initial state', () => {
    expect(sourcesReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      types.UPDATE_SOURCES,
      types.SELECT_SOURCE,
      types.DESELECT_SOURCE,
      types.EXPANDED_SOURCE,
      types.NOT_EXPANDED_SOURCE,
      types.RESET_ACTIONS
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value
      };

      const resultState = sourcesReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [types.GET_SOURCES, types.DELETE_SOURCE];

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

      const resultState = sourcesReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [types.GET_SOURCES, types.DELETE_SOURCE];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = sourcesReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [types.GET_SOURCES, types.DELETE_SOURCE];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.FULFILLED_ACTION(value),
        payload: {
          data: {
            test: 'success'
          }
        }
      };

      const resultState = sourcesReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
