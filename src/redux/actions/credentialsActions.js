import { credentialsTypes } from '../constants';
import { credentialsService } from '../../services';

const addCredential = data => dispatch =>
  dispatch({
    type: credentialsTypes.ADD_CREDENTIAL,
    payload: credentialsService.addCredential(data)
  });

const getCredential = id => dispatch =>
  dispatch({
    type: credentialsTypes.GET_CREDENTIAL,
    payload: credentialsService.getCredential(id)
  });

const getCredentials =
  (query = {}) =>
  dispatch =>
    dispatch({
      type: credentialsTypes.GET_CREDENTIALS,
      payload: credentialsService.getCredentials('', query)
    });

const updateCredential = (id, data) => dispatch =>
  dispatch({
    type: credentialsTypes.UPDATE_CREDENTIAL,
    payload: credentialsService.updateCredential(id, data)
  });

const deleteCredential = id => dispatch =>
  dispatch({
    type: credentialsTypes.DELETE_CREDENTIAL,
    payload: credentialsService.deleteCredential(id)
  });

const deleteCredentials =
  (ids = []) =>
  dispatch =>
    dispatch({
      type: credentialsTypes.DELETE_CREDENTIALS,
      payload: credentialsService.deleteCredentials(ids)
    });

const credentialsActions = {
  addCredential,
  deleteCredential,
  deleteCredentials,
  getCredential,
  getCredentials,
  updateCredential
};

export {
  credentialsActions as default,
  credentialsActions,
  addCredential,
  deleteCredential,
  deleteCredentials,
  getCredential,
  getCredentials,
  updateCredential
};
