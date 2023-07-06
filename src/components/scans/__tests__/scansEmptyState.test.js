import React from 'react';
import { ScansEmptyState } from '../scansEmptyState';

describe('ScansEmptyState Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useSources: () => ({
        totalResults: 20,
        hasData: true
      })
    };

    const component = await shallowComponent(<ScansEmptyState {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render messaging if sources do not exist', async () => {
    const props = {
      useSources: () => ({
        hasData: false
      })
    };

    const component = await shallowComponent(<ScansEmptyState {...props} />);
    expect(component).toMatchSnapshot('do not exist');
  });
});
