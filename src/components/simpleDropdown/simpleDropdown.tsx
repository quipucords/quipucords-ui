/**
 * A simplified dropdown component using PatternFly, designed for basic dropdown needs. It supports customizable
 * labels, items, accessibility options, and styling variants. The component is flexible, allowing for optional
 * full-width display and an onSelect callback for additional interaction handling.
 *
 * @module simpleDropdown
 */
import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
  type MenuToggleProps
} from '@patternfly/react-core';

interface SimpleDropdownItemProps {
  item: string;
  ouiaId?: number | string;
}

interface SimpleDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  menuToggleOuiaId?: number | string;
  dropdownItems?: SimpleDropdownItemProps[];
  ariaLabel?: string;
  onSelect?: (item: string) => void;
  variant?: MenuToggleProps['variant'];
  isFullWidth?: boolean;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  label,
  isOpen,
  onToggle,
  menuToggleOuiaId,
  dropdownItems,
  ariaLabel = 'Dropdown menu',
  onSelect = Function.prototype,
  variant,
  isFullWidth
}) => {
  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={isOpen => onToggle(isOpen)}
      onSelect={() => {
        onToggle(false);
      }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          isFullWidth={isFullWidth}
          ref={toggleRef}
          isExpanded={isOpen}
          onClick={() => onToggle(!isOpen)}
          variant={variant}
          aria-label={ariaLabel}
          isDisabled={!dropdownItems || dropdownItems.length === 0}
          ouiaId={menuToggleOuiaId}
        >
          {label}
        </MenuToggle>
      )}
    >
      <DropdownList>
        {Array.isArray(dropdownItems) &&
          dropdownItems.map(({ item, ouiaId }) => (
            <DropdownItem key={item} onClick={() => onSelect(item)} ouiaId={ouiaId}>
              {item}
            </DropdownItem>
          ))}
      </DropdownList>
    </Dropdown>
  );
};

export { SimpleDropdown as default, SimpleDropdown, type SimpleDropdownProps };
