import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Tooltip as PFTooltip, TooltipPosition } from '@patternfly/react-core';
import { ContextIcon, ContextIconVariant } from '../contextIcon/contextIcon';
import { helpers } from '../../common';

/**
 * Tooltip, popover, pf wrapper
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.id
 * @param {string} props.placement
 * @param {boolean} props.isPopover
 * @param {React.ReactNode} props.content
 * @param {number} props.delayShow
 * @returns {React.ReactNode}
 */
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

/**
 * Prop types
 *
 * @type {{children: React.ReactNode, isPopover: boolean, delayShow: number, id: string, placement: string, content: React.ReactNode}}
 */
Tooltip.propTypes = {
  children: PropTypes.node,
  isPopover: PropTypes.bool,
  content: PropTypes.node,
  id: PropTypes.string,
  placement: PropTypes.oneOf([...Object.values(TooltipPosition)]),
  delayShow: PropTypes.number
};

/**
 * Default props
 *
 * @type {{children: null, isPopover: boolean, delayShow: number, id: null, placement: TooltipPosition.top, content: null}}
 */
Tooltip.defaultProps = {
  children: null,
  isPopover: false,
  content: null,
  id: null,
  placement: TooltipPosition.top,
  delayShow: 500
};

export { Tooltip as default, Tooltip, TooltipPosition };
