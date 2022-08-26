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
import { connectRouter, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { translate } from '../i18n/i18n';

/**
 * Return a scans empty state.
 */
class ScansEmptyState extends React.Component {
  componentDidMount() {
    const { getScansSources } = this.props;

    getScansSources();
  }

  onAddSource = () => {
    const { history, sourcesExist } = this.props;

    if (sourcesExist) {
      history.push('/sources');
    } else {
      store.dispatch({
        type: reduxTypes.sources.CREATE_SOURCE_SHOW
      });
    }
  };

  render() {
    const { sourcesCount, t, uiShortName, viewId } = this.props;

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
          <Button onClick={this.onAddSource}>
            {t('view.empty-state', { context: ['label', 'source-navigate'], count: sourcesCount })}
          </Button>
        </EmptyStatePrimary>
      </EmptyState>
    );
  }
}

/**
 * Prop types
 *
 * @type {{getScansSources: Function, uiShortName: string, sourcesExist: boolean, viewId: string, t: translate,
 *    history: object, sourcesCount: number}}
 */
ScansEmptyState.propTypes = {
  getScansSources: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  sourcesCount: PropTypes.number,
  sourcesExist: PropTypes.bool,
  t: PropTypes.func,
  uiShortName: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{getScansSources: Function, uiShortName: string, sourcesExist: boolean, viewId: null, t: translate,
 *    history: {}, sourcesCount: number}}
 */
ScansEmptyState.defaultProps = {
  getScansSources: helpers.noop,
  history: {},
  sourcesCount: 0,
  sourcesExist: false,
  t: translate,
  uiShortName: helpers.UI_SHORT_NAME,
  viewId: null
};

const mapDispatchToProps = dispatch => ({
  getScansSources: queryObj => dispatch(reduxActions.sources.getScansSources(queryObj))
});

const makeMapStateToProps = () => {
  const scansEmptyState = reduxSelectors.scans.makeScansEmptyState();

  return (state, props) => ({
    ...scansEmptyState(state, props)
  });
};

const ConnectedScansEmptyState = connectRouter(makeMapStateToProps, mapDispatchToProps)(ScansEmptyState);

export { ConnectedScansEmptyState as default, ConnectedScansEmptyState, ScansEmptyState };
