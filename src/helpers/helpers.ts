/**
 * Offers utilities for error handling, clipboard copying, data download, ID generation, and property setting. Includes
 * helpers for API response processing, IP address validation, authentication type determination, and UI environment settings.
 * @module helpers
 */
import React from 'react';
import moment, { MomentInput } from 'moment';
import { CredentialType } from '../types/types';

/**
 * Generates a translation key for internationalization.
 *
 * @param {string | string[]} key - The translation key(s).
 * @param {string | string[]} value - The translation value(s).
 * @param {React.ReactElement[] | { [tagName: string]: React.ReactElement }} components - React components for the translation.
 * @returns {string} - The translation key.
 */
const noopTranslate = (
  key: string | string[],
  value: string | string[],
  components: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement }
): string => {
  const updatedKey = (Array.isArray(key) && `[${key}]`) || key;
  const updatedValue =
    (typeof value === 'string' && value) ||
    (Array.isArray(value) && `[${value}]`) ||
    (Object.keys(value || '').length && JSON.stringify(value)) ||
    '';
  const updatedComponents = (components && `${components}`) || '';

  return `t(${updatedKey}${(updatedValue && `, ${updatedValue}`) || ''}${
    (updatedComponents && `, ${updatedComponents}`) || ''
  })`;
};

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

/**
 * Calculates and returns a human-readable time difference from a given timestamp.
 *
 * @param {MomentInput} timestamp - The timestamp to calculate the difference from.
 * @param {object} options
 * @param {boolean} options.devMode
 * @returns {string} - A string representing the time difference, e.g., "2 hours ago".
 */
const getTimeDisplayHowLongAgo = (timestamp: MomentInput, { devMode = DEV_MODE } = {}) => {
  if ((!timestamp || !moment.utc(timestamp).isValid()) && !devMode) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }

  return moment.utc(timestamp).utcOffset(moment().utcOffset()).fromNow();
};

/**
 * Formats the given date in UTC as 'DD MMMM Y, h:mm A z'.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const formatDate = (date: Date) => moment.utc(date).format('DD MMMM Y, h:mm A z');

/**
 * Normalizes a total count to a non-negative number less than a given modulus,
 * optionally based on development mode.
 *
 * @param {Object} data - The data object containing a count property.
 * @param {number} [data.count] - The count to be normalized.
 * @param {boolean} [devMode=DEV_MODE] - Flag to normalize count based on development mode.
 * @param {number} [modulus=100] - The modulus to use for normalization. Defaults to 100.
 * @returns {number} - The normalized total count.
 */
const normalizeTotal = (
  data: { count?: number; [key: string]: unknown } | undefined,
  devMode: boolean = DEV_MODE,
  modulus: number = 100
) => {
  let totalResults: number = data?.count || 0;
  if (devMode) {
    totalResults = Math.abs(totalResults) % modulus;
  }
  return totalResults;
};

enum authType {
  UsernameAndPassword = 'Username and Password',
  Token = 'Token',
  SSHKeyFile = 'SSH Key file'
}

/**
 * Determines the authentication type based on a CredentialType object.
 *
 * @param {CredentialType} credential - The CredentialType object representing authentication information.
 * @returns {string} - A string indicating the authentication type, e.g., "Username and Password".
 */
const getAuthType = ({ username, password, auth_token, ssh_keyfile }: CredentialType): authType => {
  if (username && password) {
    return authType.UsernameAndPassword;
  }
  if (auth_token) {
    return authType.Token;
  }
  if (ssh_keyfile) {
    return authType.SSHKeyFile;
  }
  throw new Error('Unknown credential type');
};

/**
 * Downloads the given data as a file with the specified name and type.
 * @param data The data to download.
 * @param fileName The name of the file to download. Defaults to 'download.txt'.
 * @param fileType The type of the file to download. Defaults to 'text/plain'.
 * @returns A promise that resolves with an object containing the downloaded file's name and the original data.
 */
const downloadData = (
  data: string | ArrayBuffer | ArrayBufferView | Blob,
  fileName: string,
  fileType = 'text/plain'
) =>
  new Promise((resolve, reject) => {
    try {
      const { document, navigator, URL } = window;
      const blob = new Blob([data], { type: fileType });

      if (navigator?.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
        resolve({ fileName, data });
      } else {
        const anchorTag = document.createElement('a');

        anchorTag.href = URL.createObjectURL(blob);
        anchorTag.style.display = 'none';
        anchorTag.download = fileName;

        document.body.appendChild(anchorTag);

        anchorTag.click();

        setTimeout(() => {
          URL.revokeObjectURL(anchorTag.href);
          document.body.removeChild(anchorTag);
          resolve({ fileName, data });
        }, 250);
      }
    } catch (error) {
      reject(error);
    }
  });

const PROD_MODE = process.env.REACT_APP_ENV === 'production';

const TEST_MODE = process.env.REACT_APP_ENV === 'test';

const helpers = {
  authType,
  downloadData,
  noopTranslate,
  getAuthType,
  getTimeDisplayHowLongAgo,
  formatDate,
  normalizeTotal,
  DEV_MODE,
  PROD_MODE,
  TEST_MODE
};

export { helpers as default, helpers };
