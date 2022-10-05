import React from 'react';
import PropTypes from 'prop-types';
import {
  AlertVariant,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title
} from '@patternfly/react-core';
import { Modal } from '../modal/modal';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { helpers } from '../../common';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

class MergeReportsDialog extends React.Component {
  onClose = () => {
    store.dispatch({
      type: reduxTypes.scans.MERGE_SCAN_DIALOG_HIDE
    });
  };

  onMergeScanResults = () => {
    const { getReportsDownload, mergeReports, t } = this.props;
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
          alertType: AlertVariant.success,
          message: <span>{t('toast-notifications.description', { context: ['merge-reports', 'download'] })}</span>
        });
      },
      error => {
        store.dispatch({
          type: reduxTypes.toastNotifications.TOAST_ADD,
          alertType: AlertVariant.danger,
          header: t('toast-notifications.title', { context: ['merge-reports', 'error'] }),
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
    const { t } = this.props;
    const validScans = this.getValidScans();

    if (validScans.length) {
      return (
        <div>
          <span>{t('form-dialog.confirmation', { context: ['body', 'merge-reports', 'valid'] })}</span>
          <ul>
            {validScans.map(({ id, name }) => (
              <li key={id}>
                {t('form-dialog.confirmation', {
                  context: ['body', 'merge-reports', 'list', !name && 'id'],
                  name: name || id
                })}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  renderInvalidScans() {
    const { t } = this.props;
    const invalidScans = this.getInvalidScans();

    if (invalidScans.length) {
      return (
        <div>
          <span>{t('form-dialog.confirmation', { context: ['body', 'merge-reports', 'invalid'] })}</span>
          <ul>
            {invalidScans.map(({ id, name }) => (
              <li key={id}>
                {t('form-dialog.confirmation', {
                  context: ['body', 'merge-reports', 'list', !name && 'id'],
                  name: name || id
                })}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  renderButtons() {
    const { t } = this.props;
    const validCount = this.getValidScans().length;

    if (validCount === 0) {
      return [
        <Button key="close" onClick={this.onClose}>
          {t('form-dialog.label', { context: 'close' })}
        </Button>
      ];
    }

    return [
      <Button key="merge" isDisabled={validCount < 2} onClick={this.onMergeScanResults}>
        {t('form-dialog.label', { context: ['submit', 'merge-reports'] })}
      </Button>,
      <Button key="cancel" variant={ButtonVariant.secondary} onClick={this.onClose}>
        {t('form-dialog.label', { context: 'cancel' })}
      </Button>
    ];
  }

  render() {
    const { pending, show, scans, t } = this.props;

    if (!scans || scans.length === 0) {
      return null;
    }

    const isValidCount = this.getValidScans().length < 2;
    const isGreaterValidCount = this.getValidScans().length >= 2;
    const isInvalidCount = this.getInvalidScans().length > 0;

    const iconSymbol =
      (isValidCount && ContextIconVariant.error) ||
      (isInvalidCount && ContextIconVariant.warning) ||
      ContextIconVariant.info;

    let heading;
    if (isValidCount || isInvalidCount) {
      heading = t('form-dialog.confirmation', {
        context: ['heading', 'merge-reports', (isValidCount && 'valid') || (isInvalidCount && 'invalid')]
      });
    }

    const footer = isGreaterValidCount && t('form-dialog.confirmation', { context: ['footer', 'merge-reports'] });

    return (
      <Modal
        isOpen={show}
        onClose={this.onClose}
        header={
          <Title headingLevel="h4">{t('form-dialog.confirmation', { context: ['title', 'merge-reports'] })}</Title>
        }
        actions={this.renderButtons()}
      >
        {pending && (
          <EmptyState className="quipucords-empty-state">
            <EmptyStateIcon icon={Spinner} />
            <Title headingLevel="h3">
              {t('form-dialog.empty-state', { context: ['title', 'merge-reports', 'pending'] })}
            </Title>
          </EmptyState>
        )}
        {!pending && (
          <div className="merge-reports-body">
            <span className="merge-reports-icon">
              <ContextIcon symbol={iconSymbol} />
            </span>
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
  show: PropTypes.bool.isRequired,
  t: PropTypes.func
};

MergeReportsDialog.defaultProps = {
  getReportsDownload: helpers.noop,
  mergeReports: helpers.noop,
  pending: false,
  scans: [],
  t: translate
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
