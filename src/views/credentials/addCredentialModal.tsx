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
  TextInput
} from '@patternfly/react-core';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { type CredentialType } from '../../types/types';

interface AddCredentialModalProps {
  isOpen: boolean;
  credential?: CredentialType;
  credentialType?: string;
  onClose?: () => void;
  onSubmit?: (payload: any) => void;
}

interface CredentialFormType extends Partial<CredentialType> {
  authenticationType?: string;
}

interface CredentialFormFieldsProps {
  formData?: CredentialFormType;
  authType?: string;
  typeValue?: string;
  setAuthType?: (credentialType: string) => void;
  handleInputChange?: (field: string, value: string) => void;
}

const useCredentialForm = (credentialType: string | undefined, credential?: CredentialType) => {
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

  const typeValue = credential?.cred_type || credentialType?.split(' ')?.shift()?.toLowerCase() || '';
  const [authType, setAuthType] = useState('');

  useEffect(() => {
    // this could also be a helper, for testing
    const deriveAuthType = () => {
      switch (typeValue) {
        case 'openshift':
        case 'rhacs':
          return 'Token';
        default:
          return 'Username and Password';
      }
    };

    setAuthType(deriveAuthType());
    setFormData(prev => ({ ...prev, ...credential }));

    return () => {
      setFormData(initialFormState);
    };
  }, [typeValue, credential]);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
    },
    [formData]
  );

  const filterFormData = (data: CredentialFormType) =>
    Object.fromEntries(Object.entries(data).filter(([, value]) => value));

  return {
    formData,
    authType,
    typeValue,
    setAuthType,
    handleInputChange,
    filterFormData
  };
};

const CredentialFormFields: React.FC<CredentialFormFieldsProps> = ({
  formData,
  authType = 'Username and Password',
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
      />
    </FormGroup>

    {/* Render Authentication Type dropdown only if needed based on the credential type */}
    {(typeValue === 'network' || typeValue === 'openshift') && (
      <FormGroup label="Authentication Type" fieldId="auth_type">
        <SimpleDropdown
          label={authType}
          variant="default"
          isFullWidth
          onSelect={item => setAuthType(item)}
          dropdownItems={
            (typeValue === 'network' && ['Username and Password', 'SSH Key']) || ['Token', 'Username and Password']
          }
        />
      </FormGroup>
    )}

    {/* Conditional rendering for Token input */}
    {authType === 'Token' && (
      <FormGroup label="Token" isRequired fieldId="auth_token">
        <TextInput
          value={formData?.auth_token}
          placeholder="Enter Token"
          isRequired
          type="text"
          id="credential-token"
          name="auth_token"
          onChange={event => handleInputChange('auth_token', (event.target as HTMLInputElement).value)}
        />
      </FormGroup>
    )}

    {/* Username and Password fields */}
    {authType === 'Username and Password' && (
      <React.Fragment>
        <FormGroup label="Username" isRequired fieldId="username">
          <TextInput
            value={formData?.username}
            isRequired
            placeholder="Enter username"
            id="credential-username"
            name="username"
            onChange={event => handleInputChange('username', (event.target as HTMLInputElement).value)}
          />
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
          />
        </FormGroup>
        <FormGroup label="Become Method" fieldId="become_method">
          <SimpleDropdown
            label={formData?.become_method || 'Select option'}
            variant="default"
            isFullWidth
            onSelect={item => handleInputChange('become_method', (item !== 'Select option' && item) || '')}
            dropdownItems={['Select option', 'sudo', 'su', 'pbrun', 'pfexec', 'doas', 'dzdo', 'ksu', 'runas']}
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
          />
        </FormGroup>
        <FormGroup label="Become Password" fieldId="become_password">
          <TextInput
            value={formData?.become_password}
            placeholder="Enter become password (optional)"
            type="password"
            id="become_password"
            name="become_password"
            onChange={event => handleInputChange('become_password', (event.target as HTMLInputElement).value)}
          />
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
          />
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
          />
          <FormHelperText>
            Please paste your private SSH key here. This key will be used to authenticate your access to the system.
          </FormHelperText>
        </FormGroup>
        <FormGroup label="SSH passphrase" fieldId="ssh_passphrase">
          <TextInput
            value={formData?.ssh_passphrase}
            placeholder="Enter SSH passphrase (optional)"
            type="password"
            id="ssh_passphrase"
            name="ssh_passphrase"
            onChange={event => handleInputChange('ssh_passphrase', (event.target as HTMLInputElement).value)}
          />
        </FormGroup>
      </React.Fragment>
    )}
  </React.Fragment>
);

const AddCredentialModal: React.FC<AddCredentialModalProps> = ({
  isOpen,
  credential,
  credentialType,
  onClose = Function.prototype,
  onSubmit = Function.prototype
}) => {
  const { formData, authType, typeValue, setAuthType, handleInputChange, filterFormData } = useCredentialForm(
    credentialType,
    credential
  );

  const onAdd = () => {
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
          authType={authType}
          typeValue={typeValue}
          setAuthType={setAuthType}
          handleInputChange={handleInputChange}
        />
        <ActionGroup>
          <Button variant="primary" onClick={onAdd}>
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
