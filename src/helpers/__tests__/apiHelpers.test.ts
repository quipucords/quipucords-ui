import { AxiosError } from 'axios';
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

  describe('hasFieldValidationErrorsInData', () => {
    it('should detect field validation errors for any form', () => {
      expect(
        apiHelpers.hasFieldValidationErrorsInData({
          name: ['This field is required'],
          username: 'Username already exists'
        })
      ).toBe(true);

      expect(
        apiHelpers.hasFieldValidationErrorsInData({
          hosts: ['Invalid host format'],
          port: 'Port must be a number'
        })
      ).toBe(true);

      expect(
        apiHelpers.hasFieldValidationErrorsInData({
          email: 'Invalid email format',
          custom_field: ['Required field']
        })
      ).toBe(true);
    });

    it('should return false for system-level errors', () => {
      expect(
        apiHelpers.hasFieldValidationErrorsInData({
          detail: 'Server error',
          message: 'Network error'
        })
      ).toBe(false);

      expect(
        apiHelpers.hasFieldValidationErrorsInData({
          non_field_errors: ['General validation error']
        })
      ).toBe(false);
    });

    it('should handle mixed field and system errors', () => {
      expect(
        apiHelpers.hasFieldValidationErrorsInData({
          name: 'Required', // field error
          detail: 'Server error' // system error
        })
      ).toBe(true);
    });

    it('should handle invalid input', () => {
      expect(apiHelpers.hasFieldValidationErrorsInData(null)).toBe(false);
      expect(apiHelpers.hasFieldValidationErrorsInData(undefined)).toBe(false);
      expect(apiHelpers.hasFieldValidationErrorsInData('string')).toBe(false);
    });
  });

  describe('hasFieldValidationErrors (AxiosError)', () => {
    const createAxiosError = (data: any): AxiosError =>
      ({
        response: { data },
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed'
      }) as AxiosError;

    it('should detect field validation errors from AxiosError', () => {
      expect(
        apiHelpers.hasFieldValidationErrors(
          createAxiosError({
            name: ['This field is required'],
            username: 'Username already exists'
          })
        )
      ).toBe(true);
    });

    it('should return false for system-level errors in AxiosError', () => {
      expect(
        apiHelpers.hasFieldValidationErrors(
          createAxiosError({
            detail: 'Server error',
            message: 'Network error'
          })
        )
      ).toBe(false);
    });

    it('should handle AxiosError without response data', () => {
      expect(
        apiHelpers.hasFieldValidationErrors({
          isAxiosError: true,
          name: 'AxiosError',
          message: 'Network Error'
        } as AxiosError)
      ).toBe(false);
    });
  });

  describe('parseFieldErrors', () => {
    it('should parse all field errors', () => {
      expect(
        apiHelpers.parseFieldErrors({
          name: ['This field is required'],
          username: 'Username already exists',
          hosts: ['Invalid format', 'Must not be empty']
        })
      ).toEqual({
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
