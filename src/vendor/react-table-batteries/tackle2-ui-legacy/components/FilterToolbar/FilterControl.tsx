import * as React from 'react';

import {
  FilterCategory,
  FilterValue,
  FilterType,
  SelectFilterCategory,
  SearchFilterCategory,
  MultiselectFilterCategory
} from './FilterToolbar';
import { SelectFilterControl } from './SelectFilterControl';
import { SearchFilterControl } from './SearchFilterControl';
import { MultiselectFilterControl } from './MultiselectFilterControl';

export interface FilterControlProps<TItem, TFilterCategoryKey extends string> {
  category: FilterCategory<TItem, TFilterCategoryKey>;
  filterValue: FilterValue;
  setFilterValue: (newValue: FilterValue) => void;
  showToolbarItem: boolean;
  isDisabled?: boolean;
  id: string; // Unique per toolbar, prepended to ids on individual filter inputs
}

export const FilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  ...props
}: React.PropsWithChildren<FilterControlProps<TItem, TFilterCategoryKey>>): JSX.Element | null => {
  if (category.type === FilterType.select) {
    return (
      <SelectFilterControl
        isScrollable
        category={category as SelectFilterCategory<TItem, TFilterCategoryKey>}
        {...props}
      />
    );
  }
  if (category.type === FilterType.search || category.type === FilterType.numsearch) {
    return (
      <SearchFilterControl
        category={category as SearchFilterCategory<TItem, TFilterCategoryKey>}
        isNumeric={category.type === FilterType.numsearch}
        {...props}
      />
    );
  }
  if (category.type === FilterType.multiselect) {
    return (
      <MultiselectFilterControl
        isScrollable
        category={category as MultiselectFilterCategory<TItem, TFilterCategoryKey>}
        {...props}
      />
    );
  }
  return null;
};
