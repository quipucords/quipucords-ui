import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ContextIcon, ContextIconVariant } from '../contextIcon';

describe('ContextIcon', () => {
  test.each(Object.keys(ContextIconVariant))('Should render icon %s', async iconName => {
    const props = { symbol: iconName };
    const component = await shallowComponent(<ContextIcon {...props} />);
    expect(component).toMatchSnapshot();
  });
});
