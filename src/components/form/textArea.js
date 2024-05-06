import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextArea as PfTextArea, TextAreResizeOrientation as PfTextAreResizeOrientation } from '@patternfly/react-core';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * Resize orientation types
 *
 * @type {{horizontal: TextAreResizeOrientation.horizontal, default: undefined, vertical: TextAreResizeOrientation.vertical,
 *     none: string, both: TextAreResizeOrientation.both}}
 */
const TextAreResizeOrientation = {
  ...PfTextAreResizeOrientation,
  default: undefined,
  none: 'none'
};

/**
 * A wrapper for Patternfly TextArea.
 * Provides a consistent event structure, and an onClear event for the search type.
 *
 * @fires onKeyUp
 * @fires onChange
 * @param {object} props
 * @param {string} props.className
 * @param {string} props.id
 * @param {boolean} props.isDisabled
 * @param {string} props.name
 * @param {Function} props.onChange
 * @param {Function} props.onClear
 * @param {Function} props.onKeyUp
 * @param {boolean} props.isReadOnly
 * @param {string} props.resizeOrientation
 * @param {*|string} props.value
 * @param {string} props.ouiaId
 * @param {object} props.props
 * @returns {React.ReactNode}
 */
const TextArea = ({
  className,
  id,
  isDisabled,
  name,
  onChange,
  onClear,
  onKeyUp,
  isReadOnly,
  resizeOrientation,
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
  const onTextAreaKeyUp = async event => {
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

  /**
   * onChange event, provide restructured event.
   *
   * @event onChange
   * @param {object} event
   * @param {string} changedValue
   */
  const onTextInputChange = (event, changedValue) => {
    const clonedEvent = { ...event };

    setUpdatedValue(changedValue);
    setChangeEvent(createMockEvent(clonedEvent));
  };

  const updatedName = name || helpers.generateId();
  const updatedId = id || updatedName;
  const updatedOuiaId = ouiaId || updatedName;

  return (
    <PfTextArea
      id={updatedId}
      name={updatedName}
      className={`quipucords-form__textarea ${
        (resizeOrientation === TextAreResizeOrientation.none && 'quipucords-form__textarea-resize-none') || ''
      } ${className}`}
      isDisabled={isDisabled || false}
      onChange={onTextInputChange}
      onKeyUp={onTextAreaKeyUp}
      resizeOrientation={
        resizeOrientation === TextAreResizeOrientation.none ? TextAreResizeOrientation.default : resizeOrientation
      }
      value={updatedValue ?? value ?? ''}
      data-ouia-component-id={updatedOuiaId}
      readOnlyVariant={(isReadOnly && 'default') || undefined}
      {...props}
    />
  );
};

/**
 * Prop types
 *
 * @type {{resizeOrientation: string, onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function,
 *     name: string, className: string, id: string, isDisabled: boolean, value: string, ouiaId: string}}
 */
TextArea.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onKeyUp: PropTypes.func,
  resizeOrientation: PropTypes.oneOf([...Object.values(TextAreResizeOrientation)]),
  value: PropTypes.string,
  ouiaId: PropTypes.string
};

/**
 * Default props
 *
 * @type {{resizeOrientation: *, onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function,
 *     name: null, className: string, id: null, isDisabled: boolean, value: string, ouiaId: string}}
 */
TextArea.defaultProps = {
  className: '',
  id: null,
  isDisabled: false,
  isReadOnly: false,
  name: null,
  onChange: helpers.noop,
  onClear: helpers.noop,
  onKeyUp: helpers.noop,
  resizeOrientation: TextAreResizeOrientation.default,
  value: '',
  ouiaId: null
};

export { TextArea as default, TextArea, TextAreResizeOrientation };
