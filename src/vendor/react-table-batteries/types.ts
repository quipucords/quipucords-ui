import React from 'react';
import { TableProps, TbodyProps, TdProps, ThProps, TheadProps, TrProps } from '@patternfly/react-table';
import {
  UseClientFilterDerivedStateArgs,
  UseFilterPropHelpersExternalArgs,
  FilterState,
  FilterStateArgs
} from './hooks/filtering';
import {
  UseClientSortDerivedStateArgs,
  UseSortPropHelpersExternalArgs,
  SortState,
  SortStateArgs
} from './hooks/sorting';
import {
  UseClientPaginationDerivedStateArgs,
  UsePaginationPropHelpersExternalArgs,
  PaginationState,
  PaginationStateArgs
} from './hooks/pagination';
import {
  SelectionDerivedState,
  SelectionState,
  SelectionStateArgs,
  UseSelectionPropHelpersExternalArgs
} from './hooks/selection';
import { ExpansionDerivedState, ExpansionState, ExpansionStateArgs } from './hooks/expansion';
import {
  ActiveItemDerivedState,
  UseActiveItemPropHelpersExternalArgs,
  ActiveItemState,
  ActiveItemStateArgs
} from './hooks/active-item';
import { PaginationProps, ToolbarItemProps, ToolbarProps } from '@patternfly/react-core';
import { UseExpansionPropHelpersExternalArgs } from './hooks/expansion/useExpansionPropHelpers';
import { DisallowCharacters, DiscriminatedArgs, MergedArgs } from './type-utils';
import { FilterToolbarProps } from './tackle2-ui-legacy/components/FilterToolbar';
import { ToolbarBulkSelectorProps } from './tackle2-ui-legacy/components/ToolbarBulkSelector';
import {
  TdWithBatteriesProps,
  ThWithBatteriesProps,
  ToolbarBulkSelectorWithBatteriesProps,
  TrWithBatteriesBodyRowProps,
  TrWithBatteriesHeaderRowProps
} from './components';

// Generic type params used here:
//   TItem - The actual API objects represented by rows in the table. Can be any object.
//   TColumnKey - Union type of unique identifier strings for the columns in the table
//   TSortableColumnKey - A subset of column keys that have sorting enabled
//   TFilterCategoryKey - Union type of unique identifier strings for filters (not necessarily the same as column keys)
//   TPersistenceKeyPrefix - String (must not include a `:` character) used to distinguish persisted state for multiple tables
// TODO move this to DOCS.md or CONTRIBUTING.md or MDX docs site and reference the paragraph here

export type ItemId = string | number;

/**
 * Identifier for a feature of the table. State concerns are separated by feature.
 */
export const TABLE_FEATURES = ['filter', 'sort', 'pagination', 'selection', 'expansion', 'activeItem'] as const;
export type TableFeature = (typeof TABLE_FEATURES)[number];

/**
 * Identifier for where to persist state for a single table feature or for all table features.
 * - "state" (default) - Plain React state. Resets on component unmount or page reload.
 * - "urlParams" (recommended) - URL query parameters. Persists on page reload, browser history buttons (back/forward) or loading a bookmark. Resets on page navigation.
 * - "localStorage" - Browser localStorage API. Persists semi-permanently and is shared across all tabs/windows. Resets only when the user clears their browsing data.
 * - "sessionStorage" - Browser sessionStorage API. Persists on page/history navigation/reload. Resets when the tab/window is closed.
 */
export type PersistTarget = 'state' | 'urlParams' | 'localStorage' | 'sessionStorage';

export interface CommonPersistenceArgs {
  /**
   * Where to persist state.
   * When passed at the root level to useTableState, defines the default for all features.
   * When passed in a feature sub-object, overrides the default for that feature.
   * Optional: Defaults to "state" (React state with no persistence).
   */
  persistTo?: PersistTarget;
}

export interface TablePersistenceArgs<TPersistenceKeyPrefix extends string> extends CommonPersistenceArgs {
  /**
   * A short string uniquely identifying a specific table. Automatically prepended to any key used in state persistence (e.g. in a URL parameter or localStorage).
   * - Optional: Only omit if this table will not be rendered at the same time as any other tables.
   * - Allows multiple tables to be used on the same page with the same PersistTarget.
   * - Cannot contain a `:` character since this is used as the delimiter in the prefixed key.
   * - Should be short, especially when using the "urlParams" PersistTarget.
   */
  persistenceKeyPrefix?: DisallowCharacters<TPersistenceKeyPrefix, ':'>;
}

