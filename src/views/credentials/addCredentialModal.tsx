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
  Modal,
  ModalVariant,
  TextArea,
  TextInput,
  HelperText,
  HelperTextItem
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { type CredentialErrorType, type CredentialType } from '../../types/types';

interface AddCredentialModalProps {
  isOpen: boolean;
  credential?: CredentialType;
  credentialType?: string;
  onClose?: () => void;
  onSubmit?: (payload: any) => void;
  errors?: CredentialErrorType;
  setFormErrors?: any;
}

interface CredentialFormType extends Partial<CredentialType> {
  authenticationType?: string;
}

interface CredentialFormFieldsProps {
  formData?: CredentialFormType;
  errors?: CredentialErrorType;
  authType?: string;
  typeValue?: string;
  setAuthType?: (credentialType: string) => void;
  handleInputChange?: (field: string, value: string) => void;
}

const USER_PASS = 'Username and Password';
const TOKEN = 'Token';
const SSH_KEY = 'SSH Key';

const useCredentialForm = (
  credentialType: string | undefined,
  credential?: CredentialType,
  errors?: CredentialErrorType,
  setFormErrors?: any
) => {
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
  const [canSubmit, setCanSubmit] = useState(false);

  const setError = (fieldName: string, errorMessage: string) => {
    setFormErrors({ ...errors, [fieldName]: errorMessage });
  };

  const typeValue = credential?.cred_type || credentialType?.split(' ')?.shift()?.toLowerCase() || '';
  const [authType, _setAuthType] = useState('');

  const setAuthType = (value: string) => {
    _setAuthType(value);
    // Dirty workaround for clearing errors when changing auth type
    // The ideal solution would be cleaning up only errors not relevant after the change
    setFormErrors(Object());
  };

  const getRequiredFields = useCallback(() => {
    switch (authType) {
      case SSH_KEY:
        return ['name', 'username', 'ssh_key'];
      case TOKEN:
        return ['name', 'auth_token'];
      default:
        return ['name', 'username', 'password'];
    }
  }, [authType]);

  useEffect(() => {
    // this could also be a helper, for testing
    const deriveAuthType = () => {
      switch (typeValue) {
        case 'openshift':
        case 'rhacs':
          return TOKEN;
        default:
          return USER_PASS;
      }
    };
    _setAuthType(deriveAuthType());
    setFormData(prev => ({ ...prev, ...credential }));

    return () => {
      setFormData(initialFormState);
    };
  }, [typeValue, credential]);

  useEffect(() => {
    const requiredFieldsFilled = getRequiredFields()
      .map(field => (formData[field] ? true : false))
      .every(v => v === true);
    const noErrors = Object.values(errors || {})
      .map(v => (v ? true : false))
      .every(v => v === false);
    setCanSubmit(requiredFieldsFilled && noErrors);
  }, [formData, authType, errors, getRequiredFields]);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
      if (getRequiredFields().includes(field) && value === '') {
        setError(field, 'This field is required.');
      } else {
        setError(field, '');
      }
    },
    [formData, getRequiredFields]
  );

  const filterFormData = (data: CredentialFormType) =>
    Object.fromEntries(Object.entries(data).filter(([, value]) => value));

  return {
    formData,
    errors,
    authType,
    typeValue,
    canSubmit,
    setAuthType,
    handleInputChange,
    filterFormData,
    setError
  };
};

