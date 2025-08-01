import * as React from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownGroup,
  DropdownList,
  MenuToggle,
  ToolbarToggleGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { SelectOptionProps } from '@patternfly/react-core/deprecated';
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon';

import { FilterControl } from './FilterControl';

export enum FilterType {
  select = 'select',
  multiselect = 'multiselect',
  search = 'search',
  numsearch = 'numsearch'
}

export type FilterValue = string[] | undefined | null;

export interface OptionPropsWithKey extends SelectOptionProps {
  key: string;
}

export interface BasicFilterCategory<
  TItem, // The actual API objects we're filtering
  TFilterCategoryKey extends string // Unique identifiers for each filter category (inferred from key properties if possible)
> {
  key: TFilterCategoryKey; // For use in the filterValues state object. Must be unique per category.
  title: string;
  type: FilterType; // If we want to support arbitrary filter types, this could be a React node that consumes context instead of an enum
  filterGroup?: string;
  getItemValue?: (item: TItem) => string | boolean; // For client-side filtering
  serverFilterField?: string; // For server-side filtering, defaults to `key` if omitted. Does not need to be unique if the server supports joining repeated filters.
  getServerFilterValue?: (filterValue: FilterValue) => FilterValue; // For server-side filtering. Defaults to using the UI state's value if omitted.
}

export interface MultiselectFilterCategory<TItem, TFilterCategoryKey extends string>
  extends BasicFilterCategory<TItem, TFilterCategoryKey> {
  selectOptions: OptionPropsWithKey[];
  placeholderText?: string;
  logicOperator?: 'AND' | 'OR';
}

export interface SelectFilterCategory<TItem, TFilterCategoryKey extends string>
  extends BasicFilterCategory<TItem, TFilterCategoryKey> {
  selectOptions: OptionPropsWithKey[];
}

export interface SearchFilterCategory<TItem, TFilterCategoryKey extends string>
  extends BasicFilterCategory<TItem, TFilterCategoryKey> {
  placeholderText: string;
}

export type FilterCategory<TItem, TFilterCategoryKey extends string> =
  | MultiselectFilterCategory<TItem, TFilterCategoryKey>
  | SelectFilterCategory<TItem, TFilterCategoryKey>
  | SearchFilterCategory<TItem, TFilterCategoryKey>;

export type FilterValues<TFilterCategoryKey extends string> = Partial<Record<TFilterCategoryKey, FilterValue>>;

export const getFilterLogicOperator = <TItem, TFilterCategoryKey extends string>(
  filterCategory?: FilterCategory<TItem, TFilterCategoryKey>,
  defaultOperator: 'AND' | 'OR' = 'OR'
) =>
  (filterCategory && (filterCategory as MultiselectFilterCategory<TItem, TFilterCategoryKey>).logicOperator) ||
  defaultOperator;

export interface FilterToolbarProps<TItem, TFilterCategoryKey extends string> {
  filterCategories: FilterCategory<TItem, TFilterCategoryKey>[];
  filterValues: FilterValues<TFilterCategoryKey>;
  setFilterValues: (values: FilterValues<TFilterCategoryKey>) => void;
  beginToolbarItems?: JSX.Element;
  endToolbarItems?: JSX.Element;
  pagination?: JSX.Element;
  showFiltersSideBySide?: boolean;
  isDisabled?: boolean;
  id: string; // Unique per toolbar, prepended to ids on individual filter inputs
}

/**
 * @deprecated - This FilterToolbar is an old component from Konveyor that needs to be replaced with a more composable solution.
 * TODO - rewrite FilterToolbar to follow the batteries pattern
 */
export const FilterToolbar = <TItem, TFilterCategoryKey extends string>({
  filterCategories,
  filterValues,
  setFilterValues,
  pagination,
  showFiltersSideBySide = false,
  isDisabled = false,
  id
}: React.PropsWithChildren<FilterToolbarProps<TItem, TFilterCategoryKey>>): JSX.Element | null => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [currentFilterCategoryKey, setCurrentFilterCategoryKey] = React.useState(filterCategories[0]?.key);

  const onCategorySelect = (category: FilterCategory<TItem, TFilterCategoryKey>) => {
    setCurrentFilterCategoryKey(category.key);
    setIsCategoryDropdownOpen(false);
  };

  const setFilterValue = (category: FilterCategory<TItem, TFilterCategoryKey>, newValue: FilterValue) =>
    setFilterValues({ ...filterValues, [category.key]: newValue });

  const currentFilterCategory = filterCategories.find((category) => category.key === currentFilterCategoryKey);

  const filterGroups = filterCategories.reduce(
    (groups, category) =>
      !category.filterGroup || groups.includes(category.filterGroup) ? groups : [...groups, category.filterGroup],
    [] as string[]
  );

  const renderDropdownItems = () => {
    if (filterGroups.length) {
      return filterGroups.map((filterGroup) => (
        <DropdownGroup label={filterGroup} key={filterGroup}>
          <DropdownList>
            {filterCategories
              .filter((filterCategory) => filterCategory.filterGroup === filterGroup)
              .map((filterCategory) => (
                <DropdownItem
                  id={`filter-category-${filterCategory.key}`}
                  key={filterCategory.key}
                  onClick={() => onCategorySelect(filterCategory)}
                >
                  {filterCategory.title}
                </DropdownItem>
              ))}
          </DropdownList>
        </DropdownGroup>
      ));
    } else {
      return filterCategories.map((category) => (
        <DropdownItem
          id={`filter-category-${category.key}`}
          key={category.key}
          onClick={() => onCategorySelect(category)}
        >
          {category.title}
        </DropdownItem>
      ));
    }
  };

  return (
    <>
      <ToolbarToggleGroup
        variant="filter-group"
        toggleIcon={<FilterIcon />}
        breakpoint="2xl"
        spaceItems={showFiltersSideBySide ? { default: 'spaceItemsMd' } : undefined}
      >
        {!showFiltersSideBySide && (
          <ToolbarItem>
            <Dropdown
              toggle={(toggleRef) => (
                <MenuToggle
                  id={`${id}-filtered-by`}
                  aria-label="Filtered by" // TODO support i18n / custom text here
                  ref={toggleRef}
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  isDisabled={isDisabled}
                >
                  <FilterIcon /> {currentFilterCategory?.title}
                </MenuToggle>
              )}
              isOpen={isCategoryDropdownOpen}
            >
              {renderDropdownItems()}
            </Dropdown>
          </ToolbarItem>
        )}

        {filterCategories.map((category) => (
          <FilterControl<TItem, TFilterCategoryKey>
            id={id}
            key={category.key}
            category={category}
            filterValue={filterValues[category.key]}
            setFilterValue={(newValue) => setFilterValue(category, newValue)}
            showToolbarItem={showFiltersSideBySide || currentFilterCategory?.key === category.key}
            isDisabled={isDisabled}
          />
        ))}
      </ToolbarToggleGroup>
      {pagination ? <ToolbarItem variant="pagination">{pagination}</ToolbarItem> : null}
    </>
  );
};
