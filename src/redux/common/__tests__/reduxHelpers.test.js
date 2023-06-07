import { reduxHelpers } from '../reduxHelpers';

describe('ReduxHelpers', () => {
  it('should have specific functions', () => {
    expect(reduxHelpers).toMatchSnapshot('reduxHelpers');
  });

  it('should support generated strings and flags', () => {
    expect(reduxHelpers.FULFILLED_ACTION('lorem')).toBe(`lorem_FULFILLED`);
    expect(reduxHelpers.PENDING_ACTION('lorem')).toBe(`lorem_PENDING`);
    expect(reduxHelpers.REJECTED_ACTION('lorem')).toBe(`lorem_REJECTED`);
  });

  it('should update a state object', () => {
    const initialState = {
      lorem: false,
      ipsum: true
    };

    const state = {};
    state.ipsum = false;

    expect(
      reduxHelpers.setStateProp(
        null,
        {
          lorem: true
        },
        {
          state,
          initialState
        }
      )
    ).toMatchSnapshot('reset state object');

    state.ipsum = false;

    expect(
      reduxHelpers.setStateProp(
        null,
        {
          lorem: true
        },
        {
          state,
          reset: false
        }
      )
    ).toMatchSnapshot("don't reset state object");
  });

  it('should generate a standard reducer from promise actions', () => {
    const state = {
      lorem: {},
      ipsum: {}
    };

    const action = {
      meta: {
        id: 'lorem-id'
      },
      payload: {
        data: {
          test: 'test'
        }
      }
    };

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'lorem', type: 'LOREM' },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.FULFILLED_ACTION('LOREM') }
      )
    ).toMatchSnapshot('generatedPromiseActionReducer fulfilled');

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'lorem', type: 'LOREM' },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.REJECTED_ACTION('LOREM') }
      )
    ).toMatchSnapshot('generatedPromiseActionReducer rejected');

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'lorem', type: 'LOREM' },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.PENDING_ACTION('LOREM') }
      )
    ).toMatchSnapshot('generatedPromiseActionReducer pending');

    delete action.meta;
    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'lorem', type: 'LOREM' },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.FULFILLED_ACTION('LOREM') }
      )
    ).toMatchSnapshot('generatedPromiseActionReducer fulfilled no meta data');

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'lorem', type: 'LOREM' },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.REJECTED_ACTION('LOREM') }
      )
    ).toMatchSnapshot('generatedPromiseActionReducer rejected no meta data');

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'lorem', type: 'LOREM' },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.PENDING_ACTION('LOREM') }
      )
    ).toMatchSnapshot('generatedPromiseActionReducer pending no meta data');
  });

  it('should combine multiple reducer action types', () => {
    const state = {
      loremIpsum: {},
      ipsum: {}
    };

    const action = {
      meta: {
        id: 'lorem-id'
      },
      payload: {
        data: {
          test: 'test'
        }
      }
    };

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'loremIpsum', type: ['LOREM', 'IPSUM'] },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.FULFILLED_ACTION('IPSUM') }
      )
    ).toMatchSnapshot('combined fulfilled');

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'loremIpsum', type: ['LOREM', 'IPSUM'] },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.REJECTED_ACTION('IPSUM') }
      )
    ).toMatchSnapshot('combined rejected');

    expect(
      reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'loremIpsum', type: ['LOREM', 'IPSUM'] },
          { ref: 'ipsum', type: 'IPSUM' }
        ],
        state,
        { ...action, type: reduxHelpers.PENDING_ACTION('IPSUM') }
      )
    ).toMatchSnapshot('combined pending');
  });
});
