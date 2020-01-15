import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon, Spinner } from 'patternfly-react';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { helpers } from '../../common/helpers';
import { apiTypes } from '../../constants/apiConstants';

class MergeReportsDialog extends React.Component {
  onClose = () => {
    store.dispatch({
      type: reduxTypes.scans.MERGE_SCAN_DIALOG_HIDE
    });
  };

  onMergeScanResults = () => {
    const { getReportsDownload, mergeReports } = this.props;
    const validReports = { [apiTypes.API_SUBMIT_REPORTS_REPORTS]: this.getValidReportId() };

    const mergeThenDownloadReport = async data => {
      const mergeResponse = await mergeReports(data);
      await getReportsDownload(mergeResponse.value.data[apiTypes.API_RESPONSE_REPORTS_REPORT_ID]);
    };

    mergeThenDownloadReport(validReports).then(
      () => {
        this.onClose();

        store.dispatch({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: 'success',
          message: <span>Merged report downloaded.</span>
        });
      },
      error => {
        store.dispatch({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: 'error',
          header: 'Error merging reports',
          message: helpers.getMessageFromResults(error).message
        });
      }
    );
  };

  getValidScans() {
    const { scans } = this.props;

    return scans.filter(scan => scan.mostRecentStatus === 'completed');
  }

  getInvalidScans() {
    const { scans } = this.props;

    return scans.filter(scan => scan.mostRecentStatus !== 'completed');
  }

  getValidReportId() {
    return this.getValidScans().map(scan => scan.mostRecentReportId);
  }

  renderValidScans() {
    const validScans = this.getValidScans();

    if (validScans.length) {
      return (
        <div>
          <span>Scans to be included in the merged report:</span>
          <ul>
            {validScans.map(scan => (
              <li key={scan.id}>{scan.name || `ID ${scan.id}`}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  renderInvalidScans() {
    const invalidScans = this.getInvalidScans();

    if (invalidScans.length) {
      return (
        <div>
          <span>Failed scans that cannot be included in the merged report:</span>
          <ul>
            {invalidScans.map(scan => (
              <li key={scan.id}>{scan.name || `ID ${scan.id}`}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  renderButtons() {
    const validCount = this.getValidScans().length;

    if (validCount === 0) {
      return (
        <Button bsStyle="primary" className="btn-cancel" onClick={this.onClose}>
          Close
        </Button>
      );
    }

    return (
      <React.Fragment>
        <Button bsStyle="default" className="btn-cancel" onClick={this.onClose}>
          Cancel
        </Button>
        <Button bsStyle="primary" type="submit" disabled={validCount < 2} onClick={this.onMergeScanResults}>
          Merge
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const { pending, show, scans } = this.props;

    if (!scans || scans.length === 0) {
      return null;
    }

    const validCount = this.getValidScans().length;
    const invalidCount = this.getInvalidScans().length;

    let icon = <Icon type="pf" name="info" />;
    let heading;
    let footer = <span>Once the scan reports are merged, the results will be downloaded to your local machine.</span>;

    if (validCount < 2) {
      icon = <Icon type="pf" name="error-circle-o" />;

      heading = (
        <h3 className="merge-reports-heading">
          This action is invalid. You must select at least two scans with successful most recent scans.
        </h3>
      );

      footer = null;
    } else if (invalidCount > 0) {
      icon = <Icon type="pf" name="warning-triangle-o" />;

      heading = (
        <h3 className="merge-reports-heading">
          Warning, only the selected scans with successful most recent scans will be included in the report.
        </h3>
      );
    }

    return (
      <Modal show={show} onHide={this.onClose}>
        <Modal.Header>
          <button type="button" className="close" onClick={this.onClose} aria-hidden="true" aria-label="Close">
            <Icon type="pf" name="close" />
          </button>
          <Modal.Title>Merge reports</Modal.Title>
        </Modal.Header>
        <Modal.Body aria-live="polite">
          {pending && (
            <React.Fragment>
              <Spinner loading size="lg" className="blank-slate-pf-icon" />
              <div className="text-center">Merging reports...</div>
            </React.Fragment>
          )}
          {!pending && (
            <div className="merge-reports-body">
              <span className="merge-reports-icon">{icon}</span>
              <span>
                {heading}
                <div>
                  {this.renderValidScans()}
                  {this.renderInvalidScans()}
                  {footer}
                </div>
              </span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>{this.renderButtons()}</Modal.Footer>
      </Modal>
    );
  }
}

MergeReportsDialog.propTypes = {
  getReportsDownload: PropTypes.func,
  mergeReports: PropTypes.func,
  pending: PropTypes.bool,
  scans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mostRecentStatus: PropTypes.string,
      mostRecentReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string
    })
  ),
  show: PropTypes.bool.isRequired
};

MergeReportsDialog.defaultProps = {
  getReportsDownload: helpers.noop,
  mergeReports: helpers.noop,
  pending: false,
  scans: []
};

const mapDispatchToProps = dispatch => ({
  getReportsDownload: id => dispatch(reduxActions.reports.getReportsDownload(id)),
  mergeReports: data => dispatch(reduxActions.reports.mergeReports(data))
});

const mapStateToProps = state => ({
  ...state.scans.mergeDialog,
  ...state.reports
});

const ConnectedMergeReportsDialog = connect(mapStateToProps, mapDispatchToProps)(MergeReportsDialog);

export { ConnectedMergeReportsDialog as default, ConnectedMergeReportsDialog, MergeReportsDialog };
