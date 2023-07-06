import React from 'react';
import { ContextIconAction, ContextIconActionVariant } from '../contextIconAction';

describe('ContextIconAction Component', () => {
  it('should render a basic component with default props', async () => {
    const component = await shallowComponent(<ContextIconAction />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export, and handle icon variants', () => {
    expect(ContextIconActionVariant).toMatchSnapshot('variants');

    Object.entries(ContextIconActionVariant).forEach(([key, value]) => {
      const component = renderComponent(<ContextIconAction symbol={value} />);
      expect(component.props).toMatchSnapshot(`icon variant, ${key}`);
    });
  });
});
