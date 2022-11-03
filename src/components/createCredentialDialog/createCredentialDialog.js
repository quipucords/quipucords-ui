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
    title: () => translate('form-dialog.label', { context: ['option', 'usernamePassword'] }),
    value: 'usernamePassword',
    selected: true
  }
];

// ToDo: "sshpassphrase" could be "ssh_passphrase" per the api-spec, investigate since the prior GUI code used "sshpassphrase"
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

  useEffect(() => {
    if (edit && credentialType === 'network' && isShhKeyfile) {
      setAuthType('sshKey');
    } else {
      switch (credentialType) {
        case 'network':
        case 'satellite':
        case 'vcenter':
        default:
          setAuthType('usernamePassword');
          break;
      }
    }
  }, [credentialType, edit, isShhKeyfile]);

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
   * @returns {{ssh_keyfile: boolean, password: boolean, name: boolean, username: boolean}}
   */
  const onValidateForm = ({ values = {} } = {}) => ({
    [apiTypes.API_QUERY_TYPES.NAME]: formHelpers.isEmpty(values[apiTypes.API_QUERY_TYPES.NAME]),
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
        errorMessage="You must enter a credential name"
      >
        <TextInput
          id="cred_name"
          name={apiTypes.API_QUERY_TYPES.NAME}
          value={values.name}
          placeholder="Enter a name for the credential"
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
        <FormGroup label="Authentication Type">
          <DropdownSelect
            isInline={false}
            onSelect={onSetAuthType}
            options={authenticationOptions}
            selectedOptions={authType}
          />
        </FormGroup>
      )}
      <FormGroup
        label="Username"
        error={touched[apiTypes.API_QUERY_TYPES.USERNAME] && errors[apiTypes.API_QUERY_TYPES.USERNAME]}
        errorMessage="You must enter a username"
      >
        <TextInput
          name={apiTypes.API_QUERY_TYPES.USERNAME}
          value={values[apiTypes.API_QUERY_TYPES.USERNAME]}
          placeholder="Enter Username"
          onChange={handleOnEvent}
          onClear={handleOnEvent}
          validated={
            touched[apiTypes.API_QUERY_TYPES.USERNAME] && errors[apiTypes.API_QUERY_TYPES.USERNAME]
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
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
              label="SSH Key File"
              error={touched[apiTypes.API_QUERY_TYPES.SSH_KEYFILE] && errors[apiTypes.API_QUERY_TYPES.SSH_KEYFILE]}
              errorMessage="Please enter the full path to the SSH Key File"
            >
              <TextInput
                name={apiTypes.API_QUERY_TYPES.SSH_KEYFILE}
                value={values[apiTypes.API_QUERY_TYPES.SSH_KEYFILE]}
                placeholder="Enter a SSH key file path"
                onChange={handleOnEvent}
                onClear={handleOnEvent}
                validated={
                  touched[apiTypes.API_QUERY_TYPES.SSH_KEYFILE] && errors[apiTypes.API_QUERY_TYPES.SSH_KEYFILE]
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            </FormGroup>
            <FormGroup key="sshpassphrase" label="Passphrase">
              <TextInput
                name={apiTypes.API_QUERY_TYPES.SSH_PASSPHRASE}
                type="password"
                value={values[apiTypes.API_QUERY_TYPES.SSH_PASSPHRASE]}
                placeholder="optional"
                onChange={handleOnEvent}
                onClear={handleOnEvent}
              />
            </FormGroup>
          </React.Fragment>
        );
      case 'usernamePassword':
      default:
        return (
          <FormGroup
            key="password"
            label="Password"
            error={touched[apiTypes.API_QUERY_TYPES.PASSWORD] && errors[apiTypes.API_QUERY_TYPES.PASSWORD]}
            errorMessage="You must enter a password"
          >
            <TextInput
              name={apiTypes.API_QUERY_TYPES.PASSWORD}
              type="password"
              value={values[apiTypes.API_QUERY_TYPES.PASSWORD]}
              placeholder="Enter password"
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
        <FormGroup key="become_method" label="Become Method">
          <DropdownSelect
            name={apiTypes.API_QUERY_TYPES.BECOME_METHOD}
            isInline={false}
            onSelect={handleOnEvent}
            options={becomeMethodOptions}
            selectedOptions={values[apiTypes.API_QUERY_TYPES.BECOME_METHOD]}
            direction={SelectDirection.up}
          />
        </FormGroup>
        <FormGroup key="become_user" label="Become User">
          <TextInput
            name={apiTypes.API_QUERY_TYPES.BECOME_USER}
            type="text"
            value={values[apiTypes.API_QUERY_TYPES.BECOME_USER]}
            placeholder="optional"
            onChange={handleOnEvent}
            onClear={handleOnEvent}
          />
        </FormGroup>
        <FormGroup key="become_password" label="Become Password">
          <TextInput
            name={apiTypes.API_QUERY_TYPES.BECOME_PASSWORD}
            type="password"
            value={values[apiTypes.API_QUERY_TYPES.BECOME_PASSWORD]}
            placeholder="optional"
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
          header={<Title headingLevel="h4">{edit ? `View Credential` : 'Add Credential'}</Title>}
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
                <FormGroup label="Source Type">
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
