import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter
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
  <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.lg}>
    <EmptyStateHeader
      titleText={<React.Fragment>{t('view.empty-state', { context: ['title'], name: uiShortName })}</React.Fragment>}
      icon={<EmptyStateIcon icon={AddCircleOIcon} />}
      headingLevel="h1"
    />
    <EmptyStateBody>{t('view.empty-state', { context: ['description', viewId] })}</EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateActions>
        <Button onClick={onAddSource} ouiaId="add_source">
          {t('view.empty-state', { context: ['label', viewId] })}
        </Button>
      </EmptyStateActions>
    </EmptyStateFooter>
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
