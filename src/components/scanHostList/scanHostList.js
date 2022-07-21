import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant, EmptyState, EmptyStateVariant, Spinner } from '@patternfly/react-core';
import { Grid } from 'patternfly-react';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common/helpers';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * Return a scan hosts listing for "hosts".
 */
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
    const { children, error, errorMessage, hostsList, pending, t } = this.props;

    if (pending) {
      return (
        <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
          <Spinner isSVG size="sm" /> {t('view.loading')}
        </EmptyState>
      );
    }

    if (error) {
      return (
        <EmptyState className="quipucords-empty-state__alert">
          <Alert isInline isPlain variant={AlertVariant.danger} title={t('view.error', { context: 'scan-hosts' })}>
            {t('view.error-message', { context: ['scan-hosts'], message: errorMessage })}
          </Alert>
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

/**
 * Default props
 *
 * @type {{useInspectionResults: boolean, pending: boolean, errorMessage: string, getInspectionScanResults: Function,
 *     error: boolean, hostsList: Array, filter: object, t: Function, children: React.ReactNode, isMoreResults: boolean,
 *     id: string|number, getConnectionScanResults: Function, useConnectionResults: boolean}}
 */
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
  t: PropTypes.func,
  useConnectionResults: PropTypes.bool,
  useInspectionResults: PropTypes.bool
};

/**
 * Default props
 *
 * @type {{filter: {}, useInspectionResults: boolean, t: translate, isMoreResults: boolean, pending: boolean,
 *     errorMessage: null, getInspectionScanResults: Function, error: boolean, getConnectionScanResults: Function,
 *     useConnectionResults: boolean, hostsList: *[]}}
 */
ScanHostList.defaultProps = {
  error: false,
  errorMessage: null,
  filter: {},
  getConnectionScanResults: helpers.noop,
  getInspectionScanResults: helpers.noop,
  hostsList: [],
  isMoreResults: false,
  pending: false,
  t: translate,
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
