import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateIcon,
  Form,
  Spinner,
  Title,
  ValidatedOptions,
  EmptyStateHeader
} from '@patternfly/react-core';
import { Modal } from '../modal/modal';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { CONFIG as sourcesConfig } from '../sources/sources';
import { FormState } from '../formState/formState';
import { formHelpers } from '../form/formHelpers';
import { FormGroup } from '../form/formGroup';
import { TextInput } from '../form/textInput';
import { Checkbox } from '../form/checkbox';
import { TextArea, TextAreResizeOrientation } from '../form/textArea';
import { TouchSpin } from '../touchspin/touchspin';
import { Tooltip } from '../tooltip/tooltip';
import helpers from '../../common/helpers';
import apiTypes from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

class CreateScanDialog extends React.Component {
  onClose = () => {
    const { fulfilled, t } = this.props;

    const closeDialog = () => {
      store.dispatch({
        type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
      });

      store.dispatch({
        type: reduxTypes.scans.EDIT_SCAN_HIDE
      });
    };

    if (fulfilled) {
      closeDialog();
    } else {
      store.dispatch({
        type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_SHOW,
        title: t('form-dialog.confirmation', { context: ['title', 'add-scan'] }),
        heading: t('form-dialog.confirmation', { context: ['heading', 'add-scan'] }),
        cancelButtonText: t('form-dialog.label', { context: 'no' }),
        confirmButtonText: t('form-dialog.label', { context: 'yes' }),
        onConfirm: closeDialog
      });
    }
  };

