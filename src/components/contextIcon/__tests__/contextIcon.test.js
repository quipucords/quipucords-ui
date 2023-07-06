import React from 'react';
import { ContextIcon, ContextIconVariant } from '../contextIcon';

describe('ContextIcon Component', () => {
  it('should render a basic component with default props', async () => {
    const component = await shallowComponent(<ContextIcon />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export, and handle icon variants', () => {
    expect(ContextIconVariant).toMatchSnapshot('variants');

    Object.entries(ContextIconVariant).forEach(([key, value]) => {
      const component = renderComponent(<ContextIcon symbol={value} />);
      expect(component.props).toMatchSnapshot(`icon variant, ${key}`);
    });
  });
});
