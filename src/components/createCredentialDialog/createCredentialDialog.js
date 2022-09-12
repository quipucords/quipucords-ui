import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant, Button, ButtonVariant, Form, Title, ValidatedOptions } from '@patternfly/react-core';
import { Modal } from '../modal/modal';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { helpers } from '../../common';
import { FormGroup } from '../form/formGroup';
import { TextInput } from '../form/textInput';
import { authDictionary, dictionary } from '../../constants/dictionaryConstants';
import { DropdownSelect } from '../dropdownSelect/dropdownSelect';
import { translate } from '../i18n/i18n';

/**
 * Generate authentication type options.
 *
 * @type {{title: string|Function, value: *}[]}
 */
const authenticationTypeOptions = Object.keys(authDictionary).map(type => ({
  title: () => translate('form-dialog.label', { context: ['option', type] }),
  value: type
}));

/**
 * Create or edit a credential.
 */
class CreateCredentialDialog extends React.Component {
  static validateCredentialName(credentialName) {
    if (!credentialName) {
      return 'You must enter a credential name';
    }

    if (credentialName.length > 64) {
      return 'The credential name can only contain up to 64 characters';
    }

    return '';
  }

  static validateUsername(username) {
    if (!username || !username.length) {
      return 'You must enter a user name';
    }

    return '';
  }

  static validatePassword(password) {
    if (!password || !password.length) {
      return 'You must enter a password';
    }

    return '';
  }

  static validateSshKeyFile(keyFile) {
    const sshKeyFileValidator = new RegExp(/^\/.*$/);

    if (!sshKeyFileValidator.test(keyFile)) {
      return 'Please enter the full path to the SSH Key File';
    }

    return '';
  }

  // ToDo: evaluate "sudo" as the default for becomeMethod
  initialState = {
    credentialName: '',
    credentialType: '',
    authorizationType: 'usernamePassword',
    sshKeyFile: '',
    passphrase: '',
    username: '',
    password: '',
    passwordError: '',
    becomeMethod: 'sudo',
    becomeUser: '',
    becomePassword: '',
    credentialNameError: '',
    usernameError: '',
    sshKeyFileError: '',
    becomeUserError: '',
    sshKeyDisabled: false
  };

  state = { ...this.initialState };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { edit, fulfilled, getCredentials, show, viewOptions } = this.props;

    if (!show && nextProps.show) {
      this.resetInitialState(nextProps);
    }

