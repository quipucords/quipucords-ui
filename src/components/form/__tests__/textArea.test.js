import React from 'react';
import { TextArea as PfTextArea } from '@patternfly/react-core';
import { TextArea, TextAreResizeOrientation } from '../textArea';
import { helpers } from '../../../common';

describe('TextArea Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowHookComponent(<TextArea {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should export support constants, types', () => {
    expect({ TextAreResizeOrientation }).toMatchSnapshot('support');
  });

  it('should handle readOnly, disabled', async () => {
    const props = {
      isReadOnly: true
    };

    const component = await mountHookComponent(<TextArea {...props} />);
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

    const component = await mountHookComponent(<TextArea {...props} />);
    const mockEvent = { currentTarget: { value: 'dolor sit' }, persist: helpers.noop };
    component.find(PfTextArea).simulate('change', 'hello world', mockEvent);

    expect(mockOnChange.mock.calls).toMatchSnapshot('emulated event, change');
  });

  it('should return an emulated onClear event on escape', async () => {
    const mockOnClear = jest.fn();
    const props = {
      onClear: mockOnClear,
      value: 'lorem ipsum'
    };

    const component = await mountHookComponent(<TextArea {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: 'lorem ipsum' }, persist: helpers.noop };
    component.find(PfTextArea).simulate('keyup', mockEvent);

    expect(mockOnClear.mock.calls).toMatchSnapshot('emulated event, esc');
  });
});
