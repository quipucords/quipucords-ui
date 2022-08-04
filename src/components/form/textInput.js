import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput as PfTextInput } from '@patternfly/react-core';
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
 * @param {*|string} props.value
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
 * @returns {React.ReactNode};
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
  ...props
}) => {
  const [updatedValue, setUpdatedValue] = useState(value);

  /**
   * onKeyUp event, provide additional functionality for onClear event.
   *
   * @event onKeyUp
   * @param {object} event
   */
  const onTextInputKeyUp = event => {
    const { currentTarget, keyCode } = event;
    const clonedEvent = { ...event };

    onKeyUp(createMockEvent(event, true));

    if (keyCode === 27) {
      if (type === 'search' && currentTarget.value === '') {
        onClear(createMockEvent(clonedEvent));
      } else {
        setUpdatedValue('');
        onClear(createMockEvent({ ...clonedEvent, ...{ currentTarget: { ...clonedEvent.currentTarget, value: '' } } }));
      }
    }
  };

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
    onChange(createMockEvent(clonedEvent));
  };

  const updatedName = name || helpers.generateId();
  const updatedId = id || updatedName;

  return (
    <PfTextInput
      id={updatedId}
      name={updatedName}
      className={`quipucords-form__text-input ${className}`}
      isDisabled={isDisabled || false}
      onChange={onTextInputChange}
      onKeyUp={onTextInputKeyUp}
      onMouseUp={onTextInputMouseUp}
      isReadOnly={isReadOnly || false}
      type={type}
      value={updatedValue ?? value ?? ''}
      {...props}
    />
  );
};

/**
 * Prop types
 *
 * @type {{onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function, name: string,
 *     className: string, id: string, isDisabled: boolean, onMouseUp: Function, type: string, value: string}}
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
  type: PropTypes.string,
  value: PropTypes.string
};

/**
 * Default props
 *
 * @type {{onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function, name: null,
 *     className: string, id: null, isDisabled: boolean, onMouseUp: Function, type: string, value: string}}
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
  type: 'text',
  value: ''
};

export { TextInput as default, TextInput };
