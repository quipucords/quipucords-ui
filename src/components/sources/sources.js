import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import _size from 'lodash/size';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateVariant,
  Title,
  TitleSizes
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { ListView, Spinner } from 'patternfly-react';
import { Modal, ModalVariant } from '../modal/modal';
import { connect, reduxActions, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';
import SourcesEmptyState from './sourcesEmptyState';
import SourceListItem from './sourceListItem';
import { SourceFilterFields, SourceSortFields } from './sourceConstants';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * A sources view.
 */
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
      <React.Fragment>
        <Button onClick={this.onShowAddSourceWizard}>Add</Button>{' '}
        <Button
          variant={ButtonVariant.secondary}
          isDisabled={!viewOptions.selectedItems || viewOptions.selectedItems.length === 0}
          onClick={this.onScanSources}
        >
          Scan
        </Button>
      </React.Fragment>
    );
  }

  renderPendingMessage() {
    const { pending, t } = this.props;

    if (pending) {
      return (
        <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
          <Spinner loading size="lg" className="blank-slate-pf-icon" />
          <div className="text-center">{t('view.loading', { context: 'sources' })}</div>
        </Modal>
      );
    }

    return null;
  }

  renderSourcesList(sources) {
    const { lastRefresh, t } = this.props;

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
      <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={SearchIcon} />
        <Title size={TitleSizes.lg} headingLevel="h1">
          {t('view.empty-state', { context: ['filter', 'title'] })}
        </Title>
        <EmptyStateBody>{t('view.empty-state', { context: ['filter', 'description'] })}</EmptyStateBody>
        <EmptyStatePrimary>
          <Button variant={ButtonVariant.link} onClick={this.onClearFilters}>
            {t('view.empty-state', { context: ['label', 'clear'] })}
          </Button>
        </EmptyStatePrimary>
      </EmptyState>
    );
  }

  render() {
    const { error, errorMessage, lastRefresh, pending, sources, t, viewOptions } = this.props;

    if (pending && !sources.length) {
      return this.renderPendingMessage();
    }

    if (error) {
      return (
        <EmptyState className="quipucords-empty-state__alert">
          <Alert variant={AlertVariant.danger} title={t('view.error', { context: 'sources' })}>
            {t('view.error-message', { context: ['sources'], message: errorMessage })}
          </Alert>
        </EmptyState>
      );
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

/**
 * Prop types
 *
 * @type {{sources: Array, t: Function, lastRefresh: number, pending: boolean, errorMessage: string,
 *     getSources: Function, error: boolean, updateSources: boolean, viewOptions: object}}
 */
Sources.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getSources: PropTypes.func,
  lastRefresh: PropTypes.number,
  pending: PropTypes.bool,
  sources: PropTypes.array,
  t: PropTypes.func,
  updateSources: PropTypes.bool,
  viewOptions: PropTypes.object
};

/**
 * Default props
 *
 * @type {{sources: *[], t: Function, lastRefresh: number, pending: boolean, errorMessage: null,
 *     getSources: Function, error: boolean, updateSources: boolean, viewOptions: {}}}
 */
Sources.defaultProps = {
  error: false,
  errorMessage: null,
  getSources: helpers.noop,
  lastRefresh: 0,
  pending: false,
  sources: [],
  t: translate,
  updateSources: false,
  viewOptions: {}
};

const mapDispatchToProps = dispatch => ({
  getSources: queryObj => dispatch(reduxActions.sources.getSources(queryObj))
});

const mapStateToProps = state => ({
  ...state.sources.view,
  viewOptions: state.viewOptions[reduxTypes.view.SOURCES_VIEW]
});

const ConnectedSources = connect(mapStateToProps, mapDispatchToProps)(Sources);

export { ConnectedSources as default, ConnectedSources, Sources };
