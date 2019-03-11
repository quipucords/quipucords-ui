import React from 'react';
import { mount } from 'enzyme';
import Tooltip from '../tooltip';

describe('Tooltip Component', () => {
  it('should render a tooltip', () => {
    const props = {
      id: 'test',
      tooltip: 'hello world'
    };

    const component = mount(<Tooltip {...props}>Test tooltip</Tooltip>);

    expect(component).toMatchSnapshot('tooltip');
  });

  it('should render a popover', () => {
    const props = {
      id: 'test',
      popover: 'hello world'
    };

    const component = mount(<Tooltip {...props}>Test popover</Tooltip>);

    expect(component).toMatchSnapshot('popover');
  });
});
