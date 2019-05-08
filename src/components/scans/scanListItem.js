import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Checkbox, Grid, Icon, ListView } from 'patternfly-react';
import { connect, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { helpers } from '../../common/helpers';
import Tooltip from '../tooltip/tooltip';
import ScanSourceList from './scanSourceList';
import ScanHostList from '../scanHostList/scanHostList';
import ScanJobsList from './scanJobsList';
import ScanDownload from './scanDownload';
import ListStatusItem from '../listStatusItem/listStatusItem';
import { apiTypes } from '../../constants/apiConstants';

class ScanListItem extends React.Component {
  static notifyActionStatus(scan, actionText, error, results) {
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
        message: (
          <span>
            Scan <strong>{scan.name}</strong> {actionText}.
          </span>
        )
      });
    }
  }

  state = {
    expandType: null
  };

  onRefresh = () => {
    store.dispatch({
      type: reduxTypes.scans.UPDATE_SCANS
    });
  };

  onItemSelectChange = event => {
    const { checked } = event.target;
    const { scan } = this.props;

    store.dispatch({
      type: checked ? reduxTypes.view.SELECT_ITEM : reduxTypes.view.DESELECT_ITEM,
      viewType: reduxTypes.view.SCANS_VIEW,
      item: scan
    });
  };

  onToggleExpand = toggleExpandType => {
    const { expandType } = this.state;
    const toggle = expandType === toggleExpandType ? null : toggleExpandType;

    this.setState({ expandType: toggle });
  };

  onCloseExpand = () => {
    this.setState({ expandType: null });
  };

  onStartScan = () => {
    const { scan, startScan } = this.props;

    startScan(scan.id)
      .then(
        response => ScanListItem.notifyActionStatus(scan, 'started', false, response.value),
        error => ScanListItem.notifyActionStatus(scan, 'started', true, error)
      )
      .finally(() => this.onRefresh());
  };

  onPauseScan = () => {
    const { scan, pauseScan } = this.props;

    pauseScan(scan.mostRecentId)
      .then(
        response => ScanListItem.notifyActionStatus(scan, 'paused', false, response.value),
        error => ScanListItem.notifyActionStatus(scan, 'paused', true, error)
      )
      .finally(() => this.onRefresh());
  };

  onResumeScan = () => {
    const { scan, restartScan } = this.props;

    restartScan(scan.mostRecentId)
      .then(
        response => ScanListItem.notifyActionStatus(scan, 'resumed', false, response.value),
        error => ScanListItem.notifyActionStatus(scan, 'resumed', true, error)
      )
      .finally(() => this.onRefresh());
  };

  onCancelScan = () => {
    const { scan, cancelScan } = this.props;

    cancelScan(scan.mostRecentId)
      .then(
        response => ScanListItem.notifyActionStatus(scan, 'canceled', false, response.value),
        error => ScanListItem.notifyActionStatus(scan, 'canceled', true, error)
      )
      .finally(() => this.onRefresh());
  };

  isSelected() {
    const { scan, selectedScans } = this.props;

    return selectedScans.find(nextSelected => nextSelected[apiTypes.API_RESPONSE_SCAN_ID] === scan.id) !== undefined;
  }

  renderDescription() {
    const { scan } = this.props;
    const scanStatus = scan.mostRecentStatus;
    const statusIconInfo = helpers.scanStatusIcon(scanStatus);

    const icon = statusIconInfo ? (
      <Icon
        className={cx('scan-status-icon', ...statusIconInfo.classNames)}
        type={statusIconInfo.type}
        name={statusIconInfo.name}
      />
    ) : null;

    let scanTime = scan.mostRecentEndTime;

    if (scanStatus === 'pending' || scanStatus === 'running') {
      scanTime = scan.mostRecentStartTime;
    }

    return (
      <div className="scan-description">
        {icon}
        <div className="scan-status-text">
          <div>{(scan.mostRecentStatusMessage && scan.mostRecentStatusMessage) || 'Scan created'}</div>
          <div className="text-muted">{scanTime && helpers.getTimeDisplayHowLongAgo(scanTime)}</div>
        </div>
      </div>
    );
  }

  renderStatusItems() {
    const { expandType } = this.state;
    const { scan } = this.props;

    const sourcesCount = scan.sourcesTotal;
    const prevCount = Math.max(scan.jobsTotal - 1, 0);
    const successHosts = scan.mostRecentSysScanned;
    const failedHosts = scan.mostRecentSysFailed;

    return [
      <ListStatusItem
        key="successHosts"
        id="successHosts"
        count={successHosts}
        emptyText="0 Successful"
        tipSingular="Successful System"
        tipPlural="Successful Systems"
        expanded={expandType === 'systemsScanned'}
        expandType="systemsScanned"
        toggleExpand={this.onToggleExpand}
        iconInfo={helpers.scanStatusIcon('success')}
      />,
      <ListStatusItem
        key="systemsFailed"
        id="systemsFailed"
        count={failedHosts}
        emptyText="0 Failed"
        tipSingular="Failed System"
        tipPlural="Failed Systems"
        expanded={expandType === 'systemsFailed'}
        expandType="systemsFailed"
        toggleExpand={this.onToggleExpand}
        iconInfo={helpers.scanStatusIcon('failed')}
      />,
      <ListStatusItem
        key="sources"
        id="sources"
        count={sourcesCount}
        emptyText="0 Sources"
        tipSingular="Source"
        tipPlural="Sources"
        expanded={expandType === 'sources'}
        expandType="sources"
        toggleExpand={this.onToggleExpand}
      />,
      <ListStatusItem
        key="scans"
        id="scans"
        count={prevCount}
        emptyText="0 Previous"
        tipSingular="Previous"
        tipPlural="Previous"
        expanded={expandType === 'jobs'}
        expandType="jobs"
        toggleExpand={this.onToggleExpand}
      />
    ];
  }

  renderActions() {
    const { scan } = this.props;
    const downloadActions = scan.mostRecentReportId && (
      <ScanDownload downloadId={scan.mostRecentReportId} className="pull-right" pullRight />
    );

    switch (scan.mostRecentStatus) {
      case 'completed':
        return (
          <React.Fragment>
            <Tooltip tooltip="Run Scan">
              <Button onClick={() => this.onStartScan(scan)} bsStyle="link">
                <Icon type="pf" name="spinner2" aria-label="Start" />
              </Button>
            </Tooltip>
            {downloadActions}
          </React.Fragment>
        );
      case 'failed':
      case 'canceled':
        return (
          <React.Fragment>
            <Tooltip tooltip="Retry Scan">
              <Button onClick={() => this.onStartScan(scan)} bsStyle="link">
                <Icon type="pf" name="spinner2" aria-label="Start" />
              </Button>
            </Tooltip>
            {downloadActions}
          </React.Fragment>
        );
      case 'created':
      case 'running':
        return (
          <React.Fragment>
            <Tooltip key="pauseButton" tooltip="Pause Scan">
              <Button onClick={this.onPauseScan} bsStyle="link">
                <Icon type="fa" name="pause" aria-label="Pause" />
              </Button>
            </Tooltip>
            <Tooltip key="stop" tooltip="Cancel Scan">
              <Button onClick={this.onCancelScan} bsStyle="link">
                <Icon type="fa" name="stop" aria-label="Stop" />
              </Button>
            </Tooltip>
            {downloadActions}
          </React.Fragment>
        );
      case 'paused':
        return (
          <React.Fragment>
            <Tooltip tooltip="Resume Scan">
              <Button onClick={this.onResumeScan} bsStyle="link">
                <Icon type="fa" name="play" aria-label="Resume" />
              </Button>
            </Tooltip>
            {downloadActions}
          </React.Fragment>
        );
      case 'pending':
        return (
          <React.Fragment>
            <Tooltip key="stop" tooltip="Cancel Scan">
              <Button onClick={this.onCancelScan} bsStyle="link">
                <Icon type="fa" name="stop" aria-label="Stop" />
              </Button>
            </Tooltip>
            {downloadActions}
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Tooltip tooltip="Start Scan">
              <Button onClick={this.onStartScan} bsStyle="link">
                <Icon type="fa" name="play" aria-label="Start" />
              </Button>
            </Tooltip>
            {downloadActions}
          </React.Fragment>
        );
    }
  }

  static renderHostRow(host) {
    return (
      <Grid.Row className="fadein" key={`${host.name}-${host.sourceId}-${host.jobType}`}>
        <Grid.Col xs={6} sm={4} md={3}>
          <span>
            <Icon type="pf" name={host.status === 'success' ? 'ok' : 'error-circle-o'} />
            &nbsp; {host.name}
          </span>
        </Grid.Col>
        <Grid.Col xs={6} sm={8} md={9}>
          {host.sourceName}
        </Grid.Col>
      </Grid.Row>
    );
  }

  renderExpansionContents() {
    const { expandType } = this.state;
    const { scan, lastRefresh } = this.props;

    switch (expandType) {
      case 'systemsScanned':
        return (
          <ScanHostList
            key={`systemsScanned-${lastRefresh}`}
            id={scan.mostRecentId}
            filter={{ [apiTypes.API_QUERY_STATUS]: 'success' }}
            useInspectionResults
          >
            {({ host }) => ScanListItem.renderHostRow(host)}
          </ScanHostList>
        );
      case 'systemsFailed':
        return (
          <ScanHostList
            key={`systemsFailed-${lastRefresh}`}
            id={scan.mostRecentId}
            filter={{ [apiTypes.API_QUERY_STATUS]: 'failed' }}
            useConnectionResults
            useInspectionResults
          >
            {({ host }) => ScanListItem.renderHostRow(host)}
          </ScanHostList>
        );
      case 'sources':
        return <ScanSourceList key={`sources-${lastRefresh}`} id={scan.id} />;
      case 'jobs':
        return <ScanJobsList key={`jobs-${lastRefresh}`} id={scan.id} mostRecentId={scan.mostRecentId} />;
      default:
        return null;
    }
  }

  render() {
    const { expandType } = this.state;
    const { scan } = this.props;
    const selected = this.isSelected();

    const classes = cx({
      'quipucords-scan-list-item': true,
      'list-view-pf-top-align': true,
      active: selected
    });

    return (
      <ListView.Item
        key={scan.id}
        className={classes}
        checkboxInput={<Checkbox checked={selected} bsClass="" onChange={this.onItemSelectChange} />}
        actions={this.renderActions()}
        leftContent={<div className="list-item-name">{scan.name}</div>}
        description={this.renderDescription()}
        additionalInfo={this.renderStatusItems()}
        compoundExpand
        compoundExpanded={expandType !== null}
        onCloseCompoundExpand={this.onCloseExpand}
      >
        {this.renderExpansionContents()}
      </ListView.Item>
    );
  }
}

