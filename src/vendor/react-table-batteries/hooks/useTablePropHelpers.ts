import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';

import { TableBatteries, UseTablePropHelpersArgs } from '../types';
import { useFilterPropHelpers } from './filtering';
import { useSortPropHelpers } from './sorting';
import { usePaginationPropHelpers } from './pagination';
import { useSelectionPropHelpers } from './selection';
import { useExpansionPropHelpers } from './expansion';
import { useActiveItemPropHelpers } from './active-item';
import { handlePropagatedRowClick, mergeArgs, objectKeys } from '../utils';
import { useTableComponents } from './useTableComponents';

/**
 * Returns derived state and prop helpers for all features. Used to make rendering the table components easier.
 * - Takes "source of truth" state and table-level derived state (derived either on the server or in useClientTableDerivedState)
 *   along with API data and additional args.
 * - Also triggers side-effects for some features to prevent invalid state.
 * - If you aren't using server-side filtering/sorting/pagination, call this via the shorthand hook useClientTableBatteries.
 * - If you are using server-side filtering/sorting/pagination, call this last after calling useTableState and fetching your API data.
 * @see useClientTableBatteries
 * @see useTableState
 * @see useClientTableDerivedState
 */
export const useTablePropHelpers = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: UseTablePropHelpersArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
): TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> => {
  type PropHelpers = TableBatteries<
    TItem,
    TColumnKey,
    TSortableColumnKey,
    TFilterCategoryKey,
    TPersistenceKeyPrefix
  >['propHelpers'];

  // Note: To avoid repetition, not all args are destructured here since the entire
  //       args object is passed to other other helpers which require other parts of it.
  //       For future additions, inspect `args` to see if it has anything more you need.
  const { forceNumRenderedColumns, columnNames, hasActionsColumn = false, variant } = args;

  const columnKeys = objectKeys(columnNames);

  // Some table controls rely on extra columns inserted before or after the ones included in columnNames.
  // We need to account for those when dealing with props based on column index and colSpan.
  let numColumnsBeforeData = 0;
  let numColumnsAfterData = 0;
  if (args.selection.isEnabled) {
    numColumnsBeforeData++;
  }
  if (args.expansion.isEnabled && args.expansion.variant === 'single') {
    numColumnsBeforeData++;
  }
  if (hasActionsColumn) {
    numColumnsAfterData++;
  }
  const numRenderedColumns = forceNumRenderedColumns || columnKeys.length + numColumnsBeforeData + numColumnsAfterData;

  const { filterPropsForToolbar, propsForFilterToolbar } = useFilterPropHelpers(args);
  const { getSortThProps } = useSortPropHelpers<TItem, TColumnKey, TSortableColumnKey>({ ...args, columnKeys });
  const { paginationProps, paginationToolbarItemProps } = usePaginationPropHelpers(args);
  const { selectionDerivedState, toolbarBulkSelectorProps, getSelectCheckboxTdProps } = useSelectionPropHelpers({
    ...args,
    paginationProps
  });
  const { expansionDerivedState, getSingleExpandButtonTdProps, getCompoundExpandTdProps, getExpandedContentTdProps } =
    useExpansionPropHelpers({ ...args, columnKeys, numRenderedColumns });
  const { activeItemDerivedState, getActiveItemTrProps } = useActiveItemPropHelpers(args);

  const toolbarProps: PropHelpers['toolbarProps'] = {
    className: variant === 'compact' ? spacing.pt_0 : '',
    ...(args.filter?.isEnabled && filterPropsForToolbar)
  };

  const tableProps: PropHelpers['tableProps'] = {
    variant,
    isExpandable: args.expansion?.isEnabled
  };

  const getThProps: PropHelpers['getThProps'] = ({ columnKey }) => ({
    ...(args.sort?.isEnabled && getSortThProps({ columnKey: columnKey as TSortableColumnKey })),
    children: columnNames[columnKey]
  });

  const getTrProps: PropHelpers['getTrProps'] = ({ item, onRowClick }) => {
    if (!item) {
      return {};
    }
    const activeItemTrProps = getActiveItemTrProps({ item });
    return {
      ...(args.activeItem?.isEnabled && activeItemTrProps),
      onRowClick: (event) =>
        handlePropagatedRowClick(event, () => {
          activeItemTrProps.onRowClick?.(event);
          onRowClick?.(event);
        })
    };
  };

  const getTdProps: PropHelpers['getTdProps'] = (getTdPropsArgs) => {
    const { columnKey } = getTdPropsArgs;
    return {
      dataLabel: columnNames[columnKey],
      ...(args.expansion?.isEnabled &&
        args.expansion?.variant === 'compound' &&
        getTdPropsArgs.isCompoundExpandToggle &&
        getCompoundExpandTdProps({
          columnKey,
          item: getTdPropsArgs.item,
          rowIndex: getTdPropsArgs.rowIndex
        }))
    };
  };

  const batteriesWithoutComponents: Omit<
    TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
    'components'
  > = {
    ...mergeArgs(args, {
      selection: selectionDerivedState,
      expansion: expansionDerivedState,
      activeItem: activeItemDerivedState
    }),
    numColumnsBeforeData,
    numColumnsAfterData,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
      filterToolbarProps: propsForFilterToolbar,
      paginationProps,
      paginationToolbarItemProps,
      toolbarBulkSelectorProps,
      getSelectCheckboxTdProps,
      getSingleExpandButtonTdProps,
      getExpandedContentTdProps
    }
  };

  return {
    ...batteriesWithoutComponents,
    components: useTableComponents(batteriesWithoutComponents)
  };
};
