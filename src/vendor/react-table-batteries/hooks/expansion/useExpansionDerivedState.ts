import { KeyWithValueType } from '../../type-utils';
import { ItemId } from '../../types';
import { ExpansionState } from './useExpansionState';

/**
 * Args for useExpansionDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface UseExpansionDerivedStateArgs<TItem, TColumnKey extends string> {
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
 * Derived state for the expansion feature
 * - "Derived state" here refers to values and convenience functions derived at render time based on the "source of truth" state.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export interface ExpansionDerivedState<TItem, TColumnKey extends string> {
  /**
   * Returns whether a cell or a row is expanded
   *  - If called with a columnKey, returns whether that column's cell in this row is expanded (for compound-expand)
   *  - If called without a columnKey, returns whether the entire row or any cell in it is expanded (for both single-expand and compound-expand)
   */
  isCellExpanded: (item: TItem, columnKey?: TColumnKey) => boolean;
  /**
   * Set a cell or a row as expanded or collapsed
   *  - If called with a columnKey, sets that column's cell in this row expanded or collapsed (for compound-expand)
   *  - If called without a columnKey, sets the entire row as expanded or collapsed (for single-expand)
   */
  setCellExpanded: (args: { item: TItem; isExpanding?: boolean; columnKey?: TColumnKey }) => void;
}

/**
 * Given the "source of truth" state for the expansion feature and additional arguments, returns "derived state" values and convenience functions.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 *
 * NOTE: Unlike `useClient[Filter|Sort|Pagination]DerivedState`, this is not named `useClientExpansionDerivedState` because it
 * is always local/client-computed, and it is still used when working with server-computed tables
 * (it's not specific to client-only-computed tables like the other `useClient*DerivedState` functions are).
 */
export const useExpansionDerivedState = <TItem, TColumnKey extends string>(
  args: UseExpansionDerivedStateArgs<TItem, TColumnKey>
): ExpansionDerivedState<TItem, TColumnKey> => {
  const {
    idProperty,
    expansion: { expandedCells, setExpandedCells }
  } = args;

  const isCellExpanded = (item: TItem, columnKey?: TColumnKey) =>
    columnKey ? expandedCells[String(item[idProperty])] === columnKey : !!expandedCells[String(item[idProperty])];

  const setCellExpanded = ({
    item,
    isExpanding = true,
    columnKey
  }: {
    item: TItem;
    isExpanding?: boolean;
    columnKey?: TColumnKey;
  }) => {
    const newExpandedCells = { ...expandedCells };
    if (isExpanding) {
      newExpandedCells[String(item[idProperty])] = columnKey || true;
    } else {
      delete newExpandedCells[String(item[idProperty])];
    }
    setExpandedCells(newExpandedCells);
  };

  return { isCellExpanded, setCellExpanded };
};
