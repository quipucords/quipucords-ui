import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { TableBatteries } from '../types';
import { ToolbarBulkSelector, ToolbarBulkSelectorProps } from '../tackle2-ui-legacy';

export type ToolbarBulkSelectorWithBatteriesProps<TItem> = Partial<ToolbarBulkSelectorProps<TItem>>;

export const useToolbarBulkSelectorWithBatteries = <
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
): React.FC<ToolbarBulkSelectorWithBatteriesProps<TItem>> => {
  const { propHelpers } = batteries;
  return useDeepCompareMemo(
    () => (props) => <ToolbarBulkSelector {...propHelpers.toolbarBulkSelectorProps} {...props} />,
    [propHelpers.toolbarBulkSelectorProps]
  );
};
