import React from 'react';
import SourcesEmptyState from '../sourcesEmptyState';

describe('SourcesEmptyState Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<SourcesEmptyState {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render the application name', () => {
    const props = {
      uiShortName: 'Ipsum'
    };

    const component = renderComponent(<SourcesEmptyState {...props} />);
    expect(component.getByRole('heading')).toMatchSnapshot('application name');
  });
});
