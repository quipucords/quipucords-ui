/**
 * Credential API Hook
 *
 * This hook provides functions for for interacting with credential-related API calls,
 * including adding,editing and deleting credentials and managing selected credentials.
 * @module useCredentialApi
 */
import React from 'react';
import axios from 'axios';
import { CredentialType } from 'src/types';

const useCredentialApi = () => {
  const [pendingDeleteCredential, setPendingDeleteCredential] = React.useState<CredentialType>();
  const [addCredentialModal, setAddCredentialModal] = React.useState<string>();
  const [credentialBeingEdited, setCredentialBeingEdited] = React.useState<CredentialType>();

  /**
   * Executes a POST request to add a credential, optionally triggering a scan.
   *
   * @param {CredentialType} payload - The payload containing information about the credential to be added.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const addCredential = (payload: CredentialType) => {
    return axios.post(`${process.env.REACT_APP_CREDENTIALS_SERVICE}`, payload);
  };

  /**
   * Executes a PUT request to submit edits to a credential.
   *
   * @param {CredentialType} payload - The payload containing information about the credential to be updated.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const submitEditedCredential = (payload: CredentialType) => {
    return axios.put(`${process.env.REACT_APP_CREDENTIALS_SERVICE}${payload.id}/`, payload);
  };

  /**
   * Sets the credential that is being currently edited.
   *
   * @param {CredentialType} credential - The credential to be set as the one being edited.
   */
  const onEditCredential = (credential: CredentialType) => {
    setCredentialBeingEdited(credential);
  };

  /**
   * Executes a DELETE request to delete a credential.
   *
   * @param {CredentialType} [credential] - (Optional) The credential to be deleted. If not provided, it uses `pendingDeleteCredential`.
   * @returns {AxiosResponse} - The Axios response object representing the result of the request.
   */
  const deleteCredential = (credential?: CredentialType) => {
    return axios.delete(
      `${process.env.REACT_APP_CREDENTIALS_SERVICE}${(credential || pendingDeleteCredential)?.id}/`
    );
  };

  /**
   * Deletes several selected credentials based on user interaction.
   * Add your logic to handle the deletion of selected items within this function.
   */
  const onDeleteSelectedCredentials = () => {
    const selectedItems = [];
    console.log('Deleting selected credentials:', selectedItems);
  };

  return {
    addCredentialModal,
    addCredential,
    credentialBeingEdited,
    deleteCredential,
    onDeleteSelectedCredentials,
    onEditCredential,
    pendingDeleteCredential,
    setAddCredentialModal,
    setCredentialBeingEdited,
    setPendingDeleteCredential,
    submitEditedCredential
  };
};

export default useCredentialApi;
