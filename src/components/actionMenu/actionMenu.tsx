/**
 * A generic dropdown menu component for actions, utilizing PatternFly components. It allows for actions to be specified
 * per item, with each action having a label and an onClick handler. This component is flexible for use with various
 * item types and action configurations.
 *
 * @module actionMenu
 */
import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownList, MenuToggle, type MenuToggleElement } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';

type Action<T> = {
  label: string;
  onClick: (item: T) => void;
  disabled?: boolean;
  ouiaId?: string; // Optional ouiaId for E2E testing
};

interface ActionMenuProps<T = unknown> {
  item: T;
  actions: Action<T>[];
}

const ActionMenu = <T,>({ item, actions }: ActionMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSelect={() => setIsOpen(false)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="Action Menu Toggle"
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
        {actions.map(a => (
          <DropdownItem
            value={a.label}
            key={a.label}
            ouiaId={a.ouiaId}
            onClick={() => {
              a.onClick(item);
            }}
            isDisabled={a.disabled}
          >
            {a.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export { ActionMenu as default, ActionMenu, type ActionMenuProps };
