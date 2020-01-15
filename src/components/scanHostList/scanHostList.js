import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, Grid, Spinner } from 'patternfly-react';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common/helpers';
import { apiTypes } from '../../constants/apiConstants';

class ScanHostList extends React.Component {
  state = {
    currentPage: 1,
    queryObject: {
      [apiTypes.API_QUERY_PAGE]: 1,
      [apiTypes.API_QUERY_PAGE_SIZE]: 100,
      [apiTypes.API_QUERY_ORDERING]: 'name'
    }
  };

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh(updatedQueryObject = {}) {
    const { queryObject } = this.state;
    const {
      filter,
      getConnectionScanResults,
      getInspectionScanResults,
      id,
      useConnectionResults,
      useInspectionResults
    } = this.props;

    if (useConnectionResults) {
      getConnectionScanResults(id, { ...queryObject, ...filter, ...updatedQueryObject });
    }

    if (useInspectionResults) {
      getInspectionScanResults(id, { ...queryObject, ...filter, ...updatedQueryObject });
    }
  }

  onScrollList = event => {
    const { target } = event;
    const { currentPage } = this.state;
    const { isMoreResults, pending } = this.props;

    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (bottom && !pending && isMoreResults) {
      const newPage = currentPage + 1;

      const updatedQueryObject = {
        [apiTypes.API_QUERY_PAGE]: newPage
      };

      this.setState(
        {
          currentPage: newPage
        },
        () => {
          this.onRefresh(updatedQueryObject);
        }
      );
    }
  };

  render() {
    const { children, error, errorMessage, hostsList, pending } = this.props;

    if (error) {
      return (
        <EmptyState>
          <EmptyState.Icon name="error-circle-o" />
          <EmptyState.Title>Error retrieving scan results</EmptyState.Title>
          <EmptyState.Info>{errorMessage}</EmptyState.Info>
        </EmptyState>
      );
    }

    if (pending) {
      return (
        <EmptyState>
          <Spinner loading size="sm" className="blank-slate-pf-icon" />
          <EmptyState.Title>Loading...</EmptyState.Title>
        </EmptyState>
      );
    }

    return (
      <div className="quipucords-infinite-results">
        <Grid fluid onScroll={this.onScrollList} className="quipucords-infinite-list">
          {hostsList.map(host => children({ host }))}
        </Grid>
      </div>
    );
  }
}

ScanHostList.propTypes = {
  children: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  filter: PropTypes.object,
  getConnectionScanResults: PropTypes.func,
  getInspectionScanResults: PropTypes.func,
  hostsList: PropTypes.arrayOf(
    PropTypes.shape({
      credentialName: PropTypes.string,
      jobType: PropTypes.oneOf(['connection', 'inspection']),
      name: PropTypes.string,
      sourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sourceName: PropTypes.string,
      status: PropTypes.string
    })
  ),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isMoreResults: PropTypes.bool,
  pending: PropTypes.bool,
  useConnectionResults: PropTypes.bool,
  useInspectionResults: PropTypes.bool
};

ScanHostList.defaultProps = {
  error: false,
  errorMessage: null,
  filter: {},
  getConnectionScanResults: helpers.noop,
  getInspectionScanResults: helpers.noop,
  hostsList: [],
  isMoreResults: false,
  pending: false,
  useConnectionResults: false,
  useInspectionResults: false
};

const mapDispatchToProps = dispatch => ({
  getConnectionScanResults: (id, query) => dispatch(reduxActions.scans.getConnectionScanResults(id, query)),
  getInspectionScanResults: (id, query) => dispatch(reduxActions.scans.getInspectionScanResults(id, query))
});

const makeMapStateToProps = () => {
  const getScanHostsDetails = reduxSelectors.scans.makeScanHostsList();

  return (state, props) => ({
    ...getScanHostsDetails(state, props)
  });
};

const ConnectedScanHostList = connect(makeMapStateToProps, mapDispatchToProps)(ScanHostList);

export { ConnectedScanHostList as default, ConnectedScanHostList, ScanHostList };
