/**
 * Extracts and concatenates error messages from an object.
 *
 * @param { { [key: string]: unknown } | undefined } data - The data object that may contain error messages.
 * @returns {string} A string containing error messages, joined by newlines, or 'Unknown error' if none are found.
 */
const extractErrorMessage = (data: { [key: string]: unknown } | undefined) => {
  if (!data) {
    return 'Unknown error';
  }
  const errorValues = Object.values(data);
  const messages = errorValues.flatMap(value => (Array.isArray(value) ? value : [value])).filter(Boolean);
  return messages.join('\n');
};

/**
 * Checks if error response contains field-specific validation errors
 * (as opposed to general system errors)
 */
const hasFieldValidationErrors = (errorData: any): boolean => {
  if (!errorData || typeof errorData !== 'object') {
    return false;
  }
  
  // System-level error keys that are NOT field validation errors
  const systemErrorKeys = ['detail', 'message', 'error', 'status', 'code', 'non_field_errors'];
  
  // Check if there are any keys that look like field validation errors
  // (not system error keys, and have string/array values)
  return Object.keys(errorData).some(key => 
    !systemErrorKeys.includes(key) && 
    (Array.isArray(errorData[key]) || typeof errorData[key] === 'string')
  );
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
  parseFieldErrors 
};

export { apiHelpers as default, apiHelpers };
