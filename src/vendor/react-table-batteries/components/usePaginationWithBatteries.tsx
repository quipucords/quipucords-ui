import React from 'react';
import { Pagination, PaginationProps } from '@patternfly/react-core';
import { useDeepCompareMemo } from 'use-deep-compare';
import { TableBatteries } from '../types';

export const usePaginationWithBatteries = <
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
): React.FC<PaginationProps> => {
  const { propHelpers } = batteries;
  return useDeepCompareMemo(
    () => (props) => <Pagination {...propHelpers.paginationProps} {...props} />,
    [propHelpers.paginationProps]
  );
};
