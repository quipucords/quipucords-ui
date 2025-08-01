import { Tbody, Thead } from '@patternfly/react-table';
import { TableBatteries } from '../types';
import {
  useFilterToolbarWithBatteries,
  usePaginationToolbarItemWithBatteries,
  usePaginationWithBatteries,
  useTableWithBatteries,
  useTdWithBatteries,
  useThWithBatteries,
  useToolbarBulkSelectorWithBatteries,
  useToolbarWithBatteries,
  useTrWithBatteries
} from '../components';

export const useTableComponents = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  batteries: Omit<
    TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
    'components'
  >
): TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>['components'] => ({
  Table: useTableWithBatteries(batteries),
  Thead, // Included here as-is in case we need to use a batteries component here in the future
  Tr: useTrWithBatteries(batteries),
  Th: useThWithBatteries(batteries),
  Tbody, // Included here as-is in case we need to use a batteries component here in the future
  Td: useTdWithBatteries(batteries),
  Toolbar: useToolbarWithBatteries(batteries),
  ToolbarBulkSelector: useToolbarBulkSelectorWithBatteries(batteries),
  FilterToolbar: useFilterToolbarWithBatteries(batteries),
  PaginationToolbarItem: usePaginationToolbarItemWithBatteries(batteries),
  Pagination: usePaginationWithBatteries(batteries)
});
