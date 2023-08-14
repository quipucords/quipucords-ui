import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput as PfTextInput, TextInputTypes } from '@patternfly/react-core';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * A wrapper for Patternfly TextInput.
 * Provides a consistent event structure, and an onClear event for the search type.
 *
 * @fires onKeyUp
 * @fires onMouseUp
 * @fires onChange
 * @param {object} props
 * @param {string} props.className
 * @param {string} props.id
 * @param {boolean} props.isDisabled
 * @param {string} props.name
 * @param {Function} props.onChange
 * @param {Function} props.onClear
 * @param {Function} props.onKeyUp
 * @param {Function} props.onMouseUp
 * @param {boolean} props.isReadOnly
 * @param {string} props.type
 * @param {*|string} props.value
 * @param {string} props.ouiaId
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const TextInput = ({
  className,
  id,
  isDisabled,
  name,
  onChange,
  onClear,
  onKeyUp,
  onMouseUp,
  isReadOnly,
  type,
  value,
  ouiaId,
  ...props
}) => {
  const [updatedValue, setUpdatedValue] = useState(value);
  const [clearedEvent, setClearedEvent] = useState();
  const [changeEvent, setChangeEvent] = useState();

  useEffect(() => {
    if (clearedEvent) {
      setClearedEvent(null);
      onClear(clearedEvent);
    }
  }, [clearedEvent, onClear]);

  useEffect(() => {
    if (changeEvent) {
      setChangeEvent(null);
      onChange(changeEvent);
    }
  }, [changeEvent, onChange]);

  // ToDo: review having to manually set value on escape key
  /**
   * onKeyUp event, provide additional functionality for onClear event.
   *
   * @event onKeyUp
   * @param {object} event
   */
  const onTextInputKeyUp = event => {
    const { keyCode } = event;
    const clonedEvent = { ...event };

    onKeyUp(createMockEvent(event, true));

    if (keyCode === 27) {
      setUpdatedValue('');
      const updatedTarget = clonedEvent.currentTarget;
      updatedTarget.value = '';
      setClearedEvent(createMockEvent({ ...clonedEvent, currentTarget: updatedTarget }));
    }
  };

  // ToDo: review use of setTimeout, used for pf icons inside field
  /**
   * onMouseUp event, provide additional functionality for onClear event.
   *
   * @event onMouseUp
   * @param {object} event
   */
  const onTextInputMouseUp = event => {
    const { currentTarget } = event;
    const clonedEvent = { ...event };

    onMouseUp(createMockEvent(event, true));

    if (type !== 'search' || currentTarget.value === '') {
      return;
    }

    window.setTimeout(() => {
      if (currentTarget.value === '') {
        onClear(createMockEvent(clonedEvent));
      }
    });
  };

  /**
   * onChange event, provide restructured event.
   *
   * @event onChange
   * @param {string} changedValue
   * @param {object} event
   */
  const onTextInputChange = (changedValue, event) => {
    const clonedEvent = { ...event };

    setUpdatedValue(changedValue);
    setChangeEvent(createMockEvent(clonedEvent));
  };

  const updatedName = name || helpers.generateId();
  const updatedId = id || updatedName;
  const updatedOuiaId = ouiaId || updatedName;

  return (
    <PfTextInput
      id={updatedId}
      name={updatedName}
      className={`quipucords-form__text-input ${className}`}
      isDisabled={isDisabled || false}
      isReadOnly={isReadOnly || false}
      onChange={onTextInputChange}
      onKeyUp={onTextInputKeyUp}
      onMouseUp={onTextInputMouseUp}
      type={type}
      value={updatedValue ?? value ?? ''}
      ouiaId={updatedOuiaId}
      {...props}
    />
  );
};

/**
 * Prop types
 *
 * @type {{onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function, name: string,
 *     className: string, id: string, isDisabled: boolean, onMouseUp: Function, type: string,
 *     value: string, ouiaId: string}}
 */
TextInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onKeyUp: PropTypes.func,
  onMouseUp: PropTypes.func,
  type: PropTypes.oneOf([...Object.values(TextInputTypes)]),
  value: PropTypes.string,
  ouiaId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function, name: null,
 *     className: string, id: null, isDisabled: boolean, onMouseUp: Function, type: TextInputTypes.text,
 *     value: string, ouiaId: string}}
 */
TextInput.defaultProps = {
  className: '',
  id: null,
  isDisabled: false,
  isReadOnly: false,
  name: null,
  onChange: helpers.noop,
  onClear: helpers.noop,
  onKeyUp: helpers.noop,
  onMouseUp: helpers.noop,
  type: TextInputTypes.text,
  value: '',
  ouiaId: null
};

export { TextInput as default, TextInput, TextInputTypes };
