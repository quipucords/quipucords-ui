import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { RebootingIcon } from '@patternfly/react-icons';
import { helpers } from '../../common/helpers';
import { translate } from '../i18n/i18n';

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
    const { lastRefresh, onRefresh, t } = this.props;

    return (
      <Button variant="link" icon={<RebootingIcon />} onClick={onRefresh}>
        <span className="last-refresh-time">
          {t('refresh-time-button.refreshed', { context: 'load' })}
          {lastRefresh && helpers.getTimeDisplayHowLongAgo(lastRefresh)}
        </span>
      </Button>
    );
  }
}

RefreshTimeButton.propTypes = {
  lastRefresh: PropTypes.number,
  onRefresh: PropTypes.func.isRequired,
  t: PropTypes.func
};

RefreshTimeButton.defaultProps = {
  lastRefresh: 0,
  t: translate
};

export { RefreshTimeButton as default, RefreshTimeButton };
