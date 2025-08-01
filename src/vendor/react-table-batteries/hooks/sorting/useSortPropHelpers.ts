import { ThProps } from '@patternfly/react-table';
import { SortState, SortStateArgs } from './useSortState';

/**
 * Args for useSortPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface UseSortPropHelpersExternalArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey
> {
  /**
   * A subset of the `TableState` object's `sort` property with the state itself and relevant state args
   */
  sort: SortState<TSortableColumnKey> & Pick<SortStateArgs<TItem, TSortableColumnKey>, 'sortableColumns'>;
}

/**
 * Additional args for useSortPropHelpers that come from logic inside useTablePropHelpers
 * @see useTablePropHelpers
 */
export interface UseSortPropHelpersInternalArgs<TColumnKey extends string> {
  /**
   * The keys of the `columnNames` object passed to useTableState (for all columns, not just the sortable ones)
   */
  columnKeys: TColumnKey[];
}

/**
 * Returns derived state and prop helpers for the sort feature based on given "source of truth" state.
 * - Used internally by useTablePropHelpers
 * - "Derived state" here refers to values and convenience functions derived at render time.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useSortPropHelpers = <TItem, TColumnKey extends string, TSortableColumnKey extends TColumnKey>(
  args: UseSortPropHelpersExternalArgs<TItem, TColumnKey, TSortableColumnKey> &
    UseSortPropHelpersInternalArgs<TColumnKey>
) => {
  const {
    columnKeys,
    sort: { activeSort, setActiveSort, sortableColumns }
  } = args;

  /**
   * Returns props for the Th component for a column with sorting enabled.
   */
  const getSortThProps = ({ columnKey }: { columnKey: TSortableColumnKey }): Pick<ThProps, 'sort'> =>
    sortableColumns.includes(columnKey)
      ? {
          sort: {
            columnIndex: columnKeys.indexOf(columnKey),
            sortBy: {
              index: activeSort ? columnKeys.indexOf(activeSort.columnKey) : undefined,
              direction: activeSort?.direction
            },
            onSort: (_event, index, direction) => {
              setActiveSort({
                columnKey: columnKeys[index] as TSortableColumnKey,
                direction
              });
            }
          }
        }
      : {};

  return { getSortThProps };
};
