/**
 * Add Credential Modal Component
 *
 * * This component displays a modal for adding or editing a credential of a specific type. It provides
 * a form to input credential details including name, username and authentication details.
 * @module AddCredentialModal
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionGroup,
  Button,
  DropdownItem,
  Form,
  FormContextProvider,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput
} from '@patternfly/react-core';
import helpers from 'src/common/helpers';
import { SimpleDropdown } from 'src/components/SimpleDropdown';
import { CredentialType } from 'src/types';

export interface AddCredentialModalProps {
  credential?: CredentialType;
  type: string;
  onClose: () => void;
  onSubmit: (payload) => void;
}

const AddCredentialModal: React.FC<AddCredentialModalProps> = ({
  credential,
  type,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation();
  const typeValue = credential?.cred_type || type.split(' ').shift()?.toLowerCase();
  const [authType, setAuthType] = React.useState('');
  const [becomeMethod, setBecomeMethod] = React.useState<string>('');
  const { deriveAuthType } = helpers;

  /**
   * Set Authentication Type Effect
   *
   * This effect sets the authentication type based on the derived type value and credential.
   *
   * @param {string} typeValue - The type value used to derive the authentication type.
   * @param {string} credential - The credential used to derive the authentication type.
   */
  React.useEffect(() => {
    setAuthType(deriveAuthType(typeValue));
  }, [typeValue, credential]);

  /**
   * Handle Add Action
   *
   * This function is responsible for handling the "Add" action, which includes creating a payload
   * with the provided values and submitting it.
   *
   * @param {object} values - An object containing the input values for the new item.
   */
  const onAdd = values => {
    const payload = {
      name: values['name'],
      username: values['username'],
      password: values['password'],
      auth_token: values['auth_token'],
      sshKey: values['ssh_key'],
      becomeMethod: values['become_method'],
      becomePassword: ['become_password'],
      becomeUser: values['become_user'],
      ...(!credential && { cred_type: typeValue }),
      ...(credential && { id: credential.id })
    };
    onSubmit(payload);
  };

  function generateTitle(credential, type, translateFunc) {
    const context = credential ? 'edit' : 'add';
    const label = translateFunc(`table.label_${context}`);
    return `${label} Credential: ${type}`;
  }

  return (
    <Modal
      variant={ModalVariant.small}
      title={generateTitle(credential, type, t)}
      isOpen={!!type}
      onClose={onClose}
    >
      <FormContextProvider
        initialValues={{
          name: credential?.name || '',
          username: credential?.username || '',
          auth_token: credential?.auth_token || '',
          password: credential?.password || '',
          becomeMethod: credential?.become_method || '',
          becomePassword: credential?.become_password || '',
          becomeUser: credential?.become_user || ''
        }}
      >
        {({ setValue, getValue, values }) => (
          <Form>
            <FormGroup
              label={t('form-dialog.label', { context: 'name' })}
              isRequired
              fieldId="name"
            >
              <TextInput
                value={getValue('name')}
                placeholder={t('form-dialog.label', {
                  context: 'name_create-credential_placeholder'
                })}
                isRequired
                type="text"
                id="credential-name"
                name="name"
                onChange={ev => {
                  setValue('name', (ev.target as HTMLInputElement).value);
                }}
              />
            </FormGroup>

            {/* Render Authentication Type dropdown only if needed based on the credential type */}
            {(typeValue === 'network' || typeValue === 'openshift') && (
              <FormGroup
                label={t('form-dialog.label', { context: 'auth-type_create-credential' })}
                fieldId="auth_type"
              >
                <SimpleDropdown
                  label={authType}
                  variant="default"
                  isFullWidth
                  dropdownItems={
                    typeValue === 'network'
                      ? [t('form-dialog.label', { context: 'option_usernamePassword' })].map(s => (
                          <DropdownItem key={s} component="button" onClick={() => setAuthType(s)}>
                            {s}
                          </DropdownItem>
                        ))
                      : [
                          t('form-dialog.label', { context: 'option_token' }),
                          t('form-dialog.label', { context: 'option_usernamePassword' })
                        ].map(s => (
                          <DropdownItem key={s} component="button" onClick={() => setAuthType(s)}>
                            {s}
                          </DropdownItem>
                        ))
                  }
                />
              </FormGroup>
            )}

            {/* Conditional rendering for Token input */}
            {authType === 'Token' && (
              <FormGroup
                label={t('form-dialog.label', { context: 'option_token' })}
                isRequired
                fieldId="auth_token"
              >
                <TextInput
                  value={getValue('auth_token')}
                  placeholder={t('form-dialog.label', { context: 'token_placeholder' })}
                  isRequired
                  type="text"
                  id="credential-token"
                  name="auth_token"
                  onChange={ev => {
                    setValue('auth_token', (ev.target as HTMLInputElement).value);
                  }}
                />
              </FormGroup>
            )}

            {/* Username and Password fields */}
            {authType === 'Username and Password' && (
              <>
                <FormGroup
                  label={t('form-dialog.label', { context: 'username' })}
                  isRequired
                  fieldId="username"
                >
                  <TextInput
                    value={getValue('username')}
                    isRequired
                    placeholder={t('form-dialog.label', { context: 'username_placeholder' })}
                    id="credential-username"
                    name="username"
                    onChange={ev => {
                      setValue('username', (ev.target as HTMLInputElement).value);
                    }}
                  />
                </FormGroup>
                <FormGroup
                  label={t('form-dialog.label', { context: 'password' })}
                  isRequired
                  fieldId="password"
                >
                  <TextInput
                    value={getValue('password')}
                    isRequired
                    placeholder={t('form-dialog.label', { context: 'password_placeholder' })}
                    type="password"
                    id="credential-password"
                    name="password"
                    onChange={ev => {
                      setValue('password', (ev.target as HTMLInputElement).value);
                    }}
                  />
                </FormGroup>
              </>
            )}

            {/* SSH Key input */}
            {authType === 'SSH Key' && (
              <FormGroup
                label={t('form-dialog.label', { context: 'sshKey' })}
                isRequired
                fieldId="sshKey"
              >
                <TextInput
                  value={getValue('ssh_key')}
                  placeholder={t('form-dialog.label', { context: 'sshkey_placeholder' })}
                  isRequired
                  type="text"
                  id="credential-ssh-key"
                  name="sshKey"
                  onChange={ev => {
                    setValue('ssh_key', (ev.target as HTMLInputElement).value);
                  }}
                />
              </FormGroup>
            )}

            {/* Network specific fields */}
            {typeValue === 'network' && (
              <>
                <FormGroup
                  label={t('form-dialog.label', { context: 'become-method' })}
                  fieldId="become_method"
                >
                  <SimpleDropdown
                    label={becomeMethod}
                    variant={'default'}
                    isFullWidth
                    dropdownItems={[
                      'sudo',
                      'su',
                      'pbrun',
                      'pfexec',
                      'doas',
                      'dzdo',
                      'ksu',
                      'runas'
                    ].map(s => (
                      <DropdownItem key={s} onClick={() => setBecomeMethod(s)}>
                        {s}
                      </DropdownItem>
                    ))}
                  />
                </FormGroup>
                <FormGroup
                  label={t('form-dialog.label', { context: 'become-user' })}
                  fieldId="become_user"
                >
                  <TextInput
                    value={getValue('become_user')}
                    placeholder={t('form-dialog.label', { context: 'become_user_placeholder' })}
                    type="text"
                    id="become-user"
                    name="becomeUser"
                    onChange={ev => {
                      setValue('become_user', (ev.target as HTMLInputElement).value);
                    }}
                  />
                </FormGroup>
                <FormGroup
                  label={t('form-dialog.label', { context: 'become-password' })}
                  fieldId="become_password"
                >
                  <TextInput
                    value={getValue('become_password')}
                    placeholder={t('form-dialog.label', { context: 'become_password_placeholder' })}
                    type="password"
                    id="become-password"
                    name="becomePassword"
                    onChange={ev => {
                      setValue('become_password', (ev.target as HTMLInputElement).value);
                    }}
                  />
                </FormGroup>
              </>
            )}

            <ActionGroup>
              <Button variant="primary" onClick={() => onAdd({ ...values })}>
                Save
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        )}
      </FormContextProvider>
    </Modal>
  );
};

export default AddCredentialModal;
