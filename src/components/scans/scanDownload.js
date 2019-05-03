import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, MenuItem } from 'patternfly-react';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { helpers } from '../../common/helpers';

class ScanDownload extends React.Component {
  static notifyDownloadStatus(error, results) {
    if (error) {
      store.dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: 'error',
        header: 'Error',
        message: helpers.getMessageFromResults(results).message
      });
    } else {
      store.dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: 'success',
        message: <span>Report downloaded.</span>
      });
    }
  }

  onDetailedDownload = () => {
    const { getReportDetailsCsv, downloadId } = this.props;

    getReportDetailsCsv(downloadId).then(
      () => ScanDownload.notifyDownloadStatus(false),
      error => ScanDownload.notifyDownloadStatus(true, error.message)
    );
  };

  onSummaryDownload = () => {
    const { getReportSummaryCsv, downloadId } = this.props;

    getReportSummaryCsv(downloadId).then(
      () => ScanDownload.notifyDownloadStatus(false),
      error => ScanDownload.notifyDownloadStatus(true, error.message)
    );
  };

  render() {
    const { downloadId, getReportDetailsCsv, getReportSummaryCsv, ...props } = this.props;

    return (
      <React.Fragment>
        <Dropdown id={helpers.generateId()} {...props}>
          <Dropdown.Toggle useAnchor className="btn-link">
            <Icon type="fa" name="download" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey="1" onClick={() => this.onSummaryDownload()}>
              Summary Report
            </MenuItem>
            <MenuItem eventKey="2" onClick={() => this.onDetailedDownload()}>
              Detailed Report
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

ScanDownload.propTypes = {
  downloadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  getReportDetailsCsv: PropTypes.func,
  getReportSummaryCsv: PropTypes.func
};

ScanDownload.defaultProps = {
  getReportDetailsCsv: helpers.noop,
  getReportSummaryCsv: helpers.noop
};

const mapDispatchToProps = dispatch => ({
  getReportDetailsCsv: id => dispatch(reduxActions.reports.getReportDetailsCsv(id)),
  getReportSummaryCsv: (id, query) => dispatch(reduxActions.reports.getReportSummaryCsv(id, query))
});

const mapStateToProps = () => ({});

const ConnectedScanDownload = connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanDownload);

export { ConnectedScanDownload as default, ConnectedScanDownload, ScanDownload };
