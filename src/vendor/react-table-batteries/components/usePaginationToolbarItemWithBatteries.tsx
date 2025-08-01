import React from 'react';
import { ToolbarItem, ToolbarItemProps } from '@patternfly/react-core';
import { useDeepCompareMemo } from 'use-deep-compare';
import { TableBatteries } from '../types';

export const usePaginationToolbarItemWithBatteries = <
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
): React.FC<ToolbarItemProps> => {
  const { propHelpers } = batteries;
  return useDeepCompareMemo(
    () => (props) => <ToolbarItem {...propHelpers.paginationToolbarItemProps} {...props} />,
    [propHelpers.paginationToolbarItemProps]
  );
};
