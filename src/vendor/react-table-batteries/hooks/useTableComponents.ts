import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import { Pagination } from '@patternfly/react-core';
import { Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';

/**
 * Returns React component references for use in the table batteries object.
 * These are the standard PatternFly components used for table rendering.
 */
export const useTableComponents = () => ({
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  // Placeholder for removed components
  ToolbarBulkSelector: () => null,
  FilterToolbar: () => null,
  PaginationToolbarItem: () => null
});
