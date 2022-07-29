import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { Form } from 'patternfly-react';
import { connect, store, reduxActions, reduxSelectors, reduxTypes } from '../../redux';
import { helpers } from '../../common/helpers';
import apiTypes from '../../constants/apiConstants';
import { dictionary, sslProtocolDictionary } from '../../constants/dictionaryConstants';
import { FormField, fieldValidation } from '../formField/formField';
import { FormState } from '../formState/formState';
import { DropdownSelect, SelectVariant } from '../dropdownSelect/dropdownSelect';
import { translate } from '../i18n/i18n';

/**
 * Generate ssl protocol options.
 *
 * @type {{title: string|Function, value: *}[]}
 */
const sslProtocolOptions = Object.keys(sslProtocolDictionary)
  .map(type => ({
    title: () => translate('form-dialog.label', { context: ['option', type] }),
    value: type
  }))
  .concat({
    title: () => translate('form-dialog.label', { context: ['option', 'disableSsl'] }),
    value: 'disableSsl'
  });

/**
 * Add a source with a Wizard, step two, apply credentials.
 */
class AddSourceWizardStepTwo extends React.Component {
  static hostValid(value) {
    return (
      new RegExp('^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$').test(value) ||
      new RegExp('^(([a-z0-9]|[a-z0-9][a-z0-9_\\-]*[a-z0-9])\\.)*([a-z0-9]|[a-z0-9][a-z0-9_\\-]*[a-z0-9])$', 'i').test(
        value
      )
    );
  }

  static hostsValid(hosts = []) {
    if (!hosts.length) {
      return false;
    }

    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];

