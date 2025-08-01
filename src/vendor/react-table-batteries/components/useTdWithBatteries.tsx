import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Td, TdProps } from '@patternfly/react-table';

import { TableBatteries } from '../types';

export interface TdWithBatteriesProps<TColumnKey extends string> extends TdProps {
  /**
   * The key identifying the column associated with this table body cell.
   */
  columnKey: TColumnKey;
}

export const useTdWithBatteries = <
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
): React.ForwardRefExoticComponent<Omit<TdWithBatteriesProps<TColumnKey>, 'ref'>> => {
  const { expansion, propHelpers, idProperty, numRenderedColumns } = batteries;
  const TdWithBatteries = useDeepCompareMemo(
    () =>
      React.forwardRef(
        (
          { columnKey, ...props }: Omit<TdWithBatteriesProps<TColumnKey>, 'ref'>,
          ref: React.Ref<HTMLTableCellElement>
        ) => (
          <Td
            {...propHelpers.getTdProps({ columnKey })}
            innerRef={ref as React.MutableRefObject<HTMLTableCellElement>}
            {...props}
          />
        )
      ),
    [expansion.isEnabled, expansion.variant, expansion.expandedCells, idProperty, numRenderedColumns]
  );
  TdWithBatteries.displayName = 'TdWithBatteries';
  return TdWithBatteries;
};
