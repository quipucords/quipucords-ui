import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Spinner, Title } from '@patternfly/react-core';
import { OutlinedCheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_success_color_100 as green, global_danger_color_100 as red } from '@patternfly/react-tokens';
import { connect, reduxSelectors } from '../../redux';
import { EMPTY_CONTEXT, translate } from '../i18n/i18n';

/**
 * Add source wizard, step three, confirmation.
 *
 * @param {object} props
 * @param {boolean} props.add
 * @param {boolean} props.error
 * @param {boolean} props.fulfilled
 * @param {boolean} props.pending
 * @param {string} props.name
 * @param {Function} props.t
 * @returns {React.ReactNode}
 */
const AddSourceWizardStepThree = ({ add, error, fulfilled, pending, name, t }) => (
  <EmptyState className="quipucords-empty-state">
    {error && <EmptyStateIcon icon={ExclamationCircleIcon} data-test-state="error" color={red.value} />}
    {fulfilled && <EmptyStateIcon icon={OutlinedCheckCircleIcon} data-test-state="fulfilled" color={green.value} />}
    {pending && <EmptyStateIcon icon={Spinner} data-test-state="pending" />}
    <Title headingLevel="h3">
      {t('form-dialog.empty-state_title_add-source', {
        context: [(error && 'error') || (pending && 'pending'), !add && 'edit'],
        name
      })}
    </Title>
    <EmptyStateBody>
      {t(`form-dialog.empty-state_description_add-source`, {
        context: [(error && 'error') || (pending && 'pending'), (!add && pending && 'edit') || EMPTY_CONTEXT],
        name
      })}
    </EmptyStateBody>
  </EmptyState>
);

/**
 * Prop types
 *
 * @type {{add: boolean, t: Function, pending: boolean, fulfilled: boolean, name: string, error: boolean}}
 */
AddSourceWizardStepThree.propTypes = {
  add: PropTypes.bool,
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  pending: PropTypes.bool,
  name: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props
 *
 * @type {{add: boolean, t: translate, pending: boolean, fulfilled: boolean, name: null, error: boolean}}
 */
AddSourceWizardStepThree.defaultProps = {
  add: false,
  error: false,
  fulfilled: false,
  pending: false,
  name: null,
  t: translate
};

const makeMapStateToProps = () => {
  const mapSource = reduxSelectors.sources.makeSourceDetail();

  return (state, props) => ({
    ...state.addSourceWizard,
    ...mapSource(state, props)
  });
};

const ConnectedAddSourceWizardStepThree = connect(makeMapStateToProps)(AddSourceWizardStepThree);

export { ConnectedAddSourceWizardStepThree as default, ConnectedAddSourceWizardStepThree, AddSourceWizardStepThree };
