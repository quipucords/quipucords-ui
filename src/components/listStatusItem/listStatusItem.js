import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon, ListView } from 'patternfly-react';
import _get from 'lodash/get';
import Tooltip from '../tooltip/tooltip';
import helpers from '../../common/helpers';

const ListStatusItem = ({ count, emptyText, tipSingular, tipPlural, expanded, expandType, toggleExpand, iconInfo }) => {
  if (count <= 0) {
    return (
      <ListView.InfoItem className="list-view-info-item-icon-count empty-count">
        <Tooltip tooltip={`0 ${tipPlural}`}>
          <span>{emptyText}</span>
        </Tooltip>
      </ListView.InfoItem>
    );
  }

  return (
    <ListView.InfoItem className="list-view-info-item-icon-count">
      <Tooltip tooltip={`${count}  ${count === 1 ? tipSingular : tipPlural}`}>
        <ListView.Expand
          expanded={expanded}
          toggleExpanded={() => {
            toggleExpand(expandType);
          }}
        >
          {iconInfo && (
            <React.Fragment>
              <Icon
                className={cx('list-view-compound-item-icon', ..._get(iconInfo, 'classNames', []))}
                type={iconInfo.type}
                name={iconInfo.name}
              />
              <strong>{count}</strong>
            </React.Fragment>
          )}
          {!iconInfo && (
            <span>
              <strong>{count}</strong>
              {` ${tipPlural}`}
            </span>
          )}
        </ListView.Expand>
      </Tooltip>
    </ListView.InfoItem>
  );
};

ListStatusItem.propTypes = {
  count: PropTypes.number,
  emptyText: PropTypes.string,
  tipSingular: PropTypes.string,
  tipPlural: PropTypes.string,
  expanded: PropTypes.bool,
  expandType: PropTypes.string,
  toggleExpand: PropTypes.func,
  iconInfo: PropTypes.shape({
    classNames: PropTypes.array,
    name: PropTypes.string,
    type: PropTypes.string
  })
};

ListStatusItem.defaultProps = {
  count: 0,
  emptyText: null,
  tipSingular: null,
  tipPlural: null,
  expanded: false,
  expandType: null,
  toggleExpand: helpers.noop,
  iconInfo: null
};

export { ListStatusItem as default, ListStatusItem };
