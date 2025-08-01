import { ExpansionState } from './useExpansionState';
import { useExpansionDerivedState } from './useExpansionDerivedState';
import { TdProps } from '@patternfly/react-table';
import { KeyWithValueType } from '../../type-utils';
import { ItemId } from '../../types';

/**
 * Args for useExpansionPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface UseExpansionPropHelpersExternalArgs<TItem, TColumnKey extends string> {
  /**
   * An ordered mapping of unique keys to human-readable column name strings.
   * - Keys of this object are used as unique identifiers for columns (`columnKey`).
   * - Values of this object are rendered in the column headers by default (can be overridden by passing children to <Th>) and used as `dataLabel` for cells in the column.
   */
  columnNames: Record<TColumnKey, string>;
  /**
   * The string key/name of a property on the API data item objects that can be used as a unique identifier (string or number)
   */
  idProperty: KeyWithValueType<TItem, ItemId>;
  /**
   * A subset of the `TableState` object's `expansion` property - here we only need the state itself.
   */
  expansion: ExpansionState<TColumnKey>;
}

/**
 * Additional args for useExpansionPropHelpers that come from logic inside useTablePropHelpers
 * @see useTablePropHelpers
 */
export interface UseExpansionPropHelpersInternalArgs<TColumnKey extends string> {
  /**
   * The keys of the `columnNames` object (unique keys identifying each column).
   */
  columnKeys: TColumnKey[];
  /**
   * The total number of columns (Td elements that should be rendered in each Tr)
   * - Includes data cells (based on the number of `columnKeys`) and non-data cells for enabled features.
   * - For use as the colSpan of a cell that spans an entire row.
   */
  numRenderedColumns: number;
}

/**
 * Returns derived state and prop helpers for the expansion feature based on given "source of truth" state.
 * - Used internally by useTablePropHelpers
 * - "Derived state" here refers to values and convenience functions derived at render time.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useExpansionPropHelpers = <TItem, TColumnKey extends string>(
  args: UseExpansionPropHelpersExternalArgs<TItem, TColumnKey> & UseExpansionPropHelpersInternalArgs<TColumnKey>
) => {
  const {
    columnNames,
    idProperty,
    columnKeys,
    numRenderedColumns,
    expansion: { expandedCells }
  } = args;

  const expansionDerivedState = useExpansionDerivedState(args);
  const { isCellExpanded, setCellExpanded } = expansionDerivedState;

  /**
   * Returns props for the Td to the left of the data cells which contains each row's expansion toggle button (only for single-expand).
   */
  const getSingleExpandButtonTdProps = ({
    item,
    rowIndex
  }: {
    item: TItem;
    rowIndex: number;
  }): Omit<TdProps, 'ref'> => ({
    expand: {
      rowIndex,
      isExpanded: isCellExpanded(item),
      onToggle: () =>
        setCellExpanded({
          item,
          isExpanding: !isCellExpanded(item)
        }),
      expandId: `expandable-row-${item[idProperty]}`
    }
  });

  /**
   * Returns props for the Td which is a data cell in an expandable column and functions as an expand toggle (only for compound-expand)
   */
  const getCompoundExpandTdProps = ({
    columnKey,
    item,
    rowIndex
  }: {
    columnKey: TColumnKey;
    item: TItem;
    rowIndex: number;
  }): Omit<TdProps, 'ref'> => ({
    compoundExpand: {
      isExpanded: isCellExpanded(item, columnKey),
      onToggle: () =>
        setCellExpanded({
          item,
          isExpanding: !isCellExpanded(item, columnKey),
          columnKey
        }),
      expandId: `compound-expand-${item[idProperty]}-${columnKey}`,
      rowIndex,
      columnIndex: columnKeys.indexOf(columnKey)
    }
  });

  /**
   * Returns props for the Td which contains the expanded content below an expandable row (for both single-expand and compound-expand).
   * This Td should be rendered as the only cell in a Tr just below the Tr containing the corresponding row.
   * The Tr for the row content and the Tr for the expanded content should be the only two children of a Tbody grouping them (one per expandable row).
   */
  const getExpandedContentTdProps = ({ item }: { item: TItem }): Omit<TdProps, 'ref'> => {
    const expandedColumnKey = expandedCells[String(item[idProperty])];
    return {
      dataLabel: typeof expandedColumnKey === 'string' ? columnNames[expandedColumnKey] : undefined,
      noPadding: true,
      colSpan: numRenderedColumns,
      width: 100
    };
  };

  return {
    expansionDerivedState,
    getSingleExpandButtonTdProps,
    getCompoundExpandTdProps,
    getExpandedContentTdProps
  };
};
