import { serviceCall } from './config';

const addCredential = (data = {}) =>
  serviceCall({
    method: 'post',
    url: `${process.env.REACT_APP_CREDENTIALS_SERVICE}`,
    data
  });

const deleteCredential = id =>
  serviceCall({
    method: 'delete',
    url: `${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}/`
  });

const getCredentials = (id = '', params = {}) =>
  serviceCall(
    {
      url: `${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}`,
      params
    },
    { auth: false }
  );

const updateCredential = (id, data = {}) =>
  serviceCall({
    method: 'patch',
    url: `${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}/`,
    data
  });

const credentialsService = {
  addCredential,
  deleteCredential,
  getCredentials,
  updateCredential
};

export {
  credentialsService as default,
  credentialsService,
  addCredential,
  deleteCredential,
  getCredentials,
  updateCredential
};
