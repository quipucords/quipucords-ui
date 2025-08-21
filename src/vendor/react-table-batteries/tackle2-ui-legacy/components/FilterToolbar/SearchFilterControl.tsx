import * as React from 'react';
import { ToolbarFilter, InputGroup, TextInput, Button, ButtonVariant } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { FilterControlProps } from './FilterControl';
import { SearchFilterCategory } from './FilterToolbar';

export interface SearchFilterControlProps<TItem, TFilterCategoryKey extends string>
  extends FilterControlProps<TItem, TFilterCategoryKey> {
  category: SearchFilterCategory<TItem, TFilterCategoryKey>;
  isNumeric: boolean;
}

export const SearchFilterControl = <TItem, TFilterCategoryKey extends string>({
  category,
  filterValue,
  setFilterValue,
  showToolbarItem,
  isNumeric,
  isDisabled = false,
  id
}: React.PropsWithChildren<SearchFilterControlProps<TItem, TFilterCategoryKey>>): JSX.Element | null => {
  // Keep internal copy of value until submitted by user
  const [inputValue, setInputValue] = React.useState(filterValue?.[0] || '');
  // Update it if it changes externally
  React.useEffect(() => {
    setInputValue(filterValue?.[0] || '');
  }, [filterValue]);

  const onFilterSubmit = () =>
    // Ignore value with multiple spaces
    setFilterValue(inputValue ? [inputValue.replace(/\s+/g, ' ')] : []);

  const inputId = `${id}-${category.key}-input`;
  return (
    <ToolbarFilter
      labels={filterValue || []}
      deleteLabel={() => setFilterValue([])}
      categoryName={category.title}
      showToolbarItem={showToolbarItem}
    >
      <InputGroup role="group">
        <TextInput
          name={inputId}
          id={inputId}
          type={isNumeric ? 'number' : 'search'}
          onChange={(_, value) => setInputValue(value)}
          aria-label={`${category.title} filter`}
          value={inputValue}
          placeholder={category.placeholderText}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key && event.key !== 'Enter') {
              return;
            }
            onFilterSubmit();
          }}
          isDisabled={isDisabled}
        />
        <Button icon={<SearchIcon />}
          variant={ButtonVariant.control}
          id={`${id}-search-button`}
          aria-label="search button for search input"
          onClick={onFilterSubmit}
          isDisabled={isDisabled}
        >
          
        </Button>
      </InputGroup>
    </ToolbarFilter>
  );
};
