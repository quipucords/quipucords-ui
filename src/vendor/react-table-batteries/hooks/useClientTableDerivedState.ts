import { useClientFilterDerivedState } from './filtering';
import { useClientSortDerivedState } from './sorting';
import { useClientPaginationDerivedState } from './pagination';
import { UseClientTableDerivedStateArgs, TableDerivedState, TableState } from '../types';

/**
 * Returns table-level "derived state" (the results of local/client-computed filtering/sorting/pagination)
 * - Used internally by the shorthand hook useClientTableBatteries.
 * - Takes "source of truth" state for all features and additional args.
 * @see useClientTableBatteries
 */
export const useClientTableDerivedState = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> &
    UseClientTableDerivedStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>
): TableDerivedState<TItem> => {
  const { items } = args;
  const { filteredItems } = useClientFilterDerivedState({
    ...args,
    items
  });
  const { sortedItems } = useClientSortDerivedState({
    ...args,
    items: filteredItems
  });
  const { currentPageItems } = useClientPaginationDerivedState({
    ...args,
    items: sortedItems
  });
  return {
    totalItemCount: filteredItems.length,
    currentPageItems
  };
};
