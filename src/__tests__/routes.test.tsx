import React from 'react';
import { shallowComponent } from '../../config/jest.setupTests';
import { AppRoutes as Routes } from '../routes';

describe('Routes', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<Routes {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
