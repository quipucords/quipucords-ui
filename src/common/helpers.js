import moment from 'moment';
import _get from 'lodash/get';
import _set from 'lodash/set';

/**
 * Fill for AggregatedError
 *
 * @param {Array|*} errors An array of errors
 * @param {string|*} message
 * @param {object} options
 * @param {string} options.name
 * @returns {Error|window.AggregateError<Error>}
 */
const aggregatedError = (errors, message, { name = 'AggregateError' } = {}) => {
  const { AggregateError, Error } = window;
  let err;

  if (AggregateError) {
    err = new AggregateError(errors, message);
  } else {
    err = new Error(message);
    err.name = name;
    err.errors = (Array.isArray(errors) && errors) || [errors];
    err.isEmulated = true;
  }
  return err;
};

/**
 * Copy value into "clipboard"
 *
 * @param {string|*} text
 * @returns {boolean}
 */
const copyClipboard = text => {
  let successful;

  try {
    window.getSelection().removeAllRanges();

    const newTextarea = window.document.createElement('pre');
    newTextarea.appendChild(window.document.createTextNode(text));

    newTextarea.style.position = 'absolute';
    newTextarea.style.top = '-9999px';
    newTextarea.style.left = '-9999px';

    const range = window.document.createRange();
    window.document.body.appendChild(newTextarea);

    range.selectNode(newTextarea);

    window.getSelection().addRange(range);

    successful = window.document.execCommand('copy');

    window.document.body.removeChild(newTextarea);
    window.getSelection().removeAllRanges();
  } catch (e) {
    successful = null;

    if (process.env.REACT_APP_ENV !== 'test') {
      console.warn('Copy to clipboard failed.', e.message);
    }
  }

  return successful;
};

/**
 * Apply more realistic values numerical values when using the generated data in dev mode.
 *
 * @param {number} count
 * @param {number} modulus
 * @returns {number}
 */
const devModeNormalizeCount = (count, modulus = 100) => Math.abs(count) % modulus;

/**
 * Allow data to be downloaded.
 *
 * @param {string|*} data
 * @param {string} fileName
 * @param {string} fileType
 * @returns {Promise<unknown>}
 */
const downloadData = (data = '', fileName = 'download.txt', fileType = 'text/plain') =>
  new Promise((resolve, reject) => {
    try {
      const blob = new Blob([data], { type: fileType });

      if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName);
        resolve({ fileName, data });
      } else {
        const anchorTag = window.document.createElement('a');

        anchorTag.href = window.URL.createObjectURL(blob);
        anchorTag.style.display = 'none';
        anchorTag.download = fileName;

        window.document.body.appendChild(anchorTag);

        anchorTag.click();

        setTimeout(() => {
          window.document.body.removeChild(anchorTag);
          window.URL.revokeObjectURL(blob);
          resolve({ fileName, data });
        }, 250);
      }
    } catch (error) {
      reject(error);
    }
  });

/**
 * Generate a random'ish ID.
 *
 * @param {string} prefix
 * @returns {string}
 */
const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

/**
 * An empty function.
 * Typically used as a default prop.
 */
const noop = Function.prototype;

/**
 * An empty promise.
 * Typically used as a default prop, or during testing.
 *
 * @type {Promise<{}>}
 */
const noopPromise = Promise.resolve({});

/**
 * A placeholder for "t", or any translation method.
 * Associated with the i18n package, and typically used as a default prop.
 *
 * @param {string|Array} key
 * @param {string|object|Array} value
 * @param {Array} components
 * @returns {string}
 */
