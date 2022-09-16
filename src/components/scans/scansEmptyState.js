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
import { useNavigate } from '../router/routerContext';
import { useSourcesExist } from '../sources/sourcesContext';
import { helpers } from '../../common';
import { reduxTypes, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Return a scans empty state.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useNavigate
 * @param {Function} props.useDispatch
 * @param {string} props.uiShortName
 * @param {Function} props.useSourcesExist
 * @param {string} props.viewId
 * @returns {React.ReactNode}
 */
const ScansEmptyState = ({
  t,
  useDispatch: useAliasDispatch,
  useNavigate: useAliasNavigate,
  uiShortName,
  useSourcesExist: useAliasSourcesExist,
  viewId
}) => {
  const dispatch = useAliasDispatch();
  const navigate = useAliasNavigate();
  const { sourcesCount, hasSources } = useAliasSourcesExist();

  const onAddSource = () => {
    if (hasSources) {
      navigate('/sources');
    } else {
      dispatch({
        type: reduxTypes.sources.CREATE_SOURCE_SHOW
      });
    }
  };

  return (
    <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
      <EmptyStateIcon icon={AddCircleOIcon} />
      <Title headingLevel="h1">
        {t('view.empty-state', { context: ['title', viewId], count: sourcesCount, name: uiShortName })}
      </Title>
      <EmptyStateBody>
        {t('view.empty-state', { context: ['description', viewId], count: sourcesCount })}
      </EmptyStateBody>
      <EmptyStatePrimary>
        <Button onClick={onAddSource}>
          {t('view.empty-state', { context: ['label', 'source-navigate'], count: sourcesCount })}
        </Button>
      </EmptyStatePrimary>
    </EmptyState>
  );
};

/**
 * Prop types
 *
 * @type {{uiShortName: string, viewId: string, t: Function, useSourcesExist: Function, useDispatch: Function,
 *     useNavigate: Function}}
 */
ScansEmptyState.propTypes = {
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useNavigate: PropTypes.func,
  uiShortName: PropTypes.string,
  useSourcesExist: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{uiShortName: string, viewId: null, t: translate, useSourcesExist: Function, useDispatch: Function,
 *     useNavigate: Function}}
 */
ScansEmptyState.defaultProps = {
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useNavigate,
  uiShortName: helpers.UI_SHORT_NAME,
  useSourcesExist,
  viewId: null
};

export { ScansEmptyState as default, ScansEmptyState };
