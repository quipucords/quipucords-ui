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
  onScanScan: (scan: ScanType) => void;
}

const ScanActionMenu: React.FC<ScanActionMenuProps> = ({ scan, onDeleteScan, onScanScan }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dropdown
      id={`${scan.id}_actions`}
      isOpen={isOpen}
      onSelect={(e, value) => {
        if (value === 'delete') {
          onDeleteScan(scan);
        } else if (value === 'scan') {
          onScanScan(scan);
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
        <DropdownItem value="scan" key="scan">
          Rescan
        </DropdownItem>
        <DropdownItem value="delete" key="delete">
          Delete
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

export default ScanActionMenu;
