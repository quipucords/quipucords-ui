import credentialsReducer from '../credentialsReducer';
import { credentialsTypes as types } from '../../constants';
import { reduxHelpers } from '../../common';

describe('CredentialsReducer', () => {
  it('should return the initial state', () => {
    expect(credentialsReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      types.UPDATE_CREDENTIALS,
      types.SELECT_CREDENTIAL,
      types.DESELECT_CREDENTIAL,
      types.EXPANDED_CREDENTIAL,
      types.NOT_EXPANDED_CREDENTIAL,
      types.CREATE_CREDENTIAL_SHOW,
      types.EDIT_CREDENTIAL_SHOW,
      types.UPDATE_CREDENTIAL_HIDE,
      types.RESET_ACTIONS
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value
      };

      const resultState = credentialsReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [
      types.ADD_CREDENTIAL,
      types.DELETE_CREDENTIAL,
      types.UPDATE_CREDENTIAL,
      types.GET_CREDENTIALS
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

      const resultState = credentialsReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [
      types.ADD_CREDENTIAL,
      types.DELETE_CREDENTIAL,
      types.UPDATE_CREDENTIAL,
      types.GET_CREDENTIALS
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = credentialsReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      types.ADD_CREDENTIAL,
      types.DELETE_CREDENTIAL,
      types.UPDATE_CREDENTIAL,
      types.GET_CREDENTIALS
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

      const resultState = credentialsReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
