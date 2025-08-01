import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Table, TableProps } from '@patternfly/react-table';

import { TableBatteries } from '../types';

export const useTableWithBatteries = <
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
): React.ForwardRefExoticComponent<Omit<TableProps, 'ref'>> => {
  const { propHelpers } = batteries;
  const TableWithBatteries = useDeepCompareMemo(
    () =>
      React.forwardRef((props: Omit<TableProps, 'ref'>, ref: React.Ref<HTMLTableElement>) => (
        <Table {...propHelpers.tableProps} innerRef={ref as React.MutableRefObject<HTMLTableElement>} {...props} />
      )),
    [propHelpers.tableProps]
  );
  TableWithBatteries.displayName = 'TableWithBatteries';
  return TableWithBatteries;
};
