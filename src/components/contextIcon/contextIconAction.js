import React from 'react';
import PropTypes from 'prop-types';
import { PlayIcon, StopIcon } from '@patternfly/react-icons';

/**
 * Context icon variants
 *
 * @type {{running: string, play: string, canceled: string, paused: string, created: string, pending: string,
 *     cancelled: string, completed: string, failed: string}}
 */
const ContextIconActionVariant = {
  completed: 'completed',
  failed: 'failed',
  canceled: 'failed',
  cancelled: 'failed',
  pending: 'pending',
  created: 'running',
  running: 'running',
  paused: 'paused',
  play: 'play'
};

/**
 * Return an action icon from context/symbol
 *
 * @param {object} props
 * @param {string} props.symbol
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const ContextIconAction = ({ symbol, ...props }) => {
  switch (symbol) {
    case ContextIconActionVariant.completed:
    case ContextIconActionVariant.failed:
    case ContextIconActionVariant.paused:
      return <PlayIcon {...props} />;
    case ContextIconActionVariant.running:
    case ContextIconActionVariant.pending:
      return <StopIcon {...props} />;
    default:
      return <PlayIcon {...props} />;
  }
};

/**
 * Prop types
 *
 * @type {{symbol: string}}
 */
ContextIconAction.propTypes = {
  symbol: PropTypes.oneOf([...Object.values(ContextIconActionVariant)])
};

/**
 * Default props
 *
 * @type {{symbol: null}}
 */
ContextIconAction.defaultProps = {
  symbol: null
};

export { ContextIconAction as default, ContextIconAction, ContextIconActionVariant };
