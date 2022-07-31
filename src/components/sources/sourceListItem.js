import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Checkbox, Grid, Icon, ListView } from 'patternfly-react';
import _get from 'lodash/get';
import _size from 'lodash/size';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import { helpers } from '../../common/helpers';
import { dictionary } from '../../constants/dictionaryConstants';
import SourceCredentialsList from './sourceCredentialsList';
import ScanHostList from '../scanHostList/scanHostList';
import ToolTip from '../tooltip/tooltip';
import ListStatusItem from '../listStatusItem/listStatusItem';
import Poll from '../poll/poll';
import { apiTypes } from '../../constants/apiConstants';

class SourceListItem extends React.Component {
  state = {
    expandType: null
  };

  onRefresh = () => {
    store.dispatch({
      type: reduxTypes.sources.UPDATE_SOURCES
    });
  };

  onItemSelectChange = event => {
    const { checked } = event.target;
    const { item } = this.props;

    store.dispatch({
      type: checked ? reduxTypes.view.SELECT_ITEM : reduxTypes.view.DESELECT_ITEM,
      viewType: reduxTypes.view.SOURCES_VIEW,
      item
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

  onDelete = source => {
    const { deleteSource } = this.props;

    const onConfirm = () => {
      store.dispatch({
        type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_HIDE
      });

      deleteSource(source[apiTypes.API_RESPONSE_SOURCE_ID]).then(
        () => {
          store.dispatch({
            type: reduxTypes.toastNotifications.TOAST_ADD,
            alertType: 'success',
            message: (
              <span>
                Deleted source <strong>{source[apiTypes.API_RESPONSE_SOURCE_NAME]}</strong>.
              </span>
            )
          });

          store.dispatch({
            type: reduxTypes.view.DESELECT_ITEM,
            viewType: reduxTypes.view.SOURCES_VIEW,
            item: source
          });

          store.dispatch({
            type: reduxTypes.sources.UPDATE_SOURCES
          });
        },
        error => {
          store.dispatch({
            type: reduxTypes.toastNotifications.TOAST_ADD,
            alertType: 'danger',
            header: 'Error',
            message: helpers.getMessageFromResults(error).message
          });
        }
      );
    };

    store.dispatch({
      type: reduxTypes.confirmationModal.CONFIRMATION_MODAL_SHOW,
      title: 'Delete Source',
      heading: (
        <span>
          Are you sure you want to delete the source <strong>{source[apiTypes.API_RESPONSE_SOURCE_NAME]}</strong>?
        </span>
      ),
      confirmButtonText: 'Delete',
      onConfirm
    });
  };

  onEdit = source => {
    store.dispatch({
      type: reduxTypes.sources.EDIT_SOURCE_SHOW,
      source
    });
  };

  onScan = source => {
    store.dispatch({
      type: reduxTypes.scans.EDIT_SCAN_SHOW,
      sources: [source]
    });
  };

  isSelected() {
    const { item, selectedSources } = this.props;

    return (
      selectedSources.find(nextSelected => nextSelected[apiTypes.API_RESPONSE_SOURCE_ID] === item.id) !== undefined
    );
  }

  renderSourceType() {
    const { item } = this.props;
    const typeIcon = helpers.sourceTypeIcon(item.source_type);

    return (
      <ToolTip content={dictionary[item.source_type]}>
        <ListView.Icon type={typeIcon.type} name={typeIcon.name} />
      </ToolTip>
    );
  }

  renderActions() {
    const { item } = this.props;

    return (
      <span>
        <ToolTip content="Edit">
          <Button onClick={() => this.onEdit(item)} bsStyle="link">
            <Icon type="pf" name="edit" aria-label="Edit" />
          </Button>
        </ToolTip>
        <ToolTip content="Delete">
          <Button onClick={() => this.onDelete(item)} bsStyle="link">
            <Icon type="pf" name="delete" aria-label="Delete" />
          </Button>
        </ToolTip>
        <Button onClick={() => this.onScan(item)}>Scan</Button>
      </span>
    );
  }

  renderStatusItems() {
    const { expandType } = this.state;
    const { item } = this.props;

    const credentialCount = _size(_get(item, 'credentials', []));
    let okHostCount = _get(item, 'connection.source_systems_scanned', 0);
    let failedHostCount = _get(item, 'connection.source_systems_failed', 0);
    const unreachableHostCount = _get(item, 'connection.source_systems_unreachable', 0);

    if (helpers.DEV_MODE) {
      okHostCount = helpers.devModeNormalizeCount(okHostCount);
      failedHostCount = helpers.devModeNormalizeCount(failedHostCount);
    }

    return [
      <ListStatusItem
        key="credential"
        id="credential"
        count={credentialCount}
        emptyText="0 Credentials"
        tipSingular="Credential"
        tipPlural="Credentials"
        expanded={expandType === 'credentials'}
        expandType="credentials"
        toggleExpand={this.onToggleExpand}
        iconInfo={{ type: 'fa', name: 'id-card' }}
      />,
      <ListStatusItem
        key="okHosts"
        id="okHosts"
        count={okHostCount}
        emptyText="0 Successful"
        tipSingular="Successful Authentication"
        tipPlural="Successful Authentications"
        expanded={expandType === 'okHosts'}
        expandType="okHosts"
        toggleExpand={this.onToggleExpand}
        iconInfo={helpers.scanStatusIcon('success')}
      />,
      <ListStatusItem
        key="failedHosts"
        id="failedHosts"
        count={failedHostCount}
        emptyText="0 Failed"
        tipSingular="Failed Authentication"
        tipPlural="Failed Authentications"
        expanded={expandType === 'failedHosts'}
        expandType="failedHosts"
        toggleExpand={this.onToggleExpand}
        iconInfo={helpers.scanStatusIcon('failed')}
      />,
      <ListStatusItem
        key="unreachableHosts"
        id="unreachableHosts"
        count={unreachableHostCount}
        emptyText="0 Unreachable"
        tipSingular="Unreachable System"
        tipPlural="Unreachable Systems"
        expanded={expandType === 'unreachableHosts'}
        expandType="unreachableHosts"
        toggleExpand={this.onToggleExpand}
        iconInfo={helpers.scanStatusIcon('unreachable')}
      />
    ];
  }

  static renderHostRow(host) {
    const iconInfo = helpers.scanStatusIcon(host.status);

    return (
      <Grid.Row className="fadein" key={helpers.generateId('hostRow')}>
        <Grid.Col xs={host.status === 'success' ? 6 : 12} sm={4}>
          <span>
            <Icon type={iconInfo.type} name={iconInfo.name} className={cx(...iconInfo.classNames)} />
            &nbsp; {host.name}
          </span>
        </Grid.Col>
        {host.status === 'success' && (
          <Grid.Col xs={6} sm={4}>
            <span>
              <Icon type="fa" name="id-card" />
              &nbsp; {host.credentialName}
            </span>
          </Grid.Col>
        )}
      </Grid.Row>
    );
  }

  renderExpansionContents() {
    const { expandType } = this.state;
    const { item, lastRefresh } = this.props;

    switch (expandType) {
      case 'okHosts':
        return (
          <ScanHostList
            key={`systemsScanned-${lastRefresh}`}
            id={item.connection.id}
            filter={{ [apiTypes.API_QUERY_SOURCE_TYPE]: item.id, [apiTypes.API_QUERY_STATUS]: 'success' }}
            useConnectionResults
          >
            {({ host }) => SourceListItem.renderHostRow(host)}
          </ScanHostList>
        );
      case 'failedHosts':
        return (
          <ScanHostList
            key={`systemsFailed-${lastRefresh}`}
            id={item.connection.id}
            filter={{ [apiTypes.API_QUERY_SOURCE_TYPE]: item.id, [apiTypes.API_QUERY_STATUS]: 'failed' }}
            useConnectionResults
          >
            {({ host }) => SourceListItem.renderHostRow(host)}
          </ScanHostList>
        );
      case 'unreachableHosts':
        return (
          <ScanHostList
            key={`systemsUnreachable-${lastRefresh}`}
            id={item.connection.id}
            filter={{ [apiTypes.API_QUERY_SOURCE_TYPE]: item.id, [apiTypes.API_QUERY_STATUS]: 'unreachable' }}
            useConnectionResults
          >
            {({ host }) => SourceListItem.renderHostRow(host)}
          </ScanHostList>
        );
      case 'credentials':
        return <SourceCredentialsList source={item} />;
      default:
        return null;
    }
  }

  renderDescription() {
    const { item } = this.props;

    const itemHostsPopover = (
      <div className="quipucords-sources-popover-scroll">
        {item.hosts && item.hosts.length > 1 && (
          <ul className="quipucords-popover-list">
            {item.hosts.map(host => (
              <li key={host}>{host}</li>
            ))}
          </ul>
        )}
        {item.hosts && item.hosts.length === 1 && <div>{item.hosts[0]}</div>}
      </div>
    );

    let itemDescription;

    if (_size(item.hosts)) {
      if (item.source_type === 'network') {
        itemDescription = (
          <ListView.DescriptionText>
            <ToolTip delayShow={100} isPopover content={itemHostsPopover} trigger="click" placement="left">
              <Button bsStyle="link" className="quipucords-sources-network-button">
                Network Range
              </Button>
            </ToolTip>
          </ListView.DescriptionText>
        );
      } else {
        itemDescription = <ListView.DescriptionText>{item.hosts[0]}</ListView.DescriptionText>;
      }
    }

    return (
      <div className="quipucords-split-description">
        <span className="quipucords-description-left">
          <ListView.DescriptionHeading>{item.name}</ListView.DescriptionHeading>
          {itemDescription}
        </span>
        <span className="quipucords-description-right">{this.renderScanStatus()}</span>
      </div>
    );
  }

  renderScanStatus() {
    const { item } = this.props;

    const scan = _get(item, 'connection');
    let scanDescription = '';
    let scanTime = _get(scan, 'end_time');
    let icon = null;

    switch (_get(scan, 'status')) {
      case 'completed':
        scanDescription = 'Last Connected';
        icon = <Icon className="scan-status-icon" type="pf" name="ok" />;
        break;
      case 'failed':
        scanDescription = 'Connection Failed';
        icon = <Icon className="scan-status-icon" type="pf" name="error-circle-o" />;
        break;
      case 'canceled':
        scanDescription = 'Connection Canceled';
        icon = <Icon className="scan-status-icon" type="pf" name="error-circle-o" />;
        break;
      case 'created':
      case 'pending':
      case 'running':
        scanTime = _get(scan, 'start_time');
        scanDescription = 'Connection in Progress';
        icon = <Icon className="scan-status-icon fa-spin" type="fa" name="spinner" />;
        break;
      case 'paused':
        scanDescription = 'Connection Paused';
        icon = <Icon className="scan-status-icon" type="pf" name="warning-triangle-o" />;
        break;
      default:
        return null;
    }

    return (
      <div className="scan-description">
        {icon}
        <div className="scan-status-text">
          <div>{scanDescription}</div>
          <div>{helpers.getTimeDisplayHowLongAgo(scanTime)}</div>
        </div>
      </div>
    );
  }

  render() {
    const { expandType } = this.state;
    const { item, pollInterval } = this.props;
    const selected = this.isSelected();
    const sourceStatus = _get(item, ['connection', 'status']);

    return (
      <Poll
        key={item.id}
        interval={pollInterval}
        itemId={`sourceListItem-${item.id}`}
        itemIdCheck={/created|pending|running/i.test(sourceStatus)}
        onPoll={this.onRefresh}
      >
        <ListView.Item
          key={item.id}
          stacked
          className={cx({
            'list-view-pf-top-align': true,
            active: selected
          })}
          checkboxInput={<Checkbox checked={selected} bsClass="" onChange={this.onItemSelectChange} />}
          actions={this.renderActions()}
          leftContent={this.renderSourceType()}
          description={this.renderDescription()}
          additionalInfo={this.renderStatusItems()}
          compoundExpand
          compoundExpanded={expandType !== null}
          onCloseCompoundExpand={this.onCloseExpand}
        >
          {this.renderExpansionContents()}
        </ListView.Item>
      </Poll>
    );
  }
}

SourceListItem.propTypes = {
  deleteSource: PropTypes.func,
  item: PropTypes.object.isRequired,
  lastRefresh: PropTypes.number,
  pollInterval: PropTypes.number,
  selectedSources: PropTypes.array
};

SourceListItem.defaultProps = {
  deleteSource: helpers.noop,
  lastRefresh: 0,
  pollInterval: 120000,
  selectedSources: []
};

const mapDispatchToProps = dispatch => ({
  deleteSource: id => dispatch(reduxActions.sources.deleteSource(id))
});

const mapStateToProps = state => ({ selectedSources: state.viewOptions[reduxTypes.view.SOURCES_VIEW].selectedItems });

const ConnectedSourceListItem = connect(mapStateToProps, mapDispatchToProps)(SourceListItem);

export { ConnectedSourceListItem as default, ConnectedSourceListItem, SourceListItem };
