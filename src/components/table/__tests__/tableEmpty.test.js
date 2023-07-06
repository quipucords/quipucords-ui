import React from 'react';
import { TableEmpty } from '../tableEmpty';

describe('TableEmpty Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<TableEmpty {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
