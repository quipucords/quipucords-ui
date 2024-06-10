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

const apiHelpers = { extractErrorMessage };

export { apiHelpers as default, apiHelpers };