export interface FeatureStateCommonArgs extends CommonPersistenceArgs {
  /**
   * Whether to enable logic and rendering related to the feature
   */
  isEnabled: boolean;
}

/**
 * Feature-specific args for useTableState with all features enabled.
 * Separated from UseTableStateArgs for easier reference to the defined versions of these properties.
 * Used in UseTableStateArgs with all properties optional. Omit args for a feature to disable that feature.
 */
export interface TableFeatureStateArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string
> {
  /**
   * State arguments for the filter feature.
   */
  filter: FilterStateArgs<TItem, TFilterCategoryKey>;
  /**
   * State arguments for the sort feature.
   */
  sort: SortStateArgs<TItem, TSortableColumnKey>;
  /**
   * State arguments for the pagination feature.
   */
  pagination: PaginationStateArgs;
  /**
   * State arguments for the selection feature.
   */
  selection: SelectionStateArgs<TItem>;
  /**
   * State arguments for the expansion feature.
   */
  expansion: ExpansionStateArgs;
  /**
   * State arguments for the active item feature.
   */
  activeItem: ActiveItemStateArgs;
}

/**
 * State with all features enabled.
 * Separated from TableState for easier reference to the defined versions of these properties.
 * Used in TableState with all properties optional. Only state for enabled features will end up in TableState.
 */
export interface TableFeatureState<
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string
> {
  filter: FilterState<TFilterCategoryKey>;
  sort: SortState<TSortableColumnKey>;
  pagination: PaginationState;
  selection: SelectionState;
  expansion: ExpansionState<TColumnKey>;
  activeItem: ActiveItemState;
}

export interface TableFeatureDerivedState<TItem, TColumnKey extends string> {
  selection: SelectionDerivedState<TItem>;
  expansion: ExpansionDerivedState<TItem, TColumnKey>;
  activeItem: ActiveItemDerivedState<TItem>;
}

/**
 * Table-level state configuration arguments
 * - Taken by useTableState
 * - Made up of the combined feature-level state configuration argument objects (all optional - omit a feature's args to disable it).
 * - Does not require any state or API data in scope (can be called at the top of your component).
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableBatteries
 */
export interface UseTableStateArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> extends TablePersistenceArgs<TPersistenceKeyPrefix>,
    Partial<TableFeatureStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>> {
  /**
   * An ordered mapping of unique keys to human-readable column name strings.
   * - Keys of this object are used as unique identifiers for columns (`columnKey`).
   * - Values of this object are rendered in the column headers by default (can be overridden by passing children to <Th>) and used as `dataLabel` for cells in the column.
   */
  columnNames: Record<TColumnKey, string>;
}

/**
 * Table-level state object
 * - Returned by useTableState
 * - Provides persisted "source of truth" state for all table features.
 * - Also includes all of useTableState's arguments for convenience, since useTablePropHelpers requires them along with the state itself.
 * - The state and arguments objects for each feature are merged here as we build up to the full batteries object.
 * - Note that this only contains the args and "source of truth" state and does not include "derived state" which is computed at render time.
 *   - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableBatteries
 */
export interface TableState<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> extends MergedArgs<
    UseTableStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
    TableFeatureState<TColumnKey, TSortableColumnKey, TFilterCategoryKey>
  > {
  /**
   * A string that changes whenever state changes that should result in a data refetch if this is a server-filtered/sorted/paginated table.
   * For use as a useEffect dependency, react-query key, or other value that will trigger an API refetch when it changes.
   */
  cacheKey: string;
}

/**
 * Table-level local derived state configuration arguments
 * - "Local derived state" refers to the results of client-side filtering/sorting/pagination. This is not used for server-paginated tables.
 * - Made up of the combined feature-level local derived state argument objects.
 * - Used by useClientTableDerivedState.
 *   - useClientTableDerivedState also requires the return values from useTableState.
 * - Also used indirectly by the useClientTableBatteries shorthand hook.
 * - Requires state and API data in scope (or just API data if using useClientTableBatteries).
 */
export type UseClientTableDerivedStateArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string
> = UseClientFilterDerivedStateArgs<TItem, TFilterCategoryKey> &
  UseClientSortDerivedStateArgs<TItem, TSortableColumnKey> &
  UseClientPaginationDerivedStateArgs<TItem>;
// There is no ClientSelectionDerivedStateArgs type because selection derived state is always local and internal to useTablePropHelpers
// There is no ClientExpansionDerivedStateArgs type because expansion derived state is always local and internal to useTablePropHelpers
// There is no ClientActiveItemDerivedStateArgs type because active item derived state is always local and internal to useTablePropHelpers

/**
 * Table-level derived state object
 * - "Derived state" here refers to the results of filtering/sorting/pagination performed either on the client or the server.
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * - Provided by either:
 *   - Return values of useClientTableDerivedState (client-side filtering/sorting/pagination)
 *   - The consumer directly (server-side filtering/sorting/pagination)
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableBatteries
 */
export interface TableDerivedState<TItem> {
  /**
   * The items to be rendered on the current page of the table. These items have already been filtered, sorted and paginated.
   */
  currentPageItems: TItem[];
  /**
   * The total number of items in the entire un-filtered, un-paginated table (the size of the entire API collection being tabulated).
   */
  totalItemCount: number;
}

export type PropHelpersFeatureExternalArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string
> = UseFilterPropHelpersExternalArgs<TItem, TFilterCategoryKey> &
  UseSortPropHelpersExternalArgs<TItem, TColumnKey, TSortableColumnKey> &
  UsePaginationPropHelpersExternalArgs &
  UseSelectionPropHelpersExternalArgs<TItem> &
  UseExpansionPropHelpersExternalArgs<TItem, TColumnKey> &
  UseActiveItemPropHelpersExternalArgs<TItem>;

/**
 * Rendering configuration arguments
 * - Used by only useTablePropHelpers
 * - Requires state and API data in scope
 * - Combines all args for useTableState with the return values of useTableState, args used only for rendering, and args derived from either:
 *   - Server-side filtering/sorting/pagination provided by the consumer
 *   - useClientTableDerivedState (client-side filtering/sorting/pagination)
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableBatteries
 */
export type UseTablePropHelpersArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> =
  // Combine all args for useTableState, its return values, and additional args (merging feature sub-objects).
  MergedArgs<
    MergedArgs<
      UseTableStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
      TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
    >,
    PropHelpersFeatureExternalArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>
  > &
    TableDerivedState<TItem> & {
      /**
       * Whether the table data is loading
       */
      isLoading?: boolean;
      /**
       * Override the `numRenderedColumns` value used internally. This should be equal to the colSpan of a cell that takes the full width of the table.
       * - Optional: when omitted, the value used is based on the number of `columnNames` and whether features are enabled that insert additional columns (like checkboxes for selection, a kebab for actions, etc).
       */
      forceNumRenderedColumns?: number;
      /**
       * The variant of the table. Affects some spacing. Gets included in `propHelpers.tableProps`.
       */
      variant?: TableProps['variant'];
      /**
       * Whether there is a separate column for action buttons/menus at the right side of the table
       */
      hasActionsColumn?: boolean;
    };

/**
 * Table batteries object
 * - The object used for rendering. Includes everything you need to return JSX for your table.
 * - Returned by useTablePropHelpers and useClientTableBatteries
 * - Includes all args and return values from useTableState and useTablePropHelpers (configuration, state, derived state and propHelpers).
 */
