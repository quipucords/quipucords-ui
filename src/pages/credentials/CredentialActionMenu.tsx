import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { CredentialType } from '../../types';

interface CredentialActionMenuProps {
  credential: CredentialType;
}

const CredentialActionMenu: React.FC<CredentialActionMenuProps> = ({ credential }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onEditCredential = () => {
    alert(`Edit: ${credential.name}`);
  };
  const onDeleteCredential = () => {
    alert(`Delete: ${credential.name}`);
  };

  return (
    <Dropdown
      id={`${credential.id}_actions`}
      isOpen={isOpen}
      onSelect={(e, value) => {
        if (value === 'edit') {
          onEditCredential();
        } else if (value === 'delete') {
          onDeleteCredential();
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

export default CredentialActionMenu;