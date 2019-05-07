import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, EmptyState, ListView, Modal, Spinner } from 'patternfly-react';
import _isEqual from 'lodash/isEqual';
import _size from 'lodash/size';
import { connect, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';
import ScansEmptyState from './scansEmptyState';
import ScanListItem from './scanListItem';
import Tooltip from '../tooltip/tooltip';
import { ScanFilterFields, ScanSortFields } from './scanConstants';
import { apiTypes } from '../../constants/apiConstants';

class Scans extends React.Component {
  componentDidMount() {
    const { getScans, viewOptions } = this.props;

    getScans(helpers.createViewQueryObject(viewOptions, { [apiTypes.API_QUERY_SCAN_TYPE]: 'inspect' }));
  }

  componentDidUpdate(prevProps) {
    const { getScans, update, viewOptions } = this.props;

    const prevQuery = helpers.createViewQueryObject(prevProps.viewOptions, {
      [apiTypes.API_QUERY_SCAN_TYPE]: 'inspect'
    });
    const nextQuery = helpers.createViewQueryObject(viewOptions, { [apiTypes.API_QUERY_SCAN_TYPE]: 'inspect' });

    if (update || !_isEqual(prevQuery, nextQuery)) {
      getScans(nextQuery);
    }
  }

  onMergeScanResults = () => {
    const { viewOptions } = this.props;

    store.dispatch({
      type: reduxTypes.scans.MERGE_SCAN_DIALOG_SHOW,
      show: true,
      scans: viewOptions.selectedItems
    });
  };

  onRefresh = () => {
    store.dispatch({
      type: reduxTypes.scans.UPDATE_SCANS
    });
  };

  onClearFilters = () => {
    store.dispatch({
      type: reduxTypes.viewToolbar.CLEAR_FILTERS,
      viewType: reduxTypes.view.SCANS_VIEW
    });
  };

  renderScansActions() {
    const { viewOptions } = this.props;

    return (
      <div className="form-group">
        <Tooltip key="mergeButtonTip" tooltip="Merge selected scan results into a single report">
          <Button id="merge-reports" disabled={viewOptions.selectedItems.length <= 1} onClick={this.onMergeScanResults}>
            Merge reports
          </Button>
        </Tooltip>
      </div>
    );
  }

  renderPendingMessage() {
    const { pending } = this.props;

    if (pending) {
      return (
        <Modal bsSize="lg" backdrop={false} show animation={false}>
          <Modal.Body>
            <Spinner loading size="lg" className="blank-slate-pf-icon" />
            <div className="text-center">Loading...</div>
          </Modal.Body>
        </Modal>
      );
    }

    return null;
  }

  renderScansList(scans) {
    const { lastRefresh } = this.props;

    if (scans.length) {
      return (
        <ListView className="quipicords-list-view">
          {scans.map(scan => (
            <ScanListItem scan={scan} key={scan[apiTypes.API_RESPONSE_SCAN_ID]} lastRefresh={lastRefresh} />
          ))}
        </ListView>
      );
    }

    return (
      <EmptyState className="list-view-blank-slate">
        <EmptyState.Title>No Results Match the Filter Criteria</EmptyState.Title>
        <EmptyState.Info>The active filters are hiding all items.</EmptyState.Info>
        <EmptyState.Action>
          <Button bsStyle="link" onClick={this.onClearFilters}>
            Clear Filters
          </Button>
        </EmptyState.Action>
      </EmptyState>
    );
  }

  render() {
    const { error, errorMessage, lastRefresh, pending, scans, viewOptions } = this.props;

    if (error) {
      return (
        <EmptyState>
          <Alert type="error">
            <span>Error retrieving scans: {errorMessage}</span>
          </Alert>
          {this.renderPendingMessage()}
        </EmptyState>
      );
    }

    if (pending && !scans.length) {
      return <div className="quipucords-view-container">{this.renderPendingMessage()}</div>;
    }

    if (scans.length || _size(viewOptions.activeFilters)) {
      return (
        <div className="quipucords-view-container">
          <ViewToolbar
            viewType={reduxTypes.view.SCANS_VIEW}
            filterFields={ScanFilterFields}
            sortFields={ScanSortFields}
            onRefresh={this.onRefresh}
            lastRefresh={lastRefresh}
            actions={this.renderScansActions()}
            itemsType="Scan"
            itemsTypePlural="Scans"
            selectedCount={viewOptions.selectedItems.length}
            {...viewOptions}
          />
          <ViewPaginationRow viewType={reduxTypes.view.SCANS_VIEW} {...viewOptions} />
          <div className="quipucords-list-container">{this.renderScansList(scans)}</div>
          {this.renderPendingMessage()}
        </div>
      );
    }

    return <ScansEmptyState />;
  }
}

Scans.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getScans: PropTypes.func,
  lastRefresh: PropTypes.number,
  pending: PropTypes.bool,
  scans: PropTypes.array,
  update: PropTypes.bool,
  viewOptions: PropTypes.object
};

Scans.defaultProps = {
  error: false,
  errorMessage: null,
  getScans: helpers.noop,
  lastRefresh: 0,
  pending: false,
  scans: [],
  update: false,
  viewOptions: {}
};

const mapDispatchToProps = dispatch => ({
  getScans: queryObj => dispatch(reduxActions.scans.getScans(queryObj))
});

const makeMapStateToProps = () => {
  const scansView = reduxSelectors.scans.makeScansView();

  return (state, props) => ({
    ...scansView(state, props),
    viewOptions: state.viewOptions[reduxTypes.view.SCANS_VIEW]
  });
};

const ConnectedScans = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Scans);

export { ConnectedScans as default, ConnectedScans, Scans };
