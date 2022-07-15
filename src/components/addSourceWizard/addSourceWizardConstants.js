import React from 'react';
import AddSourceWizardStepOne from './addSourceWizardStepOne';
import AddSourceWizardStepTwo from './addSourceWizardStepTwo';
import AddSourceWizardStepThree from './addSourceWizardStepThree';
import { translate } from '../i18n/i18n';

/**
 * Add a source, wizard steps. Applies state for wizard behavior.
 *
 * @type {{component: React.ReactNode, enableNext: Function|*, name: Function|*, canJumpTo: Function|boolean,
 *    nextButtonText: Function|*, id: number|string, hideBackButton: Function|boolean,
 *    hideCancelButton: Function|boolean}[]}
 */
const addSourceWizardSteps = [
  {
    id: 1,
    component: <AddSourceWizardStepOne />,
    canJumpTo: ({ fulfilled, pending }) => fulfilled === false && pending === false,
    enableNext: ({ stepOneValid }) => stepOneValid === true,
    name: () => translate('form-dialog.title', { context: ['add-source', 'step'] })
  },
  {
    id: 2,
    component: <AddSourceWizardStepTwo />,
    canJumpTo: ({ fulfilled, pending, stepOneValid }) =>
      fulfilled === false && pending === false && stepOneValid === true,
    enableNext: ({ stepOneValid, stepTwoValid }) => (stepOneValid && stepTwoValid) || false,
    name: () => translate('form-dialog.title', { context: ['add-source', 'step', 'two'] }),
    nextButtonText: () => translate('form-dialog.label', { context: ['submit', 'add-source'] })
  },
  {
    id: 3,
    component: <AddSourceWizardStepThree />,
    canJumpTo: ({ stepOneValid, stepTwoValid }) => (stepOneValid && stepTwoValid) || false,
    enableNext: ({ fulfilled, pending }) => fulfilled === true || pending === true,
    hideBackButton: ({ fulfilled, pending }) => fulfilled === true || pending === true,
    hideCancelButton: ({ fulfilled, pending }) => fulfilled === true || pending === true,
    name: () => translate('form-dialog.title', { context: ['add-source', 'step', 'three'] }),
    nextButtonText: () => translate('form-dialog.label', { context: ['close'] })
  }
];

/**
 * Edit a source, wizard steps. Applies state for wizard behavior.
 *
 * @type {{component: React.ReactNode, enableNext: Function|*, name: Function|*, canJumpTo: Function|boolean,
 *    nextButtonText: Function|*, id: number|string, hideBackButton: Function|boolean,
 *    hideCancelButton: Function|boolean}[]}
 */
const editSourceWizardSteps = [
  {
    id: 1,
    component: <AddSourceWizardStepTwo />,
    canJumpTo: ({ fulfilled, pending }) => fulfilled === false && pending === false,
    enableNext: ({ stepTwoValid }) => stepTwoValid || false,
    name: () => translate('form-dialog.title', { context: ['add-source', 'step', 'two'] }),
    nextButtonText: () => translate('form-dialog.label', { context: ['submit', 'add-source'] })
  },
  {
    id: 2,
    component: <AddSourceWizardStepThree />,
    canJumpTo: ({ stepTwoValid }) => stepTwoValid || false,
    enableNext: ({ fulfilled, pending }) => fulfilled === true || pending === true,
    hideBackButton: ({ fulfilled, pending }) => fulfilled === true || pending === true,
    hideCancelButton: ({ fulfilled, pending }) => fulfilled === true || pending === true,
    name: () => translate('form-dialog.title', { context: ['add-source', 'step', 'three'] }),
    nextButtonText: () => translate('form-dialog.label', { context: ['close'] })
  }
];

export { addSourceWizardSteps, editSourceWizardSteps };
