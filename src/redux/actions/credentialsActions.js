import { credentialsTypes } from '../constants';
import { credentialsService } from '../../services';

const addCredential = data => dispatch =>
  dispatch({
    type: credentialsTypes.ADD_CREDENTIAL,
    payload: credentialsService.addCredential(data)
  });

const getCredentials =
  (id, query = {}) =>
  dispatch =>
    dispatch({
      type: credentialsTypes.GET_CREDENTIALS,
      payload: credentialsService.getCredentials(id || '', query)
    });

const updateCredential = (id, data) => dispatch =>
  dispatch({
    type: credentialsTypes.UPDATE_CREDENTIAL,
    payload: credentialsService.updateCredential(id, data)
  });

const deleteCredential = id => dispatch => {
  const updatedIds = (Array.isArray(id) && id) || [id];

  return dispatch({
    type: credentialsTypes.DELETE_CREDENTIAL,
    payload: Promise.all(updatedIds.map(updatedId => credentialsService.deleteCredential(updatedId)))
  });
};

const credentialsActions = {
  addCredential,
  deleteCredential,
  getCredentials,
  updateCredential
};

export {
  credentialsActions as default,
  credentialsActions,
  addCredential,
  deleteCredential,
  getCredentials,
  updateCredential
};
