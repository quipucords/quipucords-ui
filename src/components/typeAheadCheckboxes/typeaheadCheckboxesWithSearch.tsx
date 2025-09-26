/**
 * Enhanced multi-select typeahead component with server-side search and pagination support.
 * Utilizes PatternFly for UI consistency and accessibility.
 *
 * Features:
 * - Server-side search with debouncing
 * - Pagination support to handle large datasets
 * - Maintains selected state across searches
 * - Optimized for credential selection in Add Source modal
 *
 * @module typeaheadCheckboxesWithSearch
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { helpers } from '../../helpers';
import { useGetCredentialsApi } from '../../hooks/useCredentialApi';
import { type CredentialType } from '../../types/types';

interface TypeaheadCheckboxesWithSearchProps {
  onChange?: (selections: string[]) => void;
  selectedOptions?: string[];
  placeholder?: string;
  menuToggleOuiaId?: number | string;
  maxSelections?: number;
  credentialType?: string;
  initialSelectedCredentials?: CredentialType[];
}

interface CredentialOption {
  value: string;
  label: string;
  credential: CredentialType;
}

const TypeaheadCheckboxesWithSearch: React.FC<TypeaheadCheckboxesWithSearchProps> = ({
  onChange = Function.prototype,
  selectedOptions = [],
  placeholder = '0 items selected',
  menuToggleOuiaId,
  maxSelections = Infinity,
  credentialType,
  initialSelectedCredentials = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<SelectOptionProps[]>([]);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activePlaceholder, setActivePlaceholder] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [availableCredentials, setAvailableCredentials] = useState<CredentialOption[]>([]);
  const [allCredentials, setAllCredentials] = useState<CredentialOption[]>([]); // For local filtering
  const [selectedCredentialMap, setSelectedCredentialMap] = useState<Map<string, CredentialType>>(new Map());
  const [credentialCache, setCredentialCache] = useState<Map<string, CredentialType>>(new Map());

  const textInputRef = useRef<HTMLInputElement>(null);
  const justSelectedRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { getCredentials } = useGetCredentialsApi();

  // Initialize selected credential map and cache from initial data
  useEffect(() => {
    if (!initialSelectedCredentials || initialSelectedCredentials.length === 0) {
      return;
    }

    const selectedMap = new Map<string, CredentialType>();
    const cache = new Map<string, CredentialType>();
    const credOptions: CredentialOption[] = [];

    initialSelectedCredentials.forEach(cred => {
      const idStr = cred.id.toString();
      selectedMap.set(idStr, cred);
      cache.set(idStr, cred);
      credOptions.push({
        value: idStr,
        label: cred.name,
        credential: cred
      });
    });

    setSelectedCredentialMap(selectedMap);
    setCredentialCache(cache);

    if (credOptions.length > 0) {
      setAllCredentials(credOptions);
    }
  }, [initialSelectedCredentials?.length]);

  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const params: any = {};

          if (credentialType) {
            params.cred_type = credentialType;
          }

          if (searchTerm.trim()) {
            params.search_by_name = searchTerm.trim();
          }

          params.page_size = 100;

          const response = await getCredentials({ params });

          if (response?.data) {
            const { results = [], next } = response.data;
            setHasMorePages(!!next);

            const credentialOptions: CredentialOption[] = results.map(cred => ({
              value: cred.id.toString(),
              label: cred.name,
              credential: cred
            }));

            setAvailableCredentials(credentialOptions);

            // If no pagination, store all credentials for local filtering
            if (!next) {
              setAllCredentials(credentialOptions);
            }

            setCredentialCache(prev => {
              const newCache = new Map(prev);
              results.forEach(cred => {
                newCache.set(cred.id.toString(), cred);
              });
              return newCache;
            });

            setSelectedCredentialMap(prev => {
              const newSelectedMap = new Map(prev);
              results.forEach(cred => {
                newSelectedMap.set(cred.id.toString(), cred);
              });
              return newSelectedMap;
            });
          }
        } catch (error) {
          if (!helpers.TEST_MODE) {
            console.error('Error searching credentials:', error);
          }
          setAvailableCredentials([]);
          setHasMorePages(false);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    [credentialType, getCredentials]
  );

  const performLocalFilter = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setAvailableCredentials(allCredentials);
        return;
      }

      const filtered = allCredentials.filter(cred => cred.label.toLowerCase().includes(searchTerm.toLowerCase()));
      setAvailableCredentials(filtered);
    },
    [allCredentials]
  );

  useEffect(() => {
    if (isOpen || inputValue) {
      // Use local filtering if we have all credentials loaded
      if (!hasMorePages && allCredentials.length > 0) {
        performLocalFilter(inputValue);
      } else {
        debouncedSearch(inputValue);
      }
    }
  }, [inputValue, isOpen, debouncedSearch, hasMorePages, allCredentials.length, performLocalFilter]);

  useEffect(() => {
    const selectedFromAvailable = availableCredentials.filter(option => selectedOptions.includes(option.value));

    const unselectedFromAvailable = availableCredentials
      .filter(option => !selectedOptions.includes(option.value))
      .sort((a, b) => a.label.localeCompare(b.label));

    const selectedNotInResults: CredentialOption[] = [];
    selectedOptions.forEach(selectedId => {
      if (!availableCredentials.find(opt => opt.value === selectedId)) {
        const credential = credentialCache.get(selectedId) || selectedCredentialMap.get(selectedId);
        if (credential) {
          selectedNotInResults.push({
            value: selectedId,
            label: credential.name,
            credential
          });
        }
      }
    });

    const combinedOptions = [...selectedNotInResults, ...selectedFromAvailable, ...unselectedFromAvailable];

    const selectOptionProps: SelectOptionProps[] = combinedOptions.map(option => ({
      value: option.value,
      label: option.label,
      children: option.label,
      isDisabled: false
    }));

    if (combinedOptions.length === 0 && inputValue && !isLoading) {
      selectOptionProps.push({
        isDisabled: true,
        children: `No results found for "${inputValue}"`,
        value: 'no-results'
      });
    }

    if (hasMorePages && inputValue.trim() === '') {
      selectOptionProps.push({
        isDisabled: true,
        children: 'Type to search for more credentials...',
        value: 'search-hint'
      });
    }

    setSelectOptions(selectOptionProps);
    setFocusedItemIndex(null);
    setActiveItem(null);
  }, [
    availableCredentials,
    selectedOptions,
    selectedCredentialMap,
    credentialCache,
    inputValue,
    isLoading,
    hasMorePages
  ]);

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === 'ArrowUp') {
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === 'ArrowDown') {
        if (focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus);
      const focusedItem = selectOptions.filter(option => !option.isDisabled)[indexToFocus];
      if (focusedItem) {
        setActiveItem(`select-multi-typeahead-checkbox-${String(focusedItem.value).replace(' ', '-')}`);
      }
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = selectOptions.filter(menuItem => !menuItem.isDisabled);
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex !== null ? enabledMenuItems[focusedItemIndex] : firstMenuItem;

    switch (event.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(true);
        } else if (isOpen && focusedItem && focusedItem.value !== 'no-results' && focusedItem.value !== 'search-hint') {
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

    if (!isOpen && !justSelectedRef.current) {
      setIsOpen(true);
    }
  };

  const onSelect = (value: string) => {
    if (!value || value === 'no-results' || value === 'search-hint') {
      return;
    }

    let newSelected: string[];

    if (!selectedOptions.includes(value)) {
      if (selectedOptions.length >= maxSelections) {
        return;
      }
      newSelected = [...selectedOptions, value];

      const credentialOption = availableCredentials.find(opt => opt.value === value);
      if (credentialOption) {
        setSelectedCredentialMap(prev => {
          const newMap = new Map(prev);
          newMap.set(value, credentialOption.credential);
          return newMap;
        });
        setCredentialCache(prev => {
          const newCache = new Map(prev);
          newCache.set(value, credentialOption.credential);
          return newCache;
        });
      }
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
          id="multi-typeahead-select-checkbox-input-with-search"
          autoComplete="off"
          ref={textInputRef}
          placeholder={activePlaceholder}
          {...(activeItem && { 'aria-activedescendant': activeItem })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-multi-typeahead-checkbox-listbox-with-search"
          data-ouia-component-id="credentials_list_input_with_search"
        />
        <TextInputGroupUtilities>
          {isLoading && <Spinner size="md" />}
          {selectedOptions.length > 0 && (
            <Button
              icon={<TimesIcon aria-hidden />}
              variant="plain"
              onClick={() => {
                setInputValue('');
                onChange([]);
                setSelectedCredentialMap(new Map());
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
              ouiaId="credentials_list_clear_button_with_search"
            />
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      role="menu"
      id="multi-typeahead-checkbox-select-with-search"
      isOpen={isOpen}
      selected={selectedOptions}
      onSelect={(ev, selection) => onSelect(selection as string)}
      onOpenChange={() => setIsOpen(false)}
      toggle={toggle}
    >
      <SelectList id="select-multi-typeahead-checkbox-listbox-with-search">
        {selectOptions.map((option, index) => (
          <SelectOption
            {...(!option.isDisabled && { hasCheckbox: true })}
            isSelected={selectedOptions.includes(option.value)}
            key={option.value || option.children}
            isFocused={focusedItemIndex === index}
            className={option.className}
            id={`select-multi-typeahead-with-search-${String(option.value).replace(' ', '-')}`}
            // eslint-disable-next-line react/no-children-prop
            children={option.label || option.children}
            {...option}
            ref={null}
          />
        ))}
      </SelectList>
    </Select>
  );
};

export {
  TypeaheadCheckboxesWithSearch as default,
  TypeaheadCheckboxesWithSearch,
  type TypeaheadCheckboxesWithSearchProps
};
