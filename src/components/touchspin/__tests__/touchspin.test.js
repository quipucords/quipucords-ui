import React from 'react';
import { mount } from 'enzyme';
import { TouchSpin } from '../touchspin';

describe('TouchSpin Component', () => {
  it('should render a basic component', () => {
    const props = {
      name: 'lorem'
    };

    const component = mount(<TouchSpin {...props} />);

    const componentInstance = component.instance();
    expect(componentInstance.props).toMatchSnapshot('initial props');
    expect(componentInstance.state).toMatchSnapshot('initial state');

    expect(component.render()).toMatchSnapshot('basic render');
  });

  it('should handle onchange events', () => {
    const props = {
      name: 'lorem',
      onChange: jest.fn()
    };

    const component = mount(<TouchSpin {...props} />);

    component.find('button[title="Decrease number input"]').simulate('click');
    expect(props.onChange).toHaveBeenCalledTimes(1);

    component.find('button[title="Increase number input"]').simulate('click');
    expect(props.onChange).toHaveBeenCalledTimes(2);
  });
});
