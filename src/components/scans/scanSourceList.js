import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, Grid, Icon, Spinner } from 'patternfly-react';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common/helpers';

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
    const { error, errorMessage, pending, scanJobList } = this.props;

    if (error) {
      return (
        <EmptyState>
          <EmptyState.Icon name="error-circle-o" />
          <EmptyState.Title>Error retrieving scan jobs</EmptyState.Title>
          <EmptyState.Info>{errorMessage}</EmptyState.Info>
        </EmptyState>
      );
    }

    if (pending) {
      return (
        <EmptyState>
          <Spinner loading size="sm" className="blank-slate-pf-icon" />
          <EmptyState.Title>Loading...</EmptyState.Title>
        </EmptyState>
      );
    }

    return (
      <Grid fluid>
        {scanJobList.map(item => (
          <Grid.Row className="fadein" key={item.id}>
            <Grid.Col xs={4} md={3}>
              <Icon {...helpers.sourceTypeIcon(item.sourceType)} />
              &nbsp; {item.name}
            </Grid.Col>
            <Grid.Col xs={8} md={9}>
              {ScanSourceList.setSourceStatus(item)}
            </Grid.Col>
          </Grid.Row>
        ))}
      </Grid>
    );
  }
}

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
  )
};

ScanSourceList.defaultProps = {
  error: false,
  errorMessage: null,
  getScanJob: helpers.noop,
  pending: false,
  scanJobList: []
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
