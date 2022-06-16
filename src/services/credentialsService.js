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

const deleteCredentials = (data = []) =>
  Promise.all(data.map(id => deleteCredential(id))).then(success => new Promise(resolve => resolve({ data: success })));

const getCredentials = (id = '', params = {}) =>
  serviceCall(
    {
      url: `${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}`,
      params
    },
    { auth: false }
  );

const getCredential = id => getCredentials(id);

const updateCredential = (id, data = {}) =>
  serviceCall({
    method: 'put',
    url: `${process.env.REACT_APP_CREDENTIALS_SERVICE}${id}/`,
    data
  });

const credentialsService = {
  addCredential,
  deleteCredential,
  deleteCredentials,
  getCredential,
  getCredentials,
  updateCredential
};

export {
  credentialsService as default,
  credentialsService,
  addCredential,
  deleteCredential,
  deleteCredentials,
  getCredential,
  getCredentials,
  updateCredential
};