      if (
        host !== '' &&
        !new RegExp(
          '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.(\\d{1,3}|\\[\\d{1,3}:\\d{1,3}\\]|\\d{1,3}\\/([1][6-9]|[2][0-9]|30|31|32))$'
        ).test(host) &&
        !new RegExp(
          '^(([a-z0-9]|[a-z0-9][a-z0-9_\\-]*[a-z0-9])\\.)*([a-z0-9]|[a-z0-9][a-z0-9_\\-]*[a-z0-9])$',
          'i'
        ).test(host)
      ) {
        return false;
      }
    }

    return true;
  }

  componentDidMount() {
    const { getCredentials } = this.props;

    getCredentials();
  }

  // ToDo: future, exported hook from addCredentialType can be leveraged here
  onAddCredential = () => {
    const { type } = this.props;

    store.dispatch({
      type: reduxTypes.credentials.CREATE_CREDENTIAL_SHOW,
      credentialType: type
    });
  };

  isStepValid = ({ checked = {}, values = {}, touched = {} }) => {
    const { add, edit, type } = this.props;
    const errors = {};

    errors.credentials = fieldValidation.isEmpty(values.credentials);
    errors.name = fieldValidation.isEmpty(values.name);

    if (type === 'network') {
      errors.hosts = fieldValidation.isEmpty(values.hosts) || !AddSourceWizardStepTwo.hostsValid(values.hosts);
    } else {
      errors.hosts = fieldValidation.isEmpty(values.hosts) || !AddSourceWizardStepTwo.hostValid(values.hosts[0]);
    }

    errors.port = !fieldValidation.isEmpty(values.port) && !fieldValidation.isPortValid(values.port);

    const isNotErrors = !Object.values(errors).filter(val => val === true).length;

    if ((add && isNotErrors) || (edit && isNotErrors && Object.keys(touched).length)) {
      this.submitStep({
        checked,
        values
      });
    }

    return errors;
  };

  submitStep({ checked = {}, values = {} }) {
    const { id, type } = this.props;

    const source = {
      [apiTypes.API_SUBMIT_SOURCE_CREDENTIALS]: values.credentials,
      [apiTypes.API_SUBMIT_SOURCE_HOSTS]: values.hosts,
      [apiTypes.API_SUBMIT_SOURCE_NAME]: values.name,
      [apiTypes.API_SUBMIT_SOURCE_PORT]: values.port || (type === 'network' && 22) || (type !== 'network' && 443)
    };

    helpers.setPropIfTruthy(source, [apiTypes.API_SUBMIT_SOURCE_ID], id);

    helpers.setPropIfDefined(
      source,
      [apiTypes.API_SUBMIT_SOURCE_OPTIONS, apiTypes.API_SUBMIT_SOURCE_OPTIONS_PARAMIKO],
      checked.optionParamiko
    );

    if (type !== 'network') {
      helpers.setPropIfDefined(
        source,
        [apiTypes.API_SUBMIT_SOURCE_OPTIONS, apiTypes.API_SUBMIT_SOURCE_OPTIONS_SSL_CERT],
        checked.optionSslCert
      );

      helpers.setPropIfTruthy(
        source,
        [apiTypes.API_SUBMIT_SOURCE_OPTIONS, apiTypes.API_SUBMIT_SOURCE_OPTIONS_SSL_PROTOCOL],
        values.optionSslProtocol
      );

      helpers.setPropIfDefined(
        source,
        [apiTypes.API_SUBMIT_SOURCE_OPTIONS, apiTypes.API_SUBMIT_SOURCE_OPTIONS_DISABLE_SSL],
        checked.optionDisableSsl
      );
    }

    store.dispatch({
      type: reduxTypes.sources.VALID_SOURCE_WIZARD_STEPTWO,
      source
    });
  }

  renderName({ values, errors, touched, handleOnEvent }) {
    const { stepTwoErrorMessages, type } = this.props;

    return (
      <FormField
        label="Name"
        error={(touched.name && errors.name) || stepTwoErrorMessages.name}
        errorMessage={stepTwoErrorMessages.name || 'A source name is required'}
      >
        <Form.FormControl
          type="text"
          name="name"
          value={values.name}
          placeholder={`Enter a name for the ${dictionary[type] || ''} source`}
          onChange={handleOnEvent}
        />
      </FormField>
    );
  }

  renderHosts({ values, errors, touched, handleOnEventCustom, handleOnEvent }) {
    const { stepTwoErrorMessages, type } = this.props;

    const onChangeMultipleHost = event => {
      const { value } = event.target;

      let updatedHosts = (value || '').replace(/\\n|\\r|\s/g, ',').split(',');
      updatedHosts = updatedHosts.filter(host => host !== '');

      handleOnEventCustom([
        {
          name: 'hosts',
          value: updatedHosts
        },
        {
          name: 'hostsMultiple',
          value
        }
      ]);
    };

    const onChangeSingleHost = event => {
      const { value } = event.target;
      const updatedHosts = [];
      const [host, port] = (value || '').split(':');

      updatedHosts.push(host);

      handleOnEventCustom([
        {
          name: 'hosts',
          value: updatedHosts
        },
        {
          name: 'port',
          value: port
        },
        {
          name: 'hostsSingle',
          value
        }
      ]);
    };

    switch (type) {
      case 'network':
        return (
          <React.Fragment>
            <FormField
              label="Search addresses"
              error={(touched.hostsMultiple && errors.hosts) || stepTwoErrorMessages.hosts}
              errorMessage="A valid IP address or hostname is required"
            >
              <Form.FormControl
                componentClass="textarea"
                name="hostsMultiple"
                value={values.hostsMultiple}
                rows={5}
                placeholder="Enter values separated by commas"
                onChange={onChangeMultipleHost}
              />
              <Form.HelpBlock>
                IP addresses, IP ranges, DNS host names, and wildcards are valid. Use CIDR or Ansible notation for
                ranges.
              </Form.HelpBlock>
            </FormField>
            <FormField
              label="Port"
              error={(touched.port && errors.port) || stepTwoErrorMessages.port}
              errorMessage="Port must be valid"
            >
              <Form.FormControl
                name="port"
                type="text"
                value={values.port}
                maxLength={5}
                placeholder="Default port is 22"
                onChange={handleOnEvent}
              />
            </FormField>
          </React.Fragment>
        );

      case 'vcenter':
      case 'satellite':
        const hostPortError = (
          <React.Fragment>
            {touched.hostsSingle && errors.hosts && 'A valid IP address or hostname is required '}
            {errors.port && 'Port must be valid'}
          </React.Fragment>
        );

        return (
          <React.Fragment>
            <FormField
              label="IP address or hostname"
              error={
                (touched.hostsSingle && errors.hosts) ||
                errors.port ||
                stepTwoErrorMessages.hosts ||
                stepTwoErrorMessages.port
              }
              errorMessage={
                (stepTwoErrorMessages.hosts && 'A valid IP address or hostname is required') ||
                (stepTwoErrorMessages.port && 'Port must be valid') ||
                hostPortError
              }
            >
              <Form.FormControl
                name="hostsSingle"
                type="text"
                value={values.hostsSingle}
                placeholder="Enter an IP address or hostname (default port is 443)"
                onChange={onChangeSingleHost}
              />
            </FormField>
          </React.Fragment>
        );

      default:
        return null;
    }
  }

  renderCredentials({ errors, touched, handleOnEventCustom }) {
    const { availableCredentials, credentials, stepTwoErrorMessages, t, type } = this.props;

    const multiselectCredentials = type === 'network';
    const sourceCredentials = availableCredentials.filter(cred => cred.type === type);

    const onChangeCredential = event => {
      handleOnEventCustom({
        name: 'credentials',
        value: event.options.filter(opt => opt.selected === true).map(opt => opt.value)
      });
    };

    return (
      <FormField
        label="Credentials"
        error={(touched.credentials && errors.credentials) || stepTwoErrorMessages.credentials}
        errorMessage={stepTwoErrorMessages.credentials || 'A credential is required'}
      >
        <Form.InputGroup>
          <DropdownSelect
            placeholder={t('form-dialog.label_placeholder', {
              context: [
                'add-source',
                'credential',
                multiselectCredentials && 'multi',
                !availableCredentials.length && 'add'
              ]
            })}
            id="credentials"
            isInline={false}
            disabled={!sourceCredentials.length}
            variant={(multiselectCredentials && SelectVariant.checkbox) || SelectVariant.single}
            onSelect={onChangeCredential}
            options={sourceCredentials}
            selectedOptions={credentials}
            key={`dropdown-update-${sourceCredentials.length}`}
          />
          <Form.InputGroup.Button>
            <Button
              variant={ButtonVariant.control}
              aria-label={t('form-dialog.label', { context: 'add-credential' })}
              icon={<PlusIcon />}
              onClick={this.onAddCredential}
              title={t('form-dialog.label', { context: 'add-credential' })}
            />
          </Form.InputGroup.Button>
        </Form.InputGroup>
      </FormField>
    );
  }

  renderOptions({ checked, values, handleOnEvent, handleOnEventCustom }) {
    const { type, stepTwoErrorMessages } = this.props;

    const onChangeSslProtocol = event => {
      const { value } = event;
      const isDisabledSsl = value === 'disableSsl';

      handleOnEventCustom([
        {
          name: 'optionSslProtocol',
          value: isDisabledSsl ? undefined : value
        },
        {
          name: 'optionDisableSsl',
          checked: isDisabledSsl
        },
        {
          name: 'optionSslCert',
          checked: isDisabledSsl ? false : checked.optionSslCert
        }
      ]);
    };

    switch (type) {
      case 'network':
        return (
          <FormField error={stepTwoErrorMessages.options} errorMessage={stepTwoErrorMessages.options}>
            <Form.Checkbox
              name="optionParamiko"
              checked={checked.optionParamiko || false}
              inline
              onChange={handleOnEvent}
            >
              Connect using Paramiko instead of Open <abbr title="Secure Shell">SSH</abbr>
            </Form.Checkbox>
          </FormField>
        );
      case 'vcenter':
      case 'satellite':
        return (
          <React.Fragment>
            <FormField label="Connection">
              <DropdownSelect
                id="optionSslProtocol"
                isInline={false}
                onSelect={onChangeSslProtocol}
                options={sslProtocolOptions}
                selectedOptions={[(checked.optionDisableSsl && 'disableSsl') || values.optionSslProtocol]}
              />
            </FormField>
            <FormField error={stepTwoErrorMessages.options} errorMessage={stepTwoErrorMessages.options}>
              <Form.Checkbox
                name="optionSslCert"
                checked={checked.optionSslCert || false}
                disabled={checked.optionDisableSsl}
                inline
                onChange={handleOnEvent}
              >
                Verify SSL Certificate
              </Form.Checkbox>
            </FormField>
          </React.Fragment>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      credentials,
      edit,
      hosts,
      hostsMultiple,
      hostsSingle,
      name,
      optionSslCert,
      optionSslProtocol,
      optionDisableSsl,
      optionParamiko,
      port,
      type
    } = this.props;

    const formValues = {
      name,
      hosts,
      hostsMultiple,
      hostsSingle,
      optionSslCert,
      optionSslProtocol,
      optionDisableSsl,
      optionParamiko,
      port,
      credentials
    };

    return (
      <FormState key={type} setValues={formValues} validateOnMount={edit} validate={this.isStepValid}>
        {({ handleOnSubmit, ...options }) => (
          <Form horizontal onSubmit={handleOnSubmit}>
            {this.renderName(options)}
            {this.renderHosts(options)}
            {this.renderCredentials(options)}
            {this.renderOptions(options)}
          </Form>
        )}
      </FormState>
    );
  }
}

