import * as React from 'react';
import { ToolbarFilter, Select, SelectList, SelectOption, MenuToggle } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { FilterControlProps } from './FilterControl';
import { MultiselectFilterCategory, OptionPropsWithKey } from './FilterToolbar';

export interface MultiselectFilterControlProps<TItem, TFilterCategoryKey extends string>
  extends FilterControlProps<TItem, TFilterCategoryKey> {
  category: MultiselectFilterCategory<TItem, TFilterCategoryKey>;
  isScrollable?: boolean;
}

export const MultiselectFilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  filterValue,
  setFilterValue,
  showToolbarItem,
  isDisabled = false,
  isScrollable = false,
  id
}: React.PropsWithChildren<MultiselectFilterControlProps<TItem, TFilterCategoryKey>>): JSX.Element | null => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);

  const getOptionKeyFromOptionValue = (optionValue: string | number) =>
    category.selectOptions.find(optionProps => optionProps.value === optionValue)?.key;

  const getChipFromOptionValue = (optionValue: string | number | undefined) =>
    optionValue ? optionValue.toString() : '';

  const getOptionKeyFromChip = (chip: string) =>
    category.selectOptions.find(optionProps => optionProps.value.toString() === chip)?.key;

  const getOptionValueFromOptionKey = (optionKey: string) =>
    category.selectOptions.find(optionProps => optionProps.key === optionKey)?.value;

  const onFilterSelect = (
    event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    if (value !== undefined) {
      const optionKey = getOptionKeyFromOptionValue(value);
      if (optionKey && filterValue?.includes(optionKey)) {
        const updatedValues = filterValue.filter((item: string) => item !== optionKey);
        setFilterValue(updatedValues);
      } else if (filterValue) {
        const updatedValues = [...filterValue, optionKey];
        setFilterValue(updatedValues as string[]);
      } else {
        setFilterValue([optionKey || '']);
      }
    }
  };

  const onFilterClear = (chip: string) => {
    const optionKey = getOptionKeyFromChip(chip);
    const newValue = filterValue ? filterValue.filter(val => val !== optionKey) : [];
    setFilterValue(newValue.length > 0 ? newValue : null);
  };

  // Select expects "selected" to be an array of the "value" props from the relevant optionProps
  const selected = filterValue ? filterValue.map(getOptionValueFromOptionKey) : [];

  const chips = selected.map(getChipFromOptionValue);

  const renderSelectOptions = (options: OptionPropsWithKey[]) =>
    options.map(optionProps => (
      <SelectOption key={optionProps.key} value={optionProps.value} isSelected={selected.includes(optionProps.value)}>
        {optionProps.label || optionProps.value.toString()}
      </SelectOption>
    ));

  // TODO support i18n / custom text here?
  const placeholderText = category.placeholderText || `Filter by ${category.title}...`;

  const toggle = (toggleRef: React.RefObject<HTMLDivElement | HTMLButtonElement>) => (
    <MenuToggle
      ref={toggleRef}
      className={css(isScrollable && 'isScrollable')}
      aria-label={category.title}
      aria-expanded={isFilterDropdownOpen}
      aria-haspopup="listbox"
      isDisabled={isDisabled || category.selectOptions.length === 0}
      isExpanded={isFilterDropdownOpen}
    >
      {selected.length > 0 ? `${selected.length} selected` : placeholderText}
    </MenuToggle>
  );

  return (
    <ToolbarFilter
      id={`${id}-filter-control-${category.key}`}
      labels={chips}
      deleteLabel={(_, chip) => onFilterClear(chip as string)}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      <Select
        className={css(isScrollable && 'isScrollable')}
        isOpen={isFilterDropdownOpen}
        selected={selected}
        onSelect={onFilterSelect}
        onOpenChange={setIsFilterDropdownOpen}
        toggle={toggle}
      >
        <SelectList>{renderSelectOptions(category.selectOptions)}</SelectList>
      </Select>
    </ToolbarFilter>
  );
};
