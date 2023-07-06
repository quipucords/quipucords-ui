import React from 'react';
import Router from '../router';

describe('Router Component', () => {
  it('should shallow render a basic component', async () => {
    const component = await shallowComponent(<Router />);

    expect(component).toMatchSnapshot('basic');
  });
});
