import { PaginationProps, ToolbarItemProps } from '@patternfly/react-core';
import { UsePaginationEffectsArgs, usePaginationEffects } from './usePaginationEffects';

/**
 * Args for usePaginationPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export type UsePaginationPropHelpersExternalArgs = UsePaginationEffectsArgs & {
  /**
    The total number of items in the entire un-filtered, un-paginated table (the size of the entire API collection being tabulated).
   */
  totalItemCount: number;
};

/**
 * Returns derived state and prop helpers for the pagination feature based on given "source of truth" state.
 * - Used internally by useTablePropHelpers
 * - "Derived state" here refers to values and convenience functions derived at render time.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const usePaginationPropHelpers = (args: UsePaginationPropHelpersExternalArgs) => {
  const {
    totalItemCount,
    pagination: { pageNumber, itemsPerPage, setPageNumber, setItemsPerPage }
  } = args;

  usePaginationEffects(args);

  /**
   * Props for the PF Pagination component
   */
  const paginationProps: PaginationProps = {
    itemCount: totalItemCount,
    perPage: itemsPerPage,
    page: pageNumber,
    onSetPage: (_event, pageNumber) => setPageNumber?.(pageNumber),
    onPerPageSelect: (_event, perPage) => {
      setPageNumber?.(1);
      setItemsPerPage?.(perPage);
    }
  };

  /**
   * Props for the PF ToolbarItem component which contains the Pagination component
   */
  const paginationToolbarItemProps: ToolbarItemProps = {
    variant: 'pagination',
    align: { default: 'alignRight' }
  };

  return { paginationProps, paginationToolbarItemProps };
};
