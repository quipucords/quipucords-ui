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
    deleteCredential,
    onDeleteSelectedCredentials,
    pendingDeleteCredential,
    setPendingDeleteCredential
  };
};

export default useCredentialApi;
