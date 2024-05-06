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
import { useNavigate } from '../router/routerContext';
import { useView } from '../view/viewContext';
import { useSources } from '../sources/sourcesContext';
import { helpers } from '../../common';
import { reduxTypes, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Return a scans empty state.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {string} props.uiShortName
 * @param {Function} props.useDispatch
 * @param {Function} props.useNavigate
 * @param {Function} props.useSources
 * @param {Function} props.useView
 * @returns {React.ReactNode}
 */
const ScansEmptyState = ({
  t,
  uiShortName,
  useDispatch: useAliasDispatch,
  useNavigate: useAliasNavigate,
  useSources: useAliasSources,
  useView: useAliasView
}) => {
  const { viewId } = useAliasView();
  const dispatch = useAliasDispatch();
  const navigate = useAliasNavigate();
  const { totalResults, hasData } = useAliasSources();

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
    <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText={
          <React.Fragment>
            {t('view.empty-state', { context: ['title', viewId], count: totalResults, name: uiShortName })}
          </React.Fragment>
        }
        icon={<EmptyStateIcon icon={AddCircleOIcon} />}
        headingLevel="h1"
      />
      <EmptyStateBody>
        {t('view.empty-state', { context: ['description', viewId], count: totalResults })}
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button onClick={onAddSource}>
            {t('view.empty-state', { context: ['label', 'source-navigate'], count: totalResults })}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

/**
 * Prop types
 *
 * @type {{uiShortName: string, useView: Function, t: Function, useSources: Function, useDispatch: Function,
 *     useNavigate: Function}}
 */
ScansEmptyState.propTypes = {
  t: PropTypes.func,
  uiShortName: PropTypes.string,
  useDispatch: PropTypes.func,
  useNavigate: PropTypes.func,
  useSources: PropTypes.func,
  useView: PropTypes.func
};

/**
 * Default props
 *
 * @type {{uiShortName: string, useView: Function, t: translate, useSources: Function, useDispatch: Function,
 *     useNavigate: Function}}
 */
ScansEmptyState.defaultProps = {
  t: translate,
  uiShortName: helpers.UI_SHORT_NAME,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useNavigate,
  useSources,
  useView
};

export { ScansEmptyState as default, ScansEmptyState };
