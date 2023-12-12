import React from 'react';
import { PauseIcon, PlayIcon, RedoIcon, StopIcon } from '@patternfly/react-icons';

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

const ContextIconAction: React.FC<{ symbol?: string }> = ({ symbol, ...props }) => {
  switch (symbol) {
    case ContextIconActionVariant.completed:
    case ContextIconActionVariant.failed:
      return <RedoIcon {...props} />;
    case ContextIconActionVariant.running:
      return <PauseIcon {...props} />;
    case ContextIconActionVariant.paused:
      return <PlayIcon {...props} />;
    case ContextIconActionVariant.pending:
      return <StopIcon {...props} />;
    default:
      return <PlayIcon {...props} />;
  }
};

export { ContextIconAction as default, ContextIconAction, ContextIconActionVariant };
