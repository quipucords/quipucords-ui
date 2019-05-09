import React from 'react';
import PropTypes from 'prop-types';
import { Button, EmptyState, Grid, Row } from 'patternfly-react';
import SourcesEmptyState from '../sources/sourcesEmptyState';
import helpers from '../../common/helpers';
import { connectRouter, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';

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
    const { sourcesExist } = this.props;

    if (sourcesExist) {
      return (
        <Grid fluid>
          <Row>
            <EmptyState className="full-page-blank-slate">
              <EmptyState.Icon />
              <EmptyState.Title>No scans exist yet</EmptyState.Title>
              <EmptyState.Info>Select a Source to scan from the Sources page.</EmptyState.Info>
              <EmptyState.Action>
                <Button bsStyle="primary" bsSize="large" onClick={this.onAddSource}>
                  Go to Sources
                </Button>
              </EmptyState.Action>
            </EmptyState>
          </Row>
        </Grid>
      );
    }

    return <SourcesEmptyState onAddSource={this.onAddSource} />;
  }
}

ScansEmptyState.propTypes = {
  getScansSources: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  sourcesExist: PropTypes.bool
};

ScansEmptyState.defaultProps = {
  getScansSources: helpers.noop,
  history: {},
  sourcesExist: false
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
