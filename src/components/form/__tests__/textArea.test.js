import React from 'react';
import { TextArea, TextAreResizeOrientation } from '../textArea';

describe('TextArea Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<TextArea {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export support constants, types', () => {
    expect({ TextAreResizeOrientation }).toMatchSnapshot('support');
  });

  it('should handle readOnly, disabled', async () => {
    const props = {
      isReadOnly: true
    };

    const component = renderComponent(<TextArea {...props} />);
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

    const component = renderComponent(<TextArea {...props} />);
    const input = component.find('textarea');
    const mockEvent = { target: { value: 'dolor sit' } };
    component.fireEvent.change(input, mockEvent);

    expect(props.onChange.mock.calls).toMatchSnapshot('emulated event, change');
  });

  it('should return an emulated onClear event on escape', () => {
    const props = {
      onClear: jest.fn(),
      value: 'lorem ipsum'
    };

    const component = renderComponent(<TextArea {...props} />);
    const input = component.find('textarea');
    const mockEvent = { keyCode: 27, which: 27, target: { value: '' }, key: 'Escape' };
    component.fireEvent.keyUp(input, mockEvent);

    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(props.onClear.mock.calls).toMatchSnapshot('emulated event, esc');
  });
});
