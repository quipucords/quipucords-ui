import React from 'react';
import { Td, Th, Tr, TrProps } from '@patternfly/react-table';
import { useDeepCompareMemo } from 'use-deep-compare';
import { TableBatteries } from '../types';

export interface TrWithBatteriesBaseProps extends TrProps {
  /**
   * Whether to render default built-in select checkboxes, single-expand toggles and spacer Th elements for action
   * columns.
   */
  builtInControls?: boolean;
}

export interface TrWithBatteriesHeaderRowProps extends TrWithBatteriesBaseProps {
  /**
   * Whether this is the header row at the top of the table, containing Th elements.
   * When true, item and rowIndex are not required.
   *
   * @default false
   */
  isHeaderRow: true;
}

export interface TrWithBatteriesBodyRowProps<TItem> extends TrWithBatteriesBaseProps {
  /**
   * Whether this is the header row at the top of the table, containing Th elements.
   * When false, item and rowIndex are required.
   *
   * @default false
   */
  isHeaderRow?: false;
  /**
   * The API data item represented by this row.
   * Required in body rows to make sure row-dependent state like selection and expansion work correctly.
   */
  item: TItem;
  /**
   * This row's index within currentPageItems.
   */
  rowIndex: number;
}

export const useTrWithBatteries = <
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
): React.ForwardRefExoticComponent<
  Omit<TrWithBatteriesHeaderRowProps, 'ref'> | Omit<TrWithBatteriesBodyRowProps<TItem>, 'ref'>
> => {
  const { selection, expansion, activeItem, propHelpers, numColumnsBeforeData, numColumnsAfterData } = batteries;
  const TrWithBatteries = useDeepCompareMemo(
    () =>
      React.forwardRef<
        HTMLTableRowElement,
        Omit<TrWithBatteriesHeaderRowProps, 'ref'> | Omit<TrWithBatteriesBodyRowProps<TItem>, 'ref'>
      >(
        (
          props: Omit<TrWithBatteriesHeaderRowProps, 'ref'> | Omit<TrWithBatteriesBodyRowProps<TItem>, 'ref'>,
          ref: React.Ref<HTMLTableRowElement>
        ) => {
          const { isHeaderRow, onRowClick, builtInControls = true, children, ...otherProps } = props;
          const { item, rowIndex } = props as Partial<TrWithBatteriesBodyRowProps<TItem>>;

          return (
            <Tr
              {...propHelpers.getTrProps({ item, onRowClick })}
              ref={ref as React.MutableRefObject<HTMLTableRowElement>}
              {...otherProps}
            >
              {!builtInControls ? (
                children
              ) : isHeaderRow ? (
                <React.Fragment>
                  {Array(numColumnsBeforeData)
                    .fill(null)
                    .map((_, i) => (
                      <Th key={i} />
                    ))}
                  {children}
                  {Array(numColumnsAfterData)
                    .fill(null)
                    .map((_, i) => (
                      <Th key={i} />
                    ))}
                </React.Fragment>
              ) : item ? (
                <React.Fragment>
                  {expansion.isEnabled && expansion.variant === 'single' && rowIndex !== undefined && (
                    <Td {...propHelpers.getSingleExpandButtonTdProps({ item, rowIndex })} />
                  )}
                  {selection.isEnabled && rowIndex !== undefined && (
                    <Td {...propHelpers.getSelectCheckboxTdProps({ item, rowIndex })} />
                  )}
                  {children}
                </React.Fragment>
              ) : (
                children
              )}
            </Tr>
          );
        }
      ),
    [
      activeItem.isEnabled,
      activeItem.activeItemId,
      selection.isEnabled,
      selection.selectedItemIds,
      expansion.isEnabled,
      expansion.expandedCells
    ]
  );
  TrWithBatteries.displayName = 'TrWithBatteries';
  return TrWithBatteries;
};
