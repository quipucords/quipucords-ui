/**
 * Implements a multi-select typeahead component with checkboxes, enabling users to filter and select multiple options.
 * Utilizes PatternFly for UI consistency and accessibility.
 *
 * @module typeaheadCheckboxes
 */
import React, { useEffect, useRef, useState } from 'react';
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
  Button
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons/';

interface TypeaheadCheckboxesProps {
  onChange?: (selections: string[]) => void;
  options: { value: string; label: string }[];
  selectedOptions?: string[];
  placeholder?: string;
  menuToggleOuiaId?: number | string;
  maxSelections?: number;
}

const TypeaheadCheckboxes: React.FC<TypeaheadCheckboxesProps> = ({
  onChange = Function.prototype,
  options,
  selectedOptions = [],
  placeholder = '0 items selected',
  menuToggleOuiaId,
  maxSelections = Infinity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selected, setSelected] = useState<string[]>(selectedOptions || []);
  const [selectOptions, setSelectOptions] = useState<SelectOptionProps[]>(options);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activePlaceholder, setActivePlaceholder] = useState(placeholder);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectOptions(options);
  }, [options]);

  useEffect(() => {
    setSelected(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    let newSelectOptions: SelectOptionProps[] = options;

    // Filter menu items based on the text input value when one exists
    if (inputValue) {
      newSelectOptions = options.filter(menuItem =>
        String(menuItem.label).toLowerCase().includes(inputValue.toLowerCase())
      );

      // When no options are found after filtering, display 'No results found'
      if (!newSelectOptions.length) {
        newSelectOptions = [
          {
            isDisabled: false,
            children: `No results found for "${inputValue}"`,
            value: 'no results'
          }
        ];
      }

      // Open the menu when the input value changes and the new value is not empty
      if (!isOpen) {
        setIsOpen(true);
      }
    }

    setSelectOptions(newSelectOptions);
    setFocusedItemIndex(null);
    setActiveItem(null);
  }, [inputValue, isOpen, options]);

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
      // Select the first available option
      case 'Enter':
        if (!isOpen) {
          setIsOpen(prevIsOpen => !prevIsOpen);
        } else if (isOpen && focusedItem.value !== 'no results') {
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
    if (value && value !== 'no results') {
      if (!selected.includes(value)) {
        if (selected.length >= maxSelections) {
          return;
        }
        const newSelected = [...selected, value];
        onChange(newSelected);
        setSelected(newSelected);
      } else {
        const newSelected = selected.filter(selection => selection !== value);
        onChange(newSelected);
        setSelected(newSelected);
      }
    }

    textInputRef.current?.focus();
  };

  useEffect(() => {
    setActivePlaceholder(selected.length ? `${selected.length} items selected` : placeholder);
  }, [selected, placeholder]);

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      variant="typeahead"
      onClick={onToggleClick}
      ref={toggleRef}
      isExpanded={isOpen}
      isFullWidth
      data-ouia-component-id={menuToggleOuiaId}
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
          {selected.length > 0 && (
            <Button
              icon={<TimesIcon aria-hidden />}
              variant="plain"
              onClick={() => {
                setInputValue('');
                setSelected([]);
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
      selected={selected}
      onSelect={(ev, selection) => onSelect(selection as string)}
      onOpenChange={() => setIsOpen(false)}
      toggle={toggle}
    >
      <SelectList id="select-multi-typeahead-checkbox-listbox">
        {selectOptions.map((option, index) => (
          <SelectOption
            {...(!option.isDisabled && { hasCheckbox: true })}
            isSelected={selected.includes(option.value)}
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
      </SelectList>
    </Select>
  );
};

export { TypeaheadCheckboxes as default, TypeaheadCheckboxes, type TypeaheadCheckboxesProps };
