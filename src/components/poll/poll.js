import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common';

const PollCache = {
  timer: null,
  check: {}
};

/**
 * Poll component uses a cached key value pair to determine if a poll
 * should happen. The uses cases for this are aimed at lists. If/when
 * all key/value pairs pass as false poll will clearInterval.
 */
class Poll extends React.Component {
  componentWillUnmount() {
    clearInterval(PollCache.timer);
    PollCache.check = {};
  }

  onPoll() {
    const { itemId, itemIdCheck, interval, onPoll } = this.props;

    PollCache.check[itemId] = itemIdCheck;

    clearInterval(PollCache.timer);

    PollCache.timer = setInterval(() => {
      if (/true/.test(JSON.stringify(PollCache.check))) {
        onPoll({ itemId, itemIdCheck });
      } else {
        clearInterval(PollCache.timer);
        PollCache.check = {};
      }
    }, interval);
  }

  render() {
    const { children } = this.props;

    this.onPoll();

    return <React.Fragment>{children}</React.Fragment>;
  }
}

Poll.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemIdCheck: PropTypes.bool.isRequired,
  interval: PropTypes.number,
  onPoll: PropTypes.func.isRequired
};

Poll.defaultProps = {
  interval: helpers.POLL_INTERVAL
};

export { Poll as default, Poll, PollCache };
