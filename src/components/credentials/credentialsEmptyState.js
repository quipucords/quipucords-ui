import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title
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
 * @returns {React.ReactNode}
 */
const CredentialsEmptyState = ({ onAddSource, t, uiSentenceStartName, uiShortName }) => (
  <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
    <EmptyStateIcon icon={AddCircleOIcon} />
    <Title headingLevel="h1">{t('view.empty-state', { context: 'title', name: uiShortName })}</Title>
    <EmptyStateBody>
      {t('view.empty-state', { context: ['description', 'credentials'], name: uiSentenceStartName })}
    </EmptyStateBody>
    <EmptyStatePrimary>
      <AddCredentialType buttonVariant={CredentialButtonVariant.primary} />
    </EmptyStatePrimary>
    <EmptyStateSecondaryActions>
      <Button variant={ButtonVariant.link} onClick={onAddSource}>
        {t('view.empty-state', { context: ['label', 'source'] })}
      </Button>
    </EmptyStateSecondaryActions>
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
  uiShortName: PropTypes.string
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
  uiShortName: helpers.UI_SHORT_NAME
};

export { CredentialsEmptyState as default, CredentialsEmptyState };
