import { serviceCall } from './config';

/**
 * ToDo: Prep for accessing the users locale
 * This should be replaced with the appropriate API, cookie, and/or sessionStorage/localStorage access
 */
/**
 * Get the users locale
 *
 * @returns {Promise<any>}
 */
const getLocale = () => {
  const locale = {
    value: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
    key: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC
  };

  return new Promise(resolve => {
    if (locale) {
      return resolve({
        data: locale
      });
    }

    return resolve({});
  });
};

const whoami = () =>
  serviceCall({
    method: 'get',
    url: process.env.REACT_APP_USER_SERVICE_CURRENT
  });

const logoutUser = () =>
  serviceCall({
    method: 'put',
    url: process.env.REACT_APP_USER_SERVICE_LOGOUT
  });

const userService = { getLocale, whoami, logoutUser };

export { userService as default, userService, getLocale, whoami, logoutUser };