    if (show && nextProps.fulfilled && !fulfilled) {
      store.dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: AlertVariant.success,
        message: (
          <span>
            Credential <strong>{nextProps.credential.name}</strong> successfully
            {edit ? ' updated' : ' added'}.
          </span>
        )
      });

      this.onCancel();
      getCredentials(helpers.createViewQueryObject(viewOptions));
    }
  }

  onCancel = () => {
    store.dispatch({
      type: reduxTypes.credentials.UPDATE_CREDENTIAL_HIDE
    });
  };

  onSave = () => {
    const { addCredential, credential, edit, updateCredential } = this.props;
    const {
      authorizationType,
      becomeMethod,
      becomePassword,
      becomeUser,
      credentialName,
      credentialType,
      passphrase,
      password,
      sshKeyFile,
      username
    } = this.state;

    const submitCredential = {
      username,
      name: credentialName
    };

    if (edit) {
      submitCredential.id = credential.id;
    } else {
      submitCredential.cred_type = credentialType;
    }

    if (authorizationType === 'sshKey') {
      submitCredential.ssh_keyfile = sshKeyFile;
      submitCredential.sshpassphrase = passphrase;
    } else {
      submitCredential.password = password;
    }

    if (credentialType === 'network') {
      submitCredential.become_method = becomeMethod;
      if (becomeUser) {
        submitCredential.become_user = becomeUser;
      }
      if (becomePassword) {
        submitCredential.become_password = becomePassword;
      }
    }

    if (edit) {
      updateCredential(submitCredential.id, submitCredential);
    } else {
      addCredential(submitCredential);
    }
  };

  onSetAuthType = authType => {
    this.setState({ authorizationType: authType.value });
  };

  onUpdateCredentialName = event => {
    this.setState({
      credentialName: event.target.value,
      credentialNameError: CreateCredentialDialog.validateCredentialName(event.target.value)
    });
  };

  onUpdateUsername = event => {
    this.setState({
      username: event.target.value,
      usernameError: CreateCredentialDialog.validateUsername(event.target.value)
    });
  };

  onUpdatePassword = event => {
    this.setState({
      password: event.target.value,
      passwordError: CreateCredentialDialog.validatePassword(event.target.value)
    });
  };

  onUpdateSshKeyFile = event => {
    this.setState({
      sshKeyFile: event.target.value,
      sshKeyFileError: CreateCredentialDialog.validateSshKeyFile(event.target.value)
    });
  };

  onUpdatePassphrase = event => {
    this.setState({
      passphrase: event.target.value
    });
  };

  onSetBecomeMethod = method => {
    this.setState({
      becomeMethod: method.value
    });
  };

  onUpdateBecomeUser = event => {
    this.setState({
      becomeUser: event.target.value
    });
  };

  onUpdateBecomePassword = event => {
    this.setState({
      becomePassword: event.target.value
    });
  };

  resetInitialState(nextProps) {
    let sshKeyDisabled = true;

    if (nextProps.edit && nextProps.credential) {
      if (nextProps.credential.cred_type === 'network' || nextProps.credential.ssh_keyfile) {
        sshKeyDisabled = false;
      }

      this.setState({
        credentialName: nextProps.credential.name,
        credentialType: nextProps.credential.cred_type,
        authorizationType: nextProps.credential.ssh_keyfile ? 'sshKey' : 'usernamePassword',
        sshKeyFile: nextProps.credential.ssh_keyfile,
        passphrase: nextProps.credential.passphrase,
        username: nextProps.credential.username,
        password: nextProps.credential.password,
        becomeMethod: nextProps.credential.become_method,
        becomeUser: nextProps.credential.become_user,
        becomePassword: nextProps.credential.become_password,
        credentialNameError: '',
        usernameError: '',
        sshKeyFileError: '',
        becomeUserError: '',
        sshKeyDisabled
      });
    } else {
      if (nextProps.credentialType === 'network') {
        sshKeyDisabled = false;
      }

      this.setState({
        ...this.initialState,
        credentialType: nextProps.credentialType,
        sshKeyDisabled
      });
    }
  }

  validateForm() {
    const {
      credentialName,
      credentialNameError,
      username,
      usernameError,
      authorizationType,
      password,
      passwordError,
      sshKeyFile,
      sshKeyFileError
    } = this.state;

    return (
      credentialName &&
      !credentialNameError &&
      username &&
      !usernameError &&
      (authorizationType === 'usernamePassword' ? password && !passwordError : sshKeyFile && !sshKeyFileError)
    );
  }

  renderAuthForm() {
    const { authorizationType, password, sshKeyFile, passphrase, passwordError, sshKeyFileError, sshKeyDisabled } =
      this.state;

    switch (authorizationType) {
      case 'usernamePassword':
        return (
          <FormGroup label="Password" error={passwordError} errorMessage={passwordError}>
            <TextInput
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={this.onUpdatePassword}
              validated={passwordError ? ValidatedOptions.error : ValidatedOptions.default}
            />
          </FormGroup>
        );
      case 'sshKey':
        if (sshKeyDisabled) {
          return null;
        }

        return (
          <React.Fragment>
            <FormGroup label="SSH Key File" error={sshKeyFileError} errorMessage={sshKeyFileError}>
              <TextInput
                type="text"
                value={sshKeyFile}
                placeholder="Enter the full path to the SSH key file"
                onChange={this.onUpdateSshKeyFile}
                validated={sshKeyFileError ? ValidatedOptions.error : ValidatedOptions.default}
              />
            </FormGroup>
            <FormGroup label="Passphrase">
              <TextInput type="password" value={passphrase} placeholder="optional" onChange={this.onUpdatePassphrase} />
            </FormGroup>
          </React.Fragment>
        );
      default:
        return null;
    }
  }

  renderNetworkForm() {
    const { credentialType, becomeMethod, becomeUser, becomePassword, becomeUserError } = this.state;
    const { becomeMethods } = this.props;

    if (credentialType !== 'network') {
      return null;
    }

    return (
      <React.Fragment>
        <FormGroup label="Become Method">
          <DropdownSelect
            id="become-method-select"
            isInline={false}
            onSelect={this.onSetBecomeMethod}
            options={becomeMethods}
            selectedOptions={becomeMethod}
          />
        </FormGroup>
        <FormGroup label="Become User" error={becomeUserError} errorMessage={becomeUserError}>
          <TextInput
            type="text"
            placeholder="optional"
            value={becomeUser}
            onChange={this.onUpdateBecomeUser}
            validated={becomeUserError ? ValidatedOptions.error : ValidatedOptions.default}
          />
        </FormGroup>
        <FormGroup label="Become Password">
          <TextInput
            type="password"
            value={becomePassword}
            placeholder="optional"
            onChange={this.onUpdateBecomePassword}
          />
        </FormGroup>
      </React.Fragment>
    );
  }

  renderErrorMessage() {
    const { error, errorMessage } = this.props;

    if (error) {
      return (
        <Alert isInline variant="danger" title="Error">
          {errorMessage}
        </Alert>
      );
    }

    return null;
  }

  render() {
    const { show, edit, t } = this.props;
    const {
      credentialType,
      credentialName,
      authorizationType,
      username,
      credentialNameError,
      usernameError,
      sshKeyDisabled
    } = this.state;

    return (
      <Modal
        isOpen={show}
        showClose
        onClose={this.onCancel}
        header={<Title headingLevel="h4">{edit ? `View Credential - ${credentialName}` : 'Add Credential'}</Title>}
        actions={[
          <Button key="save" onClick={this.onSave} isDisabled={!this.validateForm()}>
            {t('form-dialog.label', { context: ['submit', 'create-credential'] })}
          </Button>,
          <Button key="cancel" variant={ButtonVariant.secondary} autoFocus={edit} onClick={this.onCancel}>
            {t('form-dialog.label', { context: 'cancel' })}
          </Button>
        ]}
      >
        {this.renderErrorMessage()}
        <Form isHorizontal>
          <FormGroup label="Source Type">
            <TextInput
              className="quipucords-form-control"
              type="text"
              isReadOnly
              value={dictionary[credentialType] || ''}
            />
          </FormGroup>
          <FormGroup label="Credential Name" error={credentialNameError} errorMessage={credentialNameError}>
            <TextInput
              type="text"
              className="quipucords-form-control"
              placeholder="Enter a name for the credential"
              autoFocus={!edit}
              value={credentialName}
              onChange={this.onUpdateCredentialName}
              validated={credentialNameError ? ValidatedOptions.error : ValidatedOptions.default}
            />
          </FormGroup>
          {!sshKeyDisabled && (
            <FormGroup label="Authentication Type">
              <DropdownSelect
                id="auth-type-select"
                isInline={false}
                onSelect={this.onSetAuthType}
                options={authenticationTypeOptions}
                selectedOptions={authorizationType}
              />
            </FormGroup>
          )}
          <FormGroup label="Username" error={usernameError} errorMessage={usernameError}>
            <TextInput
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={this.onUpdateUsername}
              validated={usernameError ? ValidatedOptions.error : ValidatedOptions.default}
            />
          </FormGroup>
          {this.renderAuthForm()}
          {this.renderNetworkForm()}
        </Form>
      </Modal>
    );
  }
}

