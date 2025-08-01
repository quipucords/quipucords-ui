import React from 'react';
import { SelectionDerivedState } from './useSelectionDerivedState';
import { SelectionStateArgs } from './useSelectionState';

export interface UseSelectionEffectsArgs<TItem> {
  selection: SelectionDerivedState<TItem> & Pick<SelectionStateArgs<TItem>, 'isEnabled' | 'isItemSelectable'>;
}

export const useSelectionEffects = <TItem>(args: UseSelectionEffectsArgs<TItem>) => {
  const {
    selection: { isEnabled, isItemSelectable = () => true, selectedItems, setSelectedItems }
  } = args;
  // If isItemSelectable changes and a selected item is no longer selectable, deselect it
  React.useEffect(() => {
    if (isEnabled && isItemSelectable && !selectedItems.every(isItemSelectable)) {
      setSelectedItems(selectedItems.filter(isItemSelectable));
    }
  }, [isEnabled, isItemSelectable, selectedItems, setSelectedItems]);
};
