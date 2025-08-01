import * as React from 'react';
import { ToolbarFilter } from '@patternfly/react-core';
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  SelectProps
} from '@patternfly/react-core/deprecated'; // TODO upgrade to new PF5 Select stuff
import { FilterControlProps } from './FilterControl';
import { MultiselectFilterCategory, OptionPropsWithKey } from './FilterToolbar';
import { css } from '@patternfly/react-styles';

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

  const getOptionKeyFromOptionValue = (optionValue: string | SelectOptionObject) =>
    category.selectOptions.find((optionProps) => optionProps.value === optionValue)?.key;

  const getChipFromOptionValue = (optionValue: string | SelectOptionObject | undefined) =>
    optionValue ? optionValue.toString() : '';

  const getOptionKeyFromChip = (chip: string) =>
    category.selectOptions.find((optionProps) => optionProps.value.toString() === chip)?.key;

  const getOptionValueFromOptionKey = (optionKey: string) =>
    category.selectOptions.find((optionProps) => optionProps.key === optionKey)?.value;

  const onFilterSelect = (value: string | SelectOptionObject) => {
    const optionKey = getOptionKeyFromOptionValue(value);
    if (optionKey && filterValue?.includes(optionKey)) {
      const updatedValues = filterValue.filter((item: string) => item !== optionKey);
      setFilterValue(updatedValues);
    } else {
      if (filterValue) {
        const updatedValues = [...filterValue, optionKey];
        setFilterValue(updatedValues as string[]);
      } else {
        setFilterValue([optionKey || '']);
      }
    }
  };

  const onFilterClear = (chip: string) => {
    const optionKey = getOptionKeyFromChip(chip);
    const newValue = filterValue ? filterValue.filter((val) => val !== optionKey) : [];
    setFilterValue(newValue.length > 0 ? newValue : null);
  };

  // Select expects "selections" to be an array of the "value" props from the relevant optionProps
  const selections = filterValue ? filterValue.map(getOptionValueFromOptionKey) : null;

  const chips = selections ? selections.map(getChipFromOptionValue) : [];

  const renderSelectOptions = (options: OptionPropsWithKey[]) =>
    options.map((optionProps) => <SelectOption {...optionProps} key={optionProps.key} />);

  const onOptionsFilter: SelectProps['onFilter'] = (_event, textInput) =>
    renderSelectOptions(
      category.selectOptions.filter((optionProps) => {
        // Note: The in-dropdown filter can match the option's key or value. This may not be desirable?
        if (!textInput) {
          return false;
        }
        const optionValue = optionProps?.value?.toString();
        return (
          optionProps?.key?.toLowerCase().includes(textInput.toLowerCase()) ||
          optionValue.toLowerCase().includes(textInput.toLowerCase())
        );
      })
    );

  // TODO support i18n / custom text here?
  const placeholderText = category.placeholderText || `Filter by ${category.title}...`;

  return (
    <ToolbarFilter
      id={`${id}-filter-control-${category.key}`}
      chips={chips}
      deleteChip={(_, chip) => onFilterClear(chip as string)}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      <Select
        className={css(isScrollable && 'isScrollable')}
        aria-label={category.title}
        toggleId={`${id}-${category.key}-filter-value-select`}
        onToggle={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
        selections={selections || []}
        onSelect={(_, value) => onFilterSelect(value)}
        isOpen={isFilterDropdownOpen}
        placeholderText={placeholderText}
        isDisabled={isDisabled || category.selectOptions.length === 0}
        variant={SelectVariant.checkbox}
        hasInlineFilter
        onFilter={onOptionsFilter}
      >
        {renderSelectOptions(category.selectOptions)}
      </Select>
    </ToolbarFilter>
  );
};
