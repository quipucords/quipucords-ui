import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ListView, Button, Icon, Checkbox } from 'patternfly-react';
import { List, ListItem } from '@patternfly/react-core';
import _find from 'lodash/find';
import _get from 'lodash/get';
import { connect, reduxTypes, store } from '../../redux';
import { helpers } from '../../common/helpers';
import { dictionary } from '../../constants/dictionaryConstants';
import Tooltip from '../tooltip/tooltip';

class CredentialListItem extends React.Component {
  static authType(item) {
    return item.ssh_keyfile && item.ssh_keyfile !== '' ? 'sshKey' : 'usernamePassword';
  }

  onItemSelectChange = () => {
    const { item } = this.props;

    store.dispatch({
      type: this.isSelected() ? reduxTypes.view.DESELECT_ITEM : reduxTypes.view.SELECT_ITEM,
      viewType: reduxTypes.view.CREDENTIALS_VIEW,
      item
    });
  };

  onToggleExpand = expandType => {
    const { item } = this.props;

    if (expandType === this.expandType()) {
      store.dispatch({
        type: reduxTypes.view.EXPAND_ITEM,
        viewType: reduxTypes.view.CREDENTIALS_VIEW,
        item
      });
    } else {
      store.dispatch({
        type: reduxTypes.view.EXPAND_ITEM,
        viewType: reduxTypes.view.CREDENTIALS_VIEW,
        item,
        expandType
      });
    }
  };

  onCloseExpand = () => {
    const { item } = this.props;
    store.dispatch({
      type: reduxTypes.view.EXPAND_ITEM,
      viewType: reduxTypes.view.CREDENTIALS_VIEW,
      item
    });
  };

  expandType() {
    const { item, expandedCredentials } = this.props;

    return _get(
      _find(expandedCredentials, nextExpanded => nextExpanded.id === item.id),
      'expandType'
    );
  }

  isSelected() {
    const { item, selectedCredentials } = this.props;

    return _find(selectedCredentials, nextSelected => nextSelected.id === item.id) !== undefined;
  }

  renderActions() {
    const { item, onEdit, onDelete } = this.props;

    return [
      <Tooltip key="editButton" tooltip="View Credential">
        <Button
          onClick={() => {
            onEdit(item);
          }}
          bsStyle="link"
          key="editButton"
        >
          <Icon type="fa" name="eye" />
        </Button>
      </Tooltip>,
      <Tooltip key="deleteButton" tooltip="Delete Credential">
        <Button
          onClick={() => {
            onDelete(item);
          }}
          bsStyle="link"
          key="removeButton"
        >
          <Icon type="pf" name="delete" />
        </Button>
      </Tooltip>
    ];
  }

  renderStatusItems() {
    const { item } = this.props;

    const sourceCount = item.sources ? item.sources.length : 0;

    return [
      <ListView.InfoItem
        key="sources"
        className={cx('list-view-info-item-icon-count', { invisible: sourceCount === 0 })}
      >
        <ListView.Expand
          expanded={this.expandType() === 'sources'}
          toggleExpanded={() => {
            this.onToggleExpand('sources');
          }}
        >
          <strong>{sourceCount}</strong>
          {sourceCount === 1 ? ' Source' : ' Sources'}
        </ListView.Expand>
      </ListView.InfoItem>
    ];
  }

  renderExpansionContents() {
    const { item, expandedCredentials } = this.props;
    const typeIcon = helpers.sourceTypeIcon(item.cred_type);

    switch (this.expandType(item, expandedCredentials)) {
      case 'sources':
        (item.sources || []).sort((item1, item2) => item1.name.localeCompare(item2.name));
        return (
          <List isPlain>
            {item?.sources?.map(source => (
              <ListItem key={source.name} icon={<Icon type={typeIcon.type} name={typeIcon.name} />}>
                <Tooltip tooltip={dictionary[source.source_type]}>{source.name}</Tooltip>
              </ListItem>
            ))}
          </List>
        );
      default:
        return null;
    }
  }

  render() {
    const { item } = this.props;
    const selected = this.isSelected();
    const sourceTypeIcon = helpers.sourceTypeIcon(item.cred_type);

    const leftContent = (
      <Tooltip tooltip={dictionary[item.cred_type]}>
        <ListView.Icon type={sourceTypeIcon.type} name={sourceTypeIcon.name} />
      </Tooltip>
    );

    const description = (
      <div className="quipucords-split-description">
        <span className="quipucords-description-left">
          <ListView.DescriptionHeading>{item.name}</ListView.DescriptionHeading>
        </span>
        <span className="quipucords-description-right">
          <Tooltip tooltip="Authorization Type">{dictionary[CredentialListItem.authType(item)]}</Tooltip>
        </span>
      </div>
    );

    return (
      <ListView.Item
        key={item.id}
        stacked
        className={cx({
          'quipucords-credential-list-item': true,
          'list-view-pf-top-align': true,
          active: selected
        })}
        checkboxInput={<Checkbox checked={selected} bsClass="" onChange={this.onItemSelectChange} />}
        actions={this.renderActions()}
        leftContent={leftContent}
        description={description}
        additionalInfo={this.renderStatusItems()}
        compoundExpand
        compoundExpanded={this.expandType() !== undefined}
        onCloseCompoundExpand={this.onCloseExpand}
      >
        {this.renderExpansionContents()}
      </ListView.Item>
    );
  }
}

CredentialListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  selectedCredentials: PropTypes.array,
  expandedCredentials: PropTypes.array
};

CredentialListItem.defaultProps = {
  onEdit: helpers.noop,
  onDelete: helpers.noop,
  selectedCredentials: [],
  expandedCredentials: []
};

const mapStateToProps = state => ({
  selectedCredentials: state.viewOptions[reduxTypes.view.CREDENTIALS_VIEW].selectedItems,
  expandedCredentials: state.viewOptions[reduxTypes.view.CREDENTIALS_VIEW].expandedItems
});

const ConnectedCredentialListItem = connect(mapStateToProps)(CredentialListItem);

export { ConnectedCredentialListItem as default, ConnectedCredentialListItem, CredentialListItem };