/**
 * Prop types
 *
 * @type {{add: boolean, optionDisableSsl: boolean, hostsSingle: string, optionParamiko: boolean, credentials: Array,
 *     edit: boolean, stepTwoErrorMessages: object, hosts: Array, optionSslProtocol: string, getCredentials: Function,
 *     type: string, hostsMultiple: string, optionSslCert: boolean, availableCredentials: Array, t: Function,
 *     port: string|number, name: string, id: string|number}}
 */
AddSourceWizardStepTwo.propTypes = {
  add: PropTypes.bool,
  availableCredentials: PropTypes.array,
  credentials: PropTypes.array,
  edit: PropTypes.bool,
  getCredentials: PropTypes.func,
  hosts: PropTypes.array,
  hostsMultiple: PropTypes.string,
  hostsSingle: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  optionSslCert: PropTypes.bool,
  optionSslProtocol: PropTypes.string,
  optionDisableSsl: PropTypes.bool,
  optionParamiko: PropTypes.bool,
  port: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stepTwoErrorMessages: PropTypes.shape({
    credentials: PropTypes.string,
    hosts: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.string,
    port: PropTypes.string
  }),
  t: PropTypes.func,
  type: PropTypes.string
};

/**
 * Default props
 *
 * @type {{add: boolean, optionDisableSsl: null, hostsSingle: string, optionParamiko: null, credentials: *[], edit: boolean,
 *     stepTwoErrorMessages: {}, hosts: *[], optionSslProtocol: string, getCredentials: Function, type: null,
 *     hostsMultiple: string, optionSslCert: null, availableCredentials: *[], t: translate, port: string, name: string, id: null}}
 */
