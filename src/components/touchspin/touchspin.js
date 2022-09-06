import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Button, TextInput, ButtonVariant } from '@patternfly/react-core';
import { PlusIcon, MinusIcon } from '@patternfly/react-icons';
import helpers from '../../common/helpers';

// FixMe: remove the eslint-disable
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
    const { className, labelMax, labelMaxDescription, labelMin, labelMinDescription, name } = this.props;

    return (
      <div className={`pf-c-number-input ${className}`}>
        <InputGroup>
          <Button
            onClick={this.onMinus}
            variant={ButtonVariant.control}
            onMouseDown={this.onFocusMin}
            onMouseUp={this.onBlur}
            onMouseLeave={this.onBlur}
            isDisabled={displayValue <= minValue}
            aria-label={labelMinDescription}
          >
            {labelMin}
          </Button>
          <TextInput
            type="number"
            name={name}
            value={displayValue}
            onChange={(_, event) => this.onUpdateValue(event)}
            aria-label="Number Input"
          />
          <Button
            variant={ButtonVariant.control}
            onClick={this.onPlus}
            onMouseDown={this.onFocusMax}
            onMouseUp={this.onBlur}
            onMouseLeave={this.onBlur}
            isDisabled={displayValue >= maxValue}
            aria-label={labelMaxDescription}
          >
            {labelMax}
          </Button>
        </InputGroup>
      </div>
    );
  }
}

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
  value: PropTypes.number
};

TouchSpin.defaultProps = {
  className: '',
  labelMax: <PlusIcon />,
  labelMaxDescription: 'Increase number button',
  labelMin: <MinusIcon />,
  labelMinDescription: 'Decrease number button',
  maxValue: 100,
  minValue: 0,
  onChange: helpers.noop,
  value: 50
};

export { TouchSpin as default, TouchSpin };
