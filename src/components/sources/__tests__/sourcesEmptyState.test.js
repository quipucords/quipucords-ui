import React from 'react';
import { mount } from 'enzyme';
import { EmptyState } from 'patternfly-react';
import SourcesEmptyState from '../sourcesEmptyState';

describe('SourcesEmptyState Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = mount(<SourcesEmptyState {...props} />);

    expect(component.render()).toMatchSnapshot();
  });

  it('should render the application name', () => {
    const props = {
      uiShortName: 'Ipsum'
    };

    const component = mount(<SourcesEmptyState {...props} />);
    expect(component.find(EmptyState.Title)).toMatchSnapshot('application name');
  });
});
