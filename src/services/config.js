import axios from 'axios';
import cookies from 'js-cookie';

/**
 * Set Axios XHR default timeout.
 */
const globalXhrTimeout = Number.parseInt(process.env.REACT_APP_AJAX_TIMEOUT, 10) || 60000;

/**
 * Return a formatted auth header.
 *
 * @returns {{}}
 */
const authHeader = () => {
  const authToken = cookies.get(process.env.REACT_APP_AUTH_TOKEN) || '';

  if (authToken === '') {
    return {};
  }

  return {
    [process.env.REACT_APP_AUTH_HEADER]: (process.env.REACT_APP_AUTH_HEADER_CONTENT || '{0}').replace('{0}', authToken)
  };
};

/**
 * Apply custom service config.
 *
 * @param {object} passedConfig
 * @param {object} options
 * @param {boolean} options.auth
 * @param {number} options.xhrTimeout
 * @returns {{headers: *}}
 */
const serviceConfig = (passedConfig = {}, { auth = true, xhrTimeout = globalXhrTimeout } = {}) => ({
  headers: auth ? authHeader() : {},
  timeout: xhrTimeout,
  ...passedConfig
});

/**
 * Use a global Axios configuration.
 *
 * @param {object} config
 * @param {object} options
 * @returns {Promise<*>}
 */
const serviceCall = async (config, options) => axios(serviceConfig(config, options));

const config = { serviceCall, globalXhrTimeout, serviceConfig, authHeader };

export { config as default, config, authHeader, globalXhrTimeout, serviceCall, serviceConfig };
