import { FilterToolbarProps } from '../../tackle2-ui-legacy/components/FilterToolbar';
import { FilterState, FilterStateArgs } from './useFilterState';
import { ToolbarProps } from '@patternfly/react-core';

/**
 * Args for useFilterPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface UseFilterPropHelpersExternalArgs<TItem, TFilterCategoryKey extends string> {
  /**
   * A subset of the `TableState` object's `filter` property with the state itself and relevant state args
   */
  filter: FilterState<TFilterCategoryKey> & Pick<FilterStateArgs<TItem, TFilterCategoryKey>, 'filterCategories'>;
}

/**
 * Returns derived state and prop helpers for the filter feature based on given "source of truth" state.
 * - Used internally by useTablePropHelpers
 * - "Derived state" here refers to values and convenience functions derived at render time.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useFilterPropHelpers = <TItem, TFilterCategoryKey extends string>(
  args: UseFilterPropHelpersExternalArgs<TItem, TFilterCategoryKey>
) => {
  const {
    filter: { filterValues, setFilterValues, filterCategories }
  } = args;

  /**
   * Filter-related props for the PF Toolbar component
   */
  const filterPropsForToolbar: ToolbarProps = {
    collapseListedFiltersBreakpoint: 'xl',
    clearAllFilters: () => setFilterValues({}),
    clearFiltersButtonText: 'Clear all filters' // TODO support i18n / custom text here
  };

  /**
   * Props for the FilterToolbar component (our component for rendering filters)
   */
  const propsForFilterToolbar: Omit<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'> = {
    filterCategories,
    filterValues,
    setFilterValues
  };

  // TODO fix the confusing naming here... we have FilterToolbar and Toolbar which both have filter-related props
  return { filterPropsForToolbar, propsForFilterToolbar };
};
