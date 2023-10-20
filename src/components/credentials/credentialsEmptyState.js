import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { AddCredentialType, ButtonVariant as CredentialButtonVariant } from '../addCredentialType/addCredentialType';
import helpers from '../../common/helpers';
import { translate } from '../i18n/i18n';

/**
 * Display an empty state for Credentials.
 *
 * @param {object} props
 * @param {Function} props.onAddSource
 * @param {Function} props.t
 * @param {string} props.uiSentenceStartName
 * @param {string} props.uiShortName
 * @param {string} props.viewId
 * @returns {React.ReactNode}
 */
const CredentialsEmptyState = ({ onAddSource, t, uiSentenceStartName, uiShortName, viewId }) => (
  <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.lg}>
    <EmptyStateHeader
      titleText={<React.Fragment>{t('view.empty-state', { context: 'title', name: uiShortName })}</React.Fragment>}
      icon={<EmptyStateIcon icon={AddCircleOIcon} />}
      headingLevel="h1"
    />
    <EmptyStateBody>
      {t('view.empty-state', { context: ['description', viewId], name: uiSentenceStartName })}
    </EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateActions>
        <AddCredentialType buttonVariant={CredentialButtonVariant.primary} />
      </EmptyStateActions>
      <EmptyStateActions>
        <Button variant={ButtonVariant.link} onClick={onAddSource}>
          {t('view.empty-state', { context: ['label', 'sources'] })}
        </Button>
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);

/**
 * Prop types
 *
 * @type {{uiShortName: string, t: Function, uiSentenceStartName: string, onAddSource: Function}}
 */
CredentialsEmptyState.propTypes = {
  onAddSource: PropTypes.func,
  t: PropTypes.func,
  uiSentenceStartName: PropTypes.string,
  uiShortName: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{uiShortName: string, t: translate, uiSentenceStartName: string, onAddSource: Function}}
 */
CredentialsEmptyState.defaultProps = {
  onAddSource: helpers.noop,
  t: translate,
  uiSentenceStartName: helpers.UI_SENTENCE_START_NAME,
  uiShortName: helpers.UI_SHORT_NAME,
  viewId: null
};

export { CredentialsEmptyState as default, CredentialsEmptyState };
