import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant, Form, InputGroup, ValidatedOptions } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { connect, store, reduxActions, reduxSelectors, reduxTypes } from '../../redux';
import { helpers } from '../../common';
import { apiTypes } from '../../constants/apiConstants';
import { FormGroup } from '../form/formGroup';
import { Checkbox } from '../form/checkbox';
import { TextArea, TextAreResizeOrientation } from '../form/textArea';
import { formHelpers } from '../form/formHelpers';
import { TextInput } from '../form/textInput';
import { FormState } from '../formState/formState';
import { DropdownSelect, SelectVariant } from '../dropdownSelect/dropdownSelect';
import { translate } from '../i18n/i18n';

/**
 * Available ssl protocol types
 *
 * @type {{SSLv23: string, TLSv1: string, TLSv1_2: string, TLSv1_1: string}}
 */
const sslProtocolDictionary = {
  SSLv23: 'SSLv23',
  TLSv1: 'TLSv1',
  TLSv1_1: 'TLSv1.1',
  TLSv1_2: 'TLSv1.2'
};

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

    errors.credentials = formHelpers.isEmpty(values.credentials);
    errors.name = formHelpers.isEmpty(values.name);

    if (type === 'network') {
      errors.hosts = formHelpers.isEmpty(values.hosts) || !AddSourceWizardStepTwo.hostsValid(values.hosts);
    } else {
      errors.hosts = formHelpers.isEmpty(values.hosts) || !AddSourceWizardStepTwo.hostValid(values.hosts[0]);
    }

    errors.port = !formHelpers.isEmpty(values.port) && !formHelpers.isPortValid(values.port);

    const isNotErrors = !Object.values(errors).filter(val => val === true).length;

    if ((add && isNotErrors) || (edit && isNotErrors && Object.keys(touched).length)) {
      this.submitStep({
        checked,
        values
      });
    } else {
      store.dispatch({
        type: reduxTypes.sources.INVALID_SOURCE_WIZARD_STEPTWO
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
    const { stepTwoErrorMessages, type, t } = this.props;

    return (
      <FormGroup
        label={t('form-dialog.label', { context: 'name' })}
        error={(touched.name && errors.name) || stepTwoErrorMessages.name}
        errorMessage={stepTwoErrorMessages.name || t('form-dialog.label', { context: ['name', 'add-source', 'error'] })}
      >
        <TextInput
          ouiaId="name"
          name="name"
          value={values.name}
          placeholder={t('form-dialog.label', { context: ['name', 'add-source', 'placeholder', type] })}
          onChange={handleOnEvent}
          onClear={handleOnEvent}
          validated={
            (touched.name && errors.name) || stepTwoErrorMessages.name
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
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

    const { t } = this.props;

    switch (type) {
      case 'network':
        return (
          <React.Fragment>
            <FormGroup
              label={t('form-dialog.label', { context: 'search-addresses' })}
              error={(touched.hostsMultiple && errors.hosts) || stepTwoErrorMessages.hosts}
              errorMessage={t('form-dialog.label', {
                context: ['search-addresses', 'error']
              })}
              helperText={t('form-dialog.label', {
                context: ['search-addresses', 'help']
              })}
            >
              <TextArea
                name="hostsMultiple"
                rows={5}
                value={values.hostsMultiple}
                ouiaId="hosts_multiple"
                placeholder={t('form-dialog.label', {
                  context: ['search-addresses', 'placeholder']
                })}
                onChange={onChangeMultipleHost}
                onClear={onChangeMultipleHost}
                resizeOrientation={TextAreResizeOrientation.vertical}
                validated={
                  (touched.hostsMultiple && errors.hosts) || stepTwoErrorMessages.hosts
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            </FormGroup>
            <FormGroup
              label={t('form-dialog.label', { context: 'port' })}
              error={(touched.port && errors.port) || stepTwoErrorMessages.port}
              errorMessage={t('form-dialog.label', {
                context: ['port', 'error']
              })}
            >
              <TextInput
                ouiaId="port"
                name="port"
                value={values.port}
                maxLength={5}
                placeholder={t('form-dialog.label', {
                  context: ['port', 'placeholder']
                })}
                onChange={handleOnEvent}
                onClear={handleOnEvent}
                validated={
                  (touched.port && errors.port) || stepTwoErrorMessages.port
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            </FormGroup>
          </React.Fragment>
        );

      case 'vcenter':
      case 'satellite':
      case 'openshift':
      case 'acs':
      case 'ansible':
        const hostPortError = `${
          (touched.hostsSingle &&
            errors.hosts &&
            `${t('form-dialog.label', {
              context: ['search-address', 'error']
            })} `) ||
          ''
        }${
          (errors.port &&
            t('form-dialog.label', {
              context: ['search-address', 'error', 'port']
            })) ||
          ''
        }`;

        return (
          <FormGroup
            label={t('form-dialog.label', { context: 'search-address' })}
            error={
              (touched.hostsSingle && errors.hosts) ||
              errors.port ||
              stepTwoErrorMessages.hosts ||
              stepTwoErrorMessages.port
            }
            errorMessage={
              (stepTwoErrorMessages.hosts &&
                t('form-dialog.label', {
                  context: ['search-address', 'error']
                })) ||
              (stepTwoErrorMessages.port &&
                t('form-dialog.label', {
                  context: ['search-address', 'error', 'port']
                })) ||
              hostPortError
            }
          >
            <TextInput
              ouiaId="hosts_single"
              name="hostsSingle"
              value={values.hostsSingle}
              placeholder={t('form-dialog.label', {
                context: ['search-address', 'placeholder']
              })}
              onChange={onChangeSingleHost}
              onClear={onChangeSingleHost}
              validated={
                (touched.hostsSingle && errors.hosts) ||
                errors.port ||
                stepTwoErrorMessages.hosts ||
                stepTwoErrorMessages.port
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
            />
          </FormGroup>
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
      <FormGroup
        fieldId="addCredentials"
        label={t('form-dialog.label', { context: 'credential' })}
        error={(touched.credentials && errors.credentials) || stepTwoErrorMessages.credentials}
        errorMessage={stepTwoErrorMessages.credentials || t('form-dialog.label', { context: ['credential', 'error'] })}
      >
        <InputGroup>
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
            ouiaId="add_credentials_select"
          />
          <Button
            id="addCredentials"
            variant={ButtonVariant.control}
            aria-label={t('form-dialog.label', { context: 'add-credential' })}
            icon={<PlusIcon />}
            onClick={this.onAddCredential}
            title={t('form-dialog.label', { context: 'add-credential' })}
            ouiaId="add_credentials_add_new"
          />
        </InputGroup>
      </FormGroup>
    );
  }

  renderOptions({ checked, values, handleOnEvent, handleOnEventCustom }) {
    const { type, stepTwoErrorMessages, t } = this.props;

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
          <FormGroup error={stepTwoErrorMessages.options} errorMessage={stepTwoErrorMessages.options}>
            <Checkbox
              name="optionParamiko"
              checked={checked.optionParamiko || false}
              onChange={handleOnEvent}
              ouiaId="options_paramiko"
            >
              {t('form-dialog.label', { context: 'paramiko' }, [
                <abbr title={t('form-dialog.label', { context: 'ssh' })} />
              ])}
            </Checkbox>
          </FormGroup>
        );
      case 'openshift':
      case 'acs':
      case 'vcenter':
      case 'satellite':
      case 'ansible':
        return (
          <React.Fragment>
            <FormGroup label={t('form-dialog.label', { context: 'connection' })}>
              <DropdownSelect
                id="optionSslProtocol"
                isInline={false}
                onSelect={onChangeSslProtocol}
                options={sslProtocolOptions}
                selectedOptions={[(checked.optionDisableSsl && 'disableSsl') || values.optionSslProtocol]}
                ouiaId="options_ssl_protocol"
              />
            </FormGroup>
            <FormGroup error={stepTwoErrorMessages.options} errorMessage={stepTwoErrorMessages.options}>
              <Checkbox
                name="optionSslCert"
                checked={checked.optionSslCert}
                isDisabled={checked.optionDisableSsl}
                onChange={handleOnEvent}
                ouiaId="options_ssl_cert"
              >
                {t('form-dialog.label', { context: 'ssl-certificate' })}
              </Checkbox>
            </FormGroup>
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
          <Form isHorizontal onSubmit={handleOnSubmit}>
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
  optionSslCert: true,
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
