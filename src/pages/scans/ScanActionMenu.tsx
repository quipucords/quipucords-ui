import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { ScanType } from '../../types';

interface ScanActionMenuProps {
  scan: ScanType;
  onDeleteScan: (scan: ScanType) => void;
}

const ScanActionMenu: React.FC<ScanActionMenuProps> = ({
  scan,
  onDeleteScan,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dropdown
      id={`${scan.id}_actions`}
      isOpen={isOpen}
      onSelect={(e, value) => {
        if (value === 'delete') {
          onDeleteScan(scan);
        }
      }}
      onOpenChange={setIsOpen}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="scan actions"
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
        <DropdownItem value="delete" key="delete">
          Delete
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

export default ScanActionMenu;
