import { FeatureStateCommonArgs, TablePersistenceArgs } from '../../types';
import { usePersistentState } from '../generic/usePersistentState';

/**
 * The currently applied sort parameters
 */
export interface ActiveSort<TSortableColumnKey extends string> {
  /**
   * The identifier for the currently sorted column (`columnKey` values come from the keys of the `columnNames` object passed to useTableState)
   */
  columnKey: TSortableColumnKey;
  /**
   * The direction of the currently applied sort (ascending or descending)
   */
  direction: 'asc' | 'desc';
}

/**
 * Feature-specific args for useSortState
 * - Used as the `sort` sub-object in args of both useSortState and useTableState as a whole
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see UseTableStateArgs
 * @see TableBatteries
 */
export interface SortStateArgs<TItem, TSortableColumnKey extends string> extends FeatureStateCommonArgs {
  /**
   * The `columnKey` values (keys of the `columnNames` object passed to useTableState) corresponding to columns with sorting enabled
   */
  sortableColumns: TSortableColumnKey[];
  /**
   * The sort column and direction that should be applied by default when the table first loads
   */
  initialSort?: ActiveSort<TSortableColumnKey> | null;
  /**
   * A callback function to return, for a given API data item, a record of sortable primitives for that item's sortable columns
   * - The record maps:
   *   - from `columnKey` values (the keys of the `columnNames` object passed to useTableState)
   *   - to easily sorted primitive values (string | number | boolean) for this item's value in that column
   * Added here even though it's not used in useSortState so args can be passed all at once. Actually used only in useClientSortDerivedState.
   * @see useClientSortDerivedState
   */
  getSortValues?: (item: TItem) => Record<TSortableColumnKey, string | number | boolean>;
}

/**
 * The "source of truth" state for the sort feature.
 * - Included in the `TableState` object returned by useTableState under the `sort` sub-object (combined with args above).
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableState
 * @see TableBatteries
 */
export interface SortState<TSortableColumnKey extends string> {
  /**
   * The currently applied sort column and direction
   */
  activeSort: ActiveSort<TSortableColumnKey> | null;
  /**
   * Updates the currently applied sort column and direction
   */
  setActiveSort: (sort: ActiveSort<TSortableColumnKey>) => void;
}

/**
 * Provides the "source of truth" state for the sort feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * - Omit the `sort` object arg to disable the sorting feature.
 * @see PersistTarget
 */
export const useSortState = <TItem, TSortableColumnKey extends string, TPersistenceKeyPrefix extends string = string>(
  args: { sort?: SortStateArgs<TItem, TSortableColumnKey> } & TablePersistenceArgs<TPersistenceKeyPrefix>
): SortState<TSortableColumnKey> => {
  const { persistenceKeyPrefix } = args;
  const persistTo = args.sort?.persistTo || args.persistTo || 'state';

  const sortableColumns = args.sort?.sortableColumns || [];
  const initialSort: ActiveSort<TSortableColumnKey> | null = sortableColumns[0]
    ? { columnKey: sortableColumns[0], direction: 'asc' }
    : null;

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [activeSort, setActiveSort] = usePersistentState<
    ActiveSort<TSortableColumnKey> | null,
    TPersistenceKeyPrefix,
    'sortColumn' | 'sortDirection'
  >({
    isEnabled: args.sort?.isEnabled || false,
    defaultValue: initialSort,
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['sortColumn', 'sortDirection'],
          serialize: (activeSort) => ({
            sortColumn: activeSort?.columnKey || null,
            sortDirection: activeSort?.direction || null
          }),
          deserialize: (urlParams) =>
            urlParams.sortColumn && urlParams.sortDirection
              ? {
                  columnKey: urlParams.sortColumn as TSortableColumnKey,
                  direction: urlParams.sortDirection as 'asc' | 'desc'
                }
              : null
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? {
          persistTo,
          key: 'sort'
        }
      : { persistTo })
  });
  return { activeSort, setActiveSort };
};
