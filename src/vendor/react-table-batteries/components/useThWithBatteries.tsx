import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Th, ThProps } from '@patternfly/react-table';

import { TableBatteries } from '../types';

export interface ThWithBatteriesProps<TColumnKey extends string> extends ThProps {
  /**
   * The key identifying the column associated with this table header cell.
   */
  columnKey: TColumnKey;
}

export const useThWithBatteries = <
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
): React.ForwardRefExoticComponent<Omit<ThWithBatteriesProps<TColumnKey>, 'ref'>> => {
  const { sort, propHelpers } = batteries;
  const ThWithBatteries = useDeepCompareMemo(
    () =>
      React.forwardRef(
        (
          { columnKey, ...props }: Omit<ThWithBatteriesProps<TColumnKey>, 'ref'>,
          ref: React.Ref<HTMLTableCellElement>
        ) => (
          <Th
            {...propHelpers.getThProps({ columnKey })}
            innerRef={ref as React.MutableRefObject<HTMLTableCellElement>}
            {...props}
          />
        )
      ),
    [sort?.isEnabled, sort?.activeSort, sort?.sortableColumns]
  );
  ThWithBatteries.displayName = 'ThWithBatteries';
  return ThWithBatteries;
};
