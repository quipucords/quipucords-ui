/**
 * Add Credential Modal Component
 *
 * @module AddCredentialModal
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ActionGroup, Button, Form, FormGroup, FormHelperText, TextArea, TextInput } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { SimpleDropdown } from '../../components/simpleDropdown/simpleDropdown';
import { helpers } from '../../helpers';
import { type CredentialType } from '../../types/types';

interface AddCredentialModalProps {
  isOpen: boolean;
  credential?: CredentialType;
  credentialType?: string;
  onClose?: () => void;
  onSubmit?: (payload: any) => void;
}

interface CredentialFormProps extends Omit<AddCredentialModalProps, 'isOpen'> {
  useForm?: typeof useCredentialForm;
}

interface CredentialFormType extends Partial<CredentialType> {
  authenticationType?: string;
}

const getCleanedFormData = (
  formData: CredentialFormType,
  authType: string,
  maskedFields: string[] = ['password', 'ssh_key', 'ssh_passphrase', 'become_password', 'auth_token']
) => {
  const cleanedData = { ...formData };

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
  Object.entries(cleanedData).forEach(([key, value]) => {
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
  credential
}: { credentialType?: string; credential?: Partial<CredentialType> } = {}) => {
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
  const typeValue = credential?.cred_type || credentialType?.split(' ')?.shift()?.toLowerCase();
  const [authType, setAuthType] = useState('');

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
    },
    [formData]
  );

  const filterFormData = useCallback(
    () =>
      getCleanedFormData(
        {
          ...formData,
          ...(!credential && { cred_type: typeValue }),
          ...(credential && { id: credential.id })
        },
        authType
      ),
    [authType, formData, credential, typeValue]
  );

  return {
    formData,
    authType,
    typeValue,
    setAuthType,
    handleInputChange,
    filterFormData
  };
};

const CredentialForm: React.FC<CredentialFormProps> = ({
  credential,
  credentialType,
  onClose = () => {},
  onSubmit = () => {},
  useForm = useCredentialForm
}) => {
  const { formData, authType, typeValue, setAuthType, handleInputChange, filterFormData } = useForm({
    credentialType,
    credential
  });
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
          onChange={event => handleInputChange('name', (event.target as HTMLInputElement).value)}
          ouiaId="cred_name"
        />
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
          <TextInput
            value={formData?.auth_token}
            placeholder={credential?.has_auth_token ? '****' : 'Enter Token'}
            isRequired
            type="text"
            id="credential-token"
            name="auth_token"
            onChange={event => handleInputChange('auth_token', (event.target as HTMLInputElement).value)}
            ouiaId="auth_token"
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
              ouiaId="username"
            />
          </FormGroup>
          <FormGroup label="Password" isRequired fieldId="password">
            <TextInput
              value={formData?.password}
              isRequired
              placeholder={credential?.has_password ? '****' : 'Enter password'}
              type="password"
              id="credential-password"
              name="password"
              onChange={event => handleInputChange('password', (event.target as HTMLInputElement).value)}
              ouiaId="password"
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
              ouiaId="username"
            />
          </FormGroup>
          <FormGroup label="SSH Key" isRequired fieldId="ssh_key">
            <TextArea
              value={formData?.ssh_key}
              placeholder={credential?.has_ssh_key ? '****' : 'Enter private SSH Key'}
              isRequired
              id="credential-ssh-key"
              name="ssh_key"
              onChange={event => handleInputChange('ssh_key', event.target.value)}
              rows={10}
              data-ouia-component-id="ssh_key"
            />
            <FormHelperText>
              Please paste your private SSH key here. This key will be used to authenticate your access to the system.
            </FormHelperText>
          </FormGroup>
          <FormGroup label="SSH passphrase" fieldId="ssh_passphrase">
            <TextInput
              value={formData?.ssh_passphrase}
              placeholder={credential?.has_ssh_passphrase ? '****' : 'Enter SSH passphrase (optional)'}
              type="password"
              id="ssh_passphrase"
              name="ssh_passphrase"
              onChange={event => handleInputChange('ssh_passphrase', (event.target as HTMLInputElement).value)}
              ouiaId="ssh_passphrase"
            />
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
            />
          </FormGroup>
          <FormGroup label="Become Password" fieldId="become_password">
            <TextInput
              value={formData?.become_password}
              placeholder={credential?.has_become_password ? '****' : 'Enter become password (optional)'}
              type="password"
              id="become_password"
              name="become_password"
              onFocus={e => {
                if (e.target.value === '****') {
                  handleInputChange('become_password', '');
                }
              }}
              onChange={event => handleInputChange('become_password', (event.target as HTMLInputElement).value)}
              ouiaId="become_password"
            />
          </FormGroup>
        </React.Fragment>
      )}
      <ActionGroup>
        <Button variant="primary" onClick={onAdd}>
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
  onClose = () => {},
  onSubmit = () => {}
}) => (
  <Modal
    variant={ModalVariant.small}
    title={(credential && `Edit credential: ${credential.name || ''}`) || `Add credential: ${credentialType || ''}`}
    isOpen={isOpen}
    onClose={() => onClose()}
  >
    <CredentialForm credential={credential} credentialType={credentialType} onClose={onClose} onSubmit={onSubmit} />
  </Modal>
);

export {
  AddCredentialModal as default,
  AddCredentialModal,
  useCredentialForm,
  CredentialForm,
  getCleanedFormData,
  AddCredentialModalProps
};
