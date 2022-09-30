import viewReducer from '../viewReducer';
import { viewTypes as types } from '../../constants';

describe('viewReducer', () => {
  it('should return the initial state', () => {
    expect(viewReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [types.SET_FILTER, types.UPDATE_VIEW, types.SET_QUERY, types.RESET_PAGE];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        viewId: 'test_id'
      };

      const resultState = viewReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
