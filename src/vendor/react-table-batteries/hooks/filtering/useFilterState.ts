import { FilterValues, FilterCategory } from '../../tackle2-ui-legacy/components/FilterToolbar';
import { FeatureStateCommonArgs, TablePersistenceArgs } from '../../types';
import { usePersistentState } from '../generic/usePersistentState';
import { serializeFilterUrlParams } from './helpers';
import { deserializeFilterUrlParams } from './helpers';

/**
 * Feature-specific args for useFilterState
 * - Used as the `filter` sub-object in args of both useFilterState and useTableState as a whole
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableBatteries
 */
export interface FilterStateArgs<TItem, TFilterCategoryKey extends string> extends FeatureStateCommonArgs {
  /**
   * Definitions of the filters to be used (must include `getItemValue` functions for each category when performing filtering locally)
   */
  filterCategories: FilterCategory<TItem, TFilterCategoryKey>[];
  /**
   * Initial filter values to use on first render (optional)
   */
  initialFilterValues?: FilterValues<TFilterCategoryKey>;
}

/**
 * The "source of truth" state for the filter feature.
 * - Included in the `TableState` object returned by useTableState under the `filter` sub-object (combined with args above).
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableState
 * @see TableBatteries
 */
export interface FilterState<TFilterCategoryKey extends string> {
  /**
   * A mapping:
   * - from string keys uniquely identifying a filterCategory (inferred from the `key` properties of elements in the `filterCategories` array)
   * - to arrays of strings representing the current value(s) of that filter. Single-value filters are stored as an array with one element.
   */
  filterValues: FilterValues<TFilterCategoryKey>;
  /**
   * Updates the `filterValues` mapping.
   */
  setFilterValues: (values: FilterValues<TFilterCategoryKey>) => void;
}

/**
 * Provides the "source of truth" state for the filter feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * - Omit the `filter` object arg to disable the filtering feature.
 * @see PersistTarget
 */
export const useFilterState = <TItem, TFilterCategoryKey extends string, TPersistenceKeyPrefix extends string = string>(
  args: { filter?: FilterStateArgs<TItem, TFilterCategoryKey> } & TablePersistenceArgs<TPersistenceKeyPrefix>
): FilterState<TFilterCategoryKey> => {
  const { persistenceKeyPrefix } = args;
  const persistTo = args.filter?.persistTo || args.persistTo || 'state';

  const initialFilterValues: FilterValues<TFilterCategoryKey> = args.filter?.initialFilterValues || {};

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [filterValues, setFilterValues] = usePersistentState<
    FilterValues<TFilterCategoryKey>,
    TPersistenceKeyPrefix,
    'filters'
  >({
    isEnabled: args.filter?.isEnabled || false,
    defaultValue: initialFilterValues,
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['filters'],
          serialize: serializeFilterUrlParams,
          deserialize: deserializeFilterUrlParams
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? { persistTo, key: 'filters' }
      : { persistTo })
  });
  return { filterValues, setFilterValues };
};
