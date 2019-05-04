import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'patternfly-react';
import { helpers } from '../../common/helpers';

class RefreshTimeButton extends React.Component {
  pollingInterval = null;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate() {
    const { lastRefresh } = this.props;

    if (lastRefresh && !this.lastRefresh) {
      this.startPolling();
    }
  }

  componentWillUnmount() {
    this.stopPolling();
    this.mounted = false;
  }

  onDoUpdate = () => {
    this.forceUpdate();
  };

  startPolling() {
    if (!this.pollingInterval && this.mounted) {
      this.pollingInterval = setInterval(this.onDoUpdate, 3000);
    }
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  render() {
    const { lastRefresh, onRefresh } = this.props;

    return (
      <Button onClick={onRefresh} bsStyle="link" className="refresh-button">
        <Icon type="fa" name="refresh" />
        <span className="last-refresh-time">
          Refreshed {lastRefresh && helpers.getTimeDisplayHowLongAgo(lastRefresh)}
        </span>
      </Button>
    );
  }
}

RefreshTimeButton.propTypes = {
  lastRefresh: PropTypes.number,
  onRefresh: PropTypes.func.isRequired
};

RefreshTimeButton.defaultProps = {
  lastRefresh: 0
};

export { RefreshTimeButton as default, RefreshTimeButton };
