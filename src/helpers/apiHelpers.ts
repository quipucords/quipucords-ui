import { AxiosError } from 'axios';

/**
 * Extracts and concatenates error messages from an object.
 *
 * @param data - The data object that may contain error messages.
 * @returns A string containing error messages, joined by newlines, or 'Unknown error' if none are found.
 */
const extractErrorMessage = (data: { [key: string]: unknown } | undefined): string => {
  if (!data) {
    return 'Unknown error';
  }
  const errorValues = Object.values(data);
  const messages = errorValues.flat().filter(Boolean);
  return messages.join('\n');
};

/**
 * Checks if error data contains field-specific validation errors
 *
 * @param errorData - The error data object from response.data
 * @returns boolean indicating if field validation errors are present
 */
const hasFieldValidationErrorsInData = (errorData: any): boolean => {
  if (!errorData || typeof errorData !== 'object') {
    return false;
  }

  // System-level error keys that are NOT field validation errors
  // These are keys that Django REST Framework uses for general errors
  const systemErrorKeys = ['detail', 'message', 'non_field_errors'];

  // Check if there are any keys that look like field validation errors
  // (not system error keys, and have string/array values)
  return Object.keys(errorData).some(
    key => !systemErrorKeys.includes(key) && (Array.isArray(errorData[key]) || typeof errorData[key] === 'string')
  );
};

/**
 * Checks if AxiosError contains field-specific validation errors
 * (as opposed to general system errors)
 *
 * @param error - The AxiosError object
 * @returns boolean indicating if field validation errors are present
 */
const hasFieldValidationErrors = (error: AxiosError): boolean => {
  // For AxiosError, check the response data
  const errorData = error?.response?.data;
  return hasFieldValidationErrorsInData(errorData);
};

/**
 * Parses field-specific errors from server response
 */
const parseFieldErrors = (errorData: any): { [key: string]: string } => {
  const fieldErrors: { [key: string]: string } = {};
  if (errorData && typeof errorData === 'object') {
    Object.keys(errorData).forEach(field => {
      const errorValue = errorData[field];
      if (Array.isArray(errorValue)) {
        fieldErrors[field] = errorValue.join(', ');
      } else if (typeof errorValue === 'string') {
        fieldErrors[field] = errorValue;
      }
    });
  }

  return fieldErrors;
};

const apiHelpers = {
  extractErrorMessage,
  hasFieldValidationErrors,
  hasFieldValidationErrorsInData,
  parseFieldErrors
};

export { apiHelpers as default, apiHelpers };
