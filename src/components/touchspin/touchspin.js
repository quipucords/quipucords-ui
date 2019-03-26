import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, InputGroup, Button } from 'patternfly-react';
import helpers from '../../common/helpers';

class TouchSpin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayValue: Number.parseInt(props.value, 10),
      maxValue: Number.parseInt(props.maxValue, 10),
      minValue: Number.parseInt(props.minValue, 10),
      value: Number.parseInt(props.value, 10)
    };

    this.timer = null;
  }

  onFocusMax = () => {
    const { maxValue, value } = this.state;

    const setTimer = (time = 500) => {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.onMax();

        if (value < maxValue) {
          setTimer(0);
        }
      }, time);
    };

    setTimer();
  };

  onFocusMin = () => {
    const { minValue, value } = this.state;

    const setTimer = (time = 500) => {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.onMin();

        if (value > minValue) {
          setTimer(0);
        }
      }, time);
    };

    setTimer();
  };

  onBlur = () => {
    clearTimeout(this.timer);
  };

  onMin = () => {
    const { maxValue, minValue, value } = this.state;
    let updatedValue = value - 1 > minValue ? value - 1 : minValue;

    if (updatedValue > maxValue) {
      updatedValue = maxValue;
    }

    this.onUpdateValue({ target: { value: updatedValue } });
  };

  onMax = () => {
    const { maxValue, minValue, value } = this.state;
    let updatedValue = value + 1 < maxValue ? value + 1 : maxValue;

    if (updatedValue < minValue) {
      updatedValue = minValue;
    }

    this.onUpdateValue({ target: { value: updatedValue } });
  };

  onUpdateValue = event => {
    const { maxValue, minValue } = this.state;
    const { name, onChange } = this.props;
    const { value } = event.target;

    let parsedValue = Number.parseInt(value, 10);
    parsedValue = Number.isNaN(parsedValue) ? minValue : parsedValue;

    const maxDisabled = parsedValue > maxValue;
    const minDisabled = parsedValue < minValue;

    clearTimeout(this.timer);

    this.setState({
      displayValue: value,
      value: parsedValue,
      maxDisabled,
      minDisabled
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
    const { displayValue, maxDisabled, minDisabled } = this.state;
    const { className, labelMax, labelMaxDescription, labelMin, labelMinDescription, name } = this.props;

    return (
      <InputGroup className={`cloudmeter-touchspin ${className}`}>
        <InputGroup.Button>
          <Button
            onClick={this.onMin}
            onMouseDown={this.onFocusMin}
            onMouseUp={this.onBlur}
            onMouseLeave={this.onBlur}
            className="cloudmeter-touchspin-min-button form-control"
            aria-hidden
            tabIndex={-1}
            title={labelMinDescription}
            disabled={minDisabled}
          >
            {labelMin}
          </Button>
        </InputGroup.Button>
        <Form.FormControl
          type="text"
          name={name}
          value={displayValue}
          className="cloudmeter-touchspin-input"
          onChange={this.onUpdateValue}
        />
        <InputGroup.Button>
          <Button
            onClick={this.onMax}
            onMouseDown={this.onFocusMax}
            onMouseUp={this.onBlur}
            onMouseLeave={this.onBlur}
            className="cloudmeter-touchspin-max-button form-control"
            aria-hidden
            tabIndex={-1}
            title={labelMaxDescription}
            disabled={maxDisabled}
          >
            {labelMax}
          </Button>
        </InputGroup.Button>
      </InputGroup>
    );
  }
}

TouchSpin.propTypes = {
  className: PropTypes.string,
  labelMax: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelMaxDescription: PropTypes.string,
  labelMin: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelMinDescription: PropTypes.string,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

TouchSpin.defaultProps = {
  className: '',
  labelMax: <Icon type="fa" name="plus" />,
  labelMaxDescription: 'Increase number input',
  labelMin: <Icon type="fa" name="minus" />,
  labelMinDescription: 'Decrease number input',
  maxValue: 100,
  minValue: 0,
  onChange: helpers.noop,
  value: 50
};

export { TouchSpin as default, TouchSpin };
