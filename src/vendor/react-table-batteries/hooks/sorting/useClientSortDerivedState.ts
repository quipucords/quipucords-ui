import { SortState, SortStateArgs } from './useSortState';

/**
 * Args for useClientSortDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useClientTableDerivedState (UseClientTableDerivedStateArgs)
 * @see TableState
 * @see UseClientTableDerivedStateArgs
 */
export interface UseClientSortDerivedStateArgs<TItem, TSortableColumnKey extends string> {
  /**
   * The API data items before sorting
   */
  items: TItem[];
  /**
   * Feature-specific args: A subset of the `TableState` object's `sort` property with the state itself and relevant state args
   */
  sort: SortState<TSortableColumnKey> & Pick<SortStateArgs<TItem, TSortableColumnKey>, 'getSortValues'>;
}

/**
 * Given the "source of truth" state for the sort feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual sorting logic, which is done on the server for server-computed tables.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useClientSortDerivedState = <TItem, TSortableColumnKey extends string>(
  args: UseClientSortDerivedStateArgs<TItem, TSortableColumnKey>
) => {
  const {
    items,
    sort: { getSortValues, activeSort }
  } = args;

  if (!getSortValues || !activeSort) {
    return { sortedItems: items };
  }

  let sortedItems = items;
  sortedItems = [...items].sort((a: TItem, b: TItem) => {
    let aValue = getSortValues(a)[activeSort.columnKey];
    let bValue = getSortValues(b)[activeSort.columnKey];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.replace(/ +/g, '');
      bValue = bValue.replace(/ +/g, '');
      const aSortResult = aValue.localeCompare(bValue);
      const bSortResult = bValue.localeCompare(aValue);
      return activeSort.direction === 'asc' ? aSortResult : bSortResult;
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return activeSort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      if (aValue > bValue) {
        return activeSort.direction === 'asc' ? -1 : 1;
      }
      if (aValue < bValue) {
        return activeSort.direction === 'asc' ? -1 : 1;
      }
    }

    return 0;
  });

  return { sortedItems };
};