const noopTranslate = (key, value, components) => {
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
 * Return an icon for source type.
 *
 * @param {string} sourceType
 * @returns {{name: string, type: string}}
 */
const sourceTypeIcon = sourceType => {
  switch (sourceType) {
    case 'vcenter':
      return { type: 'pf', name: 'vcenter' };
    case 'network':
      return { type: 'pf', name: 'network-range' };
    case 'satellite':
      return { type: 'pf', name: 'satellite' };
    default:
      return { type: 'pf', name: '' };
  }
};

/**
 * Return an icon for scanning type.
 *
 * @param {string} scanType
 * @returns {{name: string, type: string}}
 */
const scanTypeIcon = scanType => {
  switch (scanType) {
    case 'connect':
      return { type: 'pf', name: 'connected' };
    case 'inspect':
      return { type: 'fa', name: 'search' };
    default:
      return { type: 'pf', name: '' };
  }
};

/**
 * Return an icon for scanning status.
 *
 * @param {string} scanStatus
 * @returns {{name: string, classNames: *[], type: string}|{name: string, classNames: string[], type: string}}
 */
const scanStatusIcon = scanStatus => {
  switch (scanStatus) {
    case 'completed':
    case 'success':
      return { type: 'pf', name: 'ok', classNames: [] };
    case 'failed':
    case 'canceled':
      return { type: 'pf', name: 'error-circle-o', classNames: [] };
    case 'unreachable':
      return { type: 'pf', name: 'disconnected', classNames: ['is-error'] };
    case 'created':
    case 'pending':
    case 'running':
      return { type: 'fa', name: 'spinner', classNames: ['fa-spin'] };
    case 'paused':
      return { type: 'pf', name: 'warning-triangle-o', classNames: [] };
    default:
      console.error(`Unknown status: ${scanStatus}`);
      return { type: 'pf', name: 'unknown', classNames: [] };
  }
};

/**
 * Set a property if the value is NOT undefined using lodash "set".
 *
 * @param {object} obj
 * @param {Array|*} props
 * @param {*} value
 * @returns {*}
 */
const setPropIfDefined = (obj, props, value) => (obj && value !== undefined ? _set(obj, props, value) : obj);

/**
 * Set a property if it equates to "truthy" using lodash "set".
 *
 * @param {object} obj
 * @param {Array|*} props
 * @param {*} value
 * @returns {*}
 */
const setPropIfTruthy = (obj, props, value) => (obj && value ? _set(obj, props, value) : obj);

/**
 * View lifecycle method helper to determine if props have changed.
 *
 * @param {object} nextViewOptions
 * @param {object} currentViewOptions
 * @returns {boolean}
 */
const viewPropsChanged = (nextViewOptions, currentViewOptions) =>
  nextViewOptions.currentPage !== currentViewOptions.currentPage ||
  nextViewOptions.pageSize !== currentViewOptions.pageSize ||
  nextViewOptions.sortField !== currentViewOptions.sortField ||
  nextViewOptions.sortAscending !== currentViewOptions.sortAscending ||
  nextViewOptions.activeFilters !== currentViewOptions.activeFilters;

/**
 * Generate a consistent query parameter object for views.
 *
 * @param {object} viewOptions
 * @param {object} queryObj
 * @returns {object}
 */
const createViewQueryObject = (viewOptions, queryObj) => {
  const queryObject = {
    ...queryObj
  };

  if (viewOptions) {
    if (viewOptions.sortField) {
      queryObject.ordering = viewOptions.sortAscending ? viewOptions.sortField : `-${viewOptions.sortField}`;
    }

    if (viewOptions.activeFilters) {
      viewOptions.activeFilters.forEach(filter => {
        queryObject[filter.field.id] = filter.field.filterType === 'select' ? filter.value.id : filter.value;
      });
    }

    queryObject.page = viewOptions.currentPage;
    queryObject.page_size = viewOptions.pageSize;
  }

  return queryObject;
};

/**
 * A redux helper associated with getting a message from results.
 *
 * @param {object} results
 * @param {*} filter
 * @returns {{messages: {}, message: null, url, status: number}}
 */
const getMessageFromResults = (results, filter = null) => {
  const status = _get(results, 'response.status', results.status);
  const statusResponse = _get(results, 'response.statusText', results.statusText);
  const messageResponse = _get(results, 'response.data', results.message);
  const detailResponse = _get(results, 'response.data', results.detail);
  const requestUrl = _get(results, 'config.url', null);

  const messages = {
    messages: {},
    message: null,
    status: status || 0,
    url: requestUrl
  };

  const displayStatus = status >= 500 ? `${status} ` : '';

  if (!messageResponse && !detailResponse) {
    if (status < 400) {
      messages.message = statusResponse;
      return messages;
    }

    if (status >= 500 || status === undefined) {
      messages.message = `${status || ''} Server is currently unable to handle this request.`;
      return messages;
    }
  }

  if (status >= 500 && /Request\sURL:/.test(messageResponse)) {
    messages.message = `${status} ${messageResponse.split(/Request\sURL:/)[0]}`;
    return messages;
  }

  if (status === 404) {
    messages.message = `404 Not Found`;
    return messages;
  }

  if (typeof messageResponse === 'string') {
    messages.message = `${displayStatus}${messageResponse}`;
    return messages;
  }

  if (typeof detailResponse === 'string') {
    messages.message = `${displayStatus}${detailResponse}`;
    return messages;
  }

  const getMessages = messageObjectArrayString => {
    const parsed = {};

    if (messageObjectArrayString && typeof messageObjectArrayString === 'string') {
      return messageObjectArrayString.replace(/\[object\sObject]/g, '');
    }

    if (Array.isArray(messageObjectArrayString)) {
      return getMessages(messageObjectArrayString.join('\n'));
    }

    Object.keys(messageObjectArrayString).forEach(key => {
      parsed[key] = getMessages(messageObjectArrayString[key]);
    });

    return parsed;
  };

  const filtered = (messageObjectArrayString, filterField) => {
    const parsed = {};
    const str = JSON.stringify(messageObjectArrayString);
    const filterFields = (Array.isArray(filterField) && filterField) || (filterField && [filterField]) || [];

    filterFields.forEach(val => {
      const match = str.match(new RegExp(`"${val}":(\\[(.*?)]]?|{(.*?)}]?|"(.*?)"),?`));

      if (match && match[1]) {
        parsed[val] = match[1]; // eslint-disable-line

        if (match && match[2]) {
          parsed[val] = JSON.parse(match[1]);

          if (Array.isArray(parsed[val])) {
            parsed[val] = parsed[val].join(', ');
          } else if (typeof parsed[val] !== 'string') {
            parsed[val] = Object.values(parsed[val]).join(', ');
          }

          parsed[val] = parsed[val].replace(/,?\s?\[object\sObject]/, '');
        }
      }
    });

    return parsed;
  };

  messages.messages =
    (filter && filtered(messageResponse || detailResponse, filter)) || getMessages(messageResponse || detailResponse);
  messages.message = `${displayStatus}${Object.values(messages.messages).join('\n')}`;

  if (messages.message === '[object Object]') {
    messages.message = JSON.stringify(messages.messages);
  } else {
    messages.message = messages.message.replace(/\n?\[object\sObject]/g, '');
  }

  return messages;
};

/**
 * A redux helper associated with returning a http status from results.
 *
 * @param {object} results
 * @returns {number}
 */
const getStatusFromResults = results => {
  let status = _get(results, 'response.status', results.status);

  if (status === undefined) {
    status = 0;
  }

  return status;
};

/**
 * Return a callback for determining a timestamp.
 *
 * @returns {Function}
 */
const getTimeStampFromResults =
  process.env.REACT_APP_ENV !== 'test'
    ? results => moment(_get(results, 'headers.date', Date.now())).format('YYYYMMDD_HHmmss')
    : () => '20190225_164640';

/**
 * Return a callback for determine time offset.
 *
 * @returns {Function}
 */
const getTimeDisplayHowLongAgo =
  process.env.REACT_APP_ENV !== 'test'
    ? timestamp => moment.utc(timestamp).utcOffset(moment().utcOffset()).fromNow()
    : () => 'a day ago';

/**
 * Is this an IP address.
 *
 * @param {string} name
 * @returns {boolean}
 */
const isIpAddress = name => {
  const vals = name.split('.');
  if (vals.length === 4) {
    return vals.find(val => Number.isNaN(val)) === undefined;
  }
  return false;
};

/**
 * Return an IP address value.
 *
 * @param {string} name
 * @returns {*}
 */
const ipAddressValue = name => {
  const values = name.split('.');
  return values[0] * 0x1000000 + values[1] * 0x10000 + values[2] * 0x100 + values[3] * 1;
};

/**
 * Is dev mode active.
 * Associated with using the NPM script "start". See dotenv config files for activation.
 *
 * @type {boolean}
 */
const DEV_MODE = process.env.REACT_APP_ENV === 'development';

/**
 * Is prod mode active.
 * Associated with production builds. See dotenv config files for activation.
 *
 * @type {boolean}
 */
const PROD_MODE = process.env.REACT_APP_ENV === 'production';

/**
 * Is test mode active.
 * Associated with running unit tests. See dotenv config files for activation.
 *
 * @type {boolean}
 */
const TEST_MODE = process.env.REACT_APP_ENV === 'test';

/**
 * Is UI application name active.
 * See dotenv config files for updating. See build scripts for how this value is being applied.
 *
 * @type {boolean}
 */
const UI_BRAND = process.env.REACT_APP_UI_BRAND === 'true';

/**
 * UI coded name, brand dependent.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_NAME = UI_BRAND === true ? process.env.REACT_APP_UI_BRAND_NAME : process.env.REACT_APP_UI_NAME;

/**
 * UI cased sentence start name.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_SENTENCE_START_NAME =
  UI_BRAND === true ? process.env.REACT_APP_UI_BRAND_SENTENCE_START_NAME : process.env.REACT_APP_UI_SENTENCE_START_NAME;

/**
 * UI short name.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_SHORT_NAME =
  UI_BRAND === true ? process.env.REACT_APP_UI_BRAND_SHORT_NAME : process.env.REACT_APP_UI_SHORT_NAME;

/**
 * UI packaged application version, with generated hash.
 * See dotenv config files for updating. See build scripts for generated hash.
 *
 * @type {string}
 */
const UI_VERSION = process.env.REACT_APP_UI_VERSION;

/**
 * Return a consistent current date.
 *
 * @returns {string|Date}
 */
const getCurrentDate = () => (TEST_MODE && moment.utc('20220601').toDate()) || moment.utc().toDate();

const helpers = {
  aggregatedError,
  copyClipboard,
  devModeNormalizeCount,
  downloadData,
  generateId,
  noop,
  noopPromise,
  noopTranslate,
  sourceTypeIcon,
  scanTypeIcon,
  scanStatusIcon,
  setPropIfDefined,
  setPropIfTruthy,
  viewPropsChanged,
  createViewQueryObject,
  getMessageFromResults,
  getStatusFromResults,
  getTimeStampFromResults,
  getTimeDisplayHowLongAgo,
  isIpAddress,
  ipAddressValue,
  DEV_MODE,
  PROD_MODE,
  TEST_MODE,
  UI_BRAND,
  UI_NAME,
  UI_SENTENCE_START_NAME,
  UI_SHORT_NAME,
  UI_VERSION,
  getCurrentDate
};

export { helpers as default, helpers };
