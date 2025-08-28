/**
 * Custom hook for managing credential form state and operations
 * 
 * This hook extracts all form-related logic from viewCredentialsList to make it
 * easily testable and reusable. It handles modal state, form submissions,
 * error management, and API orchestration.
 * 
 * @module useCredentialFormManager
 */
import { useState, useCallback } from 'react';
import { type AlertProps } from '@patternfly/react-core';
import { API_CREDS_LIST_QUERY } from '../../constants/apiConstants';
import { 
  useDeleteCredentialApi,
  useAddCredentialApi,
  useEditCredentialApi
} from '../../hooks/useCredentialApi';
import useQueryClientConfig from '../../queryClientConfig';
import { type CredentialType } from '../../types/types';
import { type CredentialErrorType } from './addCredentialModal';

interface UseCredentialFormManagerProps {
  onAddAlert: (alert: AlertProps) => void;
}

interface CredentialFormState {
  isOpen: boolean;
  onSubmit: (payload: CredentialType) => Promise<void>;
  onClose: () => void;
  errors?: CredentialErrorType;
  onClearErrors: () => void;
}

interface AddCredentialFormState extends CredentialFormState {
  credentialType?: string;
}

interface EditCredentialFormState extends CredentialFormState {
  credential?: CredentialType;
}

export const useCredentialFormManager = ({ onAddAlert }: UseCredentialFormManagerProps) => {
  const { queryClient } = useQueryClientConfig();
  
  // Form state
  const [addCredentialModal, setAddCredentialModal] = useState<string>();
  const [credentialBeingEdited, setCredentialBeingEdited] = useState<CredentialType>();
  const [credentialErrors, setCredentialErrors] = useState<CredentialErrorType | undefined>();
  
  // API hooks
  const { deleteCredentials } = useDeleteCredentialApi(onAddAlert);
  const { addCredentials } = useAddCredentialApi(onAddAlert, setCredentialErrors);
  const { editCredentials } = useEditCredentialApi(onAddAlert, setCredentialErrors);

  /**
   * Invalidates the credentials query to refresh the list
   */
  const refreshCredentialsList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [API_CREDS_LIST_QUERY] });
  }, [queryClient]);

  /**
   * Clears all form validation errors
   */
  const clearCredentialErrors = useCallback(() => {
    setCredentialErrors(undefined);
  }, []);

  /**
   * Opens the add credential modal for a specific credential type
   */
  const openAddCredentialModal = useCallback((credentialType: string) => {
    setAddCredentialModal(credentialType);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Closes the add credential modal
   */
  const closeAddCredentialModal = useCallback(() => {
    setAddCredentialModal(undefined);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Opens the edit credential modal for a specific credential
   */
  const openEditCredentialModal = useCallback((credential: CredentialType) => {
    setCredentialBeingEdited(credential);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Closes the edit credential modal
   */
  const closeEditCredentialModal = useCallback(() => {
    setCredentialBeingEdited(undefined);
    setCredentialErrors(undefined);
  }, []);

  /**
   * Handles adding a new credential
   */
  const handleAddCredentialSubmit = useCallback(async (payload: CredentialType) => {
    try {
      await addCredentials(payload);
      refreshCredentialsList();
      closeAddCredentialModal();
    } catch (error) {
      // Error handling is done in the enhanced API hook
      // Errors are set via setCredentialErrors callback
    }
  }, [addCredentials, refreshCredentialsList, closeAddCredentialModal]);

  /**
   * Handles editing an existing credential
   */
  const handleEditCredentialSubmit = useCallback(async (payload: CredentialType) => {
    try {
      await editCredentials(payload);
      refreshCredentialsList();
      closeEditCredentialModal();
    } catch (error) {
      // Error handling is done in the enhanced API hook
      // Errors are set via setCredentialErrors callback
    }
  }, [editCredentials, refreshCredentialsList, closeEditCredentialModal]);

  /**
   * Handles deleting credentials (single or multiple)
   */
  const handleDeleteCredentials = useCallback(async (credential: CredentialType | CredentialType[]) => {
    try {
      await deleteCredentials(credential);
      refreshCredentialsList();
    } catch (error) {
      // Error handling is done in the deleteCredentials hook
    }
  }, [deleteCredentials, refreshCredentialsList]);

  // Return structured form interfaces
  const addCredentialForm: AddCredentialFormState = {
    isOpen: addCredentialModal !== undefined,
    credentialType: addCredentialModal,
    onSubmit: handleAddCredentialSubmit,
    onClose: closeAddCredentialModal,
    errors: credentialErrors,
    onClearErrors: clearCredentialErrors
  };

  const editCredentialForm: EditCredentialFormState = {
    isOpen: credentialBeingEdited !== undefined,
    credential: credentialBeingEdited,
    onSubmit: handleEditCredentialSubmit,
    onClose: closeEditCredentialModal,
    errors: credentialErrors,
    onClearErrors: clearCredentialErrors
  };

  return {
    addCredentialForm,
    editCredentialForm,
    openAddCredentialModal,
    openEditCredentialModal,
    handleDeleteCredentials,
    refreshCredentialsList,
    addCredentialModal,
    credentialBeingEdited,
    credentialErrors
  };
};
