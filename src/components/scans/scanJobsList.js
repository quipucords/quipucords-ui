import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant, ButtonVariant, EmptyState, EmptyStateVariant, Spinner } from '@patternfly/react-core';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { ContextIcon, ContextIconColors, ContextIconVariant } from '../contextIcon/contextIcon';
import { helpers } from '../../common';
import { apiTypes } from '../../constants/apiConstants';
import ScanDownload from './scanDownload';
import { Table, TableVariant } from '../table/table';
import { translate } from '../i18n/i18n';

/**
 * Return a scan jobs listing for "jobs".
 */
class ScanJobsList extends React.Component {
  state = {
    currentPage: 1,
    queryObject: {
      [apiTypes.API_QUERY_PAGE]: 1,
      [apiTypes.API_QUERY_PAGE_SIZE]: 100,
      [apiTypes.API_QUERY_ORDERING]: '-end_time'
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
    const { error, errorMessage, mostRecentId, pending, scanJobsList, t } = this.props;

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
          <Alert isInline isPlain variant={AlertVariant.danger} title={t('view.error', { context: 'scan-jobs' })}>
            {t('view.error-message', { context: ['scan-jobs'], message: errorMessage })}
          </Alert>
        </EmptyState>
      );
    }

    return (
      <div className="quipucords-infinite-results">
        <div onScroll={this.onScrollList} className="quipucords-infinite-list">
          <Table
            className="quipucords-table__scan-jobs"
            variant={TableVariant.compact}
            isBorders={false}
            rows={scanJobsList
              .filter(({ id }) => mostRecentId !== id)
              .map(({ _original, endTime, reportId, startTime, status, systemsFailed, systemsScanned }) => ({
                cells: [
                  {
                    content: (
                      <React.Fragment>
                        <ContextIcon symbol={ContextIconVariant[status]} />{' '}
                        {t('table.label', { context: ['status', status, 'scan'] })}
                      </React.Fragment>
                    ),
                    dataLabel: t('table.label', { context: ['status', 'scan'] })
                  },
                  {
                    content: (
                      <React.Fragment>
                        {helpers.getTimeDisplayHowLongAgo(
                          status === 'pending' || status === 'running' ? startTime : endTime
                        )}
                      </React.Fragment>
                    ),
                    dataLabel: t('table.label', { context: ['status', 'time', 'scan'] })
                  },
                  {
                    content: (
                      <React.Fragment>
                        <ContextIcon symbol={ContextIconVariant.success} color={ContextIconColors.gray} />{' '}
                        {systemsScanned}
                      </React.Fragment>
                    ),
                    dataLabel: t('table.label', { context: ['status', 'success'] })
                  },
                  {
                    content: (
                      <React.Fragment>
                        <ContextIcon symbol={ContextIconVariant.failed} color={ContextIconColors.gray} />{' '}
                        {systemsFailed}
                      </React.Fragment>
                    ),
                    dataLabel: t('table.label', { context: ['status', 'failed'] })
                  },
                  {
                    style: { textAlign: 'right' },
                    isActionCell: true,
                    content: (
                      <React.Fragment>
                        {reportId > 0 && (
                          <ScanDownload
                            job={_original}
                            icon={<ContextIcon symbol={ContextIconVariant.download} />}
                            variant={ButtonVariant.link}
                          >
                            {t('table.label', { context: ['action', 'scan', 'download'] })}
                          </ScanDownload>
                        )}
                      </React.Fragment>
                    )
                  }
                ]
              }))}
          />
        </div>
      </div>
    );
  }
}

/**
 * Prop types
 *
 * @type {{t: Function, isMoreResults: boolean, pending: boolean, errorMessage: string, getScanJobs: Function,
 *     scanJobsList: Array, id: string|number, error: boolean, mostRecentId: string|number}}
 */
ScanJobsList.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getScanJobs: PropTypes.func,
  isMoreResults: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  mostRecentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pending: PropTypes.bool,
  scanJobsList: PropTypes.arrayOf(
    PropTypes.shape({
      _original: PropTypes.object,
      endTime: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      reportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      scanName: PropTypes.string,
      startTime: PropTypes.string,
      status: PropTypes.string,
      systemsScanned: PropTypes.number,
      systemsFailed: PropTypes.number
    })
  ),
  t: PropTypes.func
};

/**
 * Default props
 *
 * @type {{t: translate, isMoreResults: boolean, pending: boolean, errorMessage: null, getScanJobs: Function,
 *     scanJobsList: *[], error: boolean, mostRecentId: null}}
 */
ScanJobsList.defaultProps = {
  error: false,
  errorMessage: null,
  getScanJobs: helpers.noop,
  isMoreResults: false,
  mostRecentId: null,
  pending: false,
  scanJobsList: [],
  t: translate
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

const ConnectedScanJobsList = connect(makeMapStateToProps, mapDispatchToProps)(ScanJobsList);

export { ConnectedScanJobsList as default, ConnectedScanJobsList, ScanJobsList };
