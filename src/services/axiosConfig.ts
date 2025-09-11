// src/services/axiosConfig.ts

import axios from 'axios';
import cookies from 'js-cookie';
import helpers from '../helpers';

/**
 * This helper function should live here, outside of any hook.
 */
const getDecodedToken = (): string => {
  const token = cookies.get(`${process.env.REACT_APP_AUTH_COOKIE}`) || '';
  try {
    return window.atob(token);
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.error('Invalid token, unable to parse format');
    }
    return '';
  }
};

// --- REQUEST INTERCEPTOR ---
// This runs BEFORE every API request.
axios.interceptors.request.use(config => {
  const token = getDecodedToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// --- RESPONSE INTERCEPTOR ---
// This runs on every API response.
axios.interceptors.response.use(
  response => response, // Do nothing on a successful response
  error => {
    // On a 401 error, remove the cookie and force a reload to the login page.
    if (error?.response?.status === 401) {
      cookies.remove(`${process.env.REACT_APP_AUTH_COOKIE}`);
      document.location.replace('./');
    }
    return Promise.reject(error);
  }
);

/**
 * We export a function that can be used to check the initial auth state,
 * but the interceptors are already active just by importing this file.
 */
export const hasInitialAuthToken = (): boolean => {
  return !!getDecodedToken();
};