export type TableBatteries<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> =
  // Combine TableState, args for useTablePropHelpers, its return values, merging feature sub-objects.
  MergedArgs<
    MergedArgs<
      TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
      UseTablePropHelpersArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
    >,
    Partial<TableFeatureDerivedState<TItem, TColumnKey>>
  > & {
    /**
     * The number of extra non-data columns that appear before the data in each row. Based on whether selection and single-expansion features are enabled.
     */
    numColumnsBeforeData: number;
    /**
     * The number of extra non-data columns that appear after the data in each row. Based on `hasActionsColumn`.
     */
    numColumnsAfterData: number;
    /**
     * The total number of columns to be rendered including data and non-data columns.
     */
    numRenderedColumns: number;
    /**
     * Prop helpers: where it all comes together.
     * These objects and functions provide props for specific PatternFly components in your table derived from the state and arguments above.
     * As much of the prop passing as possible is abstracted away via these helpers, which are to be used with spread syntax (e.g. <Td {...getTdProps({ columnKey: "foo" })}/>).
     * Any props included here can be overridden by simply passing additional props after spreading the helper onto a component.
     */
    propHelpers: {
      /**
       * Props for the Toolbar component.
       * Includes spacing based on the table variant and props related to filtering.
       */
      toolbarProps: Omit<ToolbarProps, 'ref'>;
      /**
       * Props for the Table component.
       */
      tableProps: Omit<TableProps, 'ref'>;
      /**
       * Returns props for the Th component for a specific column.
       * Includes default children (column name) and props related to sorting.
       */
      getThProps: (args: { columnKey: TColumnKey }) => Omit<ThProps, 'ref'>;
      /**
       * Returns props for the Tr component for a specific data item.
       * Includes props related to the active-item feature.
       * The item arg is optional here because getTrProps is also used on the table header row where there is no item.
       */
      getTrProps: (args: { item?: TItem; onRowClick?: TrProps['onRowClick'] }) => Omit<TrProps, 'ref'>;
      /**
       * Returns props for the Td component for a specific column.
       * Includes default `dataLabel` (column name) and props related to compound expansion.
       * If this cell is a toggle for a compound-expandable row, pass `isCompoundExpandToggle: true`.
       * @param args - `columnKey` is always required. If `isCompoundExpandToggle` is passed, `item` and `rowIndex` are also required.
       */
      getTdProps: (
        args: { columnKey: TColumnKey } & DiscriminatedArgs<'isCompoundExpandToggle', { item: TItem; rowIndex: number }>
      ) => Omit<TdProps, 'ref'>;
      /**
       * Props for the FilterToolbar component. Omits the id prop so you must pass it by hand when rendering FilterToolbar.
       * @deprecated see the deprecation notice in FilterToolbar
       * @see FilterToolbar
       */
      filterToolbarProps: Omit<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'>;
      /**
       * Props for the Pagination component.
       */
      paginationProps: PaginationProps;
      /**
       * Props for the ToolbarItem component containing the Pagination component above the table.
       */
      paginationToolbarItemProps: ToolbarItemProps;
      /**
       * Props for the ToolbarBulkSelector component.
       */
      toolbarBulkSelectorProps: ToolbarBulkSelectorProps<TItem>;
      /**
       * Returns props for the Td component used as the checkbox cell for each row when using the selection feature.
       */
      getSelectCheckboxTdProps: (args: { item: TItem; rowIndex: number }) => Omit<TdProps, 'ref'>;
      /**
       * Returns props for the Td component used as the expand toggle when using the single-expand variant of the expansion feature.
       */
      getSingleExpandButtonTdProps: (args: { item: TItem; rowIndex: number }) => Omit<TdProps, 'ref'>;
      /**
       * Returns props for the Td component used to contain the expanded content when using the expansion feature.
       * The Td rendered with these props should be the only child of its Tr, which should be directly after the Tr of the row being expanded.
       * The two Trs for the expandable row and expanded content row should be contained in a Tbody with no other Tr components.
       */
      getExpandedContentTdProps: (args: { item: TItem }) => Omit<TdProps, 'ref'>;
    };
    components: {
      /**
       * A wrapper for the PF Table component which automatically injects props from batteries.propHelpers.tableProps
       * Takes the same props as the normal PF Table with no additional batteries-specific props.
       */
      Table: React.ForwardRefExoticComponent<Omit<TableProps, 'ref'>>;
      /**
       * A direct reference to the PF Thead component, included here with the other components for convenience.
       * No injected props are currently necessary for Thead. If that changes in the future,
       * Consumers shouldn't need to change their usage if they use this instead of importing Thead from PF.
       */
      Thead: React.ForwardRefExoticComponent<Omit<TheadProps, 'ref'>>;
      /**
       * A wrapper for the PF Tr component which automatically injects props from batteries.propHelpers.getTrProps
       * Takes the same props as the normal PF Tr plus an `item` prop: the item represented by this row.
       * @see TrWithBatteriesProps
       */
      Tr: React.ForwardRefExoticComponent<
        Omit<TrWithBatteriesHeaderRowProps, 'ref'> | Omit<TrWithBatteriesBodyRowProps<TItem>, 'ref'>
      >;
      /**
       * A wrapper for the PF Th component which automatically injects props from batteries.propHelpers.getThProps
       * Takes the same props as the normal PF Th plus a `columnKey` prop: the column associated with this cell.
       * @see ThWithBatteriesProps
       */
      Th: React.ForwardRefExoticComponent<Omit<ThWithBatteriesProps<TColumnKey>, 'ref'>>;
      /**
       * A direct reference to the PF Tbody component, included here with the other components for convenience.
       * No injected props are currently necessary for Tbody. If that changes in the future,
       * Consumers shouldn't need to change their usage if they use this instead of importing Tbody from PF.
       */
      Tbody: React.ForwardRefExoticComponent<Omit<TbodyProps, 'ref'>>;
      /**
       * A wrapper for the PF Td component which automatically injects props from batteries.propHelpers.getTdProps
       * Takes the same props as the normal PF Td plus a `columnKey` prop: the column associated with this cell.
       * @see TdWithBatteriesProps
       */
      Td: React.ForwardRefExoticComponent<Omit<TdWithBatteriesProps<TColumnKey>, 'ref'>>;
      /**
       * A wrapper for the PF Toolbar component which automatically injects props from batteries.propHelpers.toolbarProps
       * Takes the same props as the normal PF Toolbar with no additional batteries-specific props.
       */
      Toolbar: React.FC<ToolbarProps>;
      /**
       * A wrapper for the ToolbarBulkSelector component which automatically injects props from batteries.propHelpers.toolbarBulkSelectorProps
       * Takes the same props as the normal ToolbarBulkSelector with no additional batteries-specific props.
       * However, all props are made optional because defaults for them are provided by propHelpers.
       */
      ToolbarBulkSelector: React.FC<ToolbarBulkSelectorWithBatteriesProps<TItem>>;
      /**
       * A wrapper for the deprecated FilterToolbar component which automatically injects props from batteries.propHelpers.filterToolbarProps
       * Takes the same props as the normal FilterToolbar with no additional batteries-specific props.
       * However, all props are made optional except `id` because defaults for them are provided by propHelpers.
       * @deprecated see the deprecation notice in FilterToolbar
       * @see FilterToolbar
       */
      FilterToolbar: React.FC<Pick<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'>>;
      /**
       * A wrapper for the PF ToolbarItem component which automatically injects props from batteries.propHelpers.paginationToolbarItemProps
       * Takes the same props as the normal PF ToolbarItem with no additional batteries-specific props.
       */
      PaginationToolbarItem: React.FC<ToolbarItemProps>;
      /**
       * A wrapper for the PF Pagination component which automatically injects props from batteries.propHelpers.paginationProps
       * Takes the same props as the normal PF Pagination with no additional batteries-specific props.
       */
      Pagination: React.FC<PaginationProps>;
    };
  };

