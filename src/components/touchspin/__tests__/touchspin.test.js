import React from 'react';
import { mount } from 'enzyme';
import { TextInput } from '@patternfly/react-core';
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
      value: 1
    };

    const component = mount(<TouchSpin {...props} />);

    component.find('button[aria-label="Increase number button"]').simulate('click');
    expect(component.find(TextInput).props()?.value).toBe(2);

    component.find('button[aria-label="Decrease number button"]').simulate('click');
    expect(component.find(TextInput).props()?.value).toBe(1);
  });
});
