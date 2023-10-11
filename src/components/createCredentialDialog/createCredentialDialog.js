import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateIcon,
  Form,
  Spinner,
  Title,
  ValidatedOptions
} from '@patternfly/react-core';
import { useCredential, useOnSubmitCredential, useOnUpdateCredential } from './createCredentialDialogContext';
import { Modal } from '../modal/modal';
import { DropdownSelect, SelectDirection } from '../dropdownSelect/dropdownSelect';
import { FormGroup } from '../form/formGroup';
import { TextInput } from '../form/textInput';
import { FormState } from '../formState/formState';
import { formHelpers } from '../form/formHelpers';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * Available method options
 *
 * @type {string[]}
 */
const becomeMethodTypeOptions = ['sudo', 'su', 'pbrun', 'pfexec', 'doas', 'dzdo', 'ksu', 'runas'];

/**
 * Generate authentication type options.
 *
 * @type {{title: Function | React.ReactNode, value: string, selected: boolean}[]}
 */
const authenticationTypeOptions = [
  {
    title: () => translate('form-dialog.label', { context: ['option', 'sshKey'] }),
    value: 'sshKey'
  },
  {
    title: () => translate('form-dialog.label', { context: ['option', 'token'] }),
    value: 'token'
  },
  {
    title: () => translate('form-dialog.label', { context: ['option', 'usernamePassword'] }),
    value: 'usernamePassword',
    selected: true
  }
];

/**
 * ToDo: updating a creds password should immediately reset the entire field
 * When a user attempts to update a cred the password displayed is not decrypted. Existing behavior has the
 * appearance that any user who updates the field but leaves parts of the old password actually submit a combination
 * of asterisk characters combined with their updates.
 */
/**
 * Create or edit a credential.
 *
 * @fires onSetAuthType
 * @fires onCancel
 * @fires onSubmit
 * @fires onValidateForm
 * @param {object} props
 * @param {Array} props.authenticationOptions
 * @param {Array} props.becomeMethodOptions
 * @param {Function} props.t
 * @param {Function} props.useCredential
 * @param {Function} props.useOnSubmitCredential
 * @param {Function} props.useOnUpdateCredential
 * @returns {React.ReactNode|null}
 */
