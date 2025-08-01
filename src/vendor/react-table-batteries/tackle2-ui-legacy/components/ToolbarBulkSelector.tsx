import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleCheckbox,
  PaginationProps,
  ToolbarItem
} from '@patternfly/react-core';

import AngleDownIcon from '@patternfly/react-icons/dist/esm/icons/angle-down-icon';
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';

export interface ToolbarBulkSelectorProps<T> {
  areAllSelected: boolean;
  areAllExpanded?: boolean;
  onSelectAll?: (flag?: boolean) => void;
  onSelectNone: () => void;
  onExpandAll?: (flag?: boolean) => void;
  selectedRows: T[];
  onSelectMultiple: (items: T[], isSelecting: boolean) => void;
  currentPageItems: T[];
  paginationProps: PaginationProps;
  isExpandable?: boolean;
}

/**
 * @deprecated this component comes from tackle2-ui legacy code and should probably be moved somewhere else like PF component groups
 */
export const ToolbarBulkSelector = <T,>({
  currentPageItems,
  areAllSelected,
  onSelectAll,
  onSelectNone,
  onExpandAll,
  areAllExpanded,
  selectedRows,
  onSelectMultiple,
  paginationProps,
  isExpandable
}: React.PropsWithChildren<ToolbarBulkSelectorProps<T>>): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapseAll = (collapse: boolean) => {
    onExpandAll && onExpandAll(!collapse);
  };
  const collapseAllBtn = () => (
    <Button
      variant="control"
      title={`${!areAllExpanded ? 'Expand' : 'Collapse'} all`}
      onClick={() => {
        areAllExpanded !== undefined && toggleCollapseAll(areAllExpanded);
      }}
    >
      {areAllExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
    </Button>
  );

  const getBulkSelectState = () => {
    let state: boolean | null;
    if (areAllSelected) {
      state = true;
    } else if (selectedRows.length === 0) {
      state = false;
    } else {
      state = null;
    }
    return state;
  };
  const handleSelectAll = (checked: boolean) => {
    onSelectAll?.(!!checked);
  };

  const selectPage = () =>
    onSelectMultiple(
      currentPageItems.map((item: T) => item),
      true
    );

  // TODO support i18n / custom text for items below

  const dropdownItems = [
    <DropdownItem
      onClick={() => {
        handleSelectAll(false);
        setIsOpen(false);
      }}
      data-action="none"
      key="select-none"
      component="button"
    >
      Select none (0 items)
    </DropdownItem>,
    <DropdownItem
      onClick={() => {
        selectPage();
        setIsOpen(false);
      }}
      data-action="page"
      key="select-page"
      component="button"
    >
      Select page ({currentPageItems.length} items)
    </DropdownItem>,
    ...(onSelectAll
      ? [
          <DropdownItem
            onClick={() => {
              handleSelectAll(true);
              setIsOpen(false);
            }}
            data-action="all"
            key="select-all"
            component="button"
          >
            Select all ({paginationProps.itemCount})
          </DropdownItem>
        ]
      : [])
  ];

  return (
    <>
      {isExpandable && <ToolbarItem>{collapseAllBtn()}</ToolbarItem>}
      <ToolbarItem>
        <Dropdown
          isOpen={isOpen}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Bulk selection menu toggle"
              splitButtonOptions={{
                items: [
                  <MenuToggleCheckbox
                    id="bulk-selected-items-checkbox"
                    key="bulk-select-checkbox"
                    aria-label="Select all"
                    onChange={() => {
                      if (getBulkSelectState() !== false) {
                        onSelectNone();
                      } else {
                        if (onSelectAll) {
                          onSelectAll(true);
                        } else {
                          selectPage();
                        }
                      }
                    }}
                    isChecked={getBulkSelectState()}
                  />
                ]
              }}
            />
          )}
        >
          <DropdownList>{dropdownItems}</DropdownList>
        </Dropdown>
      </ToolbarItem>
    </>
  );
};
