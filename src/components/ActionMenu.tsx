/**
 * A generic dropdown menu component for actions, utilizing PatternFly components. It allows for actions to be specified
 * per item, with each action having a label and an onClick handler. This component is flexible for use with various
 * item types and action configurations.
 * @module ActionMenu
 */
import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';

interface ActionMenuProps<T> {
  item: T;
  actions: { label: string; onClick: (item: T) => void }[];
}

const ActionMenu = <T,>({ item, actions }: ActionMenuProps<T>) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

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
            onClick={() => {
              a.onClick(item);
            }}
          >
            {a.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export default ActionMenu;