/**
 * Combined configuration arguments for client-paginated tables
 * - Used by useClientTableBatteries shorthand hook
 * - Combines args for useTableState, useClientTableDerivedState and useTablePropHelpers, omitting args for any of these that come from return values of the others.
 */
export type UseClientTableBatteriesArgs<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> =
  // Include all args for useTableState
  UseTableStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> &
    // Include args for useClientTableDerivedState that aren't under feature sub-objects
    Omit<UseClientTableDerivedStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>, TableFeature> &
    // Include args for useTablePropHelpers that aren't under feature sub-objects or provided by useTableState or useClientTableDerivedState
    Omit<
      UseTablePropHelpersArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
      | TableFeature
      | keyof TableDerivedState<TItem>
      | keyof TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
    > &
    // Include feature sub-objects with args needed for useClientTableDerivedState and useTablePropHelpers but not provided by useTableState or useClientTableDerivedState
    Partial<{
      [key in TableFeature]: Omit<
        (key extends 'filter' | 'sort' | 'pagination'
          ? UseClientTableDerivedStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>[key]
          : unknown) &
          UseTablePropHelpersArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>[key],
        keyof TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>[key]
      >;
    }>;

// TODO can we simplify by going the other direction? Explicitly put the whole batteries object type here,
// then pick from it for other places that need properties and partials from it.
// perhaps assert that the full object and its combined parts are equal with a type equality guard
// (see https://stackoverflow.com/a/73461648/22769581 for an example)
