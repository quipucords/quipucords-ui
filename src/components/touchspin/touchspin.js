import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Button, TextInput, ButtonVariant, InputGroupItem } from '@patternfly/react-core';
import { PlusIcon, MinusIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

// FixMe: remove the eslint-disable
/**
 * Touch-spin numeric input
 */
class TouchSpin extends React.Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line
    this.state = {
      displayValue: Number.parseInt(props.value, 10),
      maxValue: props.maxValue,
      minValue: props.minValue
    };

    this.timer = null;
  }

  normalizeBetween = (value, min, max) => {
    if (min !== undefined && max !== undefined) {
      return Math.max(Math.min(value, max), min);
    }
    if (value <= min) {
      return min;
    }
    if (value >= max) {
      return max;
    }
    return value;
  };

  onFocusMax = () => {
    const { maxValue, displayValue } = this.state;

    const setTimer = (time = 500) => {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.onPlus();

        if (displayValue < maxValue) {
          setTimer(0);
        }
      }, time);
    };

    setTimer();
  };

  onFocusMin = () => {
    const { minValue, displayValue } = this.state;

    const setTimer = (time = 500) => {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.onMinus();

        if (displayValue > minValue) {
          setTimer(0);
        }
      }, time);
    };

    setTimer();
  };

  onBlur = () => {
    clearTimeout(this.timer);
  };

  onMinus = () => {
    const { displayValue, minValue, maxValue } = this.state;

    const updatedValue = this.normalizeBetween(displayValue - 1, minValue, maxValue);
    this.onUpdateValue({ target: { value: updatedValue } });
  };

  onPlus = () => {
    const { displayValue, minValue, maxValue } = this.state;

    const updatedValue = this.normalizeBetween(displayValue + 1, minValue, maxValue);
    this.onUpdateValue({ target: { value: updatedValue } });
  };

  onUpdateValue = event => {
    const { maxValue, minValue } = this.state;
    const { name, onChange } = this.props;

    let parsedValue = Number.parseInt(event.target.value, 10);
    parsedValue = Number.isNaN(parsedValue) ? minValue : parsedValue;

    if (parsedValue > maxValue) {
      parsedValue = maxValue;
    }

    if (parsedValue < minValue) {
      parsedValue = minValue;
    }

    clearTimeout(this.timer);

    this.setState({
      displayValue: parsedValue
    });

    const mockTarget = {
      ...event.target,
      name,
      value: parsedValue
    };

    const mockEvent = {
      ...mockTarget,
      target: { ...mockTarget },
      currentTarget: { ...mockTarget },
      persist: helpers.noop
    };

    return onChange(mockEvent);
  };

  render() {
    const { displayValue, maxValue, minValue } = this.state;
    const { className, labelMax, labelMaxDescription, labelMin, labelMinDescription, name, t } = this.props;

    return (
      <div className={`pf-c-number-input ${className}`}>
        <InputGroup>
          <InputGroupItem>
            <Button
              onClick={this.onMinus}
              variant={ButtonVariant.control}
              onMouseDown={this.onFocusMin}
              onMouseUp={this.onBlur}
              onMouseLeave={this.onBlur}
              isDisabled={displayValue <= minValue}
              aria-label={labelMinDescription || t('form-dialog.label', { context: ['touchspin', 'min'] })}
            >
              {labelMin}
            </Button>
          </InputGroupItem>
          <InputGroupItem isFill>
            <TextInput
              type="number"
              name={name}
              value={displayValue}
              onChange={this.onUpdateValue}
              aria-label={t('form-dialog.label', { context: ['touchspin', 'input'] })}
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant={ButtonVariant.control}
              onClick={this.onPlus}
              onMouseDown={this.onFocusMax}
              onMouseUp={this.onBlur}
              onMouseLeave={this.onBlur}
              isDisabled={displayValue >= maxValue}
              aria-label={labelMaxDescription || t('form-dialog.label', { context: ['touchspin', 'max'] })}
            >
              {labelMax}
            </Button>
          </InputGroupItem>
        </InputGroup>
      </div>
    );
  }
}

/**
 * Prop types
 *
 * @type {{labelMaxDescription: string, minValue: number, onChange: Function, t: Function, maxValue: number,
 *     labelMax: React.ReactNode, name: string, labelMin: React.ReactNode, className: string, labelMinDescription: string,
 *     value: number}}
 */
TouchSpin.propTypes = {
  className: PropTypes.string,
  labelMax: PropTypes.node,
  labelMaxDescription: PropTypes.string,
  labelMin: PropTypes.node,
  labelMinDescription: PropTypes.string,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  t: PropTypes.func,
  value: PropTypes.number
};

/**
 * Default props
 *
 * @type {{labelMaxDescription: null, minValue: number, onChange: Function, t: translate, maxValue: number,
 *     labelMax: React.ReactNode, labelMin: React.ReactNode, className: string, labelMinDescription: null, value: number}}
 */
TouchSpin.defaultProps = {
  className: '',
  labelMax: <PlusIcon />,
  labelMaxDescription: null,
  labelMin: <MinusIcon />,
  labelMinDescription: null,
  maxValue: 100,
  minValue: 0,
  onChange: helpers.noop,
  t: translate,
  value: 50
};

export { TouchSpin as default, TouchSpin };
