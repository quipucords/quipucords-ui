import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as PfCheckbox } from '@patternfly/react-core/dist/js/components/Checkbox';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * Render a checkbox form element. Provides restructured event data.
 *
 * @fires onCheckboxChange
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {boolean} props.checked
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {string} props.id
 * @param {*} props.isChecked
 * @param {boolean} props.isDisabled
 * @param {React.ReactNode} props.label
 * @param {string} props.name
 * @param {Function} props.onChange
 * @param {*} props.value
 * @returns {React.ReactNode}
 */
const Checkbox = ({
  ariaLabel,
  checked,
  children,
  className,
  id,
  isChecked,
  isDisabled,
  label,
  name,
  onChange,
  value,
  ...props
}) => {
  const updatedChecked = checked ?? isChecked ?? false;
  const updatedName = name || helpers.generateId();
  const updatedId = id || updatedName;

  /**
   * onChange event, provide restructured event.
   *
   * @event onCheckboxChange
   * @param {object} event
   * @param {boolean} eventChecked
   */
  const onCheckboxChange = (event, eventChecked) => {
    const mockEvent = {
      ...createMockEvent(event),
      id: updatedId,
      name: updatedName,
      value,
      checked: eventChecked
    };

    onChange(mockEvent);
  };

  return (
    <PfCheckbox
      className={`quipucords-form__checkbox ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' && children) || (typeof label === 'string' && label)}
      id={updatedId}
      isChecked={updatedChecked}
      isDisabled={isDisabled || false}
      label={children || label}
      name={updatedName}
      onChange={onCheckboxChange}
      value={value}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{onChange: Function, children: React.ReactNode, name: string, checked: boolean, className: string, id: string,
 *     isDisabled: boolean, label: string, isChecked: boolean, value: any, ariaLabel: string}}
 */
Checkbox.propTypes = {
  ariaLabel: PropTypes.string,
  checked: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any
};

/**
 * Default props.
 *
 * @type {{onChange: Function, children: null, name: null, checked: null, className: string, id: null,
 *     isDisabled: boolean, label: string, isChecked: boolean, value: undefined, ariaLabel: string}}
 */
Checkbox.defaultProps = {
  ariaLabel: 'checkbox input',
  checked: null,
  children: null,
  className: '',
  id: null,
  isChecked: false,
  isDisabled: false,
  label: '',
  name: null,
  onChange: helpers.noop,
  value: undefined
};

export { Checkbox as default, Checkbox };
