import React from 'react';
import { TextInputTypes } from '@patternfly/react-core';
import { TextInput } from '../textInput';

describe('TextInput Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<TextInput {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export support constants, types', () => {
    expect({ TextInputTypes }).toMatchSnapshot('support');
  });

  it('should handle readOnly, disabled', () => {
    const props = {
      isReadOnly: true
    };

    const component = renderComponent(<TextInput {...props} />);
    expect(component).toMatchSnapshot('readOnly');

    const componentDisabled = component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(componentDisabled).toMatchSnapshot('disabled');

    const componentActive = component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(componentActive).toMatchSnapshot('active');
  });

  it('should return an emulated onChange event', () => {
    const props = {
      onChange: jest.fn(),
      value: 'lorem ipsum'
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');
    const mockEvent = { target: { value: 'dolor sit' } };
    component.fireEvent.change(input, mockEvent);

    expect(props.onChange.mock.calls).toMatchSnapshot('emulated event, change');
  });

  it('should return an emulated onClear event on escape', () => {
    const props = {
      id: 'test-id',
      value: 'lorem ipsum',
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape' };
    component.fireEvent.keyUp(input, mockEvent);

    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(props.onClear.mock.calls).toMatchSnapshot('emulated event, esc');
  });

  it('should return a mouseup event on text clear', () => {
    const props = {
      onMouseUp: jest.fn(),
      value: 'lorem ipsum'
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');
    const mockEvent = { target: { value: '' } };
    component.fireEvent.mouseUp(input, mockEvent);

    expect(props.onMouseUp.mock.calls).toMatchSnapshot('emulated event, mouseup');
  });
});
