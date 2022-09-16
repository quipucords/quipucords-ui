import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { helpers } from '../../common';
import Tooltip from '../tooltip/tooltip';

class ScanDownload extends React.Component {
  onReportDownload = () => {
    const { downloadId, getReportsDownload } = this.props;

    getReportsDownload(downloadId).then(
      () => this.notifyDownloadStatus(false),
      error => this.notifyDownloadStatus(true, error.message)
    );
  };

  notifyDownloadStatus(error, results) {
    const { downloadName } = this.props;

    if (error) {
      store.dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: 'danger',
        header: 'Error',
        message: helpers.getMessageFromResults(results).message
      });
    } else {
      store.dispatch({
        type: reduxTypes.toastNotifications.TOAST_ADD,
        alertType: 'success',
        message: (
          <span>
            Report <strong>{(downloadName && `${downloadName} `) || ''}</strong> downloaded.
          </span>
        )
      });
    }
  }

  render() {
    const { children, downloadId, downloadName, getReportsDownload, tooltip, ...props } = this.props;

    const button = (
      <Button title="Download" onClick={this.onReportDownload} {...props}>
        {children}
      </Button>
    );

    return (
      <React.Fragment>
        {tooltip && <Tooltip content={tooltip}>{button}</Tooltip>}
        {!tooltip && button}
      </React.Fragment>
    );
  }
}

ScanDownload.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.string,
  downloadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  downloadName: PropTypes.string,
  getReportsDownload: PropTypes.func
};

ScanDownload.defaultProps = {
  children: 'Download',
  tooltip: null,
  downloadName: null,
  getReportsDownload: helpers.noop
};

const mapDispatchToProps = dispatch => ({
  getReportsDownload: id => dispatch(reduxActions.reports.getReportsDownload(id))
});

const mapStateToProps = () => ({});

const ConnectedScanDownload = connect(mapStateToProps, mapDispatchToProps)(ScanDownload);

export { ConnectedScanDownload as default, ConnectedScanDownload, ScanDownload };
