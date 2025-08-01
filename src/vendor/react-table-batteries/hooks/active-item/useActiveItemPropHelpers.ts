import { TrProps } from '@patternfly/react-table';
import {
  ActiveItemDerivedState,
  UseActiveItemDerivedStateArgs,
  useActiveItemDerivedState
} from './useActiveItemDerivedState';
import { UseActiveItemEffectsArgs, useActiveItemEffects } from './useActiveItemEffects';
import { mergeArgs } from '../../utils';
import { MergedArgs } from '../../type-utils';

/**
 * Args for useActiveItemPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export type UseActiveItemPropHelpersExternalArgs<TItem> = MergedArgs<
  UseActiveItemDerivedStateArgs<TItem>,
  Omit<UseActiveItemEffectsArgs<TItem>, 'activeItem'> & {
    activeItem?: Omit<Required<UseActiveItemEffectsArgs<TItem>>['activeItem'], keyof ActiveItemDerivedState<TItem>>;
  },
  'activeItem'
>;

/**
 * Given "source of truth" state for the active item feature, returns derived state and `propHelpers`.
 * - Used internally by useTablePropHelpers
 * - Also triggers side effects to prevent invalid state
 * - "Derived state" here refers to values and convenience functions derived at render time.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useActiveItemPropHelpers = <TItem>(args: UseActiveItemPropHelpersExternalArgs<TItem>) => {
  const activeItemDerivedState = useActiveItemDerivedState(args);
  const { isActiveItem, setActiveItem, clearActiveItem } = activeItemDerivedState;

  useActiveItemEffects(mergeArgs(args, { activeItem: activeItemDerivedState }));

  /**
   * Returns props for a clickable Tr in a table with the active item feature enabled. Sets or clears the active item when clicked.
   */
  const getActiveItemTrProps = ({ item }: { item?: TItem }): Omit<TrProps, 'ref'> => ({
    isSelectable: true,
    isClickable: true,
    isRowSelected: item && isActiveItem(item),
    onRowClick: () => {
      if (item && !isActiveItem(item)) {
        setActiveItem(item);
      } else {
        clearActiveItem();
      }
    }
  });

  return { activeItemDerivedState, getActiveItemTrProps };
};