  onValidateForm = ({ checked = {}, values = {} }) => {
    const errors = {};

    errors.scanName = formHelpers.isEmpty(values.scanName);

    if (!checked.jbossEap && !checked.jbossFuse && !checked.jbossWs) {
      errors.scanDirectories = !formHelpers.isEmpty(values.scanDirectories);
    } else {
      errors.scanDirectories = values.scanDirectories.filter(dir => !/^\//.test(dir)).length > 0;
    }

    return errors;
  };

  onSubmit = ({ checked, values }) => {
    const { addScan, startScan, t } = this.props;

    const scan = {
      [apiTypes.API_SUBMIT_SCAN_NAME]: values.scanName,
      [apiTypes.API_SUBMIT_SCAN_SOURCES]: values.scanSources
    };

    helpers.setPropIfDefined(
      scan,
      [apiTypes.API_SUBMIT_SCAN_OPTIONS, apiTypes.API_SUBMIT_SCAN_OPTIONS_MAX_CONCURRENCY],
      values.scanConcurrency
    );

    helpers.setPropIfDefined(
      scan,
      [
        apiTypes.API_SUBMIT_SCAN_OPTIONS,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_EAP
      ],
      checked.jbossEap
    );

    helpers.setPropIfDefined(
      scan,
      [
        apiTypes.API_SUBMIT_SCAN_OPTIONS,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_FUSE
      ],
      checked.jbossFuse
    );

    helpers.setPropIfDefined(
      scan,
      [
        apiTypes.API_SUBMIT_SCAN_OPTIONS,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH,
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_WS
      ],
      checked.jbossWs
    );

    if (checked.jbossEap || checked.jbossFuse || checked.jbossWs) {
      scan[apiTypes.API_SUBMIT_SCAN_OPTIONS][apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH][
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_DIRS
      ] = values.scanDirectories;
    }

    const addThenStartScan = async data => {
      const addResponse = await addScan(data);
      await startScan(addResponse.value.data[apiTypes.API_RESPONSE_SCAN_ID]);
    };

    addThenStartScan(scan).then(
      () => {
        this.onClose();

        store.dispatch({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.success,
          message: (
            <span>
              {t('toast-notifications.description', { context: ['scan-report', 'start'], name: values.scanName }, [
                <strong />
              ])}
            </span>
          )
        });

        store.dispatch({
          type: reduxTypes.view.UPDATE_VIEW,
          viewId: sourcesConfig.viewId
        });
      },
      () => {
        const { props } = this;

        if (!props.show) {
          store.dispatch({
            type: reduxTypes.toastNotifications.TOAST_ADD,
            alertType: AlertVariant.danger,
            header: t('toast-notifications.title', {
              context: ['scan-report', 'start', 'error'],
              name: values.scanName
            }),
            message: props.errorMessage
          });
        }
      }
    );
  };

  renderNameSources({ values, errors, touched, handleOnEvent }) {
    const { submitErrorMessages, t } = this.props;

    return (
      <React.Fragment>
        <FormGroup
          label={t('form-dialog.label', { context: 'scan-name' })}
          error={(touched.scanName && errors.scanName) || submitErrorMessages.scanName}
          errorMessage={submitErrorMessages.scanName || t('form-dialog.label', { context: ['scan-name', 'error'] })}
        >
          <TextInput
            type="text"
            autoFocus
            name="scanName"
            ouiaId="scan_name"
            value={values.scanName}
            maxLength={256}
            placeholder={t('form-dialog.label', { context: ['scan-name', 'placeholder'] })}
            onChange={handleOnEvent}
          />
        </FormGroup>
        <FormGroup
          label={t('form-dialog.label', { context: 'sources' })}
          error={submitErrorMessages.scanSources}
          errorMessage={submitErrorMessages.scanName}
        >
          <TextArea
            className="quipucords-form-control"
            name="displayScanSources"
            ouiaId="display_scan_sources"
            value={values.displayScanSources}
            rows={2}
            isReadOnly
            resizeOrientation={TextAreResizeOrientation.none}
          />
        </FormGroup>
      </React.Fragment>
    );
  }

  renderConcurrentScans({ values, handleOnEvent }) {
    const { submitErrorMessages, t } = this.props;

    return (
      <FormGroup
        label={t('form-dialog.label', { context: 'scan-concurrency' })}
        error={submitErrorMessages.scanConcurrency}
        errorMessage={submitErrorMessages.scanConcurrency}
        helperText={t('form-dialog.label', { context: ['scan-concurrency', 'help'] })}
        id="scanConcurrency"
      >
        <TouchSpin
          name="scanConcurrency"
          minValue={1}
          maxValue={200}
          value={values.scanConcurrency}
          onChange={handleOnEvent}
        />
      </FormGroup>
    );
  }

  renderAdditionalProducts({ checked, errors, handleOnEventCustom, handleOnEvent, touched, values }) {
    const { submitErrorMessages, t } = this.props;

    const onCheck = event => {
      const element = event.target;
      const isChecked = { ...checked };

      isChecked[element.name] = element.checked;

      if (!isChecked.jbossEap && !isChecked.jbossFuse && !isChecked.jbossWs) {
        handleOnEventCustom([
          {
            name: 'scanDirectories',
            value: []
          },
          {
            name: 'displayScanDirectories',
            value: ''
          },
          {
            name: element.name,
            checked: element.checked
          }
        ]);
      } else {
        handleOnEvent(event);
      }
    };

    const onChangeDirectories = event => {
      const { value } = event.target;

      let updatedDirs = (value || '').replace(/\\n|\\r|\s/g, ',').split(',');
      updatedDirs = updatedDirs.filter(host => host !== '');

      handleOnEventCustom([
        {
          name: 'scanDirectories',
          value: updatedDirs
        },
        {
          name: 'displayScanDirectories',
          value
        }
      ]);
    };

    const scanProductsLabel = (
      <div>
        {t('form-dialog.label', { context: ['deep-scan'] })}{' '}
        <Tooltip content={<p>{t('form-dialog.label', { context: ['deep-scan', 'tooltip'] })}</p>} />
      </div>
    );

    return (
      <React.Fragment>
        <FormGroup label={scanProductsLabel} isStack>
          <Checkbox
            ariaLabel={t('form-dialog.label', { context: ['jboss', 'full'] })}
            name="jbossEap"
            checked={checked.jbossEap}
            onChange={onCheck}
          >
            <abbr title={t('form-dialog.label', { context: ['jboss', 'full'] })}>
              {t('form-dialog.label', { context: ['jboss'] })}
            </abbr>
          </Checkbox>
          <Checkbox
            ariaLabel={t('form-dialog.label', { context: ['fuse', 'full'] })}
            name="jbossFuse"
            checked={checked.jbossFuse}
            onChange={onCheck}
          >
            <abbr title={t('form-dialog.label', { context: ['fuse', 'full'] })}>
              {t('form-dialog.label', { context: ['fuse'] })}
            </abbr>
          </Checkbox>
          <Checkbox
            ariaLabel={t('form-dialog.label', { context: ['jboss-server', 'full'] })}
            name="jbossWs"
            checked={checked.jbossWs}
            onChange={onCheck}
          >
            <abbr title={t('form-dialog.label', { context: ['jboss-server', 'full'] })}>
              {t('form-dialog.label', { context: ['jboss-server'] })}
            </abbr>
          </Checkbox>
        </FormGroup>
        <FormGroup
          label={t('form-dialog.label', { context: 'scan-alt-directories' })}
          error={(touched.scanDirectories && errors.scanDirectories) || submitErrorMessages.scanDirectories}
          errorMessage={
            submitErrorMessages.scanDirectories ||
            t('form-dialog.label', { context: ['scan-alt-directories', 'error'] })
          }
          helperText={t('form-dialog.label', { context: ['scan-alt-directories', 'help'] })}
        >
          <TextArea
            isDisabled={!checked.jbossEap && !checked.jbossFuse && !checked.jbossWs}
            name="displayScanDirectories"
            ouiaId="display_scan_directories"
            value={values.displayScanDirectories}
            rows={4}
            placeholder={t('form-dialog.label', { context: ['scan-alt-directories', 'placeholder'] })}
            onChange={onChangeDirectories}
            resizeOrientation={TextAreResizeOrientation.vertical}
            validated={
              (touched.scanDirectories && errors.scanDirectories) || submitErrorMessages.scanDirectories
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
          />
        </FormGroup>
      </React.Fragment>
    );
  }

  renderErrorMessage() {
    const { error, errorMessage, submitErrorMessages, t } = this.props;

    if (error && !Object.keys(submitErrorMessages).length) {
      return (
        <Alert isInline variant={AlertVariant.danger} title={t('form-dialog.label', { context: 'error' })}>
          {errorMessage}
        </Alert>
      );
    }

    return null;
  }

  render() {
    const { pending, show, sources, t } = this.props;

    if (!sources || sources.length === 0 || !sources[0]) {
      return null;
    }

    const formActions = (onSubmit, isValid) => {
      const updatedActions = [];
      if (!pending) {
        updatedActions.push(
          <Button key="scan" onClick={onSubmit} isDisabled={!isValid}>
            {t('form-dialog.label', { context: ['submit', 'create-scan'] })}
          </Button>
        );
        updatedActions.push(
          <Button key="cancel" variant={ButtonVariant.secondary} onClick={this.onClose}>
            {t('form-dialog.label', { context: 'cancel' })}
          </Button>
        );
      }
      return updatedActions;
    };

    return (
      <FormState
        validateOnMount={false}
        setValues={{
          displayScanDirectories: '',
          displayScanSources: sources.map(item => item.name).join(', '),
          scanConcurrency: 25,
          scanDirectories: [],
          jbossEap: false,
          jbossFuse: false,
          jbossWs: false,
          scanName: '',
          scanSources: sources.map(item => item.id)
        }}
        validate={this.onValidateForm}
        onSubmit={this.onSubmit}
      >
        {({ handleOnSubmit, isValid, ...options }) => (
          <Modal
            isOpen={show}
            showClose
            onClose={this.onClose}
            header={<Title headingLevel="h4">{t('form-dialog.title', { context: 'create-scan' })}</Title>}
            actions={formActions(handleOnSubmit, isValid)}
          >
            <Form isHorizontal onSubmit={handleOnSubmit}>
              {pending && (
                <EmptyState className="quipucords-empty-state">
                  <EmptyStateHeader
                    titleText={
                      <React.Fragment>
                        {t('form-dialog.empty-state', { context: ['title', 'create-scan', 'pending'] })}
                      </React.Fragment>
                    }
                    icon={<EmptyStateIcon icon={Spinner} />}
                    headingLevel="h3"
                  />
                </EmptyState>
              )}
              {!pending && this.renderErrorMessage(options)}
              {!pending && this.renderNameSources(options)}
              {!pending && this.renderConcurrentScans(options)}
              {!pending && this.renderAdditionalProducts(options)}
            </Form>
          </Modal>
        )}
      </FormState>
    );
  }
}

CreateScanDialog.propTypes = {
  addScan: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  fulfilled: PropTypes.bool,
  pending: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  sources: PropTypes.array.isRequired,
  startScan: PropTypes.func,
  submitErrorMessages: PropTypes.shape({
    scanConcurrency: PropTypes.string,
    scanDirectories: PropTypes.string,
    scanName: PropTypes.string,
    scanSources: PropTypes.string
  }),
  t: PropTypes.func
};

CreateScanDialog.defaultProps = {
  addScan: helpers.noop,
  error: false,
  errorMessage: null,
  fulfilled: false,
  pending: false,
  startScan: helpers.noop,
  submitErrorMessages: {},
  t: translate
};

const mapDispatchToProps = dispatch => ({
  addScan: data => dispatch(reduxActions.scans.addScan(data)),
  startScan: data => dispatch(reduxActions.scans.addStartScan(data))
});

const mapStateToProps = state => ({ ...state.scansEdit });

const ConnectedCreateScanDialog = connect(mapStateToProps, mapDispatchToProps)(CreateScanDialog);

export { ConnectedCreateScanDialog as default, ConnectedCreateScanDialog, CreateScanDialog };
