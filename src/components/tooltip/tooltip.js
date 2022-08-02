import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import { Popover, Tooltip as PFTooltip } from '@patternfly/react-core';
import helpers from '../../common/helpers';

const Tooltip = ({ children, id, placement, isPopover, content, delayShow }) => {
  const setId = id || helpers.generateId();

  if (isPopover) {
    return (
      <Popover id={setId} position={placement} hasAutoWidth showClose={false} bodyContent={content}>
        {children || <Icon type="pf" name="info" />}
      </Popover>
    );
  }

  return (
    <PFTooltip id={setId} position={placement} content={content} entryDelay={delayShow}>
      {children || <Icon type="pf" name="info" />}
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
