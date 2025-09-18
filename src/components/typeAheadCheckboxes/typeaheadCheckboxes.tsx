/**
 * Implements a multi-select typeahead component with checkboxes, enabling users to filter and select multiple options.
 * Utilizes PatternFly for UI consistency and accessibility.
 *
 * @module typeaheadCheckboxes
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  type SelectOptionProps,
  MenuToggle,
  type MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
  Spinner
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons/';

interface TypeaheadCheckboxesProps {
  onChange?: (selections: string[]) => void;
  options: { value: string; label: string }[];
  selectedOptions?: string[];
  placeholder?: string;
  menuToggleOuiaId?: number | string;
  maxSelections?: number;
  // Search functionality
  onSearch?: (searchTerm: string) => Promise<{ value: string; label: string }[]>;
  isLoading?: boolean;
  searchDelay?: number;
  // Pagination functionality
  onLoadMore?: () => Promise<void>;
  hasMorePages?: boolean;
  isLoadingMore?: boolean;
}

const TypeaheadCheckboxes: React.FC<TypeaheadCheckboxesProps> = ({
  onChange = Function.prototype,
  options,
  selectedOptions = [],
  placeholder = '0 items selected',
  menuToggleOuiaId,
  maxSelections = Infinity,
  // Search props
  onSearch,
  isLoading = false,
  searchDelay = 300,
  // Pagination props
  onLoadMore,
  hasMorePages = false,
  isLoadingMore = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<SelectOptionProps[]>(options);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activePlaceholder, setActivePlaceholder] = useState(placeholder);
  const [isSearching, setIsSearching] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const justSelectedRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection for infinite pagination
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20; // 20px threshold
      
      if (isNearBottom && hasMorePages && !isLoadingMore && onLoadMore && !inputValue) {
        // Only trigger pagination when not searching
        onLoadMore();
      }
    },
    [hasMorePages, isLoadingMore, onLoadMore, inputValue]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (onSearch && searchTerm.trim()) {
          setIsSearching(true);
          try {
            const searchResults = await onSearch(searchTerm.trim());
            // Update options with search results
            setSelectOptions(searchResults);
            if (!isOpen && !justSelectedRef.current) {
              setIsOpen(true);
            }
          } catch (error) {
            console.error('Search failed:', error);
            setSelectOptions([
              {
                isDisabled: true,
                children: 'Search failed. Please try again.',
                value: 'search-error'
              }
            ]);
          } finally {
            setIsSearching(false);
          }
        }
      }, searchDelay);
    },
    [onSearch, searchDelay, isOpen]
  );

  useEffect(() => {
    let filteredOptions = options;

    if (inputValue) {
      if (onSearch) {
        // Server-side search mode
        debouncedSearch(inputValue);
        return; // Don't process local filtering when doing server search
      } else {
        // Local filtering mode (existing behavior)
        filteredOptions = options.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));

        if (!filteredOptions.length) {
          setSelectOptions([
            {
              isDisabled: true,
              children: `No results found for "${inputValue}"`,
              value: 'no results'
            }
          ]);
          return;
        }

        if (!isOpen && !justSelectedRef.current) {
          setIsOpen(true);
        }
      }
    } else if (!onSearch) {
      // Reset to all options when input is empty (local mode only)
      filteredOptions = options;
    }

    // Only update options if not in server search mode or if input is empty
    if (!onSearch || !inputValue) {
      const selectedOptionsFiltered = filteredOptions.filter(option => selectedOptions.includes(option.value));
      const unselectedOptions = filteredOptions
        .filter(option => !selectedOptions.includes(option.value))
        .sort((a, b) => a.label.localeCompare(b.label));

      const newOptions = [...selectedOptionsFiltered, ...unselectedOptions];

      setSelectOptions(prev => {
        if (prev.length !== newOptions.length) {
          return newOptions;
        }
        const hasChanged = prev.some((option, index) => option.value !== newOptions[index]?.value);
        return hasChanged ? newOptions : prev;
      });
    }

    setFocusedItemIndex(null);
    setActiveItem(null);
  }, [inputValue, isOpen, options, selectedOptions, onSearch, debouncedSearch]);
  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === 'ArrowUp') {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === 'ArrowDown') {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus);
      const focusedItem = selectOptions.filter(option => !option.isDisabled)[indexToFocus];
      setActiveItem(`select-multi-typeahead-checkbox-${String(focusedItem.value).replace(' ', '-')}`);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = selectOptions.filter(menuItem => !menuItem.isDisabled);
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex ? enabledMenuItems[focusedItemIndex] : firstMenuItem;

    switch (event.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(prevIsOpen => !prevIsOpen);
        } else if (
          isOpen &&
          focusedItem?.value &&
          focusedItem.value !== 'no results' &&
          focusedItem.value !== 'search-error'
        ) {
          onSelect(focusedItem.value as string);
        }
        break;
      case 'Tab':
      case 'Escape':
        setIsOpen(false);
        setActiveItem(null);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setInputValue(value);
  };

  const onSelect = (value: string) => {
    if (!value || value === 'no results' || value === 'search-error') {
      return;
    }

    let newSelected: string[];

    if (!selectedOptions.includes(value)) {
      if (selectedOptions.length >= maxSelections) {
        return;
      }
      newSelected = [...selectedOptions, value];
    } else {
      newSelected = selectedOptions.filter(v => v !== value);
    }

    onChange(newSelected);

    justSelectedRef.current = true;

    if (maxSelections === 1 || newSelected.length >= maxSelections) {
      setIsOpen(false);
    }

    setInputValue('');
    textInputRef.current?.focus();

    setTimeout(() => {
      justSelectedRef.current = false;
    }, 100);
  };

  useEffect(() => {
    setActivePlaceholder(selectedOptions.length ? `${selectedOptions.length} items selected` : placeholder);
  }, [selectedOptions, placeholder]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      variant="typeahead"
      onClick={onToggleClick}
      ref={toggleRef}
      isExpanded={isOpen}
      isFullWidth
      ouiaId={menuToggleOuiaId}
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={onToggleClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="multi-typeahead-select-checkbox-input"
          autoComplete="off"
          ref={textInputRef}
          placeholder={activePlaceholder}
          {...(activeItem && { 'aria-activedescendant': activeItem })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-multi-typeahead-checkbox-listbox"
          data-ouia-component-id="credentials_list_input"
        />
        <TextInputGroupUtilities>
          {(isSearching || isLoading) && <Spinner size="md" />}
          {selectedOptions.length > 0 && (
            <Button
              icon={<TimesIcon aria-hidden />}
              variant="plain"
              onClick={() => {
                setInputValue('');
                onChange([]);
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
              ouiaId="credentials_list_clear_button"
            />
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      role="menu"
      id="multi-typeahead-checkbox-select"
      isOpen={isOpen}
      selected={selectedOptions}
      onSelect={(ev, selection) => onSelect(selection as string)}
      onOpenChange={() => setIsOpen(false)}
      toggle={toggle}
    >
      <SelectList 
        id="select-multi-typeahead-checkbox-listbox"
        onScroll={handleScroll}
      >
        {selectOptions.map((option, index) => (
          <SelectOption
            {...(!option.isDisabled && { hasCheckbox: true })}
            isSelected={selectedOptions.includes(option.value)}
            key={option.value || option.children}
            isFocused={focusedItemIndex === index}
            className={option.className}
            id={`select-multi-typeahead-${String(option.value).replace(' ', '-')}`}
            // Pass children before spreading ...option so it can be overridden by the consumer
            // eslint-disable-next-line react/no-children-prop
            children={option.label}
            {...option}
            ref={null}
          />
        ))}
        {isLoadingMore && (
          <div style={{ padding: '8px 16px', textAlign: 'center', borderTop: '1px solid #d2d2d2' }}>
            <Spinner size="sm" /> Loading more...
          </div>
        )}
        {hasMorePages && !isLoadingMore && !inputValue && (
          <div style={{ padding: '8px 16px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            Scroll down to load more...
          </div>
        )}
      </SelectList>
    </Select>
  );
};

export { TypeaheadCheckboxes as default, TypeaheadCheckboxes, type TypeaheadCheckboxesProps };
