import * as React from 'react';
import { PaginationProps } from '@patternfly/react-core';
import { ToolbarBulkSelectorProps } from '../../tackle2-ui-legacy/components/ToolbarBulkSelector';
import {
  SelectionDerivedState,
  UseSelectionDerivedStateArgs,
  useSelectionDerivedState
} from './useSelectionDerivedState';
import { UseSelectionEffectsArgs, useSelectionEffects } from './useSelectionEffects';
import { TdProps } from '@patternfly/react-table';
import { mergeArgs } from '../../utils';
import { MergedArgs } from '../../type-utils';
/**
 * Args for useSelectionPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export type UseSelectionPropHelpersExternalArgs<TItem> = MergedArgs<
  UseSelectionDerivedStateArgs<TItem>,
  { selection: Omit<UseSelectionEffectsArgs<TItem>['selection'], keyof SelectionDerivedState<TItem>> },
  'selection'
>;

/**
 * Additional args for useSelectionPropHelpers that come from logic inside useTablePropHelpers
 * @see useTablePropHelpers
 */
export interface UseSelectionPropHelpersInternalArgs {
  /**
   * Pagination props returned by usePaginationPropHelpers
   */
  paginationProps: PaginationProps;
}

export const useSelectionPropHelpers = <TItem>(
  args: UseSelectionPropHelpersExternalArgs<TItem> & UseSelectionPropHelpersInternalArgs
) => {
  const {
    paginationProps,
    currentPageItems,
    items,
    selection: { isItemSelectable = () => true }
  } = args;
  const selectionDerivedState = useSelectionDerivedState(args);
  const { selectItem, selectItems, selectAll, selectNone, selectedItems, isItemSelected, allSelected } =
    selectionDerivedState;

  useSelectionEffects(mergeArgs(args, { selection: selectionDerivedState }));

  // State for shift+click multi-select behavior
  const [lastSelectedRowIndex, setLastSelectedRowIndex] = React.useState<number | null>(null);
  React.useEffect(() => {
    setLastSelectedRowIndex(null);
  }, [paginationProps.page]);
  const [isShiftKeyHeld, setIsShiftKeyHeld] = React.useState(false);
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftKeyHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftKeyHeld(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  /**
   * Props for the ToolbarBulkSelector component.
   */
  const toolbarBulkSelectorProps: ToolbarBulkSelectorProps<TItem> = {
    onSelectAll: items ? selectAll : undefined, // If we don't have all items in scope, we can't select all
    onSelectNone: selectNone,
    areAllSelected: allSelected,
    selectedRows: selectedItems,
    paginationProps,
    currentPageItems,
    onSelectMultiple: selectItems
  };

  /**
   * Returns props for the Td component used as the checkbox cell for each row when using the selection feature.
   */
  const getSelectCheckboxTdProps: (args: { item: TItem; rowIndex: number }) => Omit<TdProps, 'ref'> = ({
    item,
    rowIndex
  }) => ({
    select: {
      rowIndex,
      onSelect: (_event, isSelecting) => {
        if (isShiftKeyHeld && lastSelectedRowIndex !== null) {
          const numberSelected = rowIndex - lastSelectedRowIndex;
          const intermediateIndexes =
            numberSelected > 0
              ? Array.from(new Array(numberSelected + 1), (_x, i) => i + lastSelectedRowIndex)
              : Array.from(new Array(Math.abs(numberSelected) + 1), (_x, i) => i + rowIndex);
          intermediateIndexes.forEach(
            (index) => currentPageItems[index] && selectItem(currentPageItems[index] as TItem, isSelecting)
          );
        } else {
          selectItem(item, isSelecting);
        }
        setLastSelectedRowIndex(rowIndex);
      },
      isSelected: isItemSelected(item),
      isDisabled: isItemSelectable && !isItemSelectable(item)
    }
  });

  return { selectionDerivedState, toolbarBulkSelectorProps, getSelectCheckboxTdProps };
};
