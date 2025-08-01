import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { TableBatteries } from '../types';
import { FilterToolbar, FilterToolbarProps } from '../tackle2-ui-legacy';

export type FilterToolbarWithBatteriesProps<TItem, TFilterCategoryKey extends string> = Partial<
  Omit<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'>
> &
  Pick<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'>;

/**
 * @deprecated based on the FilterToolbar from tackle2-ui-legacy which needs to be rewritten.
 * Included here so the consumer can wrap all rendering and not use any propHelpers directly.
 */
export const useFilterToolbarWithBatteries = <
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
): React.FC<FilterToolbarWithBatteriesProps<TItem, TFilterCategoryKey>> => {
  const { filter, propHelpers } = batteries;
  return useDeepCompareMemo(
    () => (props) => (filter.isEnabled ? <FilterToolbar {...propHelpers.filterToolbarProps} {...props} /> : null),
    [filter.isEnabled, propHelpers.filterToolbarProps]
  );
};