CreateCredentialDialog.propTypes = {
  addCredential: PropTypes.func,
  becomeMethods: PropTypes.arrayOf(PropTypes.string),
  getCredentials: PropTypes.func,
  updateCredential: PropTypes.func,
  credential: PropTypes.object,
  credentialType: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  show: PropTypes.bool,
  edit: PropTypes.bool,
  fulfilled: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  t: PropTypes.func,
  viewOptions: PropTypes.object
};

CreateCredentialDialog.defaultProps = {
  addCredential: helpers.noop,
  becomeMethods: ['sudo', 'su', 'pbrun', 'pfexec', 'doas', 'dzdo', 'ksu', 'runas'],
  getCredentials: helpers.noop,
  updateCredential: helpers.noop,
  credential: {},
  credentialType: null, // eslint-disable-line react/no-unused-prop-types
  show: false,
  edit: false,
  fulfilled: false,
  error: false,
  errorMessage: null,
  t: translate,
  viewOptions: {}
};

const mapDispatchToProps = dispatch => ({
  getCredentials: queryObj => dispatch(reduxActions.credentials.getCredentials(null, queryObj)),
  addCredential: data => dispatch(reduxActions.credentials.addCredential(data)),
  updateCredential: (id, data) => dispatch(reduxActions.credentials.updateCredential(id, data))
});

const mapStateToProps = state => ({
  ...state.credentials.dialog,
  viewOptions: state.viewOptions[reduxTypes.view.CREDENTIALS_VIEW]
});

const ConnectedCreateCredentialDialog = connect(mapStateToProps, mapDispatchToProps)(CreateCredentialDialog);

export {
  ConnectedCreateCredentialDialog as default,
  ConnectedCreateCredentialDialog,
  CreateCredentialDialog,
  authenticationTypeOptions
};
