import React from 'react';
import CredentialsEmptyState from '../credentialsEmptyState';

describe('CredentialsEmptyState Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<CredentialsEmptyState {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render the application name', async () => {
    const props = {
      uiShortName: 'Ipsum'
    };

    const component = await shallowComponent(<CredentialsEmptyState {...props} />);
    expect(component.render().getByRole('heading')).toMatchSnapshot('application name');
  });
});
