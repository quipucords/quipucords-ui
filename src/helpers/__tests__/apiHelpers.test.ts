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

  describe('hasFieldValidationErrors', () => {
    it('should detect field validation errors for any form', () => {
      // Credential form fields
      expect(apiHelpers.hasFieldValidationErrors({
        name: ['This field is required'],
        username: 'Username already exists'
      })).toBe(true);

      // Source form fields
      expect(apiHelpers.hasFieldValidationErrors({
        hosts: ['Invalid host format'],
        port: 'Port must be a number'
      })).toBe(true);

      // Any custom form fields
      expect(apiHelpers.hasFieldValidationErrors({
        email: 'Invalid email format',
        custom_field: ['Required field']
      })).toBe(true);
    });

    it('should return false for system-level errors', () => {
      expect(apiHelpers.hasFieldValidationErrors({
        detail: 'Server error',
        message: 'Network error'
      })).toBe(false);

      expect(apiHelpers.hasFieldValidationErrors({
        error: 'Authentication failed',
        status: 500
      })).toBe(false);

      expect(apiHelpers.hasFieldValidationErrors({
        non_field_errors: ['General validation error']
      })).toBe(false);
    });

    it('should handle mixed field and system errors', () => {
      // If there are any field errors, should return true
      expect(apiHelpers.hasFieldValidationErrors({
        name: 'Required',           // field error
        detail: 'Server error'      // system error
      })).toBe(true);
    });

    it('should handle invalid input', () => {
      expect(apiHelpers.hasFieldValidationErrors(null)).toBe(false);
      expect(apiHelpers.hasFieldValidationErrors(undefined)).toBe(false);
      expect(apiHelpers.hasFieldValidationErrors('string')).toBe(false);
    });
  });

  describe('parseFieldErrors', () => {
    it('should parse all field errors', () => {
      expect(apiHelpers.parseFieldErrors({
        name: ['This field is required'],
        username: 'Username already exists',
        hosts: ['Invalid format', 'Must not be empty']
      })).toEqual({
        name: 'This field is required',
        username: 'Username already exists',
        hosts: 'Invalid format, Must not be empty'
      });
    });

    it('should handle empty/invalid input', () => {
      expect(apiHelpers.parseFieldErrors(null)).toEqual({});
      expect(apiHelpers.parseFieldErrors(undefined)).toEqual({});
      expect(apiHelpers.parseFieldErrors({})).toEqual({});
    });
  });
});