const CredentialFormFields: React.FC<CredentialFormFieldsProps> = ({
  formData,
  errors,
  authType = USER_PASS,
  typeValue = 'network',
  setAuthType = Function.prototype,
  handleInputChange = Function.prototype
}) => (
  <React.Fragment>
    <FormGroup label="Name" isRequired fieldId="name">
      <TextInput
        value={formData?.name}
        placeholder="Enter a name for the credential"
        isRequired
        type="text"
        id="credential-name"
        name="name"
        onChange={event => handleInputChange('name', (event.target as HTMLInputElement).value)}
        ouiaId="cred_name"
        validated={errors?.name ? 'error' : 'default'}
      />
      {ErrorFragment(errors?.name)}
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
              { item: USER_PASS, ouiaId: 'password' },
              { item: SSH_KEY, ouiaId: 'ssh_key' }
            ]) || [
              { item: TOKEN, ouiaId: 'auth_token' },
              { item: USER_PASS, ouiaId: 'password' }
            ]
          }
        />
      </FormGroup>
    )}

    {/* Conditional rendering for Token input */}
    {authType === TOKEN && (
      <FormGroup label="Token" isRequired fieldId="auth_token">
        <TextInput
          value={formData?.auth_token}
          placeholder="Enter Token"
          isRequired
          type="text"
          id="credential-token"
          name="auth_token"
          onChange={event => handleInputChange('auth_token', (event.target as HTMLInputElement).value)}
          ouiaId="auth_token"
          validated={errors?.auth_token ? 'error' : 'default'}
        />
        {ErrorFragment(errors?.auth_token)}
      </FormGroup>
    )}

    {/* Username and Password fields */}
    {authType === USER_PASS && (
      <React.Fragment>
        <FormGroup label="Username" isRequired fieldId="username">
          <TextInput
            value={formData?.username}
            isRequired
            placeholder="Enter username"
            id="credential-username"
            name="username"
            onChange={event => handleInputChange('username', (event.target as HTMLInputElement).value)}
            ouiaId="username"
            validated={errors?.username ? 'error' : 'default'}
          />
          {ErrorFragment(errors?.username)}
        </FormGroup>
        <FormGroup label="Password" isRequired fieldId="password">
          <TextInput
            value={formData?.password}
            isRequired
            placeholder="Enter password"
            type="password"
            id="credential-password"
            name="password"
            onChange={event => handleInputChange('password', (event.target as HTMLInputElement).value)}
            ouiaId="password"
            validated={errors?.password ? 'error' : 'default'}
          />
          {ErrorFragment(errors?.password)}
        </FormGroup>
      </React.Fragment>
    )}

    {/* SSH Key input */}
    {authType === 'SSH Key' && (
      <React.Fragment>
        <FormGroup label="Username" isRequired fieldId="username">
          <TextInput
            value={formData?.username}
            isRequired
            placeholder="Enter username"
            id="credential-username"
            name="username"
            onChange={event => handleInputChange('username', (event.target as HTMLInputElement).value)}
            ouiaId="username"
            validated={errors?.username ? 'error' : 'default'}
          />
          {ErrorFragment(errors?.username)}
        </FormGroup>
        <FormGroup label="SSH Key" isRequired fieldId="ssh_key">
          <TextArea
            value={formData?.ssh_key}
            placeholder="Enter private SSH Key"
            isRequired
            id="credential-ssh-key"
            name="ssh_key"
            onChange={event => handleInputChange('ssh_key', event.target.value)}
            rows={10}
            data-ouia-component-id="ssh_key"
            validated={errors?.ssh_key ? 'error' : 'default'}
          />
          <FormHelperText>
            Please paste your private SSH key here. This key will be used to authenticate your access to the system.
          </FormHelperText>
          {ErrorFragment(errors?.ssh_key)}
        </FormGroup>
        <FormGroup label="SSH passphrase" fieldId="ssh_passphrase">
          <TextInput
            value={formData?.ssh_passphrase}
            placeholder="Enter SSH passphrase (optional)"
            type="password"
            id="ssh_passphrase"
            name="ssh_passphrase"
            onChange={event => handleInputChange('ssh_passphrase', (event.target as HTMLInputElement).value)}
            ouiaId="ssh_passphrase"
            validated={errors?.ssh_passphrase ? 'error' : 'default'}
          />
          {ErrorFragment(errors?.ssh_passphrase)}
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
            onChange={event => handleInputChange('become_user', (event.target as HTMLInputElement).value)}
            ouiaId="become_user"
            validated={errors?.become_user ? 'error' : 'default'}
          />
          {ErrorFragment(errors?.become_user)}
        </FormGroup>
        <FormGroup label="Become Password" fieldId="become_password">
          <TextInput
            value={formData?.become_password}
            placeholder="Enter become password (optional)"
            type="password"
            id="become_password"
            name="become_password"
            onChange={event => handleInputChange('become_password', (event.target as HTMLInputElement).value)}
            ouiaId="become_password"
            validated={errors?.become_password ? 'error' : 'default'}
          />
          {ErrorFragment(errors?.become_password)}
        </FormGroup>
      </React.Fragment>
    )}
  </React.Fragment>
);

const ErrorFragment = (errorMessage: string | undefined) => {
  if (errorMessage) {
    return (
      <FormHelperText>
        <HelperText>
          <HelperTextItem
            variant={errorMessage ? 'error' : 'default'}
            {...(errorMessage && { icon: <ExclamationCircleIcon /> })}
          >
            {errorMessage}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    );
  } else {
    return null;
  }
};

const AddCredentialModal: React.FC<AddCredentialModalProps> = ({
  isOpen,
  credential,
  credentialType,
  errors,
  setFormErrors,
  onClose = Function.prototype,
  onSubmit = Function.prototype
}) => {
  const { formData, authType, typeValue, canSubmit, setAuthType, handleInputChange, filterFormData } =
    useCredentialForm(credentialType, credential, errors, setFormErrors);
  const onAdd = e => {
    e.preventDefault();
    const payload = {
      ...formData,
      cred_type: typeValue,
      ...(credential && { id: credential.id })
    };
    const filtered_data = filterFormData(payload);
    onSubmit(filtered_data);
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={(credential && 'Edit Credential') || `Add Credential: ${credentialType || ''}`}
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      <Form>
        <CredentialFormFields
          formData={formData}
          errors={errors}
          authType={authType}
          typeValue={typeValue}
          setAuthType={setAuthType}
          handleInputChange={handleInputChange}
        />
        <ActionGroup>
          <Button variant="primary" onClick={onAdd} isDisabled={!canSubmit}>
            Save
          </Button>
          <Button variant="link" onClick={() => onClose()}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
export {
  AddCredentialModal as default,
  AddCredentialModal,
  CredentialFormFields,
  useCredentialForm,
  AddCredentialModalProps
};
