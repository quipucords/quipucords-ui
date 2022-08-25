import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import helpers from '../../common/helpers';
import { translate } from '../i18n/i18n';

/**
 * Return a sources empty state.
 *
 * @param {object} props
 * @param {Function} props.onAddSource
 * @param {Function} props.t
 * @param {string} props.uiShortName
 * @param {string} props.viewId
 * @returns {React.ReactNode}
 */
const SourcesEmptyState = ({ onAddSource, t, uiShortName, viewId }) => (
  <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
    <EmptyStateIcon icon={AddCircleOIcon} />
    <Title headingLevel="h1">{t('view.empty-state', { context: ['title'], name: uiShortName })}</Title>
    <EmptyStateBody>{t('view.empty-state', { context: ['description', viewId] })}</EmptyStateBody>
    <EmptyStatePrimary>
      <Button onClick={onAddSource}>{t('view.empty-state', { context: ['label', viewId] })}</Button>
    </EmptyStatePrimary>
  </EmptyState>
);

/**
 * Prop types
 *
 * @type {{uiShortName: string, viewId: string, t: Function, onAddSource: Function}}
 */
SourcesEmptyState.propTypes = {
  onAddSource: PropTypes.func,
  uiShortName: PropTypes.string,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{uiShortName: string, viewId: null, t: translate, onAddSource: Function}}
 */
SourcesEmptyState.defaultProps = {
  onAddSource: helpers.noop,
  uiShortName: helpers.UI_SHORT_NAME,
  t: translate,
  viewId: null
};

export { SourcesEmptyState as default, SourcesEmptyState };
