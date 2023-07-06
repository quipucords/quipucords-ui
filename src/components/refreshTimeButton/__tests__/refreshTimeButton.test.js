import React from 'react';
import RefreshTimeButton from '../refreshTimeButton';

describe('RefreshTimeButton Component', () => {
  it('should render a basic component', () => {
    const props = {
      onRefresh: jest.fn()
    };

    const component = renderComponent(<RefreshTimeButton {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
