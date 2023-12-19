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
  onDeleteSource: (source: SourceType) => void;
  onEditSource: (source: SourceType) => void;
}

const SourceActionMenu: React.FC<SourceActionMenuProps> = ({
  source,
  onDeleteSource,
  onEditSource
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dropdown
      id={`${source.id}_actions`}
      isOpen={isOpen}
      onSelect={(e, value) => {
        if (value === 'edit') {
          onEditSource(source);
        } else if (value === 'delete') {
          onDeleteSource(source);
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
