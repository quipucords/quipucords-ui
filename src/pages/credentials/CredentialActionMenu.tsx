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
  onDeleteCredential: (credential: CredentialType) => void;
}

const CredentialActionMenu: React.FC<CredentialActionMenuProps> = ({
  credential,
  onDeleteCredential,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dropdown
      id={`${credential.id}_actions`}
      isOpen={isOpen}
      onSelect={(e, value) => {
        if (value === 'delete') {
          onDeleteCredential(credential)
        }
      }}
      onOpenChange={setIsOpen}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="credential actions"
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
