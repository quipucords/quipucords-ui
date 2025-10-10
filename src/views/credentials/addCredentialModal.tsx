/**
 * Add Credential Modal Component
 *
 * @module AddCredentialModal
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormHelperText,
  TextArea,
  TextInput,
  HelperText,
  HelperTextItem
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { SecretInput } from '../../components/secretInput/secretInput';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { helpers } from '../../helpers';
import { type CredentialType } from '../../types/types';

interface AddCredentialModalProps {
  isOpen: boolean;
  credential?: CredentialType;
  credentialType?: string;
  errors?: CredentialErrorType;
  onClose?: () => void;
  onSubmit?: (payload: any) => void;
  onClearErrors?: () => void;
}

interface CredentialFormProps extends Omit<AddCredentialModalProps, 'isOpen'> {
  useForm?: typeof useCredentialForm;
}

interface CredentialFormType extends Partial<CredentialType> {
  authenticationType?: string;
}

interface CredentialErrorType {
  [key: string]: string | undefined;
}

const getCleanedFormData = (
  formData: CredentialFormType,
  authType: string,
  touchedFields: Set<string> = new Set(),
  maskedFields: string[] = ['password', 'ssh_key', 'ssh_passphrase', 'become_password', 'auth_token']
) => {
  const cleanedData = { ...formData };
  const fieldsAllowedToBeEmpty = new Set(['ssh_passphrase', 'become_password']).intersection(touchedFields);

  switch (authType) {
    case 'Token':
      cleanedData.password = '';
      cleanedData.username = '';
      break;
    case 'Username and Password':
      cleanedData.auth_token = '';
      cleanedData.ssh_key = '';
      cleanedData.ssh_passphrase = '';
      break;
    case 'SSH Key':
      cleanedData.password = '';
      break;
  }
  Object.entries(cleanedData)
    .filter(([key, _value]) => !fieldsAllowedToBeEmpty.has(key))
    .forEach(([key, value]) => {
      if (maskedFields.includes(key) && value === '') {
        delete cleanedData[key];
      }
    });

  return cleanedData;
};

const deriveAuthType = (credential?: Partial<CredentialType>, typeValue?: string) => {
  if (credential) {
    return helpers.getAuthType(credential);
  }
  switch (typeValue) {
    case 'openshift':
    case 'rhacs':
      return 'Token';
    default:
      return 'Username and Password';
  }
};

const useCredentialForm = ({
  credentialType,
  credential,
  errors: serverErrors,
  onClearErrors
}: {
  credentialType?: string;
  credential?: Partial<CredentialType>;
  errors?: CredentialErrorType;
  onClearErrors?: () => void;
} = {}) => {
  const initialFormState: CredentialFormType = {
    password: '',
    become_user: '',
    name: '',
    ssh_key: '',
    ssh_passphrase: '',
    become_password: '',
    authenticationType: '',
    auth_token: '',
    become_method: '',
    username: ''
  };

  const [formData, setFormData] = useState<CredentialFormType>(initialFormState);
  const [localErrors, setLocalErrors] = useState<CredentialErrorType>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [canSubmit, setCanSubmit] = useState(false);

  const typeValue = credential?.cred_type || credentialType?.split(' ')?.shift()?.toLowerCase();
  const [authType, setAuthType] = useState('');
  const isEditMode = !!credential;

  // Check if a field has an existing value on the server (for edit mode)
  const hasExistingValue = useCallback(
    (field: string) => {
      if (!isEditMode) {
        return false;
      }

      const existingValueChecks: { [key: string]: boolean } = {
        password: !!credential?.has_password,
        ssh_key: !!credential?.has_ssh_key,
        ssh_passphrase: !!credential?.has_ssh_passphrase,
        become_password: !!credential?.has_become_password,
        auth_token: !!credential?.has_auth_token,
        username: !!credential?.username,
        name: !!credential?.name,
        become_user: !!credential?.become_user,
        become_method: !!credential?.become_method
      };

      return existingValueChecks[field] || false;
    },
    [isEditMode, credential]
  );

  const getRequiredFields = useCallback(() => {
    const baseFields = ['name'];
    switch (authType) {
      case 'Token':
        return [...baseFields, 'auth_token'];
      case 'Username and Password':
        return [...baseFields, 'username', 'password'];
      case 'SSH Key':
        return [...baseFields, 'username', 'ssh_key'];
      default:
        return baseFields;
    }
  }, [authType]);

  const validateField = useCallback(
    (field: string, value: string) => {
      const requiredFields = getRequiredFields();

      if (requiredFields.includes(field) && touchedFields.has(field) && (!value || value.trim() === '')) {
        return 'This field is required';
      }

      return undefined;
    },
    [getRequiredFields, touchedFields]
  );

  const validateForm = useCallback(() => {
    const requiredFields = getRequiredFields();
    const errors: CredentialErrorType = {};

    requiredFields.forEach(field => {
      const fieldValue = formData[field as keyof CredentialFormType] || '';
      const error = validateField(field, String(fieldValue));
      if (error) {
        errors[field] = error;
      }
    });

    setLocalErrors(errors);

    const allValidationErrors = { ...serverErrors, ...errors };

    const hasNoErrors = Object.keys(allValidationErrors).length === 0;
    const allRequiredFieldsValid = requiredFields.every(field => {
      const value = formData[field as keyof CredentialFormType];
      const fieldHasValue = value && String(value).trim() !== '';
      const fieldHasExistingValue = isEditMode && hasExistingValue(field);

      return fieldHasValue || fieldHasExistingValue;
    });

    const isFormValid = hasNoErrors && allRequiredFieldsValid;
    setCanSubmit(isFormValid);
    return isFormValid;
  }, [formData, getRequiredFields, validateField, isEditMode, hasExistingValue, serverErrors]);

  useEffect(() => {
    if (credential) {
      setFormData({
        password: '',
        become_user: credential?.become_user || '',
        name: credential?.name || '',
        ssh_key: '',
        ssh_passphrase: '',
        become_password: '',
        auth_token: '',
        become_method: credential?.become_method || '',
        username: credential?.username || ''
      });
    }

    setAuthType(deriveAuthType(credential, typeValue));
    return () => {
      setFormData(initialFormState);
      setLocalErrors({});
      setTouchedFields(new Set());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate form whenever relevant data changes
  useEffect(() => {
    validateForm();
  }, [formData, authType, touchedFields, serverErrors]);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setTouchedFields(prev => new Set([...prev, field]));

      // Clear server error for this field when user starts typing
      if (serverErrors?.[field] && onClearErrors) {
        onClearErrors();
      }
    },
    [serverErrors, onClearErrors]
  );

  const ensureFieldWasTouched = useCallback((field: string) => {
    setTouchedFields(prev => new Set([...prev, field]));
  }, []);

  const ensureFieldWasNotTouched = useCallback((field: string) => {
    setTouchedFields(prev => new Set([...prev].filter(i => i !== field)));
  }, []);

  const handleAuthTypeChange = useCallback((newAuthType: string) => {
    setAuthType(newAuthType);
    setTouchedFields(new Set(['name']));
    setLocalErrors({});
  }, []);

  const filterFormData = useCallback(
    () =>
      getCleanedFormData(
        {
          ...formData,
          ...(!credential && { cred_type: typeValue }),
          ...(credential && { id: credential.id })
        },
        authType,
        touchedFields
      ),
    [authType, formData, credential, typeValue, touchedFields]
  );

  return {
    formData,
    authType,
    typeValue,
    errors: { ...serverErrors, ...localErrors },
    touchedFields,
    canSubmit,
    isEditMode,
    hasExistingValue,
    setAuthType: handleAuthTypeChange,
    handleInputChange,
    ensureFieldWasTouched,
    ensureFieldWasNotTouched,
    filterFormData
  };
};

const ErrorFragment: React.FC<{
  errorMessage: string | undefined;
  fieldTouched?: boolean;
}> = ({ errorMessage, fieldTouched = true }) => {
  if (errorMessage && fieldTouched) {
    return (
      <FormHelperText>
        <HelperText>
          <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
            {errorMessage}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    );
  }

  return null;
};

const CredentialForm: React.FC<CredentialFormProps> = ({
  credential,
  credentialType,
  errors: serverErrors,
  onClose = () => {},
  onSubmit = () => {},
  onClearErrors = () => {},
  useForm = useCredentialForm
}) => {
  const {
    formData,
    authType,
    typeValue,
    errors,
    touchedFields = new Set<string>(),
    canSubmit,
    isEditMode,
    hasExistingValue,
    setAuthType,
    handleInputChange,
    ensureFieldWasTouched,
    ensureFieldWasNotTouched,
    filterFormData
  } = useForm({
    credentialType,
    credential,
    errors: serverErrors,
    onClearErrors
  });

  const scrollToFirstError = useCallback(() => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const element =
        document.getElementById(`credential-${firstErrorField}`) ||
        document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        element.focus();
      }
    }
  }, [errors]);

  // Watch for server errors and scroll to first error
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      scrollToFirstError();
    }
  }, [serverErrors, scrollToFirstError]);

  const onAdd = () => onSubmit(filterFormData());

  return (
    <Form>
      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput
          value={formData?.name}
          placeholder="Enter a name for the credential"
          isRequired
          type="text"
          id="credential-name"
          name="name"
          validated={errors?.name ? 'error' : 'default'}
          onChange={event => handleInputChange('name', (event.target as HTMLInputElement).value)}
          ouiaId="cred_name"
        />
        <ErrorFragment errorMessage={errors?.name} fieldTouched={touchedFields.has('name')} />
      </FormGroup>

      {/* Render Authentication Type dropdown only if needed based on the credential type */}
      {(typeValue === 'network' || typeValue === 'openshift') && (
        <FormGroup label="Authentication Type" fieldId="auth_type">
          <SimpleDropdown
            label={authType}
            menuToggleOuiaId="auth_type"
            variant="default"
            isFullWidth
            onSelect={item => setAuthType(item)}
            dropdownItems={
              (typeValue === 'network' && [
                { item: 'Username and Password', ouiaId: 'password' },
                { item: 'SSH Key', ouiaId: 'ssh_key' }
              ]) || [
                { item: 'Token', ouiaId: 'auth_token' },
                { item: 'Username and Password', ouiaId: 'password' }
              ]
            }
          />
        </FormGroup>
      )}

      {/* Conditional rendering for Token input */}
      {authType === 'Token' && (
        <FormGroup label="Token" isRequired fieldId="auth_token">
          <SecretInput
            value={formData?.auth_token}
            placeholder="Enter Token"
            isRequired={!isEditMode || touchedFields.has('auth_token') || !hasExistingValue('auth_token')}
            id="credential-token"
            name="auth_token"
            validated={errors?.auth_token ? 'error' : 'default'}
            onChange={event => handleInputChange('auth_token', (event.target as HTMLInputElement).value)}
            onEditBegin={() => ensureFieldWasTouched('auth_token')}
            onUndo={() => {
              handleInputChange('auth_token', '');
              ensureFieldWasNotTouched('auth_token');
            }}
            hasSecret={credential?.has_auth_token}
            ouiaId="auth_token"
          />
          <ErrorFragment errorMessage={errors?.auth_token} fieldTouched={touchedFields.has('auth_token')} />
        </FormGroup>
      )}

      {/* Username and Password fields */}
      {authType === 'Username and Password' && (
        <React.Fragment>
          <FormGroup label="Username" isRequired fieldId="username">
            <TextInput
              value={formData?.username}
              isRequired={!isEditMode || touchedFields.has('username') || !hasExistingValue('username')}
              placeholder="Enter username"
              id="credential-username"
              name="username"
              validated={errors?.username ? 'error' : 'default'}
              onChange={event => handleInputChange('username', (event.target as HTMLInputElement).value)}
              ouiaId="username"
            />
            <ErrorFragment errorMessage={errors?.username} fieldTouched={touchedFields.has('username')} />
          </FormGroup>
          <FormGroup label="Password" isRequired fieldId="password">
            <SecretInput
              value={formData?.password}
              isRequired={!isEditMode || touchedFields.has('password') || !hasExistingValue('password')}
              placeholder="Enter password"
              id="credential-password"
              name="password"
              validated={errors?.password ? 'error' : 'default'}
              onChange={event => handleInputChange('password', (event.target as HTMLInputElement).value)}
              onEditBegin={() => ensureFieldWasTouched('password')}
              onUndo={() => {
                handleInputChange('password', '');
                ensureFieldWasNotTouched('password');
              }}
              hasSecret={credential?.has_password}
              ouiaId="password"
            />
            <ErrorFragment errorMessage={errors?.password} fieldTouched={touchedFields.has('password')} />
          </FormGroup>
        </React.Fragment>
      )}

      {/* SSH Key input */}
      {authType === 'SSH Key' && (
        <React.Fragment>
          <FormGroup label="Username" isRequired fieldId="username">
            <TextInput
              value={formData?.username}
              isRequired={!isEditMode || touchedFields.has('username') || !hasExistingValue('username')}
              placeholder="Enter username"
              id="credential-username"
              name="username"
              validated={errors?.username ? 'error' : 'default'}
              onChange={event => handleInputChange('username', (event.target as HTMLInputElement).value)}
              ouiaId="username"
            />
            <ErrorFragment errorMessage={errors?.username} fieldTouched={touchedFields.has('username')} />
          </FormGroup>
          <FormGroup label="SSH Key" isRequired fieldId="ssh_key">
            <TextArea
              value={formData?.ssh_key}
              placeholder={credential?.has_ssh_key ? '****' : 'Enter private SSH Key'}
              isRequired={!isEditMode || touchedFields.has('ssh_key') || !hasExistingValue('ssh_key')}
              id="credential-ssh-key"
              name="ssh_key"
              validated={errors?.ssh_key ? 'error' : 'default'}
              onChange={event => handleInputChange('ssh_key', event.target.value)}
              rows={10}
              data-ouia-component-id="ssh_key"
            />
            <ErrorFragment errorMessage={errors?.ssh_key} fieldTouched={touchedFields.has('ssh_key')} />
          </FormGroup>
          <FormGroup label="SSH passphrase" fieldId="ssh_passphrase">
            <SecretInput
              value={formData?.ssh_passphrase}
              placeholder="Enter SSH passphrase (optional)"
              id="ssh_passphrase"
              name="ssh_passphrase"
              validated={errors?.ssh_passphrase ? 'error' : 'default'}
              ouiaId="ssh_passphrase"
              onChange={event => handleInputChange('ssh_passphrase', (event.target as HTMLInputElement).value)}
              onEditBegin={() => ensureFieldWasTouched('ssh_passphrase')}
              onUndo={() => {
                handleInputChange('ssh_passphrase', '');
                ensureFieldWasNotTouched('ssh_passphrase');
              }}
              hasSecret={credential?.has_ssh_passphrase}
            />
            <ErrorFragment errorMessage={errors?.ssh_passphrase} fieldTouched={touchedFields.has('ssh_passphrase')} />
          </FormGroup>
        </React.Fragment>
      )}

      {/* Render "Become" fields only if network is selected and authType is Username/Password or SSH Key */}
      {typeValue === 'network' && (
        <React.Fragment>
          <FormGroup label="Become Method" fieldId="become_method">
            <SimpleDropdown
              label={formData?.become_method || 'Select option'}
              menuToggleOuiaId="become_method"
              variant="default"
              isFullWidth
              onSelect={item => handleInputChange('become_method', (item !== 'Select option' && item) || '')}
              dropdownItems={[
                { item: 'Select option', ouiaId: 'default' },
                { item: 'sudo', ouiaId: 'sudo' },
                { item: 'su', ouiaId: 'su' },
                { item: 'pbrun', ouiaId: 'pbrun' },
                { item: 'pfexec', ouiaId: 'pfexec' },
                { item: 'doas', ouiaId: 'doas' },
                { item: 'dzdo', ouiaId: 'dzdo' },
                { item: 'ksu', ouiaId: 'ksu' },
                { item: 'runas', ouiaId: 'runas' }
              ]}
            />
          </FormGroup>
          <FormGroup label="Become User" fieldId="become_user">
            <TextInput
              value={formData?.become_user}
              placeholder="Enter become user (optional)"
              type="text"
              id="become_user"
              name="become_user"
              validated={errors?.become_user ? 'error' : 'default'}
              onChange={event => handleInputChange('become_user', (event.target as HTMLInputElement).value)}
              ouiaId="become_user"
            />
            <ErrorFragment errorMessage={errors?.become_user} fieldTouched={touchedFields.has('become_user')} />
          </FormGroup>
          <FormGroup label="Become Password" fieldId="become_password">
            <SecretInput
              value={formData?.become_password}
              placeholder="Enter become password (optional)"
              id="become_password"
              name="become_password"
              validated={errors?.become_password ? 'error' : 'default'}
              onChange={event => handleInputChange('become_password', (event.target as HTMLInputElement).value)}
              onEditBegin={() => ensureFieldWasTouched('become_password')}
              onUndo={() => {
                handleInputChange('become_password', '');
                ensureFieldWasNotTouched('become_password');
              }}
              hasSecret={credential?.has_become_password}
              ouiaId="become_password"
            />
            <ErrorFragment errorMessage={errors?.become_password} fieldTouched={touchedFields.has('become_password')} />
          </FormGroup>
        </React.Fragment>
      )}
      <ActionGroup>
        <Button variant="primary" onClick={onAdd} isDisabled={!canSubmit}>
          Save
        </Button>
        <Button variant="link" onClick={() => onClose()}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

const AddCredentialModal: React.FC<AddCredentialModalProps> = ({
  isOpen,
  credential,
  credentialType,
  errors,
  onClose = () => {},
  onSubmit = () => {},
  onClearErrors = () => {}
}) => (
  <Modal
    variant={ModalVariant.small}
    title={(credential && `Edit credential: ${credential.name || ''}`) || `Add credential: ${credentialType || ''}`}
    isOpen={isOpen}
    onClose={() => onClose()}
  >
    <CredentialForm
      credential={credential}
      credentialType={credentialType}
      errors={errors}
      onClose={onClose}
      onSubmit={onSubmit}
      onClearErrors={onClearErrors}
    />
  </Modal>
);

export {
  AddCredentialModal as default,
  AddCredentialModal,
  useCredentialForm,
  CredentialForm,
  getCleanedFormData,
  AddCredentialModalProps,
  CredentialErrorType
};
