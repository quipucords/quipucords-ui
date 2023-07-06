import React from 'react';
import { Radio } from '../radio';

describe('Radio Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<Radio {...props} />);
    expect(component).toMatchSnapshot('basic component');
  });

  it('should handle disabled, checked', () => {
    const props = {
      isDisabled: true
    };

    const component = renderComponent(<Radio {...props} />);
    expect(component).toMatchSnapshot('disabled');

    const componentActive = component.setProps({
      isDisabled: false
    });
    expect(componentActive).toMatchSnapshot('active');

    const componentChecked = component.setProps({
      isDisabled: false,
      isChecked: true
    });

    expect(componentChecked).toMatchSnapshot('checked');
  });

  it('should handle children as a label', () => {
    const props = {};
    const component = renderComponent(<Radio {...props}>lorem ipsum</Radio>);
    expect(component).toMatchSnapshot('children label radio');
  });

  it('should return an emulated onChange event', () => {
    const mockOnChange = jest.fn();
    const props = {
      onChange: mockOnChange
    };

    const component = renderComponent(<Radio {...props}>lorem ipsum</Radio>);
    const input = component.find('input');
    component.fireEvent.click(input, { currentTarget: {}, target: {} });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