ScanListItem.propTypes = {
  cancelScan: PropTypes.func,
  scan: PropTypes.shape({
    jobsTotal: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mostRecentEndTime: PropTypes.string,
    mostRecentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mostRecentReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mostRecentStatus: PropTypes.string,
    mostRecentStartTime: PropTypes.string,
    mostRecentStatusMessage: PropTypes.string,
    mostRecentSysFailed: PropTypes.number,
    mostRecentSysScanned: PropTypes.number,
    name: PropTypes.string,
    sourcesTotal: PropTypes.number
  }).isRequired,
  lastRefresh: PropTypes.number,
  pauseScan: PropTypes.func,
  restartScan: PropTypes.func,
  selectedScans: PropTypes.array,
  startScan: PropTypes.func
};

ScanListItem.defaultProps = {
  cancelScan: helpers.noop,
  lastRefresh: 0,
  pauseScan: helpers.noop,
  restartScan: helpers.noop,
  selectedScans: [],
  startScan: helpers.noop
};

const mapDispatchToProps = dispatch => ({
  cancelScan: id => dispatch(reduxActions.scans.cancelScan(id)),
  pauseScan: id => dispatch(reduxActions.scans.pauseScan(id)),
  restartScan: id => dispatch(reduxActions.scans.restartScan(id)),
  startScan: id => dispatch(reduxActions.scans.startScan(id))
});

const makeMapStateToProps = () => {
  const getScanListItem = reduxSelectors.scans.makeScanListItem();

  return (state, props) => ({
    selectedScans: state.viewOptions[reduxTypes.view.SCANS_VIEW].selectedItems,
    ...getScanListItem(state, props)
  });
};

const ConnectedScanListItem = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ScanListItem);

export { ConnectedScanListItem as default, ConnectedScanListItem, ScanListItem };
