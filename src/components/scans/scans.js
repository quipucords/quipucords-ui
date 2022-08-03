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
import { Button as ButtonPf3, ListView, Spinner } from 'patternfly-react';
import { SearchIcon } from '@patternfly/react-icons';
import { Modal, ModalVariant } from '../modal/modal';
import { connect, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import helpers from '../../common/helpers';
import ViewToolbar from '../viewToolbar/viewToolbar';
import ViewPaginationRow from '../viewPaginationRow/viewPaginationRow';
import ScansEmptyState from './scansEmptyState';
import ScanListItem from './scanListItem';
import Tooltip from '../tooltip/tooltip';
import { ScanFilterFields, ScanSortFields } from './scanConstants';
import { apiTypes } from '../../constants/apiConstants';
import { translate } from '../i18n/i18n';

/**
 * A scans view.
 */
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
        <Tooltip key="mergeButtonTip" content="Merge selected scan results into a single report">
          <ButtonPf3
            id="merge-reports"
            disabled={viewOptions.selectedItems.length <= 1}
            onClick={this.onMergeScanResults}
          >
            Merge reports
          </ButtonPf3>
        </Tooltip>
      </div>
    );
  }

  renderPendingMessage() {
    const { pending, t } = this.props;

    if (pending) {
      return (
        <Modal variant={ModalVariant.medium} backdrop={false} isOpen disableFocusTrap>
          <Spinner loading size="lg" className="blank-slate-pf-icon" />
          <div className="text-center">{t('view.loading', { context: 'scans' })}</div>
        </Modal>
      );
    }

    return null;
  }

  renderScansList(scans) {
    const { lastRefresh, t } = this.props;

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
    const { error, errorMessage, lastRefresh, pending, scans, t, viewOptions } = this.props;

    if (pending || (pending && !scans.length)) {
      return this.renderPendingMessage();
    }

    if (error) {
      return (
        <EmptyState className="quipucords-empty-state__alert">
          <Alert variant={AlertVariant.danger} title={t('view.error', { context: 'scans' })}>
            {t('view.error-message', { context: ['scans'], message: errorMessage })}
          </Alert>
        </EmptyState>
      );
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

/**
 * Prop types
 *
 * @type {{getScans: Function, t: Function, lastRefresh: number, scans: Array, pending: boolean,
 *    errorMessage: string, update: boolean, error: boolean, viewOptions: object}}
 */
Scans.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getScans: PropTypes.func,
  lastRefresh: PropTypes.number,
  pending: PropTypes.bool,
  scans: PropTypes.array,
  t: PropTypes.func,
  update: PropTypes.bool,
  viewOptions: PropTypes.object
};

/**
 * Default props
 *
 * @type {{getScans: Function, t: translate, lastRefresh: number, scans: *[], pending: boolean, errorMessage: null,
 *     update: boolean, error: boolean, viewOptions: {}}}
 */
Scans.defaultProps = {
  error: false,
  errorMessage: null,
  getScans: helpers.noop,
  lastRefresh: 0,
  pending: false,
  scans: [],
  t: translate,
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

const ConnectedScans = connect(makeMapStateToProps, mapDispatchToProps)(Scans);

export { ConnectedScans as default, ConnectedScans, Scans };
