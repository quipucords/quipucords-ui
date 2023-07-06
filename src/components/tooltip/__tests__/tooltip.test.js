import React from 'react';
import Tooltip from '../tooltip';

describe('Tooltip Component', () => {
  it('should render a basic component', () => {
    const props = {
      id: 'test',
      content: 'hello world'
    };

    const component = renderComponent(<Tooltip {...props}>Test tooltip</Tooltip>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render a popover', () => {
    const props = {
      id: 'test',
      isPopover: true,
      content: 'hello world'
    };

    const component = renderComponent(<Tooltip {...props}>Test popover</Tooltip>);
    expect(component).toMatchSnapshot('popover');
  });
});
