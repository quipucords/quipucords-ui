import { TableState, UseTableStateArgs } from '../types';
import { useFilterState } from './filtering';
import { useSortState } from './sorting';
import { usePaginationState } from './pagination';
import { useActiveItemState } from './active-item';
import { useExpansionState } from './expansion';
import { useSelectionState } from './selection';
import { mergeArgs } from '../utils';

/**
 * Provides the "source of truth" state for all table features.
 * - State can be persisted in one or more configurable storage targets, either the same for the entire table or different targets per feature.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 * - If you aren't using server-side filtering/sorting/pagination, call this via the shorthand hook useClientTableBatteries.
 * - If you are using server-side filtering/sorting/pagination, call this first before fetching your API data and then calling useTablePropHelpers.
 * @param args
 * @returns
 */
export const useTableState = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: UseTableStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
): TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> => {
  const state = {
    filter: useFilterState<TItem, TFilterCategoryKey, TPersistenceKeyPrefix>(args),
    sort: useSortState<TItem, TSortableColumnKey, TPersistenceKeyPrefix>(args),
    pagination: usePaginationState<TPersistenceKeyPrefix>(args),
    selection: useSelectionState(args),
    expansion: useExpansionState<TColumnKey, TPersistenceKeyPrefix>(args),
    activeItem: useActiveItemState<TPersistenceKeyPrefix>(args)
  };
  const {
    filter: { filterValues },
    sort: { activeSort },
    pagination: { pageNumber, itemsPerPage }
  } = state;
  const cacheKey = JSON.stringify({ filterValues, activeSort, pageNumber, itemsPerPage });
  return { ...mergeArgs(args, state), cacheKey };
};
