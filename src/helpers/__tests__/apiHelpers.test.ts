import apiHelpers from '../apiHelpers';

describe('apiHelpers', () => {
  it('should handle error messages from an object', () => {
    expect({
      'concatenate error messages from an object': apiHelpers.extractErrorMessage({
        error1: 'Error message 1',
        error2: 'Error message 2'
      }),
      'handle arrays of error messages': apiHelpers.extractErrorMessage({
        errors: ['Error message 1', 'Error message 2']
      }),
      'handle nested arrays of error messages': apiHelpers.extractErrorMessage({
        errors: ['Error message 1', ['Error message 2', 'Error message 3']]
      }),
      'filter out falsy values': apiHelpers.extractErrorMessage({
        error1: 'Error message 1',
        error2: null,
        error3: undefined,
        error4: '',
        error5: 'Error message 2'
      }),
      'return "Unknown error" for undefined input': apiHelpers.extractErrorMessage(undefined),
      'handle objects with mixed types of values': apiHelpers.extractErrorMessage({
        error1: 'Error message 1',
        error2: ['Error message 2', false, 0, 'Error message 3'],
        error3: null,
        error4: { nestedError: 'Nested error message' }
      })
    }).toMatchSnapshot('extractErrorMessage');
  });
});
