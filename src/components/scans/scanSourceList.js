import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertVariant, EmptyState, EmptyStateVariant, List, ListItem, Spinner } from '@patternfly/react-core';
import { Icon } from 'patternfly-react';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common/helpers';
import { translate } from '../i18n/i18n';

/**
 * Return a scan jobs listing for "sources".
 */
class ScanSourceList extends React.Component {
  static setSourceStatus(source) {
    if (!source.connectTaskStatus && !source.inspectTaskStatus) {
      return null;
    }

    if (source.connectTaskStatus !== 'completed' || !source.inspectTaskStatus) {
      return `Connection Scan: ${source.connectTaskStatusMessage || 'checking status...'}`;
    }

    return `Inspection Scan: ${source.inspectTaskStatusMessage || 'checking status...'}`;
  }

  componentDidMount() {
    const { getScanJob, id } = this.props;

    getScanJob(id);
  }

  render() {
    const { error, errorMessage, pending, scanJobList, t } = this.props;

    if (pending) {
      return (
        <EmptyState className="quipucords-empty-state" variant={EmptyStateVariant.large}>
          <Spinner isSVG size="sm" /> {t('view.loading')}
        </EmptyState>
      );
    }

    if (error) {
      return (
        <EmptyState className="quipucords-empty-state__alert">
          <Alert isInline isPlain variant={AlertVariant.danger} title={t('view.error', { context: 'scan-jobs' })}>
            {t('view.error-message', { context: ['scan-jobs'], message: errorMessage })}
          </Alert>
        </EmptyState>
      );
    }

    return (
      <List isPlain>
        {scanJobList?.map(item => (
          <ListItem key={item.id}>
            <List isPlain>
              <ListItem icon={<Icon {...helpers.sourceTypeIcon(item.sourceType)} />} key={item.name}>
                {item.name}
              </ListItem>
              <ListItem key={`desc-${item.name}`}>{ScanSourceList.setSourceStatus(item)}</ListItem>
            </List>
          </ListItem>
        ))}
      </List>
    );
  }
}

/**
 * Prop types
 *
 * @type {{t: Function, pending: boolean, errorMessage: string, getScanJob: Function, id: string|number,
 *     error: boolean, scanJobList: Array}}
 */
ScanSourceList.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  getScanJob: PropTypes.func,
  pending: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  scanJobList: PropTypes.arrayOf(
    PropTypes.shape({
      connectTaskStatus: PropTypes.string,
      connectTaskStatusMessage: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      inspectTaskStatus: PropTypes.string,
      inspectTaskStatusMessage: PropTypes.string,
      name: PropTypes.string,
      sourceType: PropTypes.string
    })
  ),
  t: PropTypes.func
};

/**
 * Default props
 *
 * @type {{t: translate, pending: boolean, errorMessage: null, getScanJob: Function, error: boolean,
 *     scanJobList: *[]}}
 */
ScanSourceList.defaultProps = {
  error: false,
  errorMessage: null,
  getScanJob: helpers.noop,
  pending: false,
  scanJobList: [],
  t: translate
};

const mapDispatchToProps = dispatch => ({
  getScanJob: id => dispatch(reduxActions.scans.getScanJob(id))
});

const makeMapStateToProps = () => {
  const getScanJobDetail = reduxSelectors.scans.makeScanJobDetailBySource();

  return (state, props) => ({
    ...getScanJobDetail(state, props)
  });
};

const ConnectedScanSourceList = connect(makeMapStateToProps, mapDispatchToProps)(ScanSourceList);

export { ConnectedScanSourceList as default, ConnectedScanSourceList, ScanSourceList };
