/**
 * Offers utilities for error handling, clipboard copying, data download, ID generation, and property setting.
 * Includes helpers for API response processing, IP address validation, authentication type determination,
 * and UI environment settings.
 *
 * @module helpers
 */
import React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
import moment, { type MomentInput } from 'moment';
import titleImg from '../images/title.svg';
import titleImgBrand from '../images/titleBrand.svg';
import { type CredentialType } from '../types/types';

/**
 * Is dev mode active.
 * Associated with using the NPM script "start" and "start:stage". See dotenv config files for activation.
 */
const DEV_MODE = process.env.REACT_APP_ENV === 'development';

/**
 * Is prod mode active.
 * Associated with production builds. See dotenv config files for activation.
 */
const PROD_MODE = process.env.REACT_APP_ENV === 'production';

/**
 * Is test mode active.
 * Associated with running unit tests. See dotenv config files for activation.
 */
const TEST_MODE = process.env.REACT_APP_ENV === 'test';

/**
 * Is UI application name active.
 * See dotenv config files for updating. See npm build brand script for applying this value.
 */
const UI_BRAND = process.env.REACT_APP_UI_BRAND === 'true';

/**
 * UI coded name, brand dependent.
 * See dotenv config files for updating.
 */
const UI_NAME = (UI_BRAND && process.env.REACT_APP_UI_BRAND_NAME) || `${process.env.REACT_APP_UI_NAME}`;

/**
 * UI packaged application version, with generated hash.
 * See dotenv config files for updating. See build scripts for generated hash.
 */
const UI_VERSION = process.env.REACT_APP_UI_VERSION;

/**
 * Generates a translation key for internationalization.
 *
 * @param {string | string[]} key - The translation key(s).
 * @param {string | string[]} value - The translation value(s).
 * @param {React.ReactElement[] | { [tagName: string]: React.ReactElement }} components - React components for
 *     the translation.
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
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const formatDate = (date: Date) => moment.utc(date).format('DD MMMM Y, h:mm A z');

/**
 * Normalizes hosts textarea content into array that can be submitted to backend.
 *
 * @param {string} data - host textarea content.
 * @returns Array of host values which will be submitted to backend.
 */
const normalizeHosts = (data?: string) =>
  data
    ?.trim()
    ?.replaceAll(/\\n|\\r|\s/g, ',')
    ?.split(',')
    ?.filter(Boolean);

/**
 * Validates hosts textarea content.
 *
 * @param {string} data - host textarea content.
 * @param {number} maxHosts - maximum number of hosts that the field should allow.
 * @returns ValidatedOptions
 */
const validateHosts = (data: string | undefined, maxHosts: number) => {
  const hostValid = (value: string) => {
    // maximum hostname length is 253 ASCII characters, but we need some extra space for ranges
    if (value.length > 300) {
      return false;
    }

    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?$/;
    const hostRegex = /[a-zA-Z0-9][a-zA-Z0-9-_.]*/;
    const hostNumericRangeRegex = /[a-zA-Z0-9][a-zA-Z0-9-_.]*\[[0-9]+:[0-9]+\]*[a-zA-Z0-9-_.]*/;
    const hostAlphaRangeRegex = /[a-zA-Z0-9][a-zA-Z0-9-_.]*\[[a-zA-Z]{1}:[a-zA-Z]{1}\][a-zA-Z0-9-_.]*/;

    const allRegexes = [ipRegex, hostRegex, hostNumericRangeRegex, hostAlphaRangeRegex];
    return allRegexes.some(re => new RegExp(re).test(value));
  };

  if (data === undefined) {
    return ValidatedOptions.default;
  }

  const normalizedHosts = normalizeHosts(data);

  if (!normalizedHosts!.length) {
    return ValidatedOptions.error;
  }

  if (normalizedHosts!.length > maxHosts) {
    return ValidatedOptions.error;
  }

  if (normalizedHosts!.some(host => !hostValid(host))) {
    return ValidatedOptions.error;
  }

  return ValidatedOptions.default;
};

/**
 * Normalizes a total count to a non-negative number less than a given modulus,
 * optionally based on development mode.
 *
 * @param {object} data - The data object containing a count property.
 * @param {number} [data.count] - The count to be normalized.
 * @param {boolean} [devMode] - Flag to normalize count based on development mode.
 * @param {number} [modulus] - The modulus to use for normalization. Defaults to 100.
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
  SSHKey = 'SSH Key',
  SSHKeyFile = 'SSH Key File',
  Unknown = 'Unknown credential type'
}

/**
 * Determines the authentication type based on a CredentialType object.
 *
 * @param {CredentialType} credential - The CredentialType object representing authentication information.
 * @returns {string} - A string indicating the authentication type, e.g., "Username and Password".
 */
const getAuthType = ({ auth_type }: CredentialType): authType => {
  switch (auth_type) {
    case 'password':
      return authType.UsernameAndPassword;
    case 'auth_token':
      return authType.Token;
    case 'ssh_key':
      return authType.SSHKey;
    case 'ssh_keyfile':
      return authType.SSHKeyFile;
    default:
      return authType.Unknown;
  }
};

/**
 * Downloads the given data as a file with the specified name and type.
 *
 * @param data The data to download.
 * @param fileName The name of the file to download. Defaults to 'download.txt'.
 * @param fileType The type of the file to download. Defaults to 'text/plain'.
 * @returns A promise that resolves with an object containing the downloaded file's name and the original data.
 */
const downloadData = (data: string | ArrayBuffer | ArrayBufferView | Blob, fileName: string, fileType = 'text/plain') =>
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

/**
 * Generate a random ID.
 *
 * @param {string} prefix
 * @returns {string}
 */
const generateId = (prefix = 'generatedid') =>
  `${prefix}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

/**
 * Return a consistent current date
 *
 * @returns {string|Date}
 */
const getCurrentDate = () => (TEST_MODE && moment.utc('20241001').toDate()) || moment.utc().toDate();

/**
 * Return a consistent title image
 *
 * @param {boolean} isBrand
 * @returns {string}
 */
const getTitleImg = (isBrand = UI_BRAND) => ((isBrand && titleImgBrand) || titleImg) as string;

const helpers = {
  authType,
  downloadData,
  noopTranslate,
  generateId,
  getAuthType,
  getCurrentDate,
  getTimeDisplayHowLongAgo,
  getTitleImg,
  formatDate,
  normalizeHosts,
  normalizeTotal,
  validateHosts,
  DEV_MODE,
  PROD_MODE,
  TEST_MODE,
  UI_BRAND,
  UI_NAME,
  UI_VERSION
};

export { helpers as default, helpers };
