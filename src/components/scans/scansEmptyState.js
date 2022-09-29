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
import { useView } from '../view/viewContext';
import { useContextGetSources } from '../sources/sourcesContext';
import { helpers } from '../../common';
import { reduxTypes, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Return a scans empty state.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {string} props.uiShortName
 * @param {Function} props.useContextGetSources
 * @param {Function} props.useDispatch
 * @param {Function} props.useNavigate
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const ScansEmptyState = ({
  t,
  uiShortName,
  useContextGetSources: useAliasContextGetSources,
  useDispatch: useAliasDispatch,
  useNavigate: useAliasNavigate,
  useView: useAliasView
}) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();
  const navigate = useAliasNavigate();
  const { totalResults, hasData } = useAliasContextGetSources();

  const onAddSource = () => {
    if (hasData) {
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
        {t('view.empty-state', { context: ['title', viewId], count: totalResults, name: uiShortName })}
      </Title>
      <EmptyStateBody>
        {t('view.empty-state', { context: ['description', viewId], count: totalResults })}
      </EmptyStateBody>
      <EmptyStatePrimary>
        <Button onClick={onAddSource}>
          {t('view.empty-state', { context: ['label', 'source-navigate'], count: totalResults })}
        </Button>
      </EmptyStatePrimary>
    </EmptyState>
  );
};

/**
 * Prop types
 *
 * @type {{uiShortName: string, useView: Function, t: Function, useContextGetSources: Function, useDispatch: Function,
 *     useNavigate: Function}}
 */
ScansEmptyState.propTypes = {
  t: PropTypes.func,
  uiShortName: PropTypes.string,
  useDispatch: PropTypes.func,
  useNavigate: PropTypes.func,
  useContextGetSources: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{uiShortName: string, useView: Function, t: translate, useContextGetSources: Function, useDispatch: Function,
 *     useNavigate: Function}}
 */
ScansEmptyState.defaultProps = {
  t: translate,
  uiShortName: helpers.UI_SHORT_NAME,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useNavigate,
  useContextGetSources,
  useView
};

export { ScansEmptyState as default, ScansEmptyState };
