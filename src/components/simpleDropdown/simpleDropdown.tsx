/**
 * A simplified dropdown component using PatternFly, designed for basic dropdown needs. It supports customizable
 * labels, items, accessibility options, and styling variants. The component is flexible, allowing for optional
 * full-width display and an onSelect callback for additional interaction handling.
 *
 * @module simpleDropdown
 */
import React, { useState } from 'react';
import { Dropdown, DropdownList, MenuToggle, type MenuToggleElement } from '@patternfly/react-core';

export interface ISimpleDropdownProps {
  label: string;
  dropdownItems?: React.ReactNode[];
  ariaLabel?: string;
  onSelect?: () => void;
  variant: 'default' | 'plain' | 'primary' | 'secondary';
  isFullWidth?: boolean;
}

export const SimpleDropdown: React.FC<ISimpleDropdownProps> = ({
  label,
  dropdownItems,
  ariaLabel,
  onSelect,
  variant,
  isFullWidth
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={isOpen => setIsOpen(isOpen)}
      onSelect={() => {
        setIsOpen(false);
        onSelect && onSelect();
      }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          isFullWidth={isFullWidth}
          ref={toggleRef}
          isExpanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          variant={variant}
          aria-label={ariaLabel || 'Dropdown menu'}
          isDisabled={!dropdownItems || dropdownItems.length === 0}
        >
          {label}
        </MenuToggle>
      )}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};
