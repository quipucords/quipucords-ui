import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { EmptyState, Grid, Icon } from 'patternfly-react';
import moment from 'moment';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common/helpers';
import { dictionary } from '../../constants/dictionaryConstants';
import { apiTypes } from '../../constants/apiConstants';
import ScanDownload from './scanDownload';

class ScanJobsList extends React.Component {
  state = {
    currentPage: 1,
    queryObject: {
      [apiTypes.API_QUERY_PAGE]: 1,
      [apiTypes.API_QUERY_PAGE_SIZE]: 100,
      [apiTypes.API_QUERY_ORDERING]: 'name'
    }
  };

  componentDidMount() {
    const { queryObject } = this.state;
    const { getScanJobs, id } = this.props;

    getScanJobs(id, queryObject);
  }

  onScrollList = event => {
    const { target } = event;
    const { currentPage, queryObject } = this.state;
    const { getScanJobs, id, isMoreResults, pending } = this.props;

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
          getScanJobs(id, { ...queryObject, ...updatedQueryObject });
        }
      );
    }
  };

  render() {
    const { error, errorMessage, pending, scanJobsList } = this.props;

    if (error) {
      return (
        <EmptyState>
          <EmptyState.Icon name="error-circle-o" />
          <EmptyState.Title>Error retrieving scan jobs</EmptyState.Title>
          <EmptyState.Info>{errorMessage}</EmptyState.Info>
        </EmptyState>
      );
    }

    if (pending) {
      return (
        <EmptyState>
          <EmptyState.Icon name="spinner spinner-xl" />
          <EmptyState.Title>Loading scan jobs...</EmptyState.Title>
        </EmptyState>
      );
    }

    const iconProps = status => {
      const { type, name, classNames } = helpers.scanStatusIcon(status);
      return {
        type,
        name,
        className: cx('scan-job-status-icon', classNames)
      };
    };

    return (
      <div className="quipucords-infinite-results">
        <Grid fluid onScroll={this.onScrollList} className="quipucords-infinite-list">
          {scanJobsList.map(item => (
            <Grid.Row className="fadein" key={item.id}>
              <Grid.Col xs={6} sm={3}>
                <Icon {...iconProps(item.status)} />
                {dictionary[item.status] || ''}
              </Grid.Col>
              <Grid.Col xs={6} sm={3}>
                {moment
                  .utc(item.status === 'pending' || item.status === 'running' ? item.startTime : item.endTime)
                  .utcOffset(moment().utcOffset())
                  .fromNow()}
              </Grid.Col>
              <Grid.Col xs={3} sm={2}>
                <Icon className="scan-job-status-icon systems" type="pf" name="ok" />
                {item.systemsScanned}
              </Grid.Col>
              <Grid.Col xs={3} sm={2}>
                <Icon className="scan-job-status-icon systems" type="pf" name="error-circle-o" />
                {item.systemsFailed}
              </Grid.Col>
              <Grid.Col xs={3} sm={2}>
                {item.reportId > 0 && <ScanDownload pullRight downloadId={item.reportId} />}
              </Grid.Col>
            </Grid.Row>
          ))}
        </Grid>
      </div>
    );
  }
}

ScanJobsList.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getScanJobs: PropTypes.func,
  isMoreResults: PropTypes.bool,
  pending: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  scanJobsList: PropTypes.arrayOf(
    PropTypes.shape({
      endTime: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      reportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      startTime: PropTypes.string,
      status: PropTypes.string,
      systemsScanned: PropTypes.number,
      systemsFailed: PropTypes.number
    })
  )
};

ScanJobsList.defaultProps = {
  error: false,
  errorMessage: null,
  getScanJobs: helpers.noop,
  isMoreResults: false,
  pending: false,
  scanJobsList: []
};

const mapDispatchToProps = dispatch => ({
  getScanJobs: (id, query) => dispatch(reduxActions.scans.getScanJobs(id, query))
});

const makeMapStateToProps = () => {
  const getScanJobsDetails = reduxSelectors.scans.makeScanJobsList();

  return (state, props) => ({
    ...getScanJobsDetails(state, props)
  });
};

const ConnectedScanJobsList = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ScanJobsList);

export { ConnectedScanJobsList as default, ConnectedScanJobsList, ScanJobsList };
