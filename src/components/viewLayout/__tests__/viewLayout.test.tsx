import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { AppLayout as ViewLayout } from '../viewLayout';

describe('ViewLayout', () => {
  it('should render a basic component', async () => {
    const props = {
      children: 'Lorem ipsum'
    };
    const component = await shallowComponent(<ViewLayout {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render a brand component', async () => {
    const props = {
      children: 'Lorem ipsum',
      titleImg: 'titleBrand.svg',
      uiName: 'Discovery'
    };
    const component = await shallowComponent(<ViewLayout {...props} />);
    expect(component.querySelectorAll('[alt*="Discovery"],source')).toMatchSnapshot('brand');
  });
});
