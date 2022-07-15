import React from 'react';
import PropTypes from 'prop-types';
import { ModalVariant } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { addSourceWizardSteps, editSourceWizardSteps } from './addSourceWizardConstants';
import { Wizard } from '../wizard/wizard';
import { useGetAddSource } from './addSourceWizardContext';
import apiTypes from '../../constants/apiConstants';
import { EMPTY_CONTEXT, translate } from '../i18n/i18n';

/**
 * Add a source with a Wizard.
 *
 * @fires onCancel
 * @fires onSubmit
 * @param {object} props
 * @param {Function} props.addSource
 * @param {Array} props.addSteps
 * @param {Array} props.editSteps
 * @param {Function} props.t
 * @param {Function} props.updateSource
 * @param {Function} props.useDispatch
 * @param {Function} props.useGetAddSource
 * @returns {React.ReactNode}
 */
const AddSourceWizard = ({
  addSource,
  addSteps,
  editSteps,
  t,
  updateSource,
  useDispatch: useAliasDispatch,
  useGetAddSource: useAliasGetAddSource
}) => {
  const dispatch = useAliasDispatch();
  const { edit, errorStatus, fulfilled, pending, source, stepOneValid, stepTwoValid, show } = useAliasGetAddSource();

  /**
   * If value is a function, run it and pass state for step validation.
   *
   * @param {*} value
   * @returns {*}
   */
  const isFunctionRun = value => {
    if (typeof value === 'function') {
      return value({ fulfilled, pending, stepOneValid, stepTwoValid });
    }
    return value;
  };

  const updatedSteps = ((edit && editSteps) || addSteps).map(step => {
    const updatedStep = {};
    Object.entries(step).forEach(([key, value]) => {
      updatedStep[key] = isFunctionRun(value);
    });
    return updatedStep;
  });

  /**
   * On close, or cancel the wizard process dispatch notifications, close the wizard.
   *
   * @event onCancel
   */
  const onCancel = () => {
    const closeWizard = () => {
      dispatch([
        {
          type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
        },
        {
          type: reduxTypes.sources.UPDATE_SOURCE_HIDE
        }
      ]);

      if (fulfilled) {
        dispatch({
          type: reduxTypes.sources.UPDATE_SOURCES
        });
      }
    };

    if (fulfilled || errorStatus >= 500 || errorStatus === 0) {
      closeWizard();
      return;
    }

    dispatch({
      type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_SHOW,
      title: t('form-dialog.confirmation_title_add-source', { context: [pending && 'exit', edit && 'edit'] }),
      heading: t('form-dialog.confirmation_heading_add-source', { context: [pending && 'exit', edit && 'edit'] }),
      body: t('form-dialog.confirmation_body_add-source', {
        context: [pending && 'exit', edit && 'edit', !pending && EMPTY_CONTEXT]
      }),
      cancelButtonText: t('form-dialog.label', { context: 'no' }),
      confirmButtonText: t('form-dialog.label', { context: 'yes' }),
      onConfirm: closeWizard,
      variant: ModalVariant.medium
    });
  };

  /**
   * On save, submit, the wizard form.
   *
   * @event onSubmit
   */
  const onSubmit = () => {
    if (stepOneValid && stepTwoValid) {
      if (edit) {
        updateSource(source[apiTypes.API_SUBMIT_SOURCE_ID], source)(dispatch);
      } else {
        addSource(source, { scan: true })(dispatch);
      }
    }
  };

  return (
    <Wizard
      className="quipucords-wizard__add-source"
      isForm
      onClose={onCancel}
      onNext={onSubmit}
      isOpen={show}
      steps={updatedSteps}
      title={t('form-dialog.title', { context: ['add-source', edit && 'edit'] })}
      variant={ModalVariant.medium}
    />
  );
};

/**
 * Prop types
 *
 * @type {{editSteps: Array, edit: boolean, pending: boolean, stepOneValid: boolean, show: boolean,
 *     errorMessage: string, fulfilled: boolean, stepTwoValid: boolean, addSteps: Array, source: object,
 *     addSource: Function, updateSource: Function, t: Function, useDispatch: Function,
 *     errorStatus: number}}
 */
AddSourceWizard.propTypes = {
  addSource: PropTypes.func,
  addSteps: PropTypes.array,
  editSteps: PropTypes.array,
  t: PropTypes.func,
  updateSource: PropTypes.func,
  useDispatch: PropTypes.func,
  useGetAddSource: PropTypes.func
};

/**
 * Default props
 *
 * @type {{editSteps: *[], edit: boolean, pending: boolean, stepOneValid: boolean, errorMessage: null,
 *     fulfilled: boolean, stepTwoValid: boolean, addSteps: *[], source: {}, addSource: Function,
 *     updateSource: Function, t: translate, useDispatch: Function, errorStatus: null}}
 */
AddSourceWizard.defaultProps = {
  addSource: reduxActions.sources.addSource,
  addSteps: addSourceWizardSteps,
  editSteps: editSourceWizardSteps,
  t: translate,
  updateSource: reduxActions.sources.updateSource,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useGetAddSource
};

export { AddSourceWizard as default, AddSourceWizard };
