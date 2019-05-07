import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, EmptyState, ListView, Modal, Spinner } from 'patternfly-react';
import _isEqual from 'lodash/isEqual';
import _size from 'lodash/size';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';
import SourcesEmptyState from './sourcesEmptyState';
import SourceListItem from './sourceListItem';
import { SourceFilterFields, SourceSortFields } from './sourceConstants';
import { apiTypes } from '../../constants/apiConstants';

class Sources extends React.Component {
  componentDidMount() {
    const { getSources, viewOptions } = this.props;

    getSources(helpers.createViewQueryObject(viewOptions));
  }

  componentDidUpdate(prevProps) {
    const { getSources, updateSources, viewOptions } = this.props;

    const prevQuery = helpers.createViewQueryObject(prevProps.viewOptions);
    const nextQuery = helpers.createViewQueryObject(viewOptions);

    if (updateSources || !_isEqual(prevQuery, nextQuery)) {
      getSources(nextQuery);
    }
  }

  onShowAddSourceWizard = () => {
    store.dispatch({
      type: reduxTypes.sources.CREATE_SOURCE_SHOW
    });
  };

  onScanSources = () => {
    const { viewOptions } = this.props;

    store.dispatch({
      type: reduxTypes.scans.EDIT_SCAN_SHOW,
      sources: viewOptions.selectedItems
    });
  };

  onRefresh = () => {
    store.dispatch({
      type: reduxTypes.sources.UPDATE_SOURCES
    });
  };

  onClearFilters = () => {
    store.dispatch({
      type: reduxTypes.viewToolbar.CLEAR_FILTERS,
      viewType: reduxTypes.view.SOURCES_VIEW
    });
  };

  renderSourceActions() {
    const { viewOptions } = this.props;

    return (
      <div className="form-group">
        <Button bsStyle="primary" onClick={this.onShowAddSourceWizard}>
          Add
        </Button>
        <Button
          disabled={!viewOptions.selectedItems || viewOptions.selectedItems.length === 0}
          onClick={this.onScanSources}
        >
          Scan
        </Button>
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

  renderSourcesList(sources) {
    const { lastRefresh } = this.props;

    if (sources.length) {
      return (
        <ListView className="quipicords-list-view">
          {sources.map(source => (
            <SourceListItem item={source} key={source[apiTypes.API_RESPONSE_SOURCE_ID]} lastRefresh={lastRefresh} />
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
    const { error, errorMessage, lastRefresh, pending, sources, viewOptions } = this.props;

    if (error) {
      return (
        <EmptyState>
          <Alert type="error">
            <span>Error retrieving sources: {errorMessage}</span>
          </Alert>
          {this.renderPendingMessage()}
        </EmptyState>
      );
    }

    if (pending && !sources.length) {
      return <div className="quipucords-view-container">{this.renderPendingMessage()}</div>;
    }

    if (sources.length || _size(viewOptions.activeFilters)) {
      return (
        <div className="quipucords-view-container">
          <ViewToolbar
            viewType={reduxTypes.view.SOURCES_VIEW}
            filterFields={SourceFilterFields}
            sortFields={SourceSortFields}
            onRefresh={this.onRefresh}
            lastRefresh={lastRefresh}
            actions={this.renderSourceActions()}
            itemsType="Source"
            itemsTypePlural="Sources"
            selectedCount={viewOptions.selectedItems.length}
            {...viewOptions}
          />
          <ViewPaginationRow viewType={reduxTypes.view.SOURCES_VIEW} {...viewOptions} />
          <div className="quipucords-list-container">{this.renderSourcesList(sources)}</div>
          {this.renderPendingMessage()}
        </div>
      );
    }

    return <SourcesEmptyState onAddSource={this.onShowAddSourceWizard} />;
  }
}

Sources.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getSources: PropTypes.func,
  lastRefresh: PropTypes.number,
  pending: PropTypes.bool,
  sources: PropTypes.array,
  updateSources: PropTypes.bool,
  viewOptions: PropTypes.object
};

Sources.defaultProps = {
  error: false,
  errorMessage: null,
  getSources: helpers.noop,
  lastRefresh: 0,
  pending: false,
  sources: [],
  updateSources: false,
  viewOptions: {}
};

const mapDispatchToProps = dispatch => ({
  getSources: queryObj => dispatch(reduxActions.sources.getSources(queryObj))
});

const mapStateToProps = state =>
  Object.assign({}, state.sources.view, { viewOptions: state.viewOptions[reduxTypes.view.SOURCES_VIEW] });

const ConnectedSources = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sources);

export { ConnectedSources as default, ConnectedSources, Sources };
