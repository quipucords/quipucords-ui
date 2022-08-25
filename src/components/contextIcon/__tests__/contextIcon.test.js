import React from 'react';
import { shallow } from 'enzyme';
import { ContextIcon, ContextIconVariant } from '../contextIcon';

describe('ContextIcon Component', () => {
  it('should render a basic component with default props', () => {
    const component = shallow(<ContextIcon />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export, and handle icon variants', () => {
    expect(ContextIconVariant).toMatchSnapshot('variants');

    Object.entries(ContextIconVariant).forEach(([key, value]) => {
      const component = shallow(<ContextIcon symbol={value} />);
      expect(component).toMatchSnapshot(`icon variant, ${key}`);
    });
  });
});
