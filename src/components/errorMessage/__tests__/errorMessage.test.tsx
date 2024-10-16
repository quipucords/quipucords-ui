import React from 'react';
import { shallowComponent } from '../../../../config/jest.setupTests';
import { ErrorMessage } from '../errorMessage';

describe('ErrorMessage', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<ErrorMessage {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow a custom title and description', async () => {
    const props = {
      title: 'Lorem ipsum',
      description: 'Dolor sit'
    };
    const component = await shallowComponent(<ErrorMessage {...props} />);
    expect(component).toMatchSnapshot('custom');
  });
});
