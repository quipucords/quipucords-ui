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
 * @module typeaheadCheckboxes
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { type CredentialType, type CredentialOption } from '../../types/types';

interface TypeaheadCheckboxesProps {
  onChange?: (selections: string[]) => void;
  selectedOptions?: string[];
  placeholder?: string;
  menuToggleOuiaId?: number | string;
  maxSelections?: number;
  credentialType?: string;
  initialSelectedCredentials?: CredentialOption[];
}

const TypeaheadCheckboxes: React.FC<TypeaheadCheckboxesProps> = ({
  onChange = Function.prototype,
  selectedOptions = [],
  placeholder,
  menuToggleOuiaId,
  maxSelections = Infinity,
  credentialType,
  initialSelectedCredentials = []
}) => {
  const { t } = useTranslation();
  const DEBOUNCE_DELAY = 600; // ms
  const defaultPlaceholder = placeholder || t('form-dialog.label', { context: 'typeahead-placeholder' });
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<SelectOptionProps[]>([]);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activePlaceholder, setActivePlaceholder] = useState(defaultPlaceholder);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [displayedCredentials, setDisplayedCredentials] = useState<CredentialOption[]>([]);
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

    initialSelectedCredentials.forEach(credOption => {
      const idStr = credOption.value;
      selectedMap.set(idStr, credOption.credential);
      cache.set(idStr, credOption.credential);
    });

    setSelectedCredentialMap(selectedMap);
    setCredentialCache(cache);

    // Don't set allCredentials here - we need to fetch all available credentials
    // setAllCredentials should only be set when we fetch the complete list from the API
  }, [initialSelectedCredentials]);

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

            setDisplayedCredentials(credentialOptions);

            // Only store all credentials if we fetched without a search term and have no pagination
            if (!next && !searchTerm.trim()) {
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
          setDisplayedCredentials([]);
          setHasMorePages(false);
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_DELAY);
    },
    [credentialType, getCredentials]
  );

  const performLocalFilter = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) {
        // When clearing search, show all available credentials
        setDisplayedCredentials(allCredentials);
        return;
      }

      const filtered = allCredentials.filter(cred => cred.label.toLowerCase().includes(searchTerm.toLowerCase()));
      setDisplayedCredentials(filtered);
    },
    [allCredentials]
  );

  // Ensure we show all credentials when dropdown opens and we have all data
  useEffect(() => {
    if (isOpen && !inputValue && !hasMorePages && allCredentials.length > 0) {
      setDisplayedCredentials(allCredentials);
    }
  }, [isOpen, inputValue, hasMorePages, allCredentials]);

  useEffect(() => {
    if (isOpen || inputValue) {
      // Use local filtering if we have all credentials loaded and no more pages
      if (!hasMorePages && allCredentials.length > 0) {
        performLocalFilter(inputValue);
      } else {
        // Use server-side search when we don't have all data yet or when dropdown first opens
        debouncedSearch(inputValue);
      }
    }
  }, [inputValue, isOpen, debouncedSearch, allCredentials.length, performLocalFilter]);

  useEffect(() => {
    const selectedInOrder: CredentialOption[] = [];
    selectedOptions.forEach(selectedId => {
      const displayedCred = displayedCredentials.find(opt => opt.value === selectedId);
      if (displayedCred) {
        selectedInOrder.push(displayedCred);
      } else {
        const credential = credentialCache.get(selectedId) || selectedCredentialMap.get(selectedId);
        if (credential) {
          selectedInOrder.push({
            value: selectedId,
            label: credential.name,
            credential
          });
        }
      }
    });

    const unselectedFromDisplayed = displayedCredentials
      .filter(option => !selectedOptions.includes(option.value))
      .sort((a, b) => a.label.localeCompare(b.label));

    const combinedOptions = [...selectedInOrder, ...unselectedFromDisplayed];

    const selectOptionProps: SelectOptionProps[] = combinedOptions.map(option => ({
      value: option.value,
      label: option.label,
      children: option.label,
      isDisabled: false
    }));

    if (combinedOptions.length === 0 && inputValue && !isLoading) {
      selectOptionProps.push({
        isDisabled: true,
        children: t('form-dialog.label', { context: 'typeahead-no-results', searchTerm: inputValue }),
        value: 'no-results'
      });
    }

    if (hasMorePages && inputValue.trim() === '') {
      selectOptionProps.push({
        isDisabled: true,
        children: t('form-dialog.label', { context: 'typeahead-search-hint' }),
        value: 'search-hint'
      });
    }

    setSelectOptions(selectOptionProps);
    setFocusedItemIndex(null);
    setActiveItem(null);
  }, [
    displayedCredentials,
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

      const credentialOption = displayedCredentials.find(opt => opt.value === value);
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
    setActivePlaceholder(
      selectedOptions.length
        ? t('form-dialog.label', { context: 'typeahead-items-selected', count: selectedOptions.length })
        : defaultPlaceholder
    );
  }, [selectedOptions, defaultPlaceholder, t]);

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
          data-ouia-component-id="credentials_list_input"
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
              aria-label={t('form-dialog.label', { context: 'typeahead-clear' })}
              ouiaId="credentials_list_clear_button_with_search"
            />
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  const popperProps = {
    enableFlip: true
  };

  return (
    <Select
      role="menu"
      id="multi-typeahead-checkbox-select-with-search"
      isOpen={isOpen}
      selected={selectedOptions}
      onSelect={(ev, selection) => onSelect(selection as string)}
      onOpenChange={() => setIsOpen(false)}
      toggle={toggle}
      popperProps={popperProps}
      maxMenuHeight="300px"
      isScrollable
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

export { TypeaheadCheckboxes as default, TypeaheadCheckboxes, type TypeaheadCheckboxesProps };
