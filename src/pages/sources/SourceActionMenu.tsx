import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { SourceType } from '../../types';

interface SourceActionMenuProps {
  source: SourceType;
}

const SourceActionMenu: React.FC<SourceActionMenuProps> = ({ source }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onEditSource = () => {
    alert(`Edit: ${source.name}`);
  };
  const onDeleteSource = () => {
    alert(`Delete: ${source.name}`);
  };

  return (
    <Dropdown
      id={`${source.id}_actions`}
      isOpen={isOpen}
      onSelect={(e, value) => {
        if (value === 'edit') {
          onEditSource();
        } else if (value === 'delete') {
          onDeleteSource();
        }
      }}
      onOpenChange={setIsOpen}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="source actions"
          variant="plain"
          onClick={() => setIsOpen(prev => !prev)}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        <DropdownItem value="edit" key="edit">
          Edit
        </DropdownItem>
        <DropdownItem value="delete" key="delete">
          Delete
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

export default SourceActionMenu;
