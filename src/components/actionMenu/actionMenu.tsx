/**
 * A generic dropdown menu component for actions, utilizing PatternFly components. It allows for actions to be specified
 * per item, with each action having a label and an onClick handler. This component is flexible for use with various
 * item types and action configurations.
 *
 * @module actionMenu
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
  type PopperProps,
  type TooltipProps
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';

type Action<T> = {
  label: string;
  onClick: (item: T) => void;
  disabled?: boolean;
  ouiaId?: string; // Optional ouiaId for E2E testing
  tooltipProps?: TooltipProps;
};

interface ActionMenuProps<T = unknown> {
  item: T;
  actions: Action<T>[];
  popperProps?: Partial<PopperProps>;
  size?: 'default' | 'sm';
}

const ActionMenu = <T,>({ item, actions, popperProps, size = 'default' }: ActionMenuProps<T>) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dropdown
      isOpen={isOpen}
      popperProps={popperProps}
      onOpenChange={setIsOpen}
      onSelect={() => setIsOpen(false)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label={t('action-menu.aria-label')}
          variant="plain"
          size={size}
          onClick={() => setIsOpen(prev => !prev)}
          isExpanded={isOpen}
          ouiaId="action_menu_toggle"
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
            isAriaDisabled={a.disabled}
            tooltipProps={a.tooltipProps}
          >
            {a.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export { ActionMenu as default, ActionMenu, type ActionMenuProps };
