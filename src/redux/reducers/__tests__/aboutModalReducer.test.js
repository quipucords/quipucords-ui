import aboutModalReducer from '../aboutModalReducer';
import { aboutModalTypes as types } from '../../constants';

describe('AddSourceWizardReducer', () => {
  it('should return the initial state', () => {
    expect(aboutModalReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [types.ABOUT_MODAL_HIDE, types.ABOUT_MODAL_SHOW];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        source: {}
      };

      const resultState = aboutModalReducer(undefined, dispatched);

      expect({
        type: value,
        result: resultState
      }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
