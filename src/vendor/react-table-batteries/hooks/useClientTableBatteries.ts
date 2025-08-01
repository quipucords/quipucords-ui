import { useTablePropHelpers } from './useTablePropHelpers';
import { TableBatteries, UseClientTableBatteriesArgs } from '../types';
import { useClientTableDerivedState } from './useClientTableDerivedState';
import { useTableState } from './useTableState';
import { mergeArgs } from '../utils';

/**
 * Provides all state, derived state, side-effects and prop helpers needed to manage a local/client-computed table.
 * - Call this and only this if you aren't using server-side filtering/sorting/pagination.
 * - "Derived state" here refers to values and convenience functions derived at render time based on the "source of truth" state.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useClientTableBatteries = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: UseClientTableBatteriesArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
): TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> => {
  const state = useTableState(args);
  const stateWithArgs = mergeArgs(args, state);
  const derivedState = useClientTableDerivedState(stateWithArgs);
  return useTablePropHelpers({ ...stateWithArgs, ...derivedState });
};
