import * as React from 'react';
import { DatePicker, ToolbarFilter } from '@patternfly/react-core';
import { FilterControlProps } from './FilterControl';
import { DateFilterCategory } from './FilterToolbar';

export interface DateFilterControlProps<TItem, TFilterCategoryKey extends string>
  extends FilterControlProps<TItem, TFilterCategoryKey> {
  category: DateFilterCategory<TItem, TFilterCategoryKey>;
}

export const DateFilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  filterValue,
  setFilterValue,
  showToolbarItem,
  isDisabled = false,
  id
}: React.PropsWithChildren<DateFilterControlProps<TItem, TFilterCategoryKey>>): React.JSX.Element | null => {
  const onDateChange = (_event: React.FormEvent<HTMLInputElement>, _value: string, date?: Date | undefined) => {
    if (date !== undefined) {
      setFilterValue([date.toISOString()]);
    }
  };

  const getChips = React.useCallback(() => {
    const emptyChips = [];
    if (!filterValue || filterValue.length === 0) {
      return emptyChips;
    }
    const date = new Date(filterValue?.[0]);
    if (date === undefined || isNaN(date.getTime())) {
      return emptyChips;
    }
    const displayDate = new Intl.DateTimeFormat('en-CA').format(date);
    return [displayDate];
  }, [filterValue]);

  return (
    <ToolbarFilter
      id={`${id}-filter-control-${category.key}`}
      labels={getChips()}
      deleteLabel={(_category, _label) => setFilterValue(null)}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      <DatePicker onChange={onDateChange} isDisabled={isDisabled} />
    </ToolbarFilter>
  );
};
