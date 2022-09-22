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
  ValidatedOptions
} from '@patternfly/react-core';
import { FieldLevelHelp } from 'patternfly-react';
import { Modal } from '../modal/modal';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { FormState } from '../formState/formState';
import { formHelpers } from '../form/formHelpers';
import { Checkbox } from '../form/checkbox';
import { FormGroup } from '../form/formGroup';
import { TextInput } from '../form/textInput';
import { TextArea, TextAreResizeOrientation } from '../form/textArea';
import { TouchSpin } from '../touchspin/touchspin';
import helpers from '../../common/helpers';
import apiTypes from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

class CreateScanDialog extends React.Component {
  onClose = () => {
    const { fulfilled } = this.props;

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
        title: 'Cancel Add Scan',
        heading: `Are you sure you want to cancel this scan?`,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        onConfirm: closeDialog
      });
    }
  };

  onValidateForm = ({ checked = {}, values = {} }) => {
    const errors = {};

    errors.scanName = formHelpers.isEmpty(values.scanName);

    if (!checked.jbossEap && !checked.jbossFuse && !checked.jbossWs && !checked.jbossBrms) {
      errors.scanDirectories = !formHelpers.isEmpty(values.scanDirectories);
    } else {
      errors.scanDirectories = values.scanDirectories.filter(dir => !/^\//.test(dir)).length > 0;
    }

    return errors;
  };

  onSubmit = ({ checked, values }) => {
    const { addScan, startScan } = this.props;

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
        apiTypes.API_SUBMIT_SCAN_OPTIONS_EXTENDED_SEARCH_BRMS
      ],
      checked.jbossBrms
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

    if (checked.jbossEap || checked.jbossFuse || checked.jbossWs || checked.jbossBrms) {
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
              Started scan <strong>{values.scanName}</strong>.
            </span>
          )
        });

        store.dispatch({
          type: reduxTypes.sources.UPDATE_SOURCES
        });
      },
      () => {
        const { props } = this;

        if (!props.show) {
          store.dispatch({
            type: reduxTypes.toastNotifications.TOAST_ADD,
            alertType: AlertVariant.danger,
            header: `Error creating scan ${values.scanName}`,
            message: props.errorMessage
          });
        }
      }
    );
  };

  renderNameSources({ values, errors, touched, handleOnEvent }) {
    const { submitErrorMessages } = this.props;

    return (
      <React.Fragment>
        <FormGroup
          label="Name"
          error={(touched.scanName && errors.scanName) || submitErrorMessages.scanName}
          errorMessage={submitErrorMessages.scanName || 'A scan name is required'}
        >
          <TextInput
            type="text"
            autoFocus
            name="scanName"
            value={values.scanName}
            maxLength={256}
            placeholder="Enter a name for the scan"
            onChange={handleOnEvent}
          />
        </FormGroup>
        <FormGroup label="Sources" error={submitErrorMessages.scanSources} errorMessage={submitErrorMessages.scanName}>
          <TextArea
            className="quipucords-form-control"
            name="displayScanSources"
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
    const { submitErrorMessages } = this.props;

    return (
      <FormGroup
        label="Maximum concurrent scans"
        error={submitErrorMessages.scanConcurrency}
        errorMessage={submitErrorMessages.scanConcurrency}
        helperText="Minimum value 1, maximum value 200"
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
    const { submitErrorMessages } = this.props;

    const onCheck = event => {
      const element = event.target;
      const isChecked = { ...checked };

      isChecked[element.name] = element.checked;

      if (!isChecked.jbossEap && !isChecked.jbossFuse && !isChecked.jbossWs && !isChecked.jbossBrms) {
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

    const popover = <p>Deep scanning provides more accurate detection, but will take longer.</p>;

    const scanProductsLabel = (
      <div>
        Deep scan
        <br />
        for these
        <br />
        products
        <FieldLevelHelp content={popover} close placement="top" />
      </div>
    );

    return (
      <React.Fragment>
        <FormGroup label={scanProductsLabel} isStack>
          <Checkbox
            ariaLabel="Red Hat JBoss Enterprise Application Platform"
            name="jbossEap"
            checked={checked.jbossEap}
            onChange={onCheck}
          >
            <abbr title="Red Hat JBoss Enterprise Application Platform">JBoss EAP</abbr>
          </Checkbox>
          <Checkbox ariaLabel="Red Hat Fuse" name="jbossFuse" checked={checked.jbossFuse} onChange={onCheck}>
            <abbr title="Red Hat Fuse">Fuse</abbr>
          </Checkbox>
          <Checkbox ariaLabel="Red Hat JBoss Web Server" name="jbossWs" checked={checked.jbossWs} onChange={onCheck}>
            <abbr title="Red Hat JBoss Web Server">JBoss Web Server</abbr>
          </Checkbox>
          <Checkbox
            ariaLabel="Red Hat Decision Manager, formerly Red Hat JBoss BRMS"
            name="jbossBrms"
            checked={checked.jbossBrms}
            onChange={onCheck}
          >
            <abbr title="Red Hat Decision Manager, formerly Red Hat JBoss BRMS">Decision Manager</abbr>
          </Checkbox>
        </FormGroup>
        <FormGroup
          label="Scan&nbsp;alternate directories"
          error={(touched.scanDirectories && errors.scanDirectories) || submitErrorMessages.scanDirectories}
          errorMessage={submitErrorMessages.scanDirectories || `Directories must begin with a root reference (/)`}
          helperText="Default directories are /, /opt, /app, /home, /usr"
        >
          <TextArea
            isDisabled={!checked.jbossEap && !checked.jbossFuse && !checked.jbossWs && !checked.jbossBrms}
            name="displayScanDirectories"
            value={values.displayScanDirectories}
            rows={4}
            placeholder="Optional. Enter values separated by commas"
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
    const { error, errorMessage, submitErrorMessages } = this.props;

    if (error && !Object.keys(submitErrorMessages).length) {
      return (
        <Alert isInline variant={AlertVariant.danger} title="Error">
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
          jbossBrms: false,
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
            header={<Title headingLevel="h4">Scan</Title>}
            actions={formActions(handleOnSubmit, isValid)}
          >
            <Form isHorizontal onSubmit={handleOnSubmit}>
              {pending && (
                <EmptyState className="quipucords-empty-state">
                  <EmptyStateIcon icon={Spinner} />
                  <Title headingLevel="h3">Scan updating...</Title>
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
