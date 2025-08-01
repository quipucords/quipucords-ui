import { PaginationState } from './usePaginationState';

/**
 * Args for useClientPaginationDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useClientTableDerivedState (UseClientTableDerivedStateArgs)
 * @see TableState
 * @see UseClientTableDerivedStateArgs
 */
export interface UseClientPaginationDerivedStateArgs<TItem> {
  /**
   * The API data items before pagination (but after filtering)
   */
  items: TItem[];
  /**
   * Feature-specific args: A subset of the `TableState` object's `pagination` property with only the state itself
   */
  pagination: PaginationState;
}

/**
 * Given the "source of truth" state for the pagination feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual pagination logic, which is done on the server for server-computed tables.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useClientPaginationDerivedState = <TItem>(args: UseClientPaginationDerivedStateArgs<TItem>) => {
  const {
    items,
    pagination: { pageNumber, itemsPerPage }
  } = args;
  const pageStartIndex = (pageNumber - 1) * itemsPerPage;
  const currentPageItems = items.slice(pageStartIndex, pageStartIndex + itemsPerPage);
  return { currentPageItems: args.pagination ? currentPageItems : items };
};
