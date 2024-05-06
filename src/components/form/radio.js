import React from 'react';
import PropTypes from 'prop-types';
import { Radio as PfRadio } from '@patternfly/react-core/dist/js/components/Radio';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * FixMe: PF Radio has an issue associated with how it handles multiple checked props.
 * Logic within the component creates a potential issue that can be seen when a consumer sets
 * both props independently, or sets "checked" to false but NOT "isChecked" making the checked attribute
 * "undefined" and throwing the controlled/uncontrolled warning. https://bit.ly/3B1oCQB
 */
/**
 * Render a radio form element. Provides restructured event data.
 *
 * @fires onRadioChange
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
const Radio = ({
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
   * @event onRadioChange
   * @param {object} event
   * @param {boolean} eventChecked
   */
  const onRadioChange = (event, eventChecked) => {
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
    <PfRadio
      className={`quipucords-form__radio ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' && children) || (typeof label === 'string' && label)}
      id={updatedId}
      checked={updatedChecked}
      isChecked={false}
      isDisabled={isDisabled || false}
      label={children || label}
      name={updatedName}
      onChange={onRadioChange}
      value={value}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{onChange: Function, children: React.ReactNode, name: string, checked: boolean, className: string,
 *     id: string, isDisabled: boolean, label: React.ReactNode, isChecked: boolean, value: any,
 *     ariaLabel: string}}
 */
Radio.propTypes = {
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
Radio.defaultProps = {
  ariaLabel: 'radio input',
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

export { Radio as default, Radio };
