import React from 'react';
import { TextInput as PfTextInput } from '@patternfly/react-core';
import { TextInput } from '../textInput';
import { helpers } from '../../../common';

describe('TextInput Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowHookComponent(<TextInput {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled', async () => {
    const props = {
      isReadOnly: true
    };

    const component = await mountHookComponent(<TextInput {...props} />);
    expect(component.render()).toMatchSnapshot('readOnly');

    component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(component.render()).toMatchSnapshot('disabled');

    component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(component.render()).toMatchSnapshot('active');
  });

  it('should return an emulated onChange event', async () => {
    const mockOnChange = jest.fn();
    const props = {
      onChange: mockOnChange,
      value: 'lorem ipsum'
    };

    const component = await shallowHookComponent(<TextInput {...props} />);
    const mockEvent = { currentTarget: { value: 'dolor sit' }, persist: helpers.noop };
    component.find(PfTextInput).simulate('change', 'hello world', mockEvent);

    expect(mockOnChange.mock.calls).toMatchSnapshot('emulated event, change');
  });

  it('should return an emulated onClear event on escape', async () => {
    const mockOnClear = jest.fn();
    const props = {
      onClear: mockOnClear,
      value: 'lorem ipsum'
    };

    const component = await shallowHookComponent(<TextInput {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.find(PfTextInput).simulate('keyup', mockEvent);

    expect(mockOnClear.mock.calls).toMatchSnapshot('emulated event, esc');
  });

  it('should return an emulated onClear event on escape with type search', async () => {
    const mockOnClear = jest.fn();
    const props = {
      onClear: mockOnClear,
      value: 'lorem ipsum',
      type: 'search'
    };

    const component = await shallowHookComponent(<TextInput {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.find(PfTextInput).simulate('keyup', mockEvent);

    expect(mockOnClear.mock.calls).toMatchSnapshot('emulated event, esc, type search');
  });

  it('should return a mouseup event on text clear', async () => {
    const mockOnMouseUp = jest.fn();
    const props = {
      onMouseUp: mockOnMouseUp,
      value: 'lorem ipsum'
    };

    const component = await shallowHookComponent(<TextInput {...props} />);
    const mockEvent = { currentTarget: { value: '' }, persist: helpers.noop };
    component.find(PfTextInput).simulate('mouseup', mockEvent);

    expect(mockOnMouseUp.mock.calls).toMatchSnapshot('emulated event, mouseup');
  });
});
