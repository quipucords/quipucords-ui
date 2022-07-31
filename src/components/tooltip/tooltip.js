import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import { Popover, Tooltip as PFTooltip } from '@patternfly/react-core';
import helpers from '../../common/helpers';

const Tooltip = ({ children, id, placement, isPopover, content, rootClose, trigger, delayShow, ...props }) => {
  const setId = id || helpers.generateId();

  if (isPopover) {
    return (
      <Popover id={setId} hasAutoWidth showClose={false} bodyContent={<div>{content}</div>}>
        <span>{children || <Icon type="pf" name="info" />}</span>
      </Popover>
    );
  }

  return (
    <PFTooltip id={setId} content={<div>{content}</div>} {...props}>
      <span>{children || <Icon type="pf" name="info" />}</span>
    </PFTooltip>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  isPopover: PropTypes.bool,
  content: PropTypes.node,
  id: PropTypes.string,
  placement: PropTypes.string,
  rootClose: PropTypes.bool,
  trigger: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  delayShow: PropTypes.number
};

Tooltip.defaultProps = {
  children: null,
  isPopover: false,
  content: null,
  id: null,
  placement: 'top',
  rootClose: true,
  trigger: ['hover'],
  delayShow: 500
};

export { Tooltip as default, Tooltip };
