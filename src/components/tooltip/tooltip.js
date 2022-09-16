import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Tooltip as PFTooltip } from '@patternfly/react-core';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { helpers } from '../../common';

const Tooltip = ({ children, id, placement, isPopover, content, delayShow }) => {
  const setId = id || helpers.generateId();

  if (isPopover) {
    return (
      <Popover
        className="quipucords-popover"
        id={setId}
        position={placement}
        hasAutoWidth
        showClose={false}
        bodyContent={content}
      >
        <div className="quipucords-popover__wrapper">
          {children || <ContextIcon symbol={ContextIconVariant.info} />}
        </div>
      </Popover>
    );
  }

  return (
    <PFTooltip className="quipucords-tooltip" id={setId} position={placement} content={content} entryDelay={delayShow}>
      <div className="quipucords-tooltip__wrapper">{children || <ContextIcon symbol={ContextIconVariant.info} />}</div>
    </PFTooltip>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  isPopover: PropTypes.bool,
  content: PropTypes.node,
  id: PropTypes.string,
  placement: PropTypes.string,
  delayShow: PropTypes.number
};

Tooltip.defaultProps = {
  children: null,
  isPopover: false,
  content: null,
  id: null,
  placement: 'top',
  delayShow: 500
};

export { Tooltip as default, Tooltip };
