/**
 * Custom React hook for handling credential deletion operations.
 *
 * This hook manages the deletion of credentials via an API call and provides feedback to the user through alerts.
 *
 * @param {Function} onAddAlert - Callback function to add an alert to the UI.
 * @returns {Object} An object containing functions:
 *   - `apiDeleteCredentials(ids)`: Function to make the API call for deleting credentials with the given IDs.
 *   - `deleteCredentials(credential)`: Function to handle the entire credential deletion process (API call, response handling, and alerts).
 */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertProps, getUniqueId } from '@patternfly/react-core';
import axios, { AxiosError } from 'axios';
import { CredentialType } from '../types/types';

const useDeleteCredentialApi = (onAddAlert: (alert: AlertProps) => void) => {
  const { t } = useTranslation();

  const apiDeleteCredentials = useCallback((ids: CredentialType['id'][]) => {
    return axios.post(`${process.env.REACT_APP_CREDENTIALS_SERVICE_BULK_DELETE}`, { ids });
  }, []);

  const handleDeleteResponse = useCallback(
    (response, updatedCredentials) => {
      // All credentials were deleted successfully
      if (response.data.skipped.length === 0) {
        const credentialCount = updatedCredentials.length;
        const context = credentialCount === 1 ? 'deleted-credential' : 'deleted-credentials';
        const successMessage = t('toast-notifications.description', {
          context: context,
          name: updatedCredentials.map(({ name }) => name).join(', ')
        });
        onAddAlert({
          title: successMessage,
          variant: 'success',
          id: getUniqueId()
        });
      } else if (response.data.deleted.length > 0) {
        // Some credentials deleted, some skipped
        const deletedNames = response.data.deleted
          .map(id => updatedCredentials.find(cred => cred.id === id)?.name)
          .filter(Boolean);

        const skippedNames = response.data.skipped
          .map(item => updatedCredentials.find(cred => cred.id === item.credential)?.name)
          .filter(Boolean);

        const successMessage = t('toast-notifications.description', {
          context: 'deleted-credentials-skipped-credentials',
          name: deletedNames.join(', '),
          name_error: skippedNames.join(', ')
        });
        onAddAlert({
          title: successMessage,
          variant: 'warning',
          id: getUniqueId()
        });
      } else {
        // No credentials deleted, all skipped
        const skippedNames = response.data.skipped
          .map(item => updatedCredentials.find(cred => cred.id === item.credential)?.name)
          .filter(Boolean);

        const errorMessage = t('toast-notifications.description', {
          context: 'skipped-credentials',
          name: skippedNames.join(', ')
        });
        onAddAlert({
          title: errorMessage,
          variant: 'danger',
          id: getUniqueId()
        });
      }
    },
    [onAddAlert, t]
  );

  const handleDeleteError = useCallback(
    (error: unknown, updatedCredentials: CredentialType[]) => {
      console.error('Error deleting credentials:', error);
      // Type assertion to narrow down error type
      const axiosError = error as AxiosError & {
        response: { data: { detail?: string; message?: string } };
      };
      const errorMessage = t('toast-notifications.description', {
        context: 'deleted-credential_error',
        name: updatedCredentials.map(({ name }) => name).join(', '),
        message:
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Unknown error'
      });
      onAddAlert({ title: errorMessage, variant: 'danger', id: getUniqueId() });
    },
    [onAddAlert, t]
  );

  const deleteCredentials = useCallback(
    async (credential: CredentialType | CredentialType[]) => {
      const updatedCredentials = (Array.isArray(credential) && credential) || [credential];
      try {
        const response = await apiDeleteCredentials(updatedCredentials.map(({ id }) => id));
        handleDeleteResponse(response, updatedCredentials);
      } catch (error) {
        handleDeleteError(error, updatedCredentials);
      }
    },
    [apiDeleteCredentials, handleDeleteResponse, handleDeleteError]
  );

  return {
    apiDeleteCredentials,
    deleteCredentials
  };
};

export { useDeleteCredentialApi as default, useDeleteCredentialApi };
