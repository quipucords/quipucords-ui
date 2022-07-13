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
import SourcesEmptyState from '../sources/sourcesEmptyState';
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
    const { sourcesExist, t } = this.props;

    if (sourcesExist) {
      return (
        <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={AddCircleOIcon} />
          <Title headingLevel="h1">{t('view.empty-state', { context: ['title', 'scans'] })}</Title>
          <EmptyStateBody>{t('view.empty-state', { context: ['description', 'scans'] })}</EmptyStateBody>
          <EmptyStatePrimary>
            <Button onClick={this.onAddSource}>
              {t('view.empty-state', { context: ['label', 'source-navigate'] })}
            </Button>
          </EmptyStatePrimary>
        </EmptyState>
      );
    }

    return <SourcesEmptyState onAddSource={this.onAddSource} />;
  }
}

/**
 * Prop types
 *
 * @type {{getScansSources: Function, sourcesExist: boolean, t: Function, history: object}}
 */
ScansEmptyState.propTypes = {
  getScansSources: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  sourcesExist: PropTypes.bool,
  t: PropTypes.func
};

/**
 * Default props
 *
 * @type {{getScansSources: Function, sourcesExist: boolean, t: translate, history: object}}
 */
ScansEmptyState.defaultProps = {
  getScansSources: helpers.noop,
  history: {},
  sourcesExist: false,
  t: translate
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
