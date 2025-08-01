import { KeyWithValueType } from '../../type-utils';
import { ItemId } from '../../types';
import { ActiveItemState } from './useActiveItemState';

/**
 * Args for useActiveItemDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface UseActiveItemDerivedStateArgs<TItem> {
  /**
   * The current page of API data items after filtering/sorting/pagination
   */
  currentPageItems: TItem[];
  /**
   * The string key/name of a property on the API data item objects that can be used as a unique identifier (string or number)
   */
  idProperty: KeyWithValueType<TItem, ItemId>;
  /**
   * A subset of the `TableState` object's `activeItem` property - here we only need the state itself.
   */
  activeItem: ActiveItemState;
}

/**
 * Derived state for the active item feature
 * - "Derived state" here refers to values and convenience functions derived at render time based on the "source of truth" state.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export interface ActiveItemDerivedState<TItem> {
  /**
   * The API data object matching the `activeItemId` in state
   */
  activeItem: TItem | null;
  /**
   * Updates the active item (sets `activeItemId` in state to the id of the given item).
   * - Pass null to dismiss the active item.
   */
  setActiveItem: (item: TItem | null) => void;
  /**
   * Dismisses the active item. Shorthand for setActiveItem(null).
   */
  clearActiveItem: () => void;
  /**
   * Returns whether the given item matches the `activeItemId` in state.
   */
  isActiveItem: (item: TItem) => boolean;
}

/**
 * Given the "source of truth" state for the active item feature and additional arguments, returns "derived state" values and convenience functions.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 *
 * NOTE: Unlike `useClient[Filter|Sort|Pagination]DerivedState`, this is not named `useClientActiveItemDerivedState` because it
 * is always local/client-computed, and it is still used when working with server-computed tables
 * (it's not specific to client-only-computed tables like the other `useClient*DerivedState` functions are).
 */
export const useActiveItemDerivedState = <TItem>(
  args: UseActiveItemDerivedStateArgs<TItem>
): ActiveItemDerivedState<TItem> => {
  const {
    currentPageItems,
    idProperty,
    activeItem: { activeItemId, setActiveItemId }
  } = args;
  return {
    activeItem: currentPageItems.find((item) => item[idProperty] === activeItemId) || null,
    setActiveItem: (item: TItem | null) => {
      const itemId = (item?.[idProperty] ?? null) as ItemId | null; // TODO Assertion shouldn't be necessary here but TS isn't fully inferring item[idProperty]?
      setActiveItemId(itemId);
    },
    clearActiveItem: () => setActiveItemId(null),
    isActiveItem: (item) => item[idProperty] === activeItemId
  };
};
