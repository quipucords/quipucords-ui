import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import { Tooltip as PFTooltip } from '@patternfly/react-core';
import helpers from '../../common/helpers';

const Tooltip = ({ children, tooltip, id, placement, popover, rootClose, trigger, delayShow, ...props }) => {
  const setId = id || helpers.generateId();

  return (
    <PFTooltip id={setId} content={<div>{tooltip}</div>} {...props}>
      <span>{children || <Icon type="pf" name="info" />}</span>
    </PFTooltip>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  popover: PropTypes.node,
  tooltip: PropTypes.node,
  id: PropTypes.string,
  placement: PropTypes.string,
  rootClose: PropTypes.bool,
  trigger: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  delayShow: PropTypes.number
};

Tooltip.defaultProps = {
  children: null,
  popover: null,
  tooltip: null,
  id: null,
  placement: 'top',
  rootClose: true,
  trigger: ['hover'],
  delayShow: 500
};

export { Tooltip as default, Tooltip };