AddSourceWizardStepTwo.defaultProps = {
  add: true,
  availableCredentials: [],
  credentials: [],
  edit: false,
  getCredentials: helpers.noop,
  hosts: [],
  hostsMultiple: '',
  hostsSingle: '',
  id: null,
  name: '',
  optionSslCert: null,
  optionSslProtocol: 'SSLv23',
  optionDisableSsl: null,
  optionParamiko: null,
  port: '',
  stepTwoErrorMessages: {},
  t: translate,
  type: null
};

const mapDispatchToProps = dispatch => ({
  getCredentials: () => dispatch(reduxActions.credentials.getCredentials())
});

const makeMapStateToProps = () => {
  const mapSource = reduxSelectors.sources.makeSourceDetail();
  const mapCredentials = reduxSelectors.credentials.makeCredentialsDropdown();

  return (state, props) => ({
    add: state.addSourceWizard.add,
    edit: state.addSourceWizard.edit,
    stepTwoErrorMessages: state.addSourceWizard.stepTwoErrorMessages,
    ...mapSource(state, props),
    availableCredentials: mapCredentials(state, props)
  });
};

const ConnectedAddSourceWizardStepTwo = connect(makeMapStateToProps, mapDispatchToProps)(AddSourceWizardStepTwo);

export {
  ConnectedAddSourceWizardStepTwo as default,
  ConnectedAddSourceWizardStepTwo,
  AddSourceWizardStepTwo,
  sslProtocolOptions
};
