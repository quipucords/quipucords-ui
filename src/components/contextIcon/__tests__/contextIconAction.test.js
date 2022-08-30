import React from 'react';
import { shallow } from 'enzyme';
import { ContextIconAction, ContextIconActionVariant } from '../contextIconAction';

describe('ContextIconAction Component', () => {
  it('should render a basic component with default props', () => {
    const component = shallow(<ContextIconAction />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should export, and handle icon variants', () => {
    expect(ContextIconActionVariant).toMatchSnapshot('variants');

    Object.entries(ContextIconActionVariant).forEach(([key, value]) => {
      const component = shallow(<ContextIconAction symbol={value} />);
      expect(component).toMatchSnapshot(`icon variant, ${key}`);
    });
  });
});
