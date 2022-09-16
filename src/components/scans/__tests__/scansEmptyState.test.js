import React from 'react';
import { ScansEmptyState } from '../scansEmptyState';

describe('ScansEmptyState Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useSourcesExist: () => ({
        sourcesCount: 20,
        hasSources: true
      })
    };

    const component = await shallowHookComponent(<ScansEmptyState {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render messaging if sources do not exist', async () => {
    const props = {
      useSourcesExist: () => ({
        hasSources: false
      })
    };

    const component = await shallowHookComponent(<ScansEmptyState {...props} />);
    expect(component).toMatchSnapshot('do not exist');
  });
});