const CreateCredentialDialog = ({
  authenticationOptions,
  becomeMethodOptions,
  t,
  useCredential: useAliasCredential,
  useOnSubmitCredential: useAliasOnSubmitCredential,
  useOnUpdateCredential: useAliasOnUpdateCredential
}) => {
  const [authType, setAuthType] = useState();
  const { show, edit, credential = {}, credentialType, pending, error, errorMessage } = useAliasCredential();
  const { onHide } = useAliasOnUpdateCredential();
  const submitCredential = useAliasOnSubmitCredential();
  const isShhKeyfile = credential?.[apiTypes.API_QUERY_TYPES.SSH_KEYFILE] && true;
  const isToken = credential?.[apiTypes.API_QUERY_TYPES.AUTH_TOKEN] && true;

  useEffect(() => {
    if (edit && credentialType === 'network' && isShhKeyfile) {
      setAuthType('sshKey');
      return;
    }

    if (edit && credentialType === 'network' && isToken) {
      setAuthType('token');
      return;
    }

    switch (credentialType) {
      case 'openshift':
      case 'acs':
        setAuthType('token');
        break;
      case 'network':
      case 'satellite':
      case 'vcenter':
      case 'ansible':
      default:
        setAuthType('usernamePassword');
        break;
    }
  }, [credentialType, edit, isShhKeyfile, isToken]);

  if (!credentialType) {
    return null;
  }

  /**
   * Reset form fields on auth type selection.
   *
   * @event onSetAuthType
   * @param {object} event
   * @param {*} event.value
   */
  const onSetAuthType = ({ value }) => {
    setAuthType(value);
  };

  /**
   * Hide the dialog
   *
   * @event onCancel
   * @returns {*}
   */
  const onCancel = () => onHide();

  /**
   * Submit form state to add or update a credential.
   *
   * @event onSubmit
   * @param {object} formState
   * @param {object} formState.values
   * @param {object} formState.formState
   */
  const onSubmit = ({ values = {}, ...formState } = {}) => {
    const updatedValues = {};
    Object.entries(values)
      .filter(([, value]) => value !== undefined)
      .forEach(([key, value]) => {
        updatedValues[key] = value;
      });

    // clean conflicting auth type fields
    switch (authType) {
      case 'sshKey':
        delete updatedValues[apiTypes.API_QUERY_TYPES.PASSWORD];
        break;
      case 'usernamePassword':
      default:
        delete updatedValues[apiTypes.API_QUERY_TYPES.SSH_KEYFILE];
        delete updatedValues[apiTypes.API_QUERY_TYPES.SSH_PASSPHRASE];
        break;
    }

    // clean for submitting an edited cred
    if (edit) {
      delete updatedValues[apiTypes.API_QUERY_TYPES.CREDENTIAL_TYPE];
    }

    submitCredential({ formState, values: updatedValues });
  };

  /**
   * Form validator, return an error object against field names using form state.
   *
   * @event onValidateForm
   * @param {object} formState
   * @param {object} formState.values
   * @returns {{ssh_keyfile: boolean, password: boolean, name: boolean, auth_token: boolean, username: boolean}}
   */
  const onValidateForm = ({ values = {} } = {}) => ({
    [apiTypes.API_QUERY_TYPES.NAME]: formHelpers.isEmpty(values[apiTypes.API_QUERY_TYPES.NAME]),
    [apiTypes.API_QUERY_TYPES.AUTH_TOKEN]:
      authType === 'token' && formHelpers.isEmpty(values[apiTypes.API_QUERY_TYPES.AUTH_TOKEN]),
    [apiTypes.API_QUERY_TYPES.SSH_KEYFILE]:
      (authType === 'sshKey' && formHelpers.isEmpty(values[apiTypes.API_QUERY_TYPES.SSH_KEYFILE])) ||
      (authType === 'sshKey' && !formHelpers.isFilePath(values[apiTypes.API_QUERY_TYPES.SSH_KEYFILE])),
    [apiTypes.API_QUERY_TYPES.PASSWORD]:
      authType === 'usernamePassword' && formHelpers.isEmpty(values[apiTypes.API_QUERY_TYPES.PASSWORD]),
    [apiTypes.API_QUERY_TYPES.USERNAME]:
      authType === 'usernamePassword' && formHelpers.isEmpty(values[apiTypes.API_QUERY_TYPES.USERNAME])
  });

  /**
   * Pass form state and render field(s) common to all credential types.
   *
   * @param {object} formState
   * @param {object} formState.errors
   * @param {object} formState.touched
   * @param {object} formState.values
   * @param {Function} formState.handleOnEvent
   * @returns {React.ReactNode}
   */
  const renderCommonFields = ({ errors, touched, values, handleOnEvent }) => (
    <React.Fragment>
      <FormGroup
        label={t('form-dialog.label', { context: ['name', 'create-credential'] })}
        error={touched[apiTypes.API_QUERY_TYPES.NAME] && errors[apiTypes.API_QUERY_TYPES.NAME]}
        errorMessage={t('form-dialog.label', { context: ['name', 'create-credential', 'error'] })}
      >
        <TextInput
          id="cred_name"
          name={apiTypes.API_QUERY_TYPES.NAME}
          value={values.name}
          ouiaId="cred_name"
          placeholder={t('form-dialog.label', { context: ['name', 'create-credential', 'placeholder'] })}
          onChange={handleOnEvent}
          onClear={handleOnEvent}
          maxLength={64}
          validated={
            touched[apiTypes.API_QUERY_TYPES.NAME] && errors[apiTypes.API_QUERY_TYPES.NAME]
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
      {values[apiTypes.API_QUERY_TYPES.CREDENTIAL_TYPE] === 'network' && (
        <FormGroup label={t('form-dialog.label', { context: ['auth-type', 'create-credential'] })}>
          <DropdownSelect
            ouiaId="auth_type"
            isInline={false}
            onSelect={onSetAuthType}
            options={authenticationOptions}
            selectedOptions={authType}
          />
        </FormGroup>
      )}
      {authType !== 'token' && (
        <FormGroup
          label={t('form-dialog.label', { context: ['username'] })}
          error={touched[apiTypes.API_QUERY_TYPES.USERNAME] && errors[apiTypes.API_QUERY_TYPES.USERNAME]}
          errorMessage={t('form-dialog.label', { context: ['username', 'error'] })}
        >
          <TextInput
            ouiaId="username"
            name={apiTypes.API_QUERY_TYPES.USERNAME}
            value={values[apiTypes.API_QUERY_TYPES.USERNAME]}
            placeholder={t('form-dialog.label', { context: ['username', 'placeholder'] })}
            onChange={handleOnEvent}
            onClear={handleOnEvent}
            validated={
              touched[apiTypes.API_QUERY_TYPES.USERNAME] && errors[apiTypes.API_QUERY_TYPES.USERNAME]
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
          />
        </FormGroup>
      )}
    </React.Fragment>
  );

  /**
   * Pass form state and render authentication field(s) against authentication type.
   *
   * @param {object} formState
   * @param {object} formState.errors
   * @param {object} formState.touched
   * @param {object} formState.values
   * @param {Function} formState.handleOnEvent
   * @returns {React.ReactNode}
   */
  const renderAuthFields = ({ errors, touched, values, handleOnEvent } = {}) => {
    switch (authType) {
      case 'sshKey':
        return (
          <React.Fragment>
            <FormGroup
              key="ssh_keyfile"
              label={t('form-dialog.label', { context: ['ssh-keyfile', 'create-credential'] })}
              error={touched[apiTypes.API_QUERY_TYPES.SSH_KEYFILE] && errors[apiTypes.API_QUERY_TYPES.SSH_KEYFILE]}
              errorMessage={t('form-dialog.label', { context: ['ssh-keyfile', 'create-credential', 'error'] })}
            >
              <TextInput
                ouiaId="ssh_keyfile"
                name={apiTypes.API_QUERY_TYPES.SSH_KEYFILE}
                value={values[apiTypes.API_QUERY_TYPES.SSH_KEYFILE]}
                placeholder={t('form-dialog.label', { context: ['ssh-keyfile', 'create-credential', 'placeholder'] })}
                onChange={handleOnEvent}
                onClear={handleOnEvent}
                validated={
                  touched[apiTypes.API_QUERY_TYPES.SSH_KEYFILE] && errors[apiTypes.API_QUERY_TYPES.SSH_KEYFILE]
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            </FormGroup>
            <FormGroup
              key="ssh-passphrase"
              label={t('form-dialog.label', { context: ['ssh-passphrase', 'create-credential'] })}
            >
              <TextInput
                ouiaId="ssh_passphrase"
                name={apiTypes.API_QUERY_TYPES.SSH_PASSPHRASE}
                type="password"
                value={values[apiTypes.API_QUERY_TYPES.SSH_PASSPHRASE]}
                placeholder={t('form-dialog.label', { context: ['optional'] })}
                onChange={handleOnEvent}
                onClear={handleOnEvent}
              />
            </FormGroup>
          </React.Fragment>
        );
      case 'token':
        return (
          <FormGroup
            key="auth_token"
            label={t('form-dialog.label', { context: ['token', 'create-credential'] })}
            error={touched[apiTypes.API_QUERY_TYPES.AUTH_TOKEN] && errors[apiTypes.API_QUERY_TYPES.AUTH_TOKEN]}
            errorMessage={t('form-dialog.label', { context: ['token', 'create-credential', 'error'] })}
          >
            <TextInput
              ouiaId="auth_token"
              name={apiTypes.API_QUERY_TYPES.AUTH_TOKEN}
              value={values[apiTypes.API_QUERY_TYPES.AUTH_TOKEN]}
              placeholder={t('form-dialog.label', { context: ['token', 'create-credential', 'placeholder'] })}
              onChange={handleOnEvent}
              onClear={handleOnEvent}
              validated={
                touched[apiTypes.API_QUERY_TYPES.AUTH_TOKEN] && errors[apiTypes.API_QUERY_TYPES.AUTH_TOKEN]
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
            />
          </FormGroup>
        );
      case 'usernamePassword':
      default:
        return (
          <FormGroup
            key="password"
            label={t('form-dialog.label', { context: ['password'] })}
            error={touched[apiTypes.API_QUERY_TYPES.PASSWORD] && errors[apiTypes.API_QUERY_TYPES.PASSWORD]}
            errorMessage={t('form-dialog.label', { context: ['password', 'error'] })}
          >
            <TextInput
              ouiaId="password"
              name={apiTypes.API_QUERY_TYPES.PASSWORD}
              type="password"
              value={values[apiTypes.API_QUERY_TYPES.PASSWORD]}
              placeholder={t('form-dialog.label', { context: ['password', 'placeholder'] })}
              onChange={handleOnEvent}
              onClear={handleOnEvent}
              validated={
                touched[apiTypes.API_QUERY_TYPES.PASSWORD] && errors[apiTypes.API_QUERY_TYPES.PASSWORD]
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
            />
          </FormGroup>
        );
    }
  };

  /**
   * Pass form state and render network credential field(s).
   *
   * @param {object} formState
   * @param {object} formState.values
   * @param {Function} formState.handleOnEvent
   * @returns {React.ReactNode}
   */
  const renderNetworkFields = ({ values, handleOnEvent } = {}) => {
    if (values[apiTypes.API_QUERY_TYPES.CREDENTIAL_TYPE] !== 'network') {
      return null;
    }

    return (
      <React.Fragment>
        <FormGroup key="become_method" label={t('form-dialog.label', { context: ['become-method'] })}>
          <DropdownSelect
            ouiaId="become_method"
            name={apiTypes.API_QUERY_TYPES.BECOME_METHOD}
            isInline={false}
            onSelect={handleOnEvent}
            options={becomeMethodOptions}
            selectedOptions={values[apiTypes.API_QUERY_TYPES.BECOME_METHOD]}
            direction={SelectDirection.up}
          />
        </FormGroup>
        <FormGroup key="become_user" label={t('form-dialog.label', { context: ['become-user'] })}>
          <TextInput
            name={apiTypes.API_QUERY_TYPES.BECOME_USER}
            ouiaId="become_user"
            type="text"
            value={values[apiTypes.API_QUERY_TYPES.BECOME_USER]}
            placeholder={t('form-dialog.label', { context: ['optional'] })}
            onChange={handleOnEvent}
            onClear={handleOnEvent}
          />
        </FormGroup>
        <FormGroup key="become_password" label={t('form-dialog.label', { context: ['become-password'] })}>
          <TextInput
            ouiaId="become_password"
            name={apiTypes.API_QUERY_TYPES.BECOME_PASSWORD}
            type="password"
            value={values[apiTypes.API_QUERY_TYPES.BECOME_PASSWORD]}
            placeholder={t('form-dialog.label', { context: ['optional'] })}
            onChange={handleOnEvent}
            onClear={handleOnEvent}
          />
        </FormGroup>
      </React.Fragment>
    );
  };

  return (
    <FormState
      key={`form-${authType}`}
      setValues={{ ...credential, [apiTypes.API_QUERY_TYPES.CREDENTIAL_TYPE]: credentialType }}
      validateOnMount={false}
      validate={onValidateForm}
      onSubmit={onSubmit}
    >
      {({ handleOnSubmit, isValid, values, submitCount, ...options } = {}) => (
        <Modal
          isOpen={show}
          showClose
          onClose={onCancel}
          header={
            <Title headingLevel="h4">
              {t('form-dialog.title', { context: ['create-credential', edit && 'edit'] })}
            </Title>
          }
          actions={[
            <Button key={`save-${submitCount}`} onClick={handleOnSubmit} isDisabled={!isValid}>
              {t('form-dialog.label', { context: ['submit', edit && 'edit', 'create-credential'] })}
            </Button>,
            <Button key="cancel" variant={ButtonVariant.secondary} autoFocus={edit} onClick={onCancel}>
              {t('form-dialog.label', { context: 'cancel' })}
            </Button>
          ]}
        >
          {error && (
            <div>
              <Alert isInline variant="danger" title={t('form-dialog.label', { context: 'error' })}>
                {errorMessage || t('form-dialog.label', { context: ['error', 'description'] })}
              </Alert>
              <br />
            </div>
          )}
          <Form isHorizontal onSubmit={handleOnSubmit}>
            {pending && (
              <EmptyState className="quipucords-empty-state">
                <EmptyStateIcon icon={Spinner} />
                <Title headingLevel="h3">{t('form-dialog.empty-state', { context: ['title', 'pending'] })}</Title>
              </EmptyState>
            )}
            {!pending && (
              <React.Fragment>
                <FormGroup label={t('form-dialog.label', { context: ['source-type', 'create-credential'] })}>
                  <TextInput
                    type="text"
                    isReadOnly
                    value={t('form-dialog.label', { context: values[apiTypes.API_QUERY_TYPES.CREDENTIAL_TYPE] })}
                  />
                </FormGroup>
                {renderCommonFields({ values, ...options })}
                {renderAuthFields({ values, ...options })}
                {renderNetworkFields({ values, ...options })}
              </React.Fragment>
            )}
          </Form>
        </Modal>
      )}
    </FormState>
  );
};

CreateCredentialDialog.propTypes = {
  authenticationOptions: PropTypes.array,
  becomeMethodOptions: PropTypes.array,
  t: PropTypes.func,
  useCredential: PropTypes.func,
  useOnSubmitCredential: PropTypes.func,
  useOnUpdateCredential: PropTypes.func
};

CreateCredentialDialog.defaultProps = {
  authenticationOptions: authenticationTypeOptions,
  becomeMethodOptions: becomeMethodTypeOptions,
  t: translate,
  useCredential,
  useOnSubmitCredential,
  useOnUpdateCredential
};

export {
  CreateCredentialDialog as default,
  CreateCredentialDialog,
  authenticationTypeOptions,
  becomeMethodTypeOptions
};
