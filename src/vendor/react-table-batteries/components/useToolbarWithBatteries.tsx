import React from 'react';
import { Toolbar, ToolbarProps } from '@patternfly/react-core';
import { useDeepCompareMemo } from 'use-deep-compare';
import { TableBatteries } from '../types';

// Note: Toolbar probably should also be a forwardRef, but the Toolbar PF component does not pass down a ref
//       even though it accepts one in its props (via extending props for HTMLDivElement).
export const useToolbarWithBatteries = <
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
): React.FC<Omit<ToolbarProps, 'ref'>> => {
  const { propHelpers } = batteries;
  return useDeepCompareMemo(
    () => (props) => <Toolbar {...propHelpers.toolbarProps} {...props} />,
    [propHelpers.toolbarProps]
  );
};
