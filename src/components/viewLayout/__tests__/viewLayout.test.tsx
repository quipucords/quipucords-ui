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
});
